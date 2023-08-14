# 开启和关闭防火墙和Selinux

## 防火墙（firewalld）

临时关闭防火墙
systemctl stop firewalld
永久防火墙开机自关闭
systemctl disable firewalld
临时打开防火墙
systemctl start firewalld
防火墙开机启动
systemctl enable firewalld
查看防火墙状态
systemctl status firewalld



## SELinux
临时关闭SELinux
setenforce 0
临时打开SELinux
setenforce 1
查看SELinux状态
getenforce
开机关闭SELinux
编辑/etc/selinux/config文件，如下图，将SELINUX的值设置为disabled。下次开机SELinux就不会启动了。
