const e=JSON.parse('{"key":"v-4e21712b","path":"/docs/Kubernetes/%E4%BD%BF%E7%94%A8kubeadm%E6%90%AD%E5%BB%BA%E9%AB%98%E5%8F%AF%E7%94%A8%E7%9A%84K8s%E9%9B%86%E7%BE%A4.html","title":"使用kubeadm搭建高可用的K8s集群","lang":"zh-CN","frontmatter":{"description":"kubeadm是官方社区推出的一个用于快速部署kubernetes集群的工具。 这个工具能通过两条指令完成一个kubernetes集群的部署： 1. 安装要求 在开始之前，部署Kubernetes集群机器需要满足以下几个条件： 一台或多台机器，操作系统 CentOS7.x-86_x64; 硬件配置：2GB或更多RAM，2个CPU或更多CPU，硬盘30G...","head":[["meta",{"property":"og:url","content":"https://vuepress-theme-hope-docs-demo.netlify.app/docs/docs/Kubernetes/%E4%BD%BF%E7%94%A8kubeadm%E6%90%AD%E5%BB%BA%E9%AB%98%E5%8F%AF%E7%94%A8%E7%9A%84K8s%E9%9B%86%E7%BE%A4.html"}],["meta",{"property":"og:title","content":"使用kubeadm搭建高可用的K8s集群"}],["meta",{"property":"og:description","content":"kubeadm是官方社区推出的一个用于快速部署kubernetes集群的工具。 这个工具能通过两条指令完成一个kubernetes集群的部署： 1. 安装要求 在开始之前，部署Kubernetes集群机器需要满足以下几个条件： 一台或多台机器，操作系统 CentOS7.x-86_x64; 硬件配置：2GB或更多RAM，2个CPU或更多CPU，硬盘30G..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-08-14T15:44:49.000Z"}],["meta",{"property":"article:author","content":"ShareYu"}],["meta",{"property":"article:modified_time","content":"2023-08-14T15:44:49.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"使用kubeadm搭建高可用的K8s集群\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-08-14T15:44:49.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"ShareYu\\",\\"url\\":\\"https://yinyu985.github.io/\\"}]}"]]},"headers":[{"level":2,"title":"1. 安装要求","slug":"_1-安装要求","link":"#_1-安装要求","children":[]},{"level":2,"title":"2. 准备环境","slug":"_2-准备环境","link":"#_2-准备环境","children":[]},{"level":2,"title":"3. 所有master节点部署keepalived","slug":"_3-所有master节点部署keepalived","link":"#_3-所有master节点部署keepalived","children":[{"level":3,"title":"3.1 安装相关包和keepalived","slug":"_3-1-安装相关包和keepalived","link":"#_3-1-安装相关包和keepalived","children":[]},{"level":3,"title":"3.2配置master节点","slug":"_3-2配置master节点","link":"#_3-2配置master节点","children":[]},{"level":3,"title":"3.3 启动和检查","slug":"_3-3-启动和检查","link":"#_3-3-启动和检查","children":[]}]},{"level":2,"title":"4. 部署haproxy","slug":"_4-部署haproxy","link":"#_4-部署haproxy","children":[{"level":3,"title":"4.1 安装","slug":"_4-1-安装","link":"#_4-1-安装","children":[]},{"level":3,"title":"4.2 配置","slug":"_4-2-配置","link":"#_4-2-配置","children":[]},{"level":3,"title":"4.3 启动和检查","slug":"_4-3-启动和检查","link":"#_4-3-启动和检查","children":[]}]},{"level":2,"title":"5. 所有节点安装Docker/kubeadm/kubelet","slug":"_5-所有节点安装docker-kubeadm-kubelet","link":"#_5-所有节点安装docker-kubeadm-kubelet","children":[{"level":3,"title":"5.1 安装Docker","slug":"_5-1-安装docker","link":"#_5-1-安装docker","children":[]},{"level":3,"title":"5.2 添加阿里云YUM软件源","slug":"_5-2-添加阿里云yum软件源","link":"#_5-2-添加阿里云yum软件源","children":[]},{"level":3,"title":"5.3 安装kubeadm，kubelet和kubectl","slug":"_5-3-安装kubeadm-kubelet和kubectl","link":"#_5-3-安装kubeadm-kubelet和kubectl","children":[]}]},{"level":2,"title":"6. 部署Kubernetes Master","slug":"_6-部署kubernetes-master","link":"#_6-部署kubernetes-master","children":[{"level":3,"title":"6.1 创建kubeadm配置文件","slug":"_6-1-创建kubeadm配置文件","link":"#_6-1-创建kubeadm配置文件","children":[]},{"level":3,"title":"6.2 在master1节点执行","slug":"_6-2-在master1节点执行","link":"#_6-2-在master1节点执行","children":[]}]},{"level":2,"title":"7.安装集群网络","slug":"_7-安装集群网络","link":"#_7-安装集群网络","children":[]},{"level":2,"title":"8.master2节点加入集群","slug":"_8-master2节点加入集群","link":"#_8-master2节点加入集群","children":[{"level":3,"title":"8.1 复制密钥及相关文件","slug":"_8-1-复制密钥及相关文件","link":"#_8-1-复制密钥及相关文件","children":[]},{"level":3,"title":"8.2 master2加入集群","slug":"_8-2-master2加入集群","link":"#_8-2-master2加入集群","children":[]}]},{"level":2,"title":"9. 加入Kubernetes Node","slug":"_9-加入kubernetes-node","link":"#_9-加入kubernetes-node","children":[]},{"level":2,"title":"10. 测试kubernetes集群","slug":"_10-测试kubernetes集群","link":"#_10-测试kubernetes集群","children":[]}],"git":{"createdTime":1692027889000,"updatedTime":1692027889000,"contributors":[{"name":"yinyu985","email":"yinyu985@gmail.com","commits":1}]},"readingTime":{"minutes":4.85,"words":1454},"filePathRelative":"docs/Kubernetes/使用kubeadm搭建高可用的K8s集群.md","localizedDate":"2023年8月14日","autoDesc":true,"excerpt":""}');export{e as data};
