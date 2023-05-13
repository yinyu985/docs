# 高可用Prometheus方案thaos调研
## 依赖环境：

需要一个或多个v2.2.1以上版本的[Prometheus](https://prometheus.io/) ，Thaos支持多种[对象存储](https://thanos.io/tip/thanos/storage.md/)用于长期存储Prometheus的监控数据

## Thaos的组成：

遵循 KISS 和 Unix 哲学，Thanos 由一组组件组成，每个组件都扮演着特定的角色。

- Sidecar：连接到 Prometheus，读取其数据进行查询和或将其上传到云存储。
- Store Gateway：在云存储桶内提供指标。
- Compactor：对存储在云存储桶中的数据进行压缩、降采样和应用保留。
- Receiver：从 Prometheus 的远程写入 WAL 接收数据，将其公开和 或上传到云存储。
- Ruler/Rule：根据 Thanos 中的数据评估记录和警报规则，以进行说明和/或上传。
- Querier/Query：实现 Prometheus 的 v1 API 以聚合来自底层组件的数据。
- Query Frontend：实现 Prometheus 的 v1 API 将其代理到 Query，同时缓存响应和可选的查询日拆分。

### Sidecar：

Thanos 通过 Sidecar 进程与现有的 Prometheus 服务器集成，Sidecar 进程与 Prometheus 服务器在同一台机器或同一 Pod 中运行。Sidecar 的目的是将 Prometheus 数据备份到对象存储桶中，并让其他 Thanos 组件通过 gRPC API 访问 Prometheus 指标。

Docker 启动命令示例

```bash
docker run -d  \
    -v $(pwd)/prometheus0_eu1.yml:/etc/prometheus/prometheus.yml \
    --name prometheus-0-sidecar-eu1 \
    -u root \
    quay.io/thanos/thanos:v0.28.0 \
    sidecar \
    --http-address 0.0.0.0:19090 \
    --grpc-address 0.0.0.0:19190 \
    --reloader.config-file /etc/prometheus/prometheus.yml \
    --prometheus.url http://172.17.0.1:9090
```

当使用 `--shipper.upload-compacted` 标志运行 sidecar 时，它将在启动时从 Prometheus 本地存储同步所有旧的现有块。（适用于已经在用的Prometheus）

外部标签

Prometheus 允许配置给定 Prometheus 实例的“外部标签”。这些旨在全局识别该实例的角色。由于 Thanos 旨在聚合所有实例的数据，因此提供一组一致的外部标签变得至关重要！
每个 Prometheus 实例都必须有一组全局唯一的标识标签。例如，在 Prometheus 的配置文件中：

```yaml
global:
  external_labels:
    region: eu-west
    monitor: infrastructure
    replica: A
```

配置完Sidecar后，修改配置文件会自动重载，`  --reloader.config-file`标志运行Sidecar时，会自动重载Prometheus的配置文件，还有其他相关参数，控制探测间隔等。

### Querier/Query

在为一个或多个Prometheus配置了Sidecar后，想使用Thanos 的全局查询层来同时评估针对所有实例的 PromQL 查询，需要配置Querier/Query。

查询组件是无状态和水平可扩展的，可以部署任意数量的副本。一旦连接到 Sidecars，它会自动检测需要为给定的 PromQL 查询联系哪些 Prometheus 服务器。Thanos Querier 还支持了 Prometheus 的官方 HTTP API，因此可以与 Grafana 等外部工具一起使用。它还服务于 Prometheus 的 UI 的衍生产品，用于临时查询和存储状态。

在多个Prometheus中去重

Query 组件还能够对从 Prometheus HA 对收集的数据进行重复数据删除。这需要配置 Prometheus 的 global.external_labels 配置块来识别给定 Prometheus 实例的角色。一个典型的选择就是简单地使用标签名称“replica”，同时让值随心所欲。例如，您可以在 Prometheus 的配置文件中设置以下内容：

```yaml
global:
  external_labels:
    region: eu-west
    monitor: infrastructure
    replica: A
```

### Store Gateway

当 Sidecar 将数据备份到您选择的对象存储中时，您可以减少 Prometheus 保留并减少本地存储。然而，我们需要一种方法来再次查询所有的历史数据。Store Gateway通过实现与Sidecar相同的 gRPC 数据API 来实现这一点，但使用它可以在对象存储桶中找到的数据对其进行支持。就像 sidecars 和查询节点一样，store gateway 暴露了 StoreAPI 并且需要被 Thanos Querier 发现。

store gateway 占用少量磁盘空间用于缓存对象存储中数据的基本信息。这很少会超过几千兆字节，用于缩短重启时间。它很有用，但不需要在重新启动时保留它。

### Compactor

本地 Prometheus 安装会定期压缩旧数据以提高查询效率。由于 Sidecar 会尽快备份数据，因此我们需要一种方法将相同的过程应用于对象存储中的数据。

Compactor只需扫描对象存储并在需要时处理压实。同时，它负责创建数据的下采样副本，以加快查询速度。



