# alertmanager 告警抑制规则测试总结
测试环境：Prometheus，alertmanager，一台装了docker的电脑

```bash
原本已经通过docker运行了node_exporter
docker run --name nginx81 -d -p 81:80 --restart=always  nginx
docker run --name nginx82 -d -p 82:80 --restart=always  nginx
docker run --name nginx83 -d -p 83:80 --restart=always  nginx
docker run --name nginx84 -d -p 84:80 --restart=always  nginx
docker run --name nginx85 -d -p 85:80 --restart=always  nginx
```

将以上六个对象添加到Prometheus

```yaml
global:
  scrape_interval: 3s
  evaluation_interval: 3s
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['10.26.5.36:9093']
rule_files:
  - /data/prometheus-2.31.1.linux-amd64/rules.yml
scrape_configs:
  - job_name: "node_exporter"
    static_configs:
       - targets: ['10.31.166.173:9100']
         labels:
           building: '中海'
           city: '北京'
           devicetype: 'linux'
           floor: '16F'
           instance: '10.31.166.173:9100'
           instancehost: '10.31.166.173'
           job: 'node_exporter'
           monitortype: 'node_exporter'
           service: 'test_test'
  - job_name: 'tcp'
    metrics_path: /probe
    params:
      module: [tcp_connect]
    static_configs:
       - targets: ['10.31.166.173:81']
         labels:
           building: '中海'
           city: '北京'
           devicetype: 'linux'
           floor: '16F'
           instance: '10.31.166.173:81'
           port: '81'
           instancehost: '10.31.166.173'
           job: 'tcp'
           monitortype: 'tcp'
           service: 'test_test'
1-5照着写1-5照着写1-5照着写1-5照着写1-5照着写1-5照着写1-5照着写
       - targets: ['10.31.166.173:85']
         labels:
           building: '中海'
           city: '北京'
           devicetype: 'linux'
           floor: '16F'
           instance: '10.31.166.173:85'
           port: '85'
           instancehost: '10.31.166.173'
           job: 'tcp'
           monitortype: 'tcp'
           service: 'test_test'
    relabel_configs:
       - source_labels: [__address__]
         target_label: __param_target
       - source_labels: [__param_target]
         target_label: instance
       - target_label: __address__
         replacement: 10.26.5.36:9115
  - job_name: 'icmp'
    metrics_path: /probe
    params:
      module: [icmp]
    static_configs:
       - targets: ['10.31.166.173']
         labels:
           building: '中海'
           city: '北京'
           devicetype: 'linux'
           floor: '16F'
           instance: '10.31.166.173'
           instancehost: '10.31.166.173'
           job: 'icmp'
           monitortype: 'icmp'
           service: 'test_test'
    relabel_configs:
       - source_labels: [__address__]
         target_label: __param_target
       - source_labels: [__param_target]
         target_label: instance
       - target_label: __address__
         replacement: 10.26.5.36:9115
```

rule.yml如下

```yaml
groups:
- name: Linux告警规则
  rules:
#  - alert: Host_ping不通了
#    expr: probe_success{monitortype="icmp",instancehost="10.31.166.173"}==0
#    for: 5s
#    labels:
#      severity: Disaster
#    annotations:
#      summary: ping不通了
#      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
#这个不太好触发，注释掉
  - alert: Host_exporter没了
    expr: up{instancehost="10.31.166.173"}==0  ##假设这个规则是断网时的规则，来进行模拟停电时，屏蔽因为停电造成的掉铺天盖地的告警。
    for: 5s
    labels:
      severity: Warning 
    annotations:
      summary: exporter没了
      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
  - alert: Host_nginx1没了
    expr: probe_success{monitortype="tcp",instancehost="10.31.166.173",port="81"}==0
    for: 5s
    labels:
      severity: Average
    annotations:
      summary: nginx1没了
      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
  - alert: Host_nginx2没了
    expr: probe_success{monitortype="tcp",instancehost="10.31.166.173",port="82"}==0
    for: 5s
    labels:
      severity: Average  
    annotations:
      summary: nginx2没了
      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
  - alert: Host_nginx3没了
    expr: probe_success{monitortype="tcp",instancehost="10.31.166.173",port="83"}==0
    for: 5s
    labels:
      severity: Critical
    annotations:
      summary: nginx3没了
      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
  - alert: Host_nginx4没了
    expr: probe_success{monitortype="tcp",instancehost="10.31.166.173",port="84"}==0
    for: 5s
    labels:
      severity: Warning
    annotations:
      summary: nginx4没了
      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
  - alert: Host_5nginx5没了
    expr: probe_success{monitortype="tcp",instancehost="10.31.166.173",port="85"}==0
    for: 5s
    labels:
      severity: Disaster
    annotations:
      summary: 5nginx5没了
      description:  "Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} " 
```

