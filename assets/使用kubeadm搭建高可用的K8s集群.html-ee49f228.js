import{_ as s,W as a,X as d,Y as n,Z as e,$ as l,a0 as r,D as t}from"./framework-b4edc447.js";const c={},v=r(`<h1 id="使用kubeadm搭建高可用的k8s集群" tabindex="-1"><a class="header-anchor" href="#使用kubeadm搭建高可用的k8s集群" aria-hidden="true">#</a> 使用kubeadm搭建高可用的K8s集群</h1><p>kubeadm是官方社区推出的一个用于快速部署kubernetes集群的工具。</p><p>这个工具能通过两条指令完成一个kubernetes集群的部署：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 创建一个 Master 节点
$ kubeadm init

# 将一个 Node 节点加入到当前集群中
$ kubeadm join &lt;Master节点的IP和端口 &gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-安装要求" tabindex="-1"><a class="header-anchor" href="#_1-安装要求" aria-hidden="true">#</a> 1. 安装要求</h2><p>在开始之前，部署Kubernetes集群机器需要满足以下几个条件：</p><ul><li>一台或多台机器，操作系统 CentOS7.x-86_x64</li><li>硬件配置：2GB或更多RAM，2个CPU或更多CPU，硬盘30GB或更多</li><li>可以访问外网，需要拉取镜像，如果服务器不能上网，需要提前下载镜像并导入节点</li><li>禁止swap分区</li></ul><h2 id="_2-准备环境" tabindex="-1"><a class="header-anchor" href="#_2-准备环境" aria-hidden="true">#</a> 2. 准备环境</h2><table><thead><tr><th>角色</th><th>IP</th></tr></thead><tbody><tr><td>master1</td><td>192.168.44.155</td></tr><tr><td>master2</td><td>192.168.44.156</td></tr><tr><td>node1</td><td>192.168.44.157</td></tr><tr><td>VIP（虚拟ip）</td><td>192.168.44.158</td></tr></tbody></table><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 关闭防火墙
systemctl stop firewalld
systemctl disable firewalld

# 关闭selinux
sed -i &#39;s/enforcing/disabled/&#39; /etc/selinux/config  # 永久
setenforce 0  # 临时

# 关闭swap
swapoff -a  # 临时
sed -ri &#39;s/.*swap.*/#&amp;/&#39; /etc/fstab    # 永久

# 根据规划设置主机名
hostnamectl set-hostname &lt;hostname&gt;

# 在master添加hosts
cat &gt;&gt; /etc/hosts &lt;&lt; EOF
192.168.44.158    master.k8s.io   k8s-vip
192.168.44.155    master01.k8s.io master1
192.168.44.156    master02.k8s.io master2
192.168.44.157    node01.k8s.io   node1
EOF

# 将桥接的IPv4流量传递到iptables的链
cat &gt; /etc/sysctl.d/k8s.conf &lt;&lt; EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system  # 生效

# 时间同步
yum install ntpdate -y
ntpdate time.windows.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-所有master节点部署keepalived" tabindex="-1"><a class="header-anchor" href="#_3-所有master节点部署keepalived" aria-hidden="true">#</a> 3. 所有master节点部署keepalived</h2><h3 id="_3-1-安装相关包和keepalived" tabindex="-1"><a class="header-anchor" href="#_3-1-安装相关包和keepalived" aria-hidden="true">#</a> 3.1 安装相关包和keepalived</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum install -y conntrack-tools libseccomp libtool-ltdl

yum install -y keepalived
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2配置master节点" tabindex="-1"><a class="header-anchor" href="#_3-2配置master节点" aria-hidden="true">#</a> 3.2配置master节点</h3><p>master1节点配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &gt; /etc/keepalived/keepalived.conf &lt;&lt;EOF 
! Configuration File for keepalived

global_defs {
   router_id k8s
}

vrrp_script check_haproxy {
    script &quot;killall -0 haproxy&quot;
    interval 3
    weight -2
    fall 10
    rise 2
}

vrrp_instance VI_1 {
    state MASTER 
    interface ens33 
    virtual_router_id 51
    priority 250
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass ceb1b3ec013d66163d6ab
    }
    virtual_ipaddress {
        192.168.44.158
    }
    track_script {
        check_haproxy
    }

}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>master2节点配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &gt; /etc/keepalived/keepalived.conf &lt;&lt;EOF 
! Configuration File for keepalived

global_defs {
   router_id k8s
}

vrrp_script check_haproxy {
    script &quot;killall -0 haproxy&quot;
    interval 3
    weight -2
    fall 10
    rise 2
}

vrrp_instance VI_1 {
    state BACKUP 
    interface ens33 
    virtual_router_id 51
    priority 200
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass ceb1b3ec013d66163d6ab
    }
    virtual_ipaddress {
        192.168.44.158
    }
    track_script {
        check_haproxy
    }

}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-启动和检查" tabindex="-1"><a class="header-anchor" href="#_3-3-启动和检查" aria-hidden="true">#</a> 3.3 启动和检查</h3><p>在两台master节点都执行</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 启动keepalived
$ systemctl start keepalived.service
设置开机启动
$ systemctl enable keepalived.service
# 查看启动状态
$ systemctl status keepalived.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动后查看master1的网卡信息</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ip a s ens33
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_4-部署haproxy" tabindex="-1"><a class="header-anchor" href="#_4-部署haproxy" aria-hidden="true">#</a> 4. 部署haproxy</h2><h3 id="_4-1-安装" tabindex="-1"><a class="header-anchor" href="#_4-1-安装" aria-hidden="true">#</a> 4.1 安装</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum install -y haproxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-2-配置" tabindex="-1"><a class="header-anchor" href="#_4-2-配置" aria-hidden="true">#</a> 4.2 配置</h3><p>两台master节点的配置均相同，配置中声明了后端代理的两个master节点服务器，指定了haproxy运行的端口为16443等，因此16443端口为集群的入口</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &gt; /etc/haproxy/haproxy.cfg &lt;&lt; EOF
#---------------------------------------------------------------------
# Global settings
#---------------------------------------------------------------------
global
    # to have these messages end up in /var/log/haproxy.log you will
    # need to:
    # 1) configure syslog to accept network log events.  This is done
    #    by adding the &#39;-r&#39; option to the SYSLOGD_OPTIONS in
    #    /etc/sysconfig/syslog
    # 2) configure local2 events to go to the /var/log/haproxy.log
    #   file. A line like the following can be added to
    #   /etc/sysconfig/syslog
    #
    #    local2.*                       /var/log/haproxy.log
    #
    log         127.0.0.1 local2
    
    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon 
       
    # turn on stats unix socket
    stats socket /var/lib/haproxy/stats
#---------------------------------------------------------------------
# common defaults that all the &#39;listen&#39; and &#39;backend&#39; sections will
# use if not designated in their block
#---------------------------------------------------------------------  
defaults
    mode                    http
    log                     global
    option                  httplog
    option                  dontlognull
    option http-server-close
    option forwardfor       except 127.0.0.0/8
    option                  redispatch
    retries                 3
    timeout http-request    10s
    timeout queue           1m
    timeout connect         10s
    timeout client          1m
    timeout server          1m
    timeout http-keep-alive 10s
    timeout check           10s
    maxconn                 3000
#---------------------------------------------------------------------
# kubernetes apiserver frontend which proxys to the backends
#--------------------------------------------------------------------- 
frontend kubernetes-apiserver
    mode                 tcp
    bind                 *:16443
    option               tcplog
    default_backend      kubernetes-apiserver    
#---------------------------------------------------------------------
# round robin balancing between the various backends
#---------------------------------------------------------------------
backend kubernetes-apiserver
    mode        tcp
    balance     roundrobin
    server      master01.k8s.io   192.168.44.155:6443 check
    server      master02.k8s.io   192.168.44.156:6443 check
#---------------------------------------------------------------------
# collection haproxy statistics message
#---------------------------------------------------------------------
listen stats
    bind                 *:1080
    stats auth           admin:awesomePassword
    stats refresh        5s
    stats realm          HAProxy\\ Statistics
    stats uri            /admin?stats
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-启动和检查" tabindex="-1"><a class="header-anchor" href="#_4-3-启动和检查" aria-hidden="true">#</a> 4.3 启动和检查</h3><p>两台master都启动</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 设置开机启动
$ systemctl enable haproxy
# 开启haproxy
$ systemctl start haproxy
# 查看启动状态
$ systemctl status haproxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>检查端口</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>netstat -lntup|grep haproxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_5-所有节点安装docker-kubeadm-kubelet" tabindex="-1"><a class="header-anchor" href="#_5-所有节点安装docker-kubeadm-kubelet" aria-hidden="true">#</a> 5. 所有节点安装Docker/kubeadm/kubelet</h2><p>Kubernetes默认CRI（容器运行时）为Docker，因此先安装Docker。</p><h3 id="_5-1-安装docker" tabindex="-1"><a class="header-anchor" href="#_5-1-安装docker" aria-hidden="true">#</a> 5.1 安装Docker</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo
$ yum -y install docker-ce-18.06.1.ce-3.el7
$ systemctl enable docker &amp;&amp; systemctl start docker
$ docker --version
Docker version 18.06.1-ce, build e68fc7a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ cat &gt; /etc/docker/daemon.json &lt;&lt; EOF
{
  &quot;registry-mirrors&quot;: [&quot;https://b9pmyelo.mirror.aliyuncs.com&quot;]
}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-添加阿里云yum软件源" tabindex="-1"><a class="header-anchor" href="#_5-2-添加阿里云yum软件源" aria-hidden="true">#</a> 5.2 添加阿里云YUM软件源</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ cat &gt; /etc/yum.repos.d/kubernetes.repo &lt;&lt; EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-安装kubeadm-kubelet和kubectl" tabindex="-1"><a class="header-anchor" href="#_5-3-安装kubeadm-kubelet和kubectl" aria-hidden="true">#</a> 5.3 安装kubeadm，kubelet和kubectl</h3><p>由于版本更新频繁，这里指定版本号部署：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ yum install -y kubelet-1.16.3 kubeadm-1.16.3 kubectl-1.16.3
$ systemctl enable kubelet
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-部署kubernetes-master" tabindex="-1"><a class="header-anchor" href="#_6-部署kubernetes-master" aria-hidden="true">#</a> 6. 部署Kubernetes Master</h2><h3 id="_6-1-创建kubeadm配置文件" tabindex="-1"><a class="header-anchor" href="#_6-1-创建kubeadm配置文件" aria-hidden="true">#</a> 6.1 创建kubeadm配置文件</h3><p>在具有vip的master上操作，这里为master1</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ mkdir /usr/local/kubernetes/manifests -p

$ cd /usr/local/kubernetes/manifests/

$ vi kubeadm-config.yaml

apiServer:
  certSANs:
    - master1
    - master2
    - master.k8s.io
    - 192.168.44.158
    - 192.168.44.155
    - 192.168.44.156
    - 127.0.0.1
  extraArgs:
    authorization-mode: Node,RBAC
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta1
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controlPlaneEndpoint: &quot;master.k8s.io:16443&quot;
controllerManager: {}
dns: 
  type: CoreDNS
etcd:
  local:    
    dataDir: /var/lib/etcd
imageRepository: registry.aliyuncs.com/google_containers
kind: ClusterConfiguration
kubernetesVersion: v1.16.3
networking: 
  dnsDomain: cluster.local  
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.1.0.0/16
scheduler: {}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-在master1节点执行" tabindex="-1"><a class="header-anchor" href="#_6-2-在master1节点执行" aria-hidden="true">#</a> 6.2 在master1节点执行</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ kubeadm init --config kubeadm-config.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>按照提示配置环境变量，使用kubectl工具：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube
<span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config
<span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config
$ kubectl get nodes
$ kubectl get pods <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>按照提示保存以下内容，一会要使用：</strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubeadm <span class="token function">join</span> master.k8s.io:16443 <span class="token parameter variable">--token</span> jv5z7n.3y1zi95p952y9p65 <span class="token punctuation">\\</span>
    --discovery-token-ca-cert-hash sha256:403bca185c2f3a4791685013499e7ce58f9848e2213e27194b75a2e3293d8812 <span class="token punctuation">\\</span>
    --control-plane 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看集群状态</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get cs

kubectl get pods <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-安装集群网络" tabindex="-1"><a class="header-anchor" href="#_7-安装集群网络" aria-hidden="true">#</a> 7.安装集群网络</h2><p>从官方地址获取到flannel的yaml，在master1上执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> flannel
<span class="token builtin class-name">cd</span> flannel
<span class="token function">wget</span> <span class="token parameter variable">-c</span> https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装flannel网络</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> kube-flannel.yml 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>检查</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>kubectl get pods <span class="token parameter variable">-n</span> kube-system
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_8-master2节点加入集群" tabindex="-1"><a class="header-anchor" href="#_8-master2节点加入集群" aria-hidden="true">#</a> 8.master2节点加入集群</h2><h3 id="_8-1-复制密钥及相关文件" tabindex="-1"><a class="header-anchor" href="#_8-1-复制密钥及相关文件" aria-hidden="true">#</a> 8.1 复制密钥及相关文件</h3><p>从master1复制密钥及相关文件到master2</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># ssh root@192.168.44.156 mkdir -p /etc/kubernetes/pki/etcd</span>

<span class="token comment"># scp /etc/kubernetes/admin.conf root@192.168.44.156:/etc/kubernetes</span>
   
<span class="token comment"># scp /etc/kubernetes/pki/{ca.*,sa.*,front-proxy-ca.*} root@192.168.44.156:/etc/kubernetes/pki</span>
   
<span class="token comment"># scp /etc/kubernetes/pki/etcd/ca.* root@192.168.44.156:/etc/kubernetes/pki/etcd</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-master2加入集群" tabindex="-1"><a class="header-anchor" href="#_8-2-master2加入集群" aria-hidden="true">#</a> 8.2 master2加入集群</h3><p>执行在master1上init后输出的join命令,需要带上参数<code>--control-plane</code>表示把master控制节点加入集群</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubeadm join master.k8s.io:16443 --token ckf7bs.30576l0okocepg8b     --discovery-token-ca-cert-hash sha256:19afac8b11182f61073e254fb57b9f19ab4d798b70501036fc69ebef46094aba --control-plane
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>检查状态</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get node

kubectl get pods --all-namespaces
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-加入kubernetes-node" tabindex="-1"><a class="header-anchor" href="#_9-加入kubernetes-node" aria-hidden="true">#</a> 9. 加入Kubernetes Node</h2><p>在node1上执行</p><p>向集群添加新节点，执行在kubeadm init输出的kubeadm join命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubeadm join master.k8s.io:16443 --token ckf7bs.30576l0okocepg8b     --discovery-token-ca-cert-hash sha256:19afac8b11182f61073e254fb57b9f19ab4d798b70501036fc69ebef46094aba
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>集群网络重新安装，因为添加了新的node节点</strong></p><p>检查状态</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>kubectl get node

kubectl get pods --all-namespaces
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-测试kubernetes集群" tabindex="-1"><a class="header-anchor" href="#_10-测试kubernetes集群" aria-hidden="true">#</a> 10. 测试kubernetes集群</h2><p>在Kubernetes集群中创建一个pod，验证是否正常运行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ kubectl create deployment nginx --image=nginx
$ kubectl expose deployment nginx --port=80 --type=NodePort
$ kubectl get pod,svc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,82),u={href:"http://NodeIP",target:"_blank",rel:"noopener noreferrer"};function m(b,o){const i=t("ExternalLinkIcon");return a(),d("div",null,[v,n("p",null,[e("访问地址："),n("a",u,[e("http://NodeIP"),l(i)]),e(":Port")])])}const h=s(c,[["render",m],["__file","使用kubeadm搭建高可用的K8s集群.html.vue"]]);export{h as default};
