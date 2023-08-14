# 删除elasticsearch的.security-7索引后的处理步骤
搭建了一套新环境，为了测试kibana配置ldap，并且对es中超大的索引进行导出存档。
在搭建的过程中发现，kiban连接es失败，网上查找资料后发现解决方案，发现只要删除.security-7这个索引就能够清除之前设置的密码，重新设置。
.security-7索引中应该包含了用户登录等一些信息。
利用curl命令执行删除索引的操作时，删除了正式环境的该索引，删除后，一切认证相关的功能全都失效，kibana无法登录，查找资料进行恢复。
编辑`elasticsearch.yml`
```bash
cluster.name: es_cluster
node.name: elasticssearch-master1
node.master: true
path.data: /data/elasticsearch_master/data
path.logs: /data/elasticsearch_master/logs
http.port: 9200
network.host: 0.0.0.0
cluster.initial_master_nodes: ["10.**.5.22"]
discovery.zen.ping.unicast.hosts: ["10.**.5.22", "10.**.5.20", "10.**.5.**"]
discovery.zen.minimum_master_nodes: 2
discovery.zen.ping_timeout: 60s
search.max_buckets: 2000000
http.cors.enabled: true
http.cors.allow-origin: "*"
http.cors.allow-headers: "Authorization,X-Requested-With,Content-Length,Content-Type"
xpack.security.enabled: true   #将这个设置成fasle,将下面xpack相关的都注释掉。
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: /data/elasticsearch_master/config/elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: /data/elasticsearch_master/config/elastic-certificates.p12
```
创建一个超级用户，这个用户不会存进索引所以不受影响，

```bash
bin/elasticsearch-users useradd restore_user -p XXXXXXXXXXXX -r superuser
```
用这个用户对所有security相关的索引全部删除

```bash
 curl -u restore_user -X DELETE "localhost:9200/.security-*"
```
恢复刚才对`elasticsearch.yml`执行的编辑操作
重新设置全部密码，就能够正常打开kibana界面了。
```bash
bin/elasticsearch-setup-passwords interactive
```

