# debian9安装zabbix-agent2
## 检查apt源

```
cat /etc/apt/sources.list
deb http://mirrors.163.com/debian/ stretch main non-free contrib
deb http://mirrors.163.com/debian/ stretch-updates main non-free contrib
deb http://mirrors.163.com/debian/ stretch-backports main non-free contrib
deb-src http://mirrors.163.com/debian/ stretch main non-free contrib
deb-src http://mirrors.163.com/debian/ stretch-updates main non-free contrib
deb-src http://mirrors.163.com/debian/ stretch-backports main non-free contrib
deb http://mirrors.163.com/debian-security/ stretch/updates main non-free contrib
deb-src http://mirrors.163.com/debian-security/ stretch/updates main non-free contrib
```

## 从阿里镜像站下载对应zabbix-agent2版本的deb包

 wget https://mirrors.aliyun.com/zabbix/zabbix/6.0/debian/pool/main/z/zabbix/zabbix-agent2_6.0.1-1+debian9_amd64.deb?spm=a2c6h.25603864.0.0.1a5f77b3J4Hoan

## dpkg安装zabbix-agent2

```
dpkg -i zabbix-agent2_6.0.1-1+debian9_amd64.deb?spm=a2c6h.25603864.0.0.1a5f77b3J4Hoan
Selecting previously unselected package zabbix-agent2.
(Reading database ... 33665 files and directories currently installed.)
Preparing to unpack zabbix-agent2_6.0.1-1+debian9_amd64.deb?spm=a2c6h.25603864.0.0.1a5f77b3J4Hoan ...
Unpacking zabbix-agent2 (1:6.0.1-1+debian9) ...
dpkg: dependency problems prevent configuration of zabbix-agent2:
 zabbix-agent2 depends on libpcre2-8-0; however:
 Package libpcre2-8-0 is not installed.

dpkg: error processing package zabbix-agent2 (--install):
 dependency problems - leaving unconfigured
Processing triggers for systemd (232-25+deb9u14) ...
Processing triggers for man-db (2.7.6.1-2) ...
Errors were encountered while processing:
 zabbix-agent2
```

## 报错 Package libpcre2-8-0 is not installed，安装。

```
root@debian:~# apt install libpcre2-8-0
```

## 再次尝试安装，检查状态

```
root@debian:~# dpkg -i zabbix-agent2_6.0.1-1+debian9_amd64.deb?spm=a2c6h.25603864.0.0.1a5f77b3J4Hoan
(Reading database ... 33698 files and directories currently installed.)
Preparing to unpack zabbix-agent2_6.0.1-1+debian9_amd64.deb?spm=a2c6h.25603864.0.0.1a5f77b3J4Hoan ...
Unpacking zabbix-agent2 (1:6.0.1-1+debian9) over (1:6.0.1-1+debian9) ...
Setting up zabbix-agent2 (1:6.0.1-1+debian9) ...
Processing triggers for systemd (232-25+deb9u14) ...
Processing triggers for man-db (2.7.6.1-2) ...
root@debian:~# systemctl status zabbix-agent2
● zabbix-agent2.service - Zabbix Agent 2
  Loaded: loaded (/lib/systemd/system/zabbix-agent2.service; disabled; vendor preset: enabled)
  Active: active (running) since Tue 2022-09-20 11:18:21 CST; 14s ago
 Main PID: 1581 (zabbix_agent2)
  CGroup: /system.slice/zabbix-agent2.service
      └─1581 /usr/sbin/zabbix_agent2 -c /etc/zabbix/zabbix_agent2.conf

Sep 20 11:18:21 debian systemd[1]: Started Zabbix Agent 2.
Sep 20 11:18:21 debian zabbix_agent2[1581]: Starting Zabbix Agent 2 (6.0.1)
Sep 20 11:18:21 debian zabbix_agent2[1581]: Zabbix Agent2 hostname: [Zabbix server]
Sep 20 11:18:21 debian zabbix_agent2[1581]: Press Ctrl+C to exit.
```

## 再次检查状态

```
root@debian:~# apt list --installed |grep zabbix
WARNING: apt does not have a stable CLI interface. Use with caution in scripts.
zabbix-agent2/now 1:6.0.1-1+debian9 amd64 [installed,local]
```

