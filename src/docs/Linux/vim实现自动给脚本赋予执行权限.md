# vim实现自动给脚本赋予执行权限

##### 编写shell脚本时，每次都要使用chmod +x 文件名的方式给文件赋予可执行权限，那有没有一种简单的方法，可以自动识别shell脚本并为其添加执行权限，经过网上搜索，发现可以配置vimrc来实现

```
[root@localhost chapter3]# vim ~/.vimrc
au BufWritePost * if getline(1) =~ "^#!" | if getline(1) =~ "/bin/" | silent !chmod +x <afile> | endif | endif
:wq
chmod +x ~/.vimrc
```

##### 只要第一行是以#!开头，且包含/bin/，配置就会自动的赋予可执行权限

