# Shell 的奇淫技巧

## **获取字符串长度的语法如下。**

```bash
${#varname}
```

下面是一个例子。

```
$ myPath=/home/cam/book/long.file.name
$ echo ${#myPath}
29
```

大括号`{}`是必需的，否则 Bash 会将`$#`理解成脚本的参数个数，将变量名理解成文本。

```
$ echo $#myvar
0myvar
```

上面例子中，Bash 将`$#`和`myvar`分开解释了。

------

## **字符串提取子串的语法如下。**

```
${varname:offset:length}
```

上面语法的含义是返回变量`$varname`的子字符串，从位置`offset`开始（从`0`开始计算），长度为`length`。

```bash
$ count=frogfootman
$ echo ${count:4:4}
foot
```

上面例子返回字符串`frogfootman`从4号位置开始的长度为4的子字符串`foot`。

这种语法不能直接操作字符串，只能通过变量来读取字符串，并且不会改变原始字符串。

```bash
# 报错
$ echo ${"hello":2:3}
```

上面例子中，`"hello"`不是变量名，导致 Bash 报错。

如果省略`length`，则从位置`offset`开始，一直返回到字符串的结尾。

```bash
$ count=frogfootman
$ echo ${count:4}
footman
```

上面例子是返回变量`count`从4号位置一直到结尾的子字符串。

如果`offset`为负值，表示从字符串的末尾开始算起。注意，负数前面必须有一个空格， 以防止与`${variable:-word}`的变量的设置默认值语法混淆。这时还可以指定`length`，`length`可以是正值，也可以是负值（负值不能超过`offset`的长度）。

```bash
$ foo="This string is long."
$ echo ${foo: -5}
long.
$ echo ${foo: -5:2}
lo
$ echo ${foo: -5:-2}
lon
```

上面例子中，`offset`为`-5`，表示从倒数第5个字符开始截取，所以返回`long.`。如果指定长度`length`为`2`，则返回`lo`；如果`length`为`-2`，表示要排除从字符串末尾开始的2个字符，所以返回`lon`。

------

## 字符串搜索和替换的多种方法。

### **（1）字符串头部的模式匹配。**

以下两种语法可以检查字符串开头，是否匹配给定的模式。如果匹配成功，就删除匹配的部分，返回剩下的部分。原始变量不会发生变化。

```bash
# 如果 pattern 匹配变量 variable 的开头，
# 删除最短匹配（非贪婪匹配）的部分，返回剩余部分
${variable#pattern}

# 如果 pattern 匹配变量 variable 的开头，
# 删除最长匹配（贪婪匹配）的部分，返回剩余部分
${variable##pattern}
```

上面两种语法会删除变量字符串开头的匹配部分（将其替换为空），返回剩下的部分。区别是一个是最短匹配（又称非贪婪匹配），另一个是最长匹配（又称贪婪匹配）。

匹配模式`pattern`可以使用`*`、`?`、`[]`等通配符。

```bash
$ myPath=/home/cam/book/long.file.name

$ echo ${myPath#/*/}
cam/book/long.file.name

$ echo ${myPath##/*/}
long.file.name
```

上面例子中，匹配的模式是`/*/`，其中`*`可以匹配任意数量的字符，所以最短匹配是`/home/`，最长匹配是`/home/cam/book/`。

下面写法可以删除文件路径的目录部分，只留下文件名。

```bash
$ path=/home/cam/book/long.file.name

$ echo ${path##*/}
long.file.name
```

上面例子中，模式`*/`匹配目录部分，所以只返回文件名。

下面再看一个例子。

```bash
$ phone="555-456-1414"
$ echo ${phone#*-}
456-1414
$ echo ${phone##*-}
1414
```

如果匹配不成功，则返回原始字符串。

```bash
$ phone="555-456-1414"
$ echo ${phone#444}
555-456-1414
```

上面例子中，原始字符串里面无法匹配模式`444`，所以原样返回。

如果要将头部匹配的部分，替换成其他内容，采用下面的写法。

```bash
# 模式必须出现在字符串的开头
${variable/#pattern/string}

# 示例
$ foo=JPG.JPG
$ echo ${foo/#JPG/jpg}
jpg.JPG
```

