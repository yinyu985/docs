# dnsdist安装踩坑
接到需求需要安装dnsdist、dnsmasq

dnsdist：用于实现用户端DNS请求的到后端DNS服务的负载均衡，通过DNS缓存，提升DNS请求的响应速度，另可通过挂载Lua语句策略实现灵活的DNS劫持和条件转发。

dnsmasq：轻量级DNS服务，DNS策略逻辑基于文本配置文件，逻辑清晰简单， 易于维护，支持多个上游解析服务器同时Query以提升服务SLA，[优化参考](https://www.redhat.com/en/blog/five-nines-dnsmasq)。

## 安装

没有安装文档，查看网络上分享的文章直接apt-get完事。

## 出错

导入现有配置文件后一直失败，考虑过配置文件权限问题，和socket文件之后仍然无效，无法启动

## 突破

发现现有的dnsdist的版本是1.5.1，新机器利用 ` apt-cache policy dnsdist`查看所有可用的版本，并没有1.5.1

查看官网版本仓库发现debian系统的apt源配置流程如下

> 创建文件 '/etc/apt/sources.list.d/pdns.list' 写入以下内容：
>
> ```
> deb [arch=amd64] http://repo.powerdns.com/debian stretch-dnsdist-15 main
> ```
>
> 创建文件/etc/apt/preferences.d/dnsdist'写入以下内容：
>
> ```
> Package: dnsdist*
> Pin: origin repo.powerdns.com
> Pin-Priority: 600
> ```
>
> 然后执行以下命令
>
> ```
> curl https://repo.powerdns.com/FD380FBB-pub.asc
> #下载公钥
> apt-key add - 
> #添加公钥
> apt-get update
> #更新源
> apt-get install -y dnsdist=1.5.1-1pdns.stretch
> #安装，指定跟现有环境，同版本的dnsdist
> 
> curl https://repo.powerdns.com/FD380FBB-pub.asc |  apt-key add - && apt-get update && apt-get install dnsdist
> ```

将现有的dnsdist的配置文件通过scp发送到新机器，dnsdist重启一切正常，测试正常。