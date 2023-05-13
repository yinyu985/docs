import{_ as i,W as o,X as t,Y as a,Z as s,$ as l,a0 as e,D as c}from"./framework-b4edc447.js";const d={},r=e(`<h1 id="shell-的奇淫技巧" tabindex="-1"><a class="header-anchor" href="#shell-的奇淫技巧" aria-hidden="true">#</a> Shell 的奇淫技巧</h1><h2 id="获取字符串长度的语法如下。" tabindex="-1"><a class="header-anchor" href="#获取字符串长度的语法如下。" aria-hidden="true">#</a> <strong>获取字符串长度的语法如下。</strong></h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token variable">\${<span class="token operator">#</span>varname}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>下面是一个例子。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ myPath=/home/cam/book/long.file.name
$ echo \${#myPath}
29
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大括号<code>{}</code>是必需的，否则 Bash 会将<code>$#</code>理解成脚本的参数个数，将变量名理解成文本。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ echo $#myvar
0myvar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，Bash 将<code>$#</code>和<code>myvar</code>分开解释了。</p><hr><h2 id="字符串提取子串的语法如下。" tabindex="-1"><a class="header-anchor" href="#字符串提取子串的语法如下。" aria-hidden="true">#</a> <strong>字符串提取子串的语法如下。</strong></h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>\${varname:offset:length}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>上面语法的含义是返回变量<code>$varname</code>的子字符串，从位置<code>offset</code>开始（从<code>0</code>开始计算），长度为<code>length</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">count</span><span class="token operator">=</span>frogfootman
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${count<span class="token operator">:</span>4<span class="token operator">:</span>4}</span>
foot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子返回字符串<code>frogfootman</code>从4号位置开始的长度为4的子字符串<code>foot</code>。</p><p>这种语法不能直接操作字符串，只能通过变量来读取字符串，并且不会改变原始字符串。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 报错</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${&quot;hello&quot;<span class="token operator">:</span>2<span class="token operator">:</span>3}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，<code>&quot;hello&quot;</code>不是变量名，导致 Bash 报错。</p><p>如果省略<code>length</code>，则从位置<code>offset</code>开始，一直返回到字符串的结尾。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">count</span><span class="token operator">=</span>frogfootman
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${count<span class="token operator">:</span>4}</span>
footman
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子是返回变量<code>count</code>从4号位置一直到结尾的子字符串。</p><p>如果<code>offset</code>为负值，表示从字符串的末尾开始算起。注意，负数前面必须有一个空格， 以防止与<code>\${variable:-word}</code>的变量的设置默认值语法混淆。这时还可以指定<code>length</code>，<code>length</code>可以是正值，也可以是负值（负值不能超过<code>offset</code>的长度）。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">foo</span><span class="token operator">=</span><span class="token string">&quot;This string is long.&quot;</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">:</span> -5}</span>
long.
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">:</span> -5<span class="token operator">:</span>2}</span>
lo
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">:</span> -5<span class="token operator">:-</span>2}</span>
lon
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，<code>offset</code>为<code>-5</code>，表示从倒数第5个字符开始截取，所以返回<code>long.</code>。如果指定长度<code>length</code>为<code>2</code>，则返回<code>lo</code>；如果<code>length</code>为<code>-2</code>，表示要排除从字符串末尾开始的2个字符，所以返回<code>lon</code>。</p><hr><h2 id="字符串搜索和替换的多种方法。" tabindex="-1"><a class="header-anchor" href="#字符串搜索和替换的多种方法。" aria-hidden="true">#</a> 字符串搜索和替换的多种方法。</h2><h3 id="_1-字符串头部的模式匹配。" tabindex="-1"><a class="header-anchor" href="#_1-字符串头部的模式匹配。" aria-hidden="true">#</a> <strong>（1）字符串头部的模式匹配。</strong></h3><p>以下两种语法可以检查字符串开头，是否匹配给定的模式。如果匹配成功，就删除匹配的部分，返回剩下的部分。原始变量不会发生变化。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 如果 pattern 匹配变量 variable 的开头，</span>
<span class="token comment"># 删除最短匹配（非贪婪匹配）的部分，返回剩余部分</span>
<span class="token variable">\${variable<span class="token operator">#</span>pattern}</span>

<span class="token comment"># 如果 pattern 匹配变量 variable 的开头，</span>
<span class="token comment"># 删除最长匹配（贪婪匹配）的部分，返回剩余部分</span>
<span class="token variable">\${variable<span class="token operator">##</span>pattern}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面两种语法会删除变量字符串开头的匹配部分（将其替换为空），返回剩下的部分。区别是一个是最短匹配（又称非贪婪匹配），另一个是最长匹配（又称贪婪匹配）。</p><p>匹配模式<code>pattern</code>可以使用<code>*</code>、<code>?</code>、<code>[]</code>等通配符。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">myPath</span><span class="token operator">=</span>/home/cam/book/long.file.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${myPath<span class="token operator">#</span><span class="token operator">/</span>*<span class="token operator">/</span>}</span>
cam/book/long.file.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${myPath<span class="token operator">##</span><span class="token operator">/</span>*<span class="token operator">/</span>}</span>
long.file.name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，匹配的模式是<code>/*/</code>，其中<code>*</code>可以匹配任意数量的字符，所以最短匹配是<code>/home/</code>，最长匹配是<code>/home/cam/book/</code>。</p><p>下面写法可以删除文件路径的目录部分，只留下文件名。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">path</span><span class="token operator">=</span>/home/cam/book/long.file.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">##</span>*<span class="token operator">/</span>}</span>
long.file.name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，模式<code>*/</code>匹配目录部分，所以只返回文件名。</p><p>下面再看一个例子。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">phone</span><span class="token operator">=</span><span class="token string">&quot;555-456-1414&quot;</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${phone<span class="token operator">#</span>*-}</span>
<span class="token number">456</span>-1414
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${phone<span class="token operator">##</span>*-}</span>
<span class="token number">1414</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果匹配不成功，则返回原始字符串。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">phone</span><span class="token operator">=</span><span class="token string">&quot;555-456-1414&quot;</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${phone<span class="token operator">#</span>444}</span>
<span class="token number">555</span>-456-1414
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，原始字符串里面无法匹配模式<code>444</code>，所以原样返回。</p><p>如果要将头部匹配的部分，替换成其他内容，采用下面的写法。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 模式必须出现在字符串的开头</span>
<span class="token variable">\${variable<span class="token operator">/</span><span class="token operator">#</span>pattern<span class="token operator">/</span>string}</span>

<span class="token comment"># 示例</span>
$ <span class="token assign-left variable">foo</span><span class="token operator">=</span>JPG.JPG
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">/</span><span class="token operator">#</span>JPG<span class="token operator">/</span>jpg}</span>
jpg.JPG
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，被替换的<code>JPG</code>必须出现在字符串头部，所以返回<code>jpg.JPG</code>。</p><h3 id="_2-字符串尾部的模式匹配。" tabindex="-1"><a class="header-anchor" href="#_2-字符串尾部的模式匹配。" aria-hidden="true">#</a> <strong>（2）字符串尾部的模式匹配。</strong></h3><p>以下两种语法可以检查字符串结尾，是否匹配给定的模式。如果匹配成功，就删除匹配的部分，返回剩下的部分。原始变量不会发生变化。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 如果 pattern 匹配变量 variable 的结尾，</span>
<span class="token comment"># 删除最短匹配（非贪婪匹配）的部分，返回剩余部分</span>
<span class="token variable">\${variable<span class="token operator">%</span>pattern}</span>

<span class="token comment"># 如果 pattern 匹配变量 variable 的结尾，</span>
<span class="token comment"># 删除最长匹配（贪婪匹配）的部分，返回剩余部分</span>
<span class="token variable">\${variable<span class="token operator">%%</span>pattern}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面两种语法会删除变量字符串结尾的匹配部分（将其替换为空），返回剩下的部分。区别是一个是最短匹配（又称非贪婪匹配），另一个是最长匹配（又称贪婪匹配）。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">path</span><span class="token operator">=</span>/home/cam/book/long.file.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">%</span>.*}</span>
/home/cam/book/long.file

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">%%</span>.*}</span>
/home/cam/book/long
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，匹配模式是<code>.*</code>，其中<code>*</code>可以匹配任意数量的字符，所以最短匹配是<code>.name</code>，最长匹配是<code>.file.name</code>。</p><p>下面写法可以删除路径的文件名部分，只留下目录部分。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">path</span><span class="token operator">=</span>/home/cam/book/long.file.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">%</span><span class="token operator">/</span>*}</span>
/home/cam/book
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，模式<code>/*</code>匹配文件名部分，所以只返回目录部分。</p><p>下面的写法可以替换文件的后缀名。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">file</span><span class="token operator">=</span>foo.png
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${file<span class="token operator">%</span>.png}</span>.jpg
foo.jpg
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的例子将文件的后缀名，从<code>.png</code>改成了<code>.jpg</code>。</p><p>下面再看一个例子。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">phone</span><span class="token operator">=</span><span class="token string">&quot;555-456-1414&quot;</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${phone<span class="token operator">%</span>-*}</span>
<span class="token number">555</span>-456
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${phone<span class="token operator">%%</span>-*}</span>
<span class="token number">555</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果匹配不成功，则返回原始字符串。</p><p>如果要将尾部匹配的部分，替换成其他内容，采用下面的写法。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 模式必须出现在字符串的结尾</span>
<span class="token variable">\${variable<span class="token operator">/</span><span class="token operator">%</span>pattern<span class="token operator">/</span>string}</span>

<span class="token comment"># 示例</span>
$ <span class="token assign-left variable">foo</span><span class="token operator">=</span>JPG.JPG
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">/</span><span class="token operator">%</span>JPG<span class="token operator">/</span>jpg}</span>
JPG.jpg
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，被替换的<code>JPG</code>必须出现在字符串尾部，所以返回<code>JPG.jpg</code>。</p><h3 id="_3-任意位置的模式匹配。" tabindex="-1"><a class="header-anchor" href="#_3-任意位置的模式匹配。" aria-hidden="true">#</a> <strong>（3）任意位置的模式匹配。</strong></h3><p>以下两种语法可以检查字符串内部，是否匹配给定的模式。如果匹配成功，就删除匹配的部分，换成其他的字符串返回。原始变量不会发生变化。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 如果 pattern 匹配变量 variable 的一部分，</span>
<span class="token comment"># 最长匹配（贪婪匹配）的那部分被 string 替换，但仅替换第一个匹配</span>
<span class="token variable">\${variable<span class="token operator">/</span>pattern<span class="token operator">/</span>string}</span>

<span class="token comment"># 如果 pattern 匹配变量 variable 的一部分，</span>
<span class="token comment"># 最长匹配（贪婪匹配）的那部分被 string 替换，所有匹配都替换</span>
$<span class="token punctuation">{</span>variable//pattern/string
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面两种语法都是最长匹配（贪婪匹配）下的替换，区别是前一个语法仅仅替换第一个匹配，后一个语法替换所有匹配。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">path</span><span class="token operator">=</span>/home/cam/foo/foo.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">/</span>foo<span class="token operator">/</span>bar}</span>
/home/cam/bar/foo.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">/</span><span class="token operator">/</span>foo<span class="token operator">/</span>bar}</span>
/home/cam/bar/bar.name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，前一个命令只替换了第一个<code>foo</code>，后一个命令将两个<code>foo</code>都替换了。</p><p>下面的例子将分隔符从<code>:</code>换成换行符。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token variable">\${<span class="token environment constant">PATH</span><span class="token operator">/</span><span class="token operator">/</span><span class="token operator">:</span><span class="token operator">/</span>&#39;\\n&#39;}</span>
/usr/local/bin
/usr/bin
/bin
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，<code>echo</code>命令的<code>-e</code>参数，表示将替换后的字符串的<code>\\n</code>字符，解释为换行符。</p><p>模式部分可以使用通配符。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">phone</span><span class="token operator">=</span><span class="token string">&quot;555-456-1414&quot;</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${phone<span class="token operator">/</span>5?4<span class="token operator">/</span>-}</span>
<span class="token number">55</span>-56-1414
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的例子将<code>5-4</code>替换成<code>-</code>。</p><p>如果省略了<code>string</code>部分，那么就相当于匹配的部分替换成空字符串，即删除匹配的部分。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">path</span><span class="token operator">=</span>/home/cam/foo/foo.name

$ <span class="token builtin class-name">echo</span> <span class="token variable">\${path<span class="token operator">/</span>.*<span class="token operator">/</span>}</span>
/home/cam/foo/foo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面例子中，第二个斜杠后面的<code>string</code>部分省略了，所以模式<code>.*</code>匹配的部分<code>.name</code>被删除后返回。</p><p>前面提到过，这个语法还有两种扩展形式。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 模式必须出现在字符串的开头</span>
<span class="token variable">\${variable<span class="token operator">/</span><span class="token operator">#</span>pattern<span class="token operator">/</span>string}</span>

<span class="token comment"># 模式必须出现在字符串的结尾</span>
<span class="token variable">\${variable<span class="token operator">/</span><span class="token operator">%</span>pattern<span class="token operator">/</span>string}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="改变变量的大小写。" tabindex="-1"><a class="header-anchor" href="#改变变量的大小写。" aria-hidden="true">#</a> 改变变量的大小写。</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 转为大写</span>
<span class="token variable">\${varname<span class="token operator">^^</span>}</span>

<span class="token comment"># 转为小写</span>
<span class="token variable">\${varname<span class="token operator">,,</span>}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是一个例子。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token assign-left variable">foo</span><span class="token operator">=</span>heLLo
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">^^</span>}</span>
HELLO
$ <span class="token builtin class-name">echo</span> <span class="token variable">\${foo<span class="token operator">,,</span>}</span>
hello
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>`,83),p={href:"http://filename=ttt.sh",target:"_blank",rel:"noopener noreferrer"},v=e('<h2 id="反斜线" tabindex="-1"><a class="header-anchor" href="#反斜线" aria-hidden="true">#</a> 反斜线（\\）</h2><p>一种对单字符的引用机制。\\X 将会“转义”字符 X。这等价于&quot;X&quot;，也等价于&#39;X&#39;。\\ 通常用来转义双引号（&quot;）和单引号（&#39;），这样双引号和单引号就不会被解释成特殊含义了。</p><ul><li>符号 说明</li><li>\\n 表示新的一行</li><li>\\r 表示回车</li><li>\\t 表示水平制表符</li><li>\\v 表示垂直制表符</li><li>\\b 表示后退符</li><li>\\a 表示&quot;alert&quot;(蜂鸣或者闪烁)</li><li>\\0xx 转换为八进制的 ASCII 码, 等价于 0xx</li><li>&quot; 表示引号字面的意思</li></ul><p>转义符也提供续行功能，也就是编写多行命令的功能。 每一个单独行都包含一个不同的命令，但是每行结尾的转义符都会转义换行符，这样下一行会与上一行一起形成一个命令序列。</p>',4),u={href:"http://test.sh",target:"_blank",rel:"noopener noreferrer"},b=e(`<p>condition=5</p><p>if [ <span class="katex-error" title="ParseError: KaTeX parse error: Expected &#39;EOF&#39;, got &#39;#&#39; at position 19: …dition -gt 0 ] #̲gt表示greater tha…" style="color:#cc0000;">condition -gt 0 ] #gt表示greater than，也就是大于，同样有-lt（小于），-eq（等于） then : # 什么都不做，退出分支 else echo &quot;</span>condition&quot; fi</p><ol><li><p><strong>lt：less than 小于</strong></p></li><li><p><strong>le：less than or equal to 小于等于</strong></p></li><li><p><strong>eq：equal to 等于</strong></p></li><li><p><strong>ne：not equal to 不等于</strong></p></li><li><p><strong>ge：greater than or equal to 大于等于</strong></p></li><li><p><strong>gt：greater than 大于</strong></p></li></ol><h2 id="给文本添加行号" tabindex="-1"><a class="header-anchor" href="#给文本添加行号" aria-hidden="true">#</a> 给文本添加行号</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 用awk实现
awk &#39;{print FNR&quot; &quot;$0}&#39; file.txt
# 用sed实现
sed = test.txt | sed &#39;N;s/\\n/\\t/&#39;
# 用sed生成行号，再用paste进行合并
sed -n &#39;=&#39; file.txt &gt;tmp
paste tmp file.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="获取某文本两个关键字之间的内容" tabindex="-1"><a class="header-anchor" href="#获取某文本两个关键字之间的内容" aria-hidden="true">#</a> 获取某文本两个关键字之间的内容</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>awk &#39;/Simple/,/Unless/&#39; zen_of_python
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren&#39;t special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实上述还有些不妥，因为我要的是两个关键字之间的内容，而不是关键字所在的行呢。</p><p>另一个思路grep -z参数可以匹配多行。</p><h2 id="添加用户到sudoer" tabindex="-1"><a class="header-anchor" href="#添加用户到sudoer" aria-hidden="true">#</a> 添加用户到sudoer</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token keyword">function</span> <span class="token function-name function">conf_sudoer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token builtin class-name">local</span> <span class="token assign-left variable">user</span><span class="token operator">=</span><span class="token variable">$1</span>
    <span class="token function">grep</span> <span class="token parameter variable">-qE</span> <span class="token string">&quot;^\\s*<span class="token variable">$user</span>\\s+&quot;</span> /etc/sudoers <span class="token operator">&amp;&amp;</span> <span class="token function">sed</span> <span class="token parameter variable">-ri</span> <span class="token string">&quot;/^\\s*<span class="token variable">$user</span>/d&quot;</span> /etc/sudoers
    <span class="token function">grep</span> <span class="token parameter variable">-qE</span> <span class="token string">&#39;^\\s*#\\s*includedir\\s*/etc/sudoers.d&#39;</span> /etc/sudoers <span class="token operator">||</span> <span class="token function">sed</span> <span class="token parameter variable">-ri</span> <span class="token string">&#39;$a #includedir /etc/sudoers.d&#39;</span> /etc/sudoers 
    <span class="token function">grep</span> <span class="token parameter variable">-qE</span> <span class="token string">&#39;^\\s*#\\s*includedir\\s*/etc/sudoers.d&#39;</span> /etc/sudoers <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">&#39;#includedir /etc/sudoers.d&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/sudoers 
    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token variable">$user</span>&quot;</span><span class="token string">&#39; ALL=(ALL)  NOPASSWD:ALL&#39;</span> <span class="token operator">&gt;</span> /etc/sudoers.d/80-<span class="token string">&quot;<span class="token variable">\${user}</span>&quot;</span>
    <span class="token function">chmod</span> o-wx /etc/sudoers.d/80-<span class="token variable">\${user}</span> <span class="token comment">#取消其他用户写权限</span>
<span class="token punctuation">}</span>

conf_sudoer zgz    <span class="token comment">#当前用户名为 zgz</span>
visudo <span class="token parameter variable">-cf</span> /etc/sudoers   <span class="token comment"># 验证配置文件正确否</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>​ grep -qE &#39;^\\s*#\\s<em>includedir\\s</em>/etc/sudoers.d&#39; /etc/sudoers || sed -ri &#39;$a #includedir /etc/sudoers.d&#39; /etc/sudoers</p></blockquote><p>装逼犯写法，sed -ri $是指文件末尾，a是指添加append</p><blockquote><p>​ grep -qE &#39;^\\s*#\\s<em>includedir\\s</em>/etc/sudoers.d&#39; /etc/sudoers || echo &#39;#includedir /etc/sudoers.d&#39; &gt;&gt; /etc/sudoers</p></blockquote><p>普通写法，直接追加进去就好了，就在末尾。</p><h2 id="一行写for循环" tabindex="-1"><a class="header-anchor" href="#一行写for循环" aria-hidden="true">#</a> 一行写for循环</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>for i in \`ls ~\`; do cat $i;done;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="find-通过inode删除文件" tabindex="-1"><a class="header-anchor" href="#find-通过inode删除文件" aria-hidden="true">#</a> Find 通过inode删除文件</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>find . -inum &#39;33786339&#39; -exec rm -f {} \\;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,19);function m(h,k){const n=c("ExternalLinkIcon");return o(),t("div",null,[r,a("p",null,[s("#!/bin/bash echo hello; echo there "),a("a",p,[s("filename=ttt.sh"),l(n)]),s(' if [ -e "$filename" ]; then # 注意: "if"和"then"需要分隔，-e用于判断文件是否存在 echo "File $filename exists."; cp $filename $filename.bak else echo "File $filename not found."; touch $filename fi; echo "File test complete."')]),v,a("p",null,[s("先创建了 back 目录，然后复制 "),a("a",u,[s("test.sh"),l(n)]),s(" 到 back 目录。")]),b])}const f=i(d,[["render",m],["__file","Shell 的奇淫技巧.html.vue"]]);export{f as default};
