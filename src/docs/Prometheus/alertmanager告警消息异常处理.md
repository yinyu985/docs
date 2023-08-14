# alertmanager告警消息异常处理
早上发现告警消息中，有异常，其中原本应该每个两小时重复发送一次的告警消息，如果正常按照repeat_interval应该是每隔两小时，发送一次

查询消息发送日志发现，05.42两条json的某一个参数不同，只有这一个参数不同，导致两条告警消息被判断为不同的告警，从而发出两条。

为了杜绝这种现象的再次出现，在测试环境中的alertmanager的启动参数中添加了--web.external-url=

用于指定发送的的来源，这样每条告警消息中的externalURL，就会与启动参数中设置的一样，不会影响到消息过滤的效果



操作流程，停掉36测试的alertmanager

vim /etc/systemd/system/alertmanager.service

```
[Unit]
Description=Alertmanager
[Service]
Type=simple
ExecStart=/data/alertmanager-0.23.0.linux-amd64/alertmanager --log.level=info --log.format=json \
    --config.file /data/alertmanager-0.23.0.linux-amd64/alertmanager.yml \
    --storage.path /data/alertmanager-0.23.0.linux-amd64/data \
    --web.external-url=http://alertmanager-test.int.XXXXXXXXX.com
[Install]
WantedBy=multi-user.target
```



触发告警，看日志中的externalURL是否与设置的一致





正式环境变更流程，

首先备份 /etc/systemd/system/alertmanager.service

然后将集群中的五台机器做相同的操作加上    --web.external-url=http://alertmanager.int.XXXXXXXXX.com

然后按照正常的启动顺序启动

查看集群是否正常，

查看查询消息发送日志，看externalURL是否与设置的一致。

删除备份



回退操作

删除新加的，还原备份，重载service文件。按顺序启动。

