import{_ as t,W as d,X as e,a0 as r}from"./framework-b4edc447.js";const a={},o=r('<h1 id="prometheus参数详解" tabindex="-1"><a class="header-anchor" href="#prometheus参数详解" aria-hidden="true">#</a> Prometheus参数详解</h1><table><thead><tr><th>Flag</th><th>Value</th><th>Description</th></tr></thead><tbody><tr><td>--alertmanager.notification-queue-capacity</td><td>10000</td><td>警告管理器发送通知的队列容量。</td></tr><tr><td>--alertmanager.timeout</td><td></td><td>警告管理器请求超时时间</td></tr><tr><td>--config.file</td><td>/etc/prometheus/config_out/prometheus.env.yaml</td><td>Prometheus 配置文件所在的文件系统路径。</td></tr><tr><td>--enable-feature</td><td></td><td>要启用的 beta 功能</td></tr><tr><td>--log.format</td><td>logfmt</td><td>日志记录格式。</td></tr><tr><td>--log.level</td><td>info</td><td>Prometheus 日志记录的详细程度。</td></tr><tr><td>--query.lookback-delta</td><td>5m</td><td>基于磁盘存储的 Prometheus 查询返回的时间范围。</td></tr><tr><td>--query.max-concurrency</td><td>20</td><td>并发查询最大允许数量。</td></tr><tr><td>--query.max-samples</td><td>50000000</td><td>每个查询允许返回的最大值的数量。</td></tr><tr><td>--query.timeout</td><td>2m</td><td>Prometheus 查询的最大时间。</td></tr><tr><td>--rules.alert.for-grace-period</td><td>10m</td><td>当警报状态更改时，要保持该警报状态的最小持续时间。</td></tr><tr><td>--rules.alert.for-outage-tolerance</td><td>1h</td><td>警报被视为不稳定的时间，超过此时间，警报将被删除而不会重复触发。</td></tr><tr><td>--rules.alert.resend-delay</td><td>1m</td><td>重新发送警报的延迟时间。</td></tr><tr><td>--scrape.adjust-timestamps</td><td>true</td><td>Prometheus 是否应该调整时间戳以避免重复或重叠的样本。</td></tr><tr><td>--scrape.discovery-reload-interval</td><td>5s</td><td>重新发现目标的间隔。</td></tr><tr><td>--scrape.timestamp-tolerance</td><td>2ms</td><td>允许时间差异的时间戳精度。</td></tr><tr><td>--storage.agent.no-lockfile</td><td>false</td><td>是否使用锁文件来保护元数据存储。</td></tr><tr><td>--storage.agent.path</td><td>data-agent/</td><td>元数据存储的磁盘路径。</td></tr><tr><td>--storage.agent.retention.max-time</td><td>0s</td><td>元数据保留的最大时间。</td></tr><tr><td>--storage.agent.retention.min-time</td><td>0s</td><td>元数据保留时间的最小值。</td></tr><tr><td>--storage.agent.wal-compression</td><td>true</td><td>Prometheus 是否应该对写-ahead 日志使用压缩。</td></tr><tr><td>--storage.agent.wal-segment-size</td><td>0B</td><td>写-ahead 日志的段大小。</td></tr><tr><td>--storage.agent.wal-truncate-frequency</td><td>0s</td><td>写-ahead 日志使用的时间段。</td></tr><tr><td>--storage.remote.flush-deadline</td><td>1m</td><td>将远程写入代理的最后写入截止时间。</td></tr><tr><td>--storage.remote.read-concurrent-limit</td><td>10</td><td>并发读取远程写入代理的最大数量。</td></tr><tr><td>--storage.remote.read-max-bytes-in-frame</td><td>1048576</td><td>单个读取帧的最大字节数。</td></tr><tr><td>--storage.remote.read-sample-limit</td><td>50000000</td><td>读取远程写入代理采样的最大数据点数。</td></tr><tr><td>--storage.tsdb.allow-overlapping-blocks</td><td>true</td><td>控制是否允许块重叠。</td></tr><tr><td>--storage.tsdb.head-chunks-write-queue-size</td><td>0</td><td>确定在头部写入时要使用的队列大小。</td></tr><tr><td>--storage.tsdb.max-block-chunk-segment-size</td><td>0B</td><td>块分段最大字节数。</td></tr><tr><td>--storage.tsdb.max-block-duration</td><td>1d</td><td>块的持续时间最大值。</td></tr></tbody></table>',2),s=[o];function n(m,l){return d(),e("div",null,s)}const u=t(a,[["render",n],["__file","Prometheus参数详解.html.vue"]]);export{u as default};
