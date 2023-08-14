# Dockerfile 中COPY和ADD的选择

创建 Dockerfile 时，你可以使用两个命令将文件/目录复制到其中 -**`ADD`**和**`COPY`**. 尽管它们的功能范围略有不同，但它们基本上执行相同的任务。

那么，为什么我们有两个命令，我们如何知道何时使用一个或另一个？

## Docker ADD命令

Docker ADD与COPY有哪些不同？让我们首先注意到该**`ADD`**命令比**`COPY`**. 自 Docker 平台推出以来，该**`ADD`**指令已成为其命令列表的一部分。

该命令将文件/目录复制到指定容器的文件系统。

**`ADD`**命令的基本语法是：

```
ADD <src> … <dest>
```

它包括要复制的源 ( **`<src>`**)，后跟要存储它的目标 ( **`<dest>`**)。如果源是目录，则**`ADD`**复制其中的所有内容（包括文件系统元数据）。

例如，如果文件在本地可用，并且你想将其添加到图像目录中，请键入：

```
ADD /source/file/path  /destination/path
```

**`ADD`** 还可以从 URL 复制文件。它可以下载外部文件并将其复制到所需的目的地。例如：

```
ADD http://source.file/url  /destination/path
```

另一个功能是它复制压缩文件，自动提取给定目的地的内容。此功能仅适用于本地存储的压缩文件/目录。

输入来源以及你希望命令提取内容的位置，如下所示：

```
ADD source.file.tar.gz /temp
```

请记住，你无法从 URL 下载和提取压缩文件/目录。将外部包复制到本地文件系统时，该命令不会解压缩它们。

**注：**该**ADD**命令仅提取，如果它是在其中完全基于文件（而不是文件名）的内容识别的压缩格式压缩的源。公认的压缩格式包括**identity**、**gzip**、**bzip**和**xz**。

Docker ADD与COPY有哪些不同？由于一些功能问题，Docker 不得不引入一个额外的命令来复制内容—— **`COPY`**.

与其密切相关的**`ADD`**命令不同，它**`COPY`**只有一个指定的功能。它的作用是以现有格式在指定位置复制文件/目录。这意味着它不处理提取压缩文件，而是按原样复制它。

该指令只能用于本地存储的文件。因此，你不能将它与 URL 一起使用以将外部文件复制到你的容器。

要使用该**`COPY`**指令，请遵循基本命令格式：

```
COPY <src> … <dest> 
```

例如：

```
COPY /source/file/path  /destination/path 
```

## Docker ADD与COPY比较差异

为什么需要添加一个新的、类似的命令？

[Docker ADD与COPY有什么区别](https://www.lsbin.com/tag/docker-add与copy有什么区别/)？事实**`ADD`**证明，具有如此多功能的事实在实践中是有问题的，因为它的行为极其不可预测。这种不可靠的性能的结果通常归结为在你想提取时复制和在你想复制时提取。

由于现有的许多用法，Docker 无法完全取代该命令。为了避免向后兼容，最安全的选择是添加**`COPY`**命令——一个不太多样化但更可靠的命令。

## 使用哪个（最佳实践）

考虑到**`COPY`**引入该命令的情况，显然保留 ADD 是必要的。Docker 发布了一份官方文档，概述了编写 Dockerfiles 的最佳实践，其中**明确建议不要使用`ADD`命令**。

Docker 的官方文档指出**`COPY`**应该始终是首选指令，因为它比**`ADD`**更透明，COPY只支持将本地文件基本复制到容器中，而ADD的一些特性(比如只本地的tar提取和远程URL支持)不是很有效。

如果你需要从本地构建上下文复制到容器中，请坚持使用**`COPY`**.

Docker ADD与COPY有哪些不同？Docker 团队还强烈反对使用**`ADD`**从 URL 下载和复制包。相反，在命令中使用**wget**或**curl**更安全、更有效**`RUN`**。通过这样做，你可以避免创建额外的图像层并节省空间。

假设你要从 URL 下载压缩包、提取内容并清理存档。

而不是使用**`ADD`**和运行以下命令：

```
ADD http://source.file/package.file.tar.gz /temp
RUN tar -xjf /temp/package.file.tar.gz \
  && make -C /tmp/package.file \
  && rm /tmp/ package.file.tar.gz
```

你应该使用：

```
RUN curl http://source.file/package.file.tar.gz \
  | tar -xjC /tmp/ package.file.tar.gz \
  && make -C /tmp/ package.file.tar.gz
```

**注意：**你唯一需要使用**ADD**命令的时间是将本地 tar 文件提取到映像中。

## 结论

Docker ADD与COPY有什么区别？总结一下 使用**COPY**。正如 Docker 本身所建议的，除非你需要提取本地 tar 文件，否则请避免使用 ADD 命令。
