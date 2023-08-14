# 逆向一个docker镜像

## docker history --no-trunc 和 dive 逆向推出的

>`docker history --no-trunc`是一个Docker命令，它可以显示给定镜像的完整构建历史记录。通常情况下，当您运行`docker history`命令时，它会截断输出，只显示前12个字符的每个图像ID。使用`--no-trunc`选项可以强制输出完整的ID。
>
>而dive是一个开源工具，可以让您深入探索Docker镜像层，并查看每个层中添加、删除或更改了哪些文件和目录。它可以帮助您理解Docker镜像的构建方式，并找到可以缩小镜像大小的优化机会。
>
>尽管两个命令都与Docker镜像有关，但它们的使用场景不同。`docker history --no-trunc`用于查看构建镜像的历史记录，而dive则用于逆向分析镜像以寻找优化机会和问题排除。

## 通过Shell命令直接取出dockerfile


```bash
docker history --format {{.CreatedBy}} --no-trunc=true 89300b5e57f4 |sed "s/\/bin\/sh\ -c\ \#(nop)\ //g"|sed "s/\/bin\/sh\ -c/RUN/g" | tac
```

>这个命令的含义如下：
>
>这条命令是用于查看给定Docker镜像的构建历史记录，并提取出每个构建步骤的命令。具体来说，它执行以下操作：
>
>1. 使用`docker history`命令获取镜像的完整构建历史记录，并在命令行上以逆序(tac)显示。
>   - `--format {{.CreatedBy}}`选项指示`docker history`命令仅输出每个构建步骤的`CreatedBy`字段，该字段包含了使用该层构建的完整命令。
>   - `--no-trunc=true`选项则强制输出完整的ID。
>   - `89300b5e57f4`是要查看的Docker镜像的ID。
>2. 接下来，通过管道将输出传递给两个`sed`命令。
>   - 第一个`sed`命令将所有`#(nop)`标记的步骤去除，因为这些步骤没有做任何有意义的工作，只是在Dockerfile中添加一行注释而已。
>   - 第二个`sed`命令将所有以`/bin/sh -c`开头的命令更改为`RUN`，以使输出符合Dockerfile语法。
>3. 最后，输出被逆序(tac)显示出来，以便按照正确的构建顺序查看构建步骤的命令。
>
>总之，这个命令可以帮助您了解Docker镜像的构建方式，并允许您查看每个构建步骤的完整命令。

```bash
docker history --no-trunc <image_name> | awk -F " /bin/sh -c #" '{print $2}' | tail -n +2 | tac | awk 'BEGIN { FS="\n"; RS="" } {print $0"\n"}' | sed 's/ /\n/g'
```

