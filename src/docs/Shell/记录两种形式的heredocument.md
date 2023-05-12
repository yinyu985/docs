# 记录两种形式的heredocument
```bash
root@ip-172-31-13-117:~# cat >> /etc/rancher/k3s/registries.yaml <<EOF

mirrors:
  "harbor.kingsd.top":
    endpoint:
      - "https://harbor.kingsd.top"
configs:
  "harbor.kingsd.top":
    auth:
      username: admin # this is the registry username
      password: Harbor12345 # this is the registry password
EOF
systemctl restart k3s
```


```bash
root@ip-172-31-13-117:~# cat <<EOF>> /etc/rancher/k3s/registries.yaml 
mirrors:
  "harbor.kingsd.top":
    endpoint:
      - "https://harbor.kingsd.top"
configs:
  "harbor.kingsd.top":
    auth:
      username: admin # this is the registry username
      password: Harbor12345 # this is the registry password
EOF
systemctl restart k3s
```
功能效果都是一样的

## heredocument进阶

如果你要输入的内容中含有全局变量，或者输入的是一个脚本，如果按照上面的方式，会导致，变量被填充，或者脚本中的命令比如`date`被执行了。这样你的脚本就不能用了，因为写进脚本的不是date命令而是指定date的结果，要想不让它这么干，可以使用引号包围第一个EOF。

```
cat >> ~/delete_index.sh <<"EOF"
#!/bin/bash
old_date=`date -d "120 day ago" +"%Y-%m-%d"`
curl -XDELETE  --user elastic:**********  http://10.26.*.*:9200/jumpserver23-${old_date}
curl -XDELETE  --user elastic:**********  http://10.26.*.*:9200/jumpserver23_it-${old_date}
EOF
```

