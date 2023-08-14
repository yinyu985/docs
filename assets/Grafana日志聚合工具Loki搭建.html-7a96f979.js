import{_ as n,W as s,X as e,a0 as a}from"./framework-b4edc447.js";const i={},l=a(`<h1 id="grafana日志聚合工具loki搭建" tabindex="-1"><a class="header-anchor" href="#grafana日志聚合工具loki搭建" aria-hidden="true">#</a> Grafana日志聚合工具Loki搭建</h1><p>Loki是 Grafana Labs 团队最新的开源项目，是一个水平可扩展，高可用性，多租户的日志聚合系统。它的设计非常经济高效且易于操作，因为它不会为日志内容编制索引，而是为每个日志流编制一组标签，为 Prometheus和 Kubernetes用户做了相关优化。项目受 Prometheus 启发，类似于 Prometheus 的日志系统。</p><p>Loki的架构非常简单，使用了和prometheus一样的标签来作为索引，也就是说，你通过这些标签既可以查询日志的内容也可以查询到监控的数据，不但减少了两种查询之间的切换成本，也极大地降低了日志索引的存储。 Loki将使用与prometheus相同的服务发现和标签重新标记库,编写了pormtail, 在k8s中promtail以daemonset方式运行在每个节点中，通过kubernetes api等到日志的正确元数据，并将它们发送到Loki。、</p><h2 id="特点" tabindex="-1"><a class="header-anchor" href="#特点" aria-hidden="true">#</a> 特点</h2><p>与其他日志聚合系统相比， Loki具有下面的一些特性：</p><ul><li>不对日志进行全文索引。通过存储压缩非结构化日志和仅索引元数据，Loki 操作起来会更简单，更省成本。</li><li>通过使用与 Prometheus 相同的标签记录流对日志进行索引和分组，这使得日志的扩展和操作效率更高。</li><li>特别适合储存 Kubernetes Pod 日志; 诸如 Pod 标签之类的元数据会被自动删除和编入索引。</li><li>受 Grafana 原生支持。</li></ul><h2 id="组成" tabindex="-1"><a class="header-anchor" href="#组成" aria-hidden="true">#</a> 组成</h2><ul><li><p>loki是主服务器，负责存储日志和处理查询。</p></li><li><p>promtail是代理，负责收集日志并将其发送给 loki。</p></li><li><p>Grafana 用于 UI 展示。</p></li></ul><h2 id="对比" tabindex="-1"><a class="header-anchor" href="#对比" aria-hidden="true">#</a> 对比</h2><p>首先，ELK/EFK架构功能确实强大，也经过了多年的实际环境验证，其中存储在Elasticsearch中的日志通常以非结构化JSON对象的形式存储在磁盘上，并且Elasticsearch为每个对象都建立了索引，以便进行全文搜索，然后用户可以特定查询语言来搜索这些日志数据。与之对应的Loki的数据存储是解耦的，既可以在磁盘上存储数据，也可以使用如Amazon S3的云存储系统。Loki中的日志带有一组标签名和值，其中只有标签对被索引，这种权衡使得它比完整索引的操作成本更低，但是针对基于内容的查询，需要通过LogQL再单独查询。</p><p>和Fluentd相比，Promtail是专门为Loki量身定制的，它可以为运行在同一节点上的Kubernetes Pods做服务发现，从指定文件夹读取日志。Loki采用了类似于Prometheus的标签方式。因此，当与Prometheus部署在同一个环境中时，因为相同的服务发现机制，来自Promtail的日志通常具有与应用程序指标相同的标签，统一了标签管理。</p><p>Kibana提供了许多可视化工具来进行数据分析，高级功能比如异常检测等机器学习功能。Grafana专门针对Prometheus和Loki等时间序列数据打造，可以在同一个仪表板上查看日志的指标。</p><h2 id="环境搭建" tabindex="-1"><a class="header-anchor" href="#环境搭建" aria-hidden="true">#</a> 环境搭建</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">wget</span> https://github.com/grafana/loki/releases/download/v2.5.0/loki-linux-amd64.zip
<span class="token function">unzip</span> loki-linux-amd64.zip
<span class="token function">mv</span> loki-linux-amd64 /data/loki/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>写配置文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /data/loki/
<span class="token function">vi</span> loki-local-config.yaml
auth_enabled: <span class="token boolean">false</span>
server:
  http_listen_port: <span class="token number">3100</span>
ingester:
  lifecycler:
    address: <span class="token number">127.0</span>.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: <span class="token number">1</span>
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s
schema_config:
  configs:
  - from: <span class="token number">2020</span>-05-15
    store: boltdb
    object_store: filesystem
    schema: v11
    index:
      prefix: index_
      period: 168h
storage_config:
  boltdb:
    directory: /data/loki/index

  filesystem:
    directory: /data/loki/chunks

limits_config:
  enforce_metric_name: <span class="token boolean">false</span>
  reject_old_samples: <span class="token boolean">true</span>
  reject_old_samples_max_age: 168h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置系统服务</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /etc/systemd/system/loki.service
<span class="token punctuation">[</span>Unit<span class="token punctuation">]</span>
<span class="token assign-left variable">Description</span><span class="token operator">=</span>loki
<span class="token assign-left variable">Wants</span><span class="token operator">=</span>network-online.target
<span class="token assign-left variable">After</span><span class="token operator">=</span>network-online.target
<span class="token punctuation">[</span>Service<span class="token punctuation">]</span>
<span class="token assign-left variable">Restart</span><span class="token operator">=</span>on-failure
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/data/loki/loki-linux-amd64  <span class="token parameter variable">--config.file</span><span class="token operator">=</span>/data/loki/loki-local-config.yaml
<span class="token punctuation">[</span>Install<span class="token punctuation">]</span>
<span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl daemon-reload
systemctl start loki.service
systemctl status loki.service
systemctl stop loki.service
systemctl restart loki.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装采集组件(安装在被采集主机)</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">wget</span> https://github.com/grafana/loki/releases/download/v2.5.0/promtail-linux-amd64.zip
<span class="token function">unzip</span> promtail-linux-amd64.zip
<span class="token function">mv</span> promtail-linux-amd64 /data/promtail/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置系统服务</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /data/promtail/
<span class="token function">vim</span> promtail-local-config.yaml
<span class="token comment"># 写入以下内容</span>
server:
  http_listen_port: <span class="token number">9080</span>
  grpc_listen_port: <span class="token number">0</span>

positions:
  filename: /data/promtail/positions.yaml

clients:
  - url: http://localhost:3100/loki/api/v1/push

scrape_configs:
- job_name: system
  static_configs:
  - targets:
      - localhost
    labels:
      job: varlogs
      __path__: /var/log/*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl daemon-reload
systemctl start  promtail.service
systemctl status  promtail.service
systemctl restart  promtail.service
systemctl stop  promtail.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>grafana添加数据源，即可在grafana界面通过LogQL 语法或者，鼠标点选条件，去筛选条件。</p><figure><img src="https://s2.loli.net/2022/08/11/E4aAWkNCeunwtXy.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,26),d=[l];function r(t,c){return s(),e("div",null,d)}const v=n(i,[["render",r],["__file","Grafana日志聚合工具Loki搭建.html.vue"]]);export{v as default};
