

# Docker的网络模式

Docker 支持多种网络模式，它们决定了 Docker 容器如何与主机和其他容器进行通信。以下是 Docker 支持的几种网络模式：

1.  桥接模式（Bridge）：默认情况下，Docker 容器使用的网络模式。在桥接模式下，Docker 会为每个容器分配一个虚拟 IP 地址，并将它们连接到一个共享的桥接网络中，以便它们可以相互通信。
    
2.  主机模式（Host）：在主机模式下，Docker 容器与主机共享同一个网络命名空间，它们使用主机的 IP 地址和端口，因此可以直接访问主机上的服务。
    
3.  容器模式（Container）：在容器模式下，Docker 容器与另一个指定的容器共享同一个网络命名空间，它们可以直接使用彼此的 IP 地址和端口进行通信。
    
4.  无网络模式（None）：在无网络模式下，Docker 容器没有网络连接，只能通过 UNIX 套接字进行通信，这种模式通常用于与主机共享文件系统或运行一些系统级任务。
    

除了上述常用的网络模式外，Docker 还支持一些高级网络模式，例如 Overlay 网络模式，它允许在多个 Docker 主机之间创建跨主机的虚拟网络。

## 两个docker通过网桥通信
要使两个 Docker 容器通过网桥进行通信，可以按照以下步骤进行操作：

1.  创建一个 Docker 网桥：`docker network create <network_name>`
    
2.  启动第一个容器并将其连接到该网络：`docker run --name <container1_name> --network <network_name> <image_name>`
    
3.  启动第二个容器并将其连接到该网络：`docker run --name <container2_name> --network <network_name> <image_name>`
    
4.  现在两个容器都已连接到同一个网络中，它们可以通过相互访问彼此的 IP 地址来进行通信。
    

例如，假设您创建了名为 `mybridge` 的 Docker 网桥，然后您可以通过以下方式启动两个容器并将它们连接到该网络：

```
docker network create mybridge  docker run --name container1 --network mybridge -d nginx  docker run --name container2 --network mybridge -d nginx
```

现在，容器1和容器2都可以使用其 IP 地址相互访问，例如：

```
docker exec container1 curl http://<container2_ip_address> docker exec container2 curl http://<container1_ip_address>
```

其中 `<container1_ip_address>` 和 `<container2_ip_address>` 是容器1和容器2的 IP 地址。

## Docker网络的自定义模式

> Docker 还支持自定义网络模式，它允许用户创建自己的网络模式，以满足特定的需求。用户可以使用 Docker CLI 或 Docker Compose 来创建自定义网络。 自定义网络模式提供了以下优点： 1. 用户可以指定自己的网络命名空间和 IP 地址范围，以便更好地控制容器之间的通信。 2. 用户可以指定容器的 DNS 名称，以便容器之间可以使用名称而不是 IP 地址进行通信。 3. 用户可以指定容器的连接选项，例如容器之间的安全连接。 自定义网络模式还可以用于解决一些特殊的网络需求，例如多租户网络、多层应用程序网络等。

## Docker的高级网络模式

> 除了 Overlay 网络模式之外，Docker 还支持以下高级网络模式： 1. MACVLAN 模式：在 MACVLAN 模式下，Docker 容器使用主机的物理网络接口卡 (NIC) 的 MAC 地址和 IP 地址，从而使容器可以直接访问主机网络上的服务。这种模式通常用于需要容器直接与主机网络通信的场景，例如网络嗅探、虚拟路由器等。 2. IPVLAN 模式：在 IPVLAN 模式下，Docker 容器使用主机的 IP 地址，但拥有自己的 MAC 地址，从而使容器可以与其他容器和主机进行通信。这种模式通常用于需要高性能网络和容器之间的隔离的场景，例如高速数据传输、网络虚拟化等。 3. 传统模式（Legacy）：传统模式是 Docker 最早支持的网络模式，它使用 Docker Daemon 的网络栈来为容器分配 IP 地址和端口，但它已经被桥接模式所取代，不再被推荐使用。 这些高级网络模式通常用于特殊的网络需求，例如高性能网络、网络虚拟化、网络安全等。