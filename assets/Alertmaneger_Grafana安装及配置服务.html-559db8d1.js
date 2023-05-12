import{_ as r,W as t,X as s,Y as e,Z as a,$ as i,a0 as l,a1 as d,D as c}from"./framework-ab2cdc09.js";const m={},o={href:"https://github.com/prometheus/alertmanager",target:"_blank",rel:"noopener noreferrer"},u=e("strong",null,"Alertmanager",-1),v=e("p",null,[e("strong",null,"Grafana"),a(" allows you to query, visualize, alert on and understand your metrics no matter where they are stored. Create, explore, and share beautiful dashboards with your team and foster a data driven culture.")],-1),g=d(`<p>首先cd /resource，移动到资源目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>wget https://github.com/prometheus/alertmanager/releases/download/v0.23.0/alertmanager-0.23.0.linux-amd64.tar.gz
wget https://dl.grafana.com/enterprise/release/grafana-enterprise-8.2.3.linux-amd64.tar.gz
tar -xzf grafana-enterprise-8.2.3.linux-amd64.tar.gz  -C .. 
tar -xzf alertmanager-0.23.0.linux-amd64.tar.gz -C .. 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为应用创建一个系统服务通过systemctl来管理 vi /usr/lib/systemd/system/alertmanager.service</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[Unit]
Description=Alertmanager
After=network-online.target
 
[Service]
Restart=on-failure
ExecStart=/home/alertmanager-0.23.0.linux-amd64/alertmanager --config.file=/home/alertmanager-0.23.0.linux-amd64/alertmanager.yml
 
[Install]
WantedBy=multi-user.target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>vim /usr/lib/systemd/system/grafana.service</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[Unit]
Description=grafana
After=network.target
 
[Service]
Type=notify
ExecStart=/home/grafana-8.2.3/bin/grafana-server -homepath /home/grafana-8.2.3
Restart=on-failure
 
[Install]
WantedBy=multi-user.target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>systemctl start grafana#开启 systemctl status grafana#查询状态 systemctl enable grafana#设置开机自启</p><p>这个操作会将刚才创建的服务链接到etc/systemd/system/，这个目录下，也就是说这个目录放的都是开机自启的服务文件 systemctl disable grafana#禁止开机自启，这个操作会移除上一步的那个链接，从而实现，取消开启自启 systemctl daemon-reload#重载，添加完服务，就执行这个重载命令 systemctl reset-failed#重置失败的记录</p>`,8);function b(p,f){const n=c("ExternalLinkIcon");return t(),s("div",null,[e("p",null,[a("The "),e("a",o,[u,i(n)]),a(" handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.")]),v,l("more"),g])}const _=r(m,[["render",b],["__file","Alertmaneger_Grafana安装及配置服务.html.vue"]]);export{_ as default};