alertmanager.yml规则如下

```yaml
global:
route:
  receiver: "Warnings"
  group_by: ['instancehost']
  routes:
    - receiver: "Average"
      repeat_interval: 10s
      match:
        severity: Average  
    - receiver: "Warning"
      repeat_interval: 10s
      match:
        severity: Warning
    - receiver: "Disaster"
      repeat_interval: 10s
      match:
        severity: Disaster
################################################################################################################
    - receiver: "Critical"
      repeat_interval: 10s
      match:
        severity: Critical
    - receiver: "Warnings"
      repeat_interval: 10s
      match:
        severity: Warnings
################################################################################################################
#试验过程
#################################################
#inhibit_rules: 
#  - source_match:
#      severity: Warning
#    target_match_re:
#      alertname: "Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了"
#    equal: ['instancehost']
#  - source_match:
#      severity: Disaster
#    target_match_re:
#      alertname: "Host_nginx1没了"
#    equal: ['instancehost'] 
#这种方式是，Warning抑制了"Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了"这几个告警，并且Disater抑制了"Host_nginx1没了"这个告警，经过实验，确实只发送了Warning的告警，12345都被抑制了，符合预期。
#################################################
#inhibit_rules:   
#   - source_matchers:
#       - alertname = "Host_exporter没了"
#     target_match_re:
#       alertname: "Host_nginx.*"
#     equal: ['instancehost'] 
#这种方式是"Host_exporter没了"抑制了，所有以Host_nginx开头的告警。经过测试这样写，也只发送"Host_exporter没了"这个告警，符合预期。
#################################################
inhibit_rules:   
   - source_matchers:
       - alertname = "Host_exporter没了"
     target_matchers:
       - alertname =~ "Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了"
     equal: ['instancehost'] 
#这种情况是"Host_exporter没了"屏蔽了"Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了"这几个告警，此时发出来的有，"Host_exporter没了"和"Host_nginx1没了"这两个告警，符合预期。
################################################################################################################
receivers:
  - name: "Warning"
    webhook_configs:
      - url: "http://10.26.5.36:9000/warning_alertinfo"
  - name: "Critical"
    webhook_configs:
      - url: "http://10.26.5.36:9000/critical_alertinfo"
  - name: "Average"
    webhook_configs:f
      - url: "http://10.26.5.36:9000/average_alertinfo"
  - name: "Disaster"
    webhook_configs:
      - url: "http://10.26.5.36:9000/disaster_alertinfo"
  - name: "Warnings"
    webhook_configs:
      - url: "http://10.26.5.36:9000/warning_alertinfo"

```

至此已经完整掌握inhibit_rules的写法

第三列均为示例，可以根据告警等级，告警名称，进行匹配。

| 写死单个 | source_match    | target_match    | severity: Warning             |
| :------: | --------------- | --------------- | ----------------------------- |
| 写死多个 | source_matchers | target_matchers | - alertname = "Host_exporter" |
| 正则匹配 | source_match_re | target_match_re | alertname: "Host_nginx.*"     |

以上，前两列的六种匹配模式可以混用，互相搭配，但是第三列必须对应，也就是各种匹配模式的必须写对应的匹配表达式，不然报错。
