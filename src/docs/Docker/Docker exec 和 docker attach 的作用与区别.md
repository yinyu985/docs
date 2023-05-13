# Docker exec 和 docker attach 的作用与区别

docker attach
可以 attach 到一个已经运行的容器的 stdin，然后进行命令执行的动作。但是需要注意的是，如果在这里输入 exit，会导致容器的停止。

docker  exec
可以看到，其中参数 -i-t -d 与 docker run 有些相同。其实，exec会进入创建一个伪终端，与直接 run 创建出来的相似。但是不同点在于，不会因为输入 exit 而终止容器。
这种方式类似于ssh 进入容器内进行操作
通常用法：docker exec -it 容器ID /bin/bash