上面例子中，被替换的`JPG`必须出现在字符串头部，所以返回`jpg.JPG`。

### **（2）字符串尾部的模式匹配。**

以下两种语法可以检查字符串结尾，是否匹配给定的模式。如果匹配成功，就删除匹配的部分，返回剩下的部分。原始变量不会发生变化。

```bash
# 如果 pattern 匹配变量 variable 的结尾，
# 删除最短匹配（非贪婪匹配）的部分，返回剩余部分
${variable%pattern}

# 如果 pattern 匹配变量 variable 的结尾，
# 删除最长匹配（贪婪匹配）的部分，返回剩余部分
${variable%%pattern}
```

上面两种语法会删除变量字符串结尾的匹配部分（将其替换为空），返回剩下的部分。区别是一个是最短匹配（又称非贪婪匹配），另一个是最长匹配（又称贪婪匹配）。

```bash
$ path=/home/cam/book/long.file.name

$ echo ${path%.*}
/home/cam/book/long.file

$ echo ${path%%.*}
/home/cam/book/long
```

上面例子中，匹配模式是`.*`，其中`*`可以匹配任意数量的字符，所以最短匹配是`.name`，最长匹配是`.file.name`。

下面写法可以删除路径的文件名部分，只留下目录部分。

```bash
$ path=/home/cam/book/long.file.name

$ echo ${path%/*}
/home/cam/book
```

上面例子中，模式`/*`匹配文件名部分，所以只返回目录部分。

下面的写法可以替换文件的后缀名。

```bash
$ file=foo.png
$ echo ${file%.png}.jpg
foo.jpg
```

上面的例子将文件的后缀名，从`.png`改成了`.jpg`。

下面再看一个例子。

```bash
$ phone="555-456-1414"
$ echo ${phone%-*}
555-456
$ echo ${phone%%-*}
555
```

如果匹配不成功，则返回原始字符串。

如果要将尾部匹配的部分，替换成其他内容，采用下面的写法。

```bash
# 模式必须出现在字符串的结尾
${variable/%pattern/string}

# 示例
$ foo=JPG.JPG
$ echo ${foo/%JPG/jpg}
JPG.jpg
```

上面例子中，被替换的`JPG`必须出现在字符串尾部，所以返回`JPG.jpg`。

### **（3）任意位置的模式匹配。**

以下两种语法可以检查字符串内部，是否匹配给定的模式。如果匹配成功，就删除匹配的部分，换成其他的字符串返回。原始变量不会发生变化。

```bash
# 如果 pattern 匹配变量 variable 的一部分，
# 最长匹配（贪婪匹配）的那部分被 string 替换，但仅替换第一个匹配
${variable/pattern/string}

# 如果 pattern 匹配变量 variable 的一部分，
# 最长匹配（贪婪匹配）的那部分被 string 替换，所有匹配都替换
${variable//pattern/string
```



上面两种语法都是最长匹配（贪婪匹配）下的替换，区别是前一个语法仅仅替换第一个匹配，后一个语法替换所有匹配。

```bash
$ path=/home/cam/foo/foo.name

$ echo ${path/foo/bar}
/home/cam/bar/foo.name

$ echo ${path//foo/bar}
/home/cam/bar/bar.name
```

上面例子中，前一个命令只替换了第一个`foo`，后一个命令将两个`foo`都替换了。

下面的例子将分隔符从`:`换成换行符。

```bash
$ echo -e ${PATH//:/'\n'}
/usr/local/bin
/usr/bin
/bin
...
```

上面例子中，`echo`命令的`-e`参数，表示将替换后的字符串的`\n`字符，解释为换行符。

模式部分可以使用通配符。

```bash
$ phone="555-456-1414"
$ echo ${phone/5?4/-}
55-56-1414
```

上面的例子将`5-4`替换成`-`。

如果省略了`string`部分，那么就相当于匹配的部分替换成空字符串，即删除匹配的部分。

```bash
$ path=/home/cam/foo/foo.name

$ echo ${path/.*/}
/home/cam/foo/foo
```

上面例子中，第二个斜杠后面的`string`部分省略了，所以模式`.*`匹配的部分`.name`被删除后返回。

前面提到过，这个语法还有两种扩展形式。

