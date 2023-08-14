import{_ as n,W as a,X as t,Y as e,Z as s,$ as i,a0 as r,D as c}from"./framework-b4edc447.js";const l={},o=e("h1",{id:"dnsdist安装踩坑",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#dnsdist安装踩坑","aria-hidden":"true"},"#"),s(" dnsdist安装踩坑")],-1),p=e("p",null,"接到需求需要安装dnsdist、dnsmasq",-1),u=e("p",null,"dnsdist：用于实现用户端DNS请求的到后端DNS服务的负载均衡，通过DNS缓存，提升DNS请求的响应速度，另可通过挂载Lua语句策略实现灵活的DNS劫持和条件转发。",-1),m={href:"https://www.redhat.com/en/blog/five-nines-dnsmasq",target:"_blank",rel:"noopener noreferrer"},h=r(`<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>没有安装文档，查看网络上分享的文章直接apt-get完事。</p><h2 id="出错" tabindex="-1"><a class="header-anchor" href="#出错" aria-hidden="true">#</a> 出错</h2><p>导入现有配置文件后一直失败，考虑过配置文件权限问题，和socket文件之后仍然无效，无法启动</p><h2 id="突破" tabindex="-1"><a class="header-anchor" href="#突破" aria-hidden="true">#</a> 突破</h2><p>发现现有的dnsdist的版本是1.5.1，新机器利用 <code> apt-cache policy dnsdist</code>查看所有可用的版本，并没有1.5.1</p><p>查看官网版本仓库发现debian系统的apt源配置流程如下</p><blockquote><p>创建文件 &#39;/etc/apt/sources.list.d/pdns.list&#39; 写入以下内容：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>deb [arch=amd64] http://repo.powerdns.com/debian stretch-dnsdist-15 main
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建文件/etc/apt/preferences.d/dnsdist&#39;写入以下内容：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Package: dnsdist*
Pin: origin repo.powerdns.com
Pin-Priority: 600
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后执行以下命令</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>curl https://repo.powerdns.com/FD380FBB-pub.asc
#下载公钥
apt-key add - 
#添加公钥
apt-get update
#更新源
apt-get install -y dnsdist=1.5.1-1pdns.stretch
#安装，指定跟现有环境，同版本的dnsdist

curl https://repo.powerdns.com/FD380FBB-pub.asc |  apt-key add - &amp;&amp; apt-get update &amp;&amp; apt-get install dnsdist
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><p>将现有的dnsdist的配置文件通过scp发送到新机器，dnsdist重启一切正常，测试正常。</p>`,9);function v(b,_){const d=c("ExternalLinkIcon");return a(),t("div",null,[o,p,u,e("p",null,[s("dnsmasq：轻量级DNS服务，DNS策略逻辑基于文本配置文件，逻辑清晰简单， 易于维护，支持多个上游解析服务器同时Query以提升服务SLA，"),e("a",m,[s("优化参考"),i(d)]),s("。")]),h])}const g=n(l,[["render",v],["__file","dnsdist安装踩坑.html.vue"]]);export{g as default};
