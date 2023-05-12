# 给centos添加swap空间
首先查看当前的[内存](https://so.csdn.net/so/search?q=内存&spm=1001.2101.3001.7020)和swap 空间大小(默认单位为k, -m 单位为M)：

```bash
free -m
```

查看swap信息，包括文件和分区的详细信息

```bash
swapon -s
```

或者

```bash
cat /proc/swaps
```

如果都没有，我们就需要手动添加交换分区。

1、使用dd命令创建一个swap交换文件

```bash
dd if=/dev/zero of=/data/swap bs=1024 count=1024000
```

这样就建立一个/home/swap的分区文件，大小为1G。

2、制作为swap格式文件：

```bash
mkswap /data/swap
```

3、再用swapon命令把这个文件分区挂载swap分区

```bash
/sbin/swapon /data/swap
```

我们用free -m命令看一下，发现已经有交换分区了。
但是重启系统后，swap分区又变成0了。

4、为防止重启后swap分区变成0，要修改/etc/fstab文件

```
vi /etc/fstab
```

在文件末尾（最后一行）加上

```
/data/swap swap swap default 0 0
```

这样就算重启系统，swap分区还是有值。