```bash
# 模式必须出现在字符串的开头
${variable/#pattern/string}

# 模式必须出现在字符串的结尾
${variable/%pattern/string}
```

## 改变变量的大小写。

```bash
# 转为大写
${varname^^}

# 转为小写
${varname,,}
```

下面是一个例子。

```bash
$ foo=heLLo
$ echo ${foo^^}
HELLO
$ echo ${foo,,}
hello
```

------

#!/bin/bash
echo hello; echo there
filename=ttt.sh
if [ -e "$filename" ]; then    # 注意: "if"和"then"需要分隔，-e用于判断文件是否存在
    echo "File $filename exists."; cp $filename $filename.bak
else
    echo "File $filename not found."; touch $filename
fi; echo "File test complete."



## 反斜线（\）

一种对单字符的引用机制。\X 将会“转义”字符 X。这等价于"X"，也等价于'X'。\ 通常用来转义双引号（"）和单引号（'），这样双引号和单引号就不会被解释成特殊含义了。

* 符号 说明
* \n 表示新的一行
* \r 表示回车
* \t 表示水平制表符
* \v 表示垂直制表符
* \b 表示后退符
* \a 表示"alert"(蜂鸣或者闪烁)
* \0xx 转换为八进制的 ASCII 码, 等价于 0xx
* \" 表示引号字面的意思

转义符也提供续行功能，也就是编写多行命令的功能。
每一个单独行都包含一个不同的命令，但是每行结尾的转义符都会转义换行符，这样下一行会与上一行一起形成一个命令序列。

先创建了 back 目录，然后复制 test.sh 到 back 目录。

condition=5

if [ $condition -gt 0 ] #gt表示greater than，也就是大于，同样有-lt（小于），-eq（等于）
then :   # 什么都不做，退出分支
else
    echo "$condition"
fi

1. **lt：less than 小于**

2. **le：less than or equal to 小于等于**

3. **eq：equal to 等于**

4. **ne：not equal to 不等于**

5. **ge：greater than or equal to 大于等于**

6. **gt：greater than 大于**

## 给文本添加行号

```
# 用awk实现
awk '{print FNR" "$0}' file.txt
# 用sed实现
sed = test.txt | sed 'N;s/\n/\t/'
# 用sed生成行号，再用paste进行合并
sed -n '=' file.txt >tmp
paste tmp file.txt
```

## 获取某文本两个关键字之间的内容

```
awk '/Simple/,/Unless/' zen_of_python
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
```

其实上述还有些不妥，因为我要的是两个关键字之间的内容，而不是关键字所在的行呢。

另一个思路grep -z参数可以匹配多行。

## 添加用户到sudoer

```bash
function conf_sudoer(){
    local user=$1
    grep -qE "^\s*$user\s+" /etc/sudoers && sed -ri "/^\s*$user/d" /etc/sudoers
    grep -qE '^\s*#\s*includedir\s*/etc/sudoers.d' /etc/sudoers || sed -ri '$a #includedir /etc/sudoers.d' /etc/sudoers 
    grep -qE '^\s*#\s*includedir\s*/etc/sudoers.d' /etc/sudoers || echo '#includedir /etc/sudoers.d' >> /etc/sudoers 
    echo -e "$user"' ALL=(ALL)  NOPASSWD:ALL' > /etc/sudoers.d/80-"${user}"
    chmod o-wx /etc/sudoers.d/80-${user} #取消其他用户写权限
}

conf_sudoer zgz    #当前用户名为 zgz
visudo -cf /etc/sudoers   # 验证配置文件正确否
```

> ​    grep -qE '^\s*#\s*includedir\s*/etc/sudoers.d' /etc/sudoers || sed -ri '$a #includedir /etc/sudoers.d' /etc/sudoers 

装逼犯写法，sed -ri  $是指文件末尾，a是指添加append

> ​    grep -qE '^\s*#\s*includedir\s*/etc/sudoers.d' /etc/sudoers || echo '#includedir /etc/sudoers.d' >> /etc/sudoers 

普通写法，直接追加进去就好了，就在末尾。

## 一行写for循环

```
for i in `ls ~`; do cat $i;done;
```

## Find 通过inode删除文件

```
find . -inum '33786339' -exec rm -f {} \;
```

