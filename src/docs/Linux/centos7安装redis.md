# centos7安装redis
## 方法一：通过yum安装

```bash
yum -y install redis
systemctl start redis
vi /etc/redis.conf
```

为了可以使Redis能被远程连接，需要修改配置文件，路径为/etc/redis.conf

首先，注释这一行：

```text
#bind 127.0.0.1
```

修改为

```text
0.0.0.0
```

守护进程模式运行（后台运行）

```
daemonize yes
```

另外，推荐给Redis设置密码，取消注释这一行：

```text
#requirepass foobared
```

foobared即当前密码，可以自行修改为

```text
requirepass 密码
```

```bash
systemctl restart redis
```

```bash
systemctl start redis.service #启动redis服务器
systemctl stop redis.service #停止redis服务器
systemctl restart redis.service #重新启动redis服务器
systemctl status redis.service #获取redis服务器的运行状态
systemctl enable redis.service #开机启动redis服务器
systemctl disable redis.service #开机禁用redis服务器
```

## 方法二：通过源代码安装

```bash
wget https://download.redis.io/releases/redis-5.0.5.tar.gz
tar -xf redis-5.0.5.tar.gz -C ..
```

```bash
cd /data/redis-5.0.5/
```

通过make来编译，make是自动编译，会根据Makefile中描述的内容来进行编译。

```bash
make
make install
```

实际上，就是将这个几个文件复制或链接到/usr/local/bin目录了。这样就可以直接执行这几个命令了。

如果不想安装到默认路径/user/local/bin，可以通过`PREFIX`选项指定其他路径

```bash
[root@prometheus-influxdb src]# ll /usr/local/bin/
总用量 32736
-rwxr-xr-x 1 root root 4366640 7月   4 03:24 redis-benchmark
-rwxr-xr-x 1 root root 8111896 7月   4 03:24 redis-check-aof
-rwxr-xr-x 1 root root 8111896 7月   4 03:24 redis-check-rdb
-rwxr-xr-x 1 root root 4806864 7月   4 03:24 redis-cli
lrwxrwxrwx 1 root root      12 7月   4 03:24 redis-sentinel -> redis-server
-rwxr-xr-x 1 root root 8111896 7月   4 03:24 redis-server
```

启动服务器，来看看安装是否成功。

Redis目录中会有一个配置文件`redis.conf`，我们可以基于这个文件进行修改，启动时只需指定该配置文件即可

跟方法一相同步骤设置redis的配置文件，最后，将启动命令写进开机启动项

```bash
cat >>/etc/rc.local<<EOF
redis-server /data/redis-5.0.5/redis.conf
EOF
```

