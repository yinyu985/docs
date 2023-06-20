# docker网络问题

启动 nginx 容器测试下访问:
```bash
docker run -d --name nginx --rm -p 81:80 nginx:alpine
```
访问宿主机的 81 端口，如果有云主机的话安全组放行下端口。如果不能访问：

docker inspect nginx | grep IPAddress，curl 下这个ip，如果是 No route to host, 或者curl localhost:81报错curl: (56) Recv failure: Connection reset by peer。

## 尝试开下混杂模式后再试试
```
ip link set docker0 promisc on  # docker的网卡docker0开启混杂模式
```

将 docker0 接口设置为混杂模式(promiscuous mode)。
混杂模式允许网卡接收并读取发送给其他主机的网络数据包。普通模式下,网卡只接收发送给自己 MAC 地址的数据包。
对 docker0 接口启用混杂模式的原因是,Docker 使用网桥来管理容器网络,并将主机上的 docker0 接口与网桥相连。
在混杂模式下,主机可以接收发送到任何连接到网桥(包括容器)的网络数据包。这允许从主机访问容器,甚至容器互相访问。
如果不启用混杂模式,主机只能接收发给自己的数据包,无法与连接在网桥上的容器通信。
所以,总结一下这个命令的作用:
- 将主机上的 docker0 接口设置为混杂模式
- 允许主机接收发往网桥上其他接口(容器)的网络数据包
- 使主机能与 Docker 容器网络通信
- 实现 Docker 主机与容器、容器互联的网络连接
混杂模式只应在可信网络环境中使用,因为它会使主机接收到原本不发给自己的数据包,存在安全风险。但对于 Docker 容器网络来说,它是实现主机与容器互联必不可少的。
