import{_ as a,W as i,X as n,Y as r,Z as e,$ as o,a0 as s,D as l}from"./framework-b4edc447.js";const c={},h=r("h1",{id:"docker运行victoriametreic测试体验",tabindex:"-1"},[r("a",{class:"header-anchor",href:"#docker运行victoriametreic测试体验","aria-hidden":"true"},"#"),e(" Docker运行VictoriaMetreic测试体验")],-1),m=r("p",null,'VictoriaMetrics是一个开源的、快速的、低成本的时间序列数据库和监测系统。它最初是由俄罗斯IT公司 "Badoo "的一个工程师团队开发的，以满足他们的监测需求。然而，它后来被作为开源软件发布，供更广泛的社区使用，VictoriaMetrics被设计用来处理大量的时间序列数据，同时保持高性能和可扩展性。它使用一个定制的存储引擎，优化时间序列数据的存储，并实现快速查询和聚合，除了时间序列数据库的功能，VictoriaMetrics还包括一个监控系统，可以从各种来源收集和可视化指标，包括Prometheus、Graphite和InfluxDB。VictoriaMetrics与流行的查询语言兼容，包括PromQL和Graphite，并可以作为独立的二进制文件、Docker容器或Kubernetes操作程序部署。总的来说，VictoriaMetrics是一个强大而灵活的工具，用于管理时间序列数据和监测系统性能，使其成为许多组织的热门选择。',-1),d={href:"https://github.com/VictoriaMetrics/VictoriaMetrics",target:"_blank",rel:"noopener noreferrer"},p=r("p",null,"VictoriaMetrics具有以下突出特点：",-1),u={href:"https://github.com/VictoriaMetrics/VictoriaMetrics#prometheus-setup",target:"_blank",rel:"noopener noreferrer"},_={href:"https://github.com/VictoriaMetrics/VictoriaMetrics#prometheus-querying-api-usage",target:"_blank",rel:"noopener noreferrer"},f={href:"https://github.com/VictoriaMetrics/VictoriaMetrics#graphite-api-usage",target:"_blank",rel:"noopener noreferrer"},g={href:"https://medium.com/@valyala/high-cardinality-tsdb-benchmarks-victoriametrics-vs-timescaledb-vs-influxdb-13e6ee64dd6b",target:"_blank",rel:"noopener noreferrer"},b={href:"https://medium.com/@valyala/when-size-matters-benchmarking-victoriametrics-vs-timescale-and-influxdb-6035811952d4",target:"_blank",rel:"noopener noreferrer"},k={href:"https://medium.com/@valyala/measuring-vertical-scalability-for-time-series-databases-in-google-cloud-92550d78d8ae",target:"_blank",rel:"noopener noreferrer"},v={href:"https://docs.victoriametrics.com/FAQ.html#what-is-high-cardinality",target:"_blank",rel:"noopener noreferrer"},V={href:"https://medium.com/@valyala/insert-benchmarks-with-inch-influxdb-vs-victoriametrics-e31a41ae2893",target:"_blank",rel:"noopener noreferrer"},M={href:"https://valyala.medium.com/prometheus-vs-victoriametrics-benchmark-on-node-exporter-metrics-4ca29c75590f",target:"_blank",rel:"noopener noreferrer"},y=r("li",null,[r("p",null,"它提供高数据压缩，因此根据这些基准，与 TimescaleDB 相比，可以将多达 70 倍的数据点存储到有限的存储空间中，并且根据该基准，与 Prometheus、Thanos 或 Cortex 相比，所需的存储空间最多减少 7 倍。")],-1),x={href:"https://medium.com/@valyala/high-cardinality-tsdb-benchmarks-victoriametrics-vs-timescaledb-vs-influxdb-13e6ee64dd6b",target:"_blank",rel:"noopener noreferrer"},P={href:"https://medium.com/@valyala/measuring-vertical-scalability-for-time-series-databases-in-google-cloud-92550d78d8ae",target:"_blank",rel:"noopener noreferrer"},D={href:"https://medium.com/@valyala/comparing-thanos-to-victoriametrics-cluster-b193bea1683",target:"_blank",rel:"noopener noreferrer"},B={href:"https://promcon.io/2019-munich/talks/remote-write-storage-wars/",target:"_blank",rel:"noopener noreferrer"},I={href:"https://promcon.io/2019-munich/talks/remote-write-storage-wars/",target:"_blank",rel:"noopener noreferrer"},T=r("s",null,"这个演讲我看了，来自Adidas的工程师，咔咔咔在Prometheus的技术分享会上放Adidas的广告，然后就开始介绍各类监控系统，各种对比，然后Adidas荣登VictoriaMetreic的用户案例首页",-1),w={href:"https://segmentfault.com/a/1190000041789939",target:"_blank",rel:"noopener noreferrer"},A={href:"https://github.com/VictoriaMetrics/VictoriaMetrics",target:"_blank",rel:"noopener noreferrer"},C={href:"https://greasyfork.org/zh-CN/scripts/411834-download-github-repo-sub-folder",target:"_blank",rel:"noopener noreferrer"},G={href:"https://download-directory.github.io/",target:"_blank",rel:"noopener noreferrer"},S=s(`<p>拿到文件夹，里面的内容已经是使用启动VM（之后的所有VM都是代指VictoriaMetreic）全部的必要条件了。我使用VSC打开这个文件夹，找到docker-compose.yaml这个文件右键即可选择docker-compose up，这个动作等效于，只是VSC的docker插件将这个动作可视化了，使用鼠标点点点，就能够启动、停止、重启，查看日志，进入容器终端，访问暴露的端口。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /deployment/docker
<span class="token function">docker-compose</span> up
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>见证奇迹，docker会根据当前路径的docker-compose.yaml的文件去构建镜像，启动容器。启动成功后会有这么几个页面</p>`,3),N={href:"http://localhost:3000/",target:"_blank",rel:"noopener noreferrer"},X={href:"http://localhost:8428/",target:"_blank",rel:"noopener noreferrer"},W={href:"http://localhost:8429/",target:"_blank",rel:"noopener noreferrer"},z={href:"http://localhost:8880/",target:"_blank",rel:"noopener noreferrer"},E={href:"http://localhost:9093/",target:"_blank",rel:"noopener noreferrer"},L={href:"https://play.victoriametrics.com/",target:"_blank",rel:"noopener noreferrer"},O=r("p",null,"贴一篇文章",-1),q={href:"https://faun.pub/comparing-thanos-to-victoriametrics-cluster-b193bea1683",target:"_blank",rel:"noopener noreferrer"};function Q(R,j){const t=l("ExternalLinkIcon");return i(),n("div",null,[h,m,r("p",null,[e("项目开源地址:"),r("a",d,[e("https://github.com/VictoriaMetrics/VictoriaMetrics"),o(t)])]),p,r("ul",null,[r("li",null,[r("p",null,[e("它可以用作 Prometheus 的长期存储。有关详细信息，请参阅"),r("a",u,[e("这些文档"),o(t)]),e("。")])]),r("li",null,[r("p",null,[e("它可以用作 Grafana 中 Prometheus 的直接替代品，因为它支持"),r("a",_,[e("Prometheus querying API"),o(t)]),e("。")])]),r("li",null,[r("p",null,[e("它可以用作 Grafana 中 Graphite 的直接替代品，因为它支持"),r("a",f,[e("Graphite API"),o(t)]),e("。")])]),r("li",null,[r("p",null,[e("它为"),r("a",g,[e("数据摄取"),o(t)]),e("和"),r("a",b,[e("数据查询"),o(t)]),e("提供了高性能和良好的纵向和横向可扩展性 。它"),r("a",k,[e("比 InfluxDB 和 TimescaleDB 高出 20 倍"),o(t)]),e("。")])]),r("li",null,[r("p",null,[e("在处理数百万个独特的时间序列（又名"),r("a",v,[e("高基数"),o(t)]),e("）时，它"),r("a",V,[e("使用的 RAM 比 InfluxDB 少 10 倍"),o(t)]),e(" ，"),r("a",M,[e("比 Prometheus、Thanos 或 Cortex 少 7 倍"),o(t)]),e("。")])]),y,r("li",null,[r("p",null,[e("它针对具有高延迟 IO 和低 IOPS 的存储（AWS、Google Cloud、Microsoft Azure 等中的 HDD 和网络存储）进行了优化。查看"),r("a",x,[e("这些基准测试中的磁盘 IO 图"),o(t)]),e("。")])]),r("li",null,[r("p",null,[e("单节点 VictoriaMetrics 可以替代使用 Thanos、M3DB、Cortex、InfluxDB 或 TimescaleDB 等竞争解决方案构建的中等规模集群。查看"),r("a",P,[e("垂直可扩展性基准"),o(t)]),e("， "),r("a",D,[e("将 Thanos 与 VictoriaMetrics 集群进行比较"),o(t)]),e(" ，以及来自"),r("a",B,[e("PromCon 2019 的"),o(t)]),r("a",I,[e("Remote Write Storage Wars"),o(t)]),e("演讲。"),T])])]),r("p",null,[e("以上这些都是项目的readme里面自己宣传的，我只是翻译搬运，并没有做过任何测试，我能知道的就是"),r("a",w,[e("别人做过测试"),o(t)]),e("。这次使用docker-compose启动正是为了体验这个监控系统，为后续公司的监控系统转型做准备。话不多说，开搞！")]),r("p",null,[e("首先前往github，这个项目的主页:"),r("a",A,[e("https://github.com/VictoriaMetrics/VictoriaMetrics"),o(t)])]),r("p",null,[e("在master分支下，进入到deployment下的docker文件夹，其实我们需要的都在这个docker文件夹里了，也就是说其实只需要下载这一个文件夹就好了，如何下载这单个文件而不是去git clone整个仓库呢？这里我提供一个"),r("a",C,[e("油猴脚本"),o(t)]),e("，其实网上也是有"),r("a",G,[e("类似的网站"),o(t)]),e("，你只需要复制文件夹路径的链接，粘贴进去，就能够提供一个下载链接，不详细展开了，自己去探索。")]),S,r("ul",null,[r("li",null,[r("a",N,[e("http://localhost:3000/"),o(t)]),e(" ###grafana---自带的看板")]),r("li",null,[r("a",X,[e("http://localhost:8428/"),o(t)]),e(" ###VictoriaMetrics---提供查询和存储的主要组件")]),r("li",null,[r("a",W,[e("http://localhost:8429/"),o(t)]),e(" ###vmagent---提供数据采集功能组件，能够直接读取Prometheus的配置文件")]),r("li",null,[r("a",z,[e("http://localhost:8880/"),o(t)]),e(" ###vmalert---提供告警，去VM查询，符合条件就产生告警，再发送到alertmanager")]),r("li",null,[r("a",E,[e("http://localhost:9093/"),o(t)]),e(" ###alertmanager---vmalert没有超越alertmanager，并只能依赖于alertmanager，提供告警路由，告警抑制等功能。")])]),r("p",null,[e("如果你是Prometheus的用户，你可以前往"),r("a",L,[e("https://play.victoriametrics.com/"),o(t)]),e(', 这里体验一下官方提供的一个demo，相比于Prometheus这个前端页面做的确实很用心了，让我感触最深的一点就是，当你查一个指标不加任何筛选调条件（即job="XXXX"）可能会有很多的时间序列被查询到，他会有一个提示，因为性能原因只显示了多少条，这不是关键，你当然知道要加筛选条件，毕竟你也不想看到你不想看的序列出现在图表，当你想添加筛选条件时，你只需要点击你刚才查询的很多时间序列中的某个条件，即可复制到粘贴板，然后粘贴在上面的查询框，简直了，怎么会有这么人性化的设计。vmui对比Prometheus，简直完胜。 虽然vmalert没能超越alertmanager，但是其实就算做了个类alertmanager的东西，不也是重复造轮子吗？毕竟alertmanager已经很强大了。 我在自己的本机使用docker单独运行了一个node_exporter，然后把它添加到这套监控系统，整挺好，慢慢来吧，后续的体验记录也会继续更新在这里。')]),O,r("p",null,[r("a",q,[e("Thanos 与 VictoriaMetrics 集群的比较"),o(t)])])])}const H=a(c,[["render",Q],["__file","Docker运行VictoriaMetreic测试体验.html.vue"]]);export{H as default};
