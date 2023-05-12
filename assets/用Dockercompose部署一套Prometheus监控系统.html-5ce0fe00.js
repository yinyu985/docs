import{_ as r,W as a,X as l,Y as e,Z as n,$ as s,a1 as o,D as d}from"./framework-ab2cdc09.js";const t={},v=o(`<p>Prometheus受启发于Google的Brogmon监控系统（相似的Kubernetes是从Google的Brog系统演变而来），从2012年开始由前Google工程师在Soundcloud以开源软件的形式进行研发，并且于2015年早期对外发布早期版本。2016年5月继Kubernetes之后成为第二个正式加入CNCF基金会的项目，同年6月正式发布1.0版本。2017年底发布了基于全新存储层的2.0版本，能更好地与容器平台、云平台配合。<!--more--></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>version: &#39;2.2&#39;
services:
    prometheus:
        image: prom/prometheus:v2.29.2
        container_name: prometheus
        restart: always
        privileged: true
        user: root
        ports:
            - 9090:9090
        volumes:
            - /home/docker/prometheus/:/etc/prometheus/
            - /home/docker/prometheus/conf.d:/etc/prometheus/conf.d
            - /home/docker/prometheus/data:/etc/prometheus/data
        command:
            - &#39;--config.file=/etc/prometheus/prometheus.yml&#39;
            - &#39;--storage.tsdb.path=/etc/prometheus/data&#39;
            - &#39;--storage.tsdb.retention=90d&#39;
            - &#39;--web.enable-lifecycle&#39;

    grafana:
        privileged: true
        user: root
        image: grafana/grafana:8.1.2
        container_name: grafana
        restart: always
        ports:
            - &#39;3000:3000&#39;
        volumes:
            - /home/docker/grafana/data:/var/lib/grafana/
            - /home/docker/grafana/log:/var/log/grafana/
            - /home/docker/grafana/conf:/usr/share/grafana/conf

    blackbox-exporter:
        image: prom/blackbox-exporter:v0.19.0
        container_name: blackbox-exporter
        hostname: blackbox-exporter
        ports:
            - &quot;9115:9115&quot;
        restart: always
        volumes:
            - &quot;/home/docker/blackbox/blackbox.yml:/config/blackbox.yml&quot;
        command:
            - &#39;--config.file=/config/blackbox.yml&#39;

    node-exporter:
        image: prom/node-exporter:v1.2.2
        container_name: node-exporter
        ports:
            - &quot;9100:9100&quot;
        restart: always
        volumes:
            - &#39;/:/host:ro,rslave&#39;
        command:
            - &#39;--path.rootfs=/host&#39;

    openspeedtest:
        image: openspeedtest/latest:speedtest
        container_name: openspeedtest
        hostname: openspeedtest
        restart: unless-stopped
        ports:
            - &#39;3002:3000&#39;
            - &#39;3001:3001&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),c={href:"https://yunlzheng.gitbook.io/prometheus-book/",target:"_blank",rel:"noopener noreferrer"},m={href:"https://prometheus.fuckcloudnative.io/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://www.kancloud.cn/huyipow/prometheus",target:"_blank",rel:"noopener noreferrer"};function b(p,h){const i=d("ExternalLinkIcon");return a(),l("div",null,[v,e("p",null,[n("少年想学Prometheus吗？这里有几份秘籍。 "),e("a",c,[n("https://yunlzheng.gitbook.io/prometheus-book/"),s(i)]),e("a",m,[n("https://prometheus.fuckcloudnative.io/"),s(i)]),e("a",u,[n("https://www.kancloud.cn/huyipow/prometheus"),s(i)])])])}const _=r(t,[["render",b],["__file","用Dockercompose部署一套Prometheus监控系统.html.vue"]]);export{_ as default};
