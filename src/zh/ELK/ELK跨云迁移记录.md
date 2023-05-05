# ELK跨云迁移记录
## 前情提要

有一共有两套Es需要迁移到新的阿里云Es服务集群中，继上一篇ElasticSearch迁移方案对比之后，考虑到数据量，毫不犹豫的选择的Snapshot的方式，本来应该可以使用MinIO这种自建的OSS，但是受限于网络连通性，只能用阿里云提供的OSS服务，其实后来一想，是可以在阿里云的VPC的机器上自己装个MinIO的，好处是省钱，坏处是，要多维护一个组件，多一个风险。想来想去没必要为公司省钱吧。开搞！

## 前置条件

两个Es都能连接到OSS、OSS的插件（因为你想把快照存储到阿里云，就需要安装阿里云的OSS插件）、很久很久的时间。

## 安装插件

[通过OSS将自建Elasticsearch数据迁移至阿里云](https://help.aliyun.com/document_detail/170022.html?spm=a2c4g.137323.0.0.4ef21a2ecL8PaX)

这是阿里云提供的参考文档，我们要按照文中提到的插件，非常操蛋的是，他不是每个小版本都有release，你只能找一个相近的然后去手动改version信息。
因为我们的Es是7.9,我下载7.7解压重启查询能看到，结果创建快照就不好使，重启Es分片都重新分布，一看控制台，第一次重启，我还吓一跳，集群状态红色的，其实就是主分片没有成功分布，不用担心，让子弹飞一会儿。过一会儿就好了，7.7不好使，只能换7.10了，又是下载解压重启，又红一遍。插件算是搞好了，开始下一步操作。

## 创建仓库

```
PUT _snapshot/network_logs
{
  "type": "oss",
    "settings": {
        "endpoint": "http://oss-cn-shanghai.aliyuncs.com",
        "access_key_id": "************************",
        "secret_access_key": "************************",
        "bucket": "XXXXXXXXXXXXXX",
        "compress" : "true",
        "chunk_size": "1gb",
        "base_path": "network_logs/"
    }
}
```

在Kibana开发工具执行这个，解释一下

- 指定快照仓库的类型为OSS,不装插件的话，是不支持这个类型的。
- 快照仓库设置OSS的地址，id，key，桶名。
- 设置是否压缩，那必然压缩啊。
- 设置chunk_size，就是一次发多大的包。
- 设置这个快照仓库在OSS中的路径
- 还有一些我没设置的参数
- max_restore_bytes_per_sec,看了下上篇文里写了，纠错，默认改成了40M/s。

## 创建快照

```
PUT /_snapshot/network_logs/netops_fw_device-2023-03-3xing?wait_for_completion=false
{
  "indices": "netops_fw_device-2023-03-3*",
  "include_global_state": true,
  "ignore_unavailable": false
}
```

有两个重要的设置，是否包括全局状态，和是否忽略不可用的，network_logs是刚才注册的仓库名，`netops_fw_device-2023-03-3xing`是为了让快照名能够看出里面有哪些索引，但是快照名不让写特殊符号就写了xing，后面的`?wait_for_completion=false`指是否等待完成，我选否，让他自己后台。

## 恢复快照

```
POST /_snapshot/network_logs/netops_fw_device-2023-03-3xing/_restore?wait_for_completion=false
{
  "indices": "netops_fw_device-2023-03-3*",
}
```

下面三行用于指定某个快照里的某种索引，还支持对索引的改名，不过我们其实都用不到，甚至可以不写索引名，默认会回复快照中的全部索引

```
POST /_snapshot/network_logs/netops_fw_device-2023-03-3xing/_restore?wait_for_completion=false
```

## 坑坑坑坑

看起来很美好的操作，但是实际上你要考虑的东西很多，就算使用通配符也有十几种索引的类型，并且有的使用统配之后，一个快照大小达到一两个TB,只能再进一步写让每个快照的大小适中，如果你不小心创建错了快照，想删除，也不像在文件上右键删除这么简单，能删到timeout，哎，简直苦逼，要是网络直连，直接配置个跨集群同步岂不是省不少事？可惜，话语权都没有，只配搬砖。


