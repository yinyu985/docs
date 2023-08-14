# K8s中pod的创建过程

1. kubelet向kube-apiserver注册，，包括本机的cpu、内存、主机名、运行的容器等信息 

2. kube-apiserver收到请求， 将信息存储至etcd 

3. 管理员向kube-apiserver下达创建容器的请求，包括创建的容器的副本数、所使用的镜像、使用什么网络、dns、要创建的容器名称等

4. kube-apiserver收到请求，将信息存储至etcd 

5. kube-scheduler向kube-apiserver发出请求，询问是否有任务需要执行

6. kube-apiserver检索etcd, 将管理员的创建容器的需求以及kubelet的相关信息返回给kube-scheduler

7. kube-scheduler通过计算找出最适合运行当前容器的kubelet，将该kubelet信息与要创建容器的信息进行鄉定， 并返回给kube-apiserver

8. kube-apiserver收到请求，将信息存储至etcd

9. kubelet收到要创建的容器信息，调用本地的containerd,

10. kubelet收到要创建的容器信息，调用本地的containerd,创建容器

11. containerd创建完容器将信息返回给kubelet, kubelet再次向kube-apiserver发起请求，将信息发送给kube-apiserver

12. kube-apiserver收到请求，将信息存储至etcd

13. kube-controller-manager向kube-apiserver发出请求，询问是否有任务需要执行

14. kube-apiserver收到请求，将kubelet返回的创建容器的信息以及管理员要求创建容器的信息发送给kube-controller-manager

15. > kube-controller-manager进行对比之后，向kube-apiserver返回结果 
    >
    > 如果结果正常，则本次任务顾利完成，任务结束 
    >
    > 如果结果不正常，则重复5-14的执行过程

16. 管理员再次向Kube-apiserver发送请求，询问任务是否执行完毕

17. kube-apiserver收到请求，检索etcd，返回任务执行结果



> Pod是Kubernetes中最基本的调度单位，是由一组容器组成的集合，Pod中的容器共享网络和存储资源。下面是Pod创建的整个流程：
>
> 1. 用户使用Kubernetes API或者命令行工具(kubectl)创建Pod对象，并指定Pod的名称、标签、容器数量、容器镜像等信息。
> 2. Kubernetes API Server接收到用户的请求，进行验证和授权，并将Pod对象保存到etcd集群中。etcd是Kubernetes集群的数据存储后端，负责保存集群的配置信息和状态信息。
> 3. Kubernetes的调度器组件会根据Pod的调度要求，为Pod分配一个Node节点，选择的规则包括节点的资源可用性、标签选择器匹配等等。
> 4. Kubernetes的控制器组件会检测到新创建的Pod对象，根据其标签匹配规则，为Pod关联一个Replication Controller或者Deployment，以便于后续的扩容和管理。
> 5. Kubernetes的容器运行时组件Docker或者Containerd会根据Pod中定义的容器镜像，从Docker Registry或者私有仓库中拉取镜像。
> 6. 当所有的容器镜像都下载完成后，Kubernetes的Kubelet组件会在Node节点上创建Pod中的容器，并进行初始化，包括创建容器的网络命名空间、共享存储卷等。
> 7. Pod的容器启动后，Kubernetes的容器运行时组件会监控容器的运行状态，并在容器出现故障或者被终止时进行重启或者清理。
> 8. Kubernetes的API Server会将Pod的状态更新到etcd集群中，以便于其他组件查询和监控。
> 9. 用户可以使用kubectl命令或者Dashboard等工具来查看Pod的状态和日志信息。
>
> 总之，Pod创建的整个过程包括了多个组件和步骤，Kubernetes通过这些组件的协同工作，实现了高效、可靠的Pod创建和管理。
