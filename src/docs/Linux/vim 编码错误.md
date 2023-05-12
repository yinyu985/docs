# vim 编码错误


vim里面的编码主要跟三个参数有关：enc(encoding), fenc(fileencoding)和fencs(fileencodings)
其中fenc是当前文件的编码，也就是说，一个在vim里面已经正确显示了的文件(前提是你的系统环境跟你的enc设置匹配)，你可以通过改变 fenc后再w来将此文件存成不同的编码。比如说，我:set fenc=utf-8然后:w就把文件存成utf-8的了，:set fenc=gb18030再:w就把文件存成gb18030的了。这个值对于打开文件的时候是否能够正确地解码没有任何关系。
fencs就是用来在打开文件的时候进行解码的猜测列表。文件编码没有百分百正确的判断方法，所以vim只能猜测文件编码。比如我的vimrc里面这个的设置是
set fileencodings=utf-8,gb18030,utf-16,big5
所以我的vim每打开一个文件，先尝试用utf-8进行解码，如果用utf-8解码到了一半出错(所谓出错的意思是某个地方无法用utf-8正确地解码)，那么就从头来用gb18030重新尝试解码，如果gb18030又出错(注意gb18030并不是像utf-8似的规则编码，所以所谓的出错只是说某个编码没有对应的有意义的字，比如0)，就尝试用utf-16，仍然出错就尝试用big5。这一趟下来，如果中间的某次解码从头到尾都没有出错，那么 vim就认为这个文件是这个编码的，不会再进行后面的尝试了。这个时候，fenc的值就会被设为vim最后采用的编码值，可以用:set fenc?来查看具体是什么。
至于enc，其作用基本只是显示。不管最后的文件是什么编码的，vim都会将其转换为当前系统编码来进行处理，这样才能在当前系统里面正确地显示出来，因此enc就是干这个的。在windows下面，enc默认是cp936，这也就是中文windows的默认编码，所以enc是不需要改的。在 linux下，随着你的系统locale可能设为zh_CN.gb18030或者zh_CN.utf-8，你的enc要对应的设为gb18030或者 utf-8(或者gbk之类的)。

## 自己来总结一下吧：

------

如果系统的locale是zh_CN的，那么想让vim能显示正确的编码，在 .vimrc 中设置：
set enc=gbk
set fencs=utf-8,gbk
这样，vim会先探测utf-8的编码，失败了会作为gbk的编码进行解码。显示当然是gbk了，这个和locale相关。

------

查看当前文件的编码：
:set fenc

------

vim中转换编码：
:set fenc=utf8
然后保存即可。

------

如果已经打开了解码错的文件，想重新设置编码格式：
:edit ++enc=utf8

------

shell转换编码：
将一个GBK 编码的文件转换成UTF-8编码
iconv -f gbk -t utf8 file1 -o file2
批量转换文件的编码 ：
find . -name '*.txt' -exec iconv -f gbk -t utf8 {} -o tmp.txt \; -exec mv tmp.txt {} \;
注：打开UTF-8编码的文件时，除了vim里的设置，还需要正确SecureCRT
