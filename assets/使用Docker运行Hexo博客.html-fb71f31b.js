import{_ as n,W as a,X as s,a1 as e}from"./framework-ab2cdc09.js";const i={},l=e(`<p>原本Hexo是放在Mac上的，但是只是配过两次，对其了解不够深刻不敢乱动，这次我又回来了，近乎破釜沉舟，因为我把原本的博客毁得差不多了，只能重新搭，并且这次下定决心采用Docker运行，技术要用起来，才能理解的更深刻。<!--more--></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>at <span class="token operator">&gt;</span>Dockerfile<span class="token operator">&lt;&lt;</span><span class="token string">EOF
FROM node:13.14-alpine3.10
WORKDIR /blog
RUN sed -i &#39;s/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g&#39; /etc/apk/repositories &amp;&amp; apk add bash git openssh 
RUN apk add tzdata &amp;&amp; cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \\
&amp;&amp; echo &quot;Asia/Shanghai&quot; &gt; /etc/timezone &amp;&amp; apk del tzdata
RUN \\ 
npm config set registry https://registry.npm.taobao.org \\
&amp;&amp; npm install hexo-cli -g \\
&amp;&amp; hexo init . \\
&amp;&amp; npm install \\
&amp;&amp; npm install hexo-server --save \\
&amp;&amp; npm install hexo-abbrlink --save \\
&amp;&amp; npm install hexo-deployer-git --save \\
&amp;&amp; npm install hexo-symbols-count-time --save \\
&amp;&amp; npm install hexo-asset-image --save \\
&amp;&amp; npm install hexo-blog-encrypt --save \\
&amp;&amp; npm install hexo-generator-searchdb --save \\
&amp;&amp; git clone https://github.com/next-theme/hexo-theme-next.git themes/next \\
&amp;&amp; sed -i &quot;s/theme: landscape/theme: next/g&quot; _config.yml  \\
&amp;&amp; sed -i &quot;s@permalink: :year/:month/:day/:title/@permalink: posts/:abbrlink.html@g&quot; _config.yml  \\  
&amp;&amp; sed -i &quot;s@type: &#39;&#39;@type: &#39;git&#39;@g&quot; _config.yml  \\  
&amp;&amp; echo -e &#39;  repo: git@github.com:yinyu985/yinyu985.github.io.git<span class="token entity" title="\\n">\\n</span>\\
  branch: master<span class="token entity" title="\\n">\\n</span>&#39;&gt;&gt;_config.yml  \\  
&amp;&amp; rm -rf _config.landscape.yml \\
&amp;&amp; git init \\
&amp;&amp; git config --global user.name &quot;yinyu985&quot; \\
&amp;&amp; git config --global user.email &quot;yinyu985@gmai.com&quot; 
EXPOSE 4000
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="docerfile" tabindex="-1"><a class="header-anchor" href="#docerfile" aria-hidden="true">#</a> Docerfile</h2><p>上面的Dockerfile安装了Hexo，安装了git，bash，设置了时区，修改了默认主题，修改了链接生成方式，通过hexo-abbrlink生成链接，这样中文标题的文章就不用转成一大串了。</p><p>然后设置了hexo的部署方式为git，注意仓库链接建议用git，不要写http链接，不然每次deploy都要求验证账户，好久没动它，发现现在Github推代码还要在个人设置的开发者界面生成一个token。</p><p>在Dockerfile中使用echo向文本中输入多行，搜了一下，别人是怎么做的，看了下，都是千篇一律的使用<code>\\n</code>进行换行，没搜到其他办法，就这么用吧，结果写进去，构建，运行，文件拷出来，没生效，echo加个参数好吗？带你学习一下echo怎么用吧！</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>echo<span class="token punctuation">(</span>选项<span class="token punctuation">)</span><span class="token punctuation">(</span>参数<span class="token punctuation">)</span>
选项
-e：启用转义字符。
-E: 不启用转义字符（默认）
-n: 结尾不换行
使用-e选项时，若字符串中出现以下字符，则特别加以处理，而不会将它当成一般文字输出：

<span class="token punctuation">\\</span>a 发出警告声；
<span class="token punctuation">\\</span>b 删除前一个字符；
<span class="token punctuation">\\</span>c 不产生进一步输出 <span class="token punctuation">(</span><span class="token punctuation">\\</span>c 后面的字符不会输出<span class="token punctuation">)</span>；
<span class="token punctuation">\\</span>f 换行但光标仍旧停留在原来的位置；
<span class="token punctuation">\\</span>n 换行且光标移至行首；
<span class="token punctuation">\\</span>r 光标移至行首，但不换行；
<span class="token punctuation">\\</span>t 插入tab；
<span class="token punctuation">\\</span>v 与<span class="token punctuation">\\</span>f相同；
<span class="token punctuation">\\</span><span class="token punctuation">\\</span> 插入<span class="token punctuation">\\</span>字符；
<span class="token punctuation">\\</span>nnn 插入 nnn（八进制）所代表的ASCII字符；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实践出真知啊，网上搜的文章，都没有-e参数，也不知道他是怎么支持<code>\\n</code>转义的，可能系统不同？</p><h2 id="构建" tabindex="-1"><a class="header-anchor" href="#构建" aria-hidden="true">#</a> 构建</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> build <span class="token parameter variable">-t</span>  yinyu985/hexo:latest <span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>构建镜像啦，将第一步Dockerfile输出到一个空目录，然后在这个空目录里，命令最后的.就是在当前目录。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run  <span class="token parameter variable">-itd</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-p</span> <span class="token number">4000</span>:4000 <span class="token punctuation">\\</span>
<span class="token parameter variable">--name</span> <span class="token string">&#39;hexo&#39;</span>  <span class="token punctuation">\\</span>
yinyu985/hexo:latest 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>随便启动一下，啥也不挂载，其实端口也是多余的，但是千金难买爷乐意。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> <span class="token function">cp</span> hexo:/blog ~
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>将容器里面的/blog目录拷贝到本mac的家目录。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> <span class="token function">rm</span> <span class="token parameter variable">-f</span> hexo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后得把这个容器删掉，不然影响后面干正事。</p><h2 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run  <span class="token parameter variable">-itd</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-p</span> <span class="token number">4000</span>:4000 <span class="token punctuation">\\</span>
<span class="token parameter variable">--name</span> <span class="token string">&#39;hexo&#39;</span>  <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> ~/blog/themes:/blog/themes <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> ~/blog/source:/blog/source <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> ~/blog/source/_posts:/blog/source/_posts <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> ~/blog/_config.yml:/blog/_config.yml <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> ~/.ssh:/root/.ssh <span class="token punctuation">\\</span>
yinyu985/hexo:latest  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候就是干正事，刚才虽然从容器拷贝出来，但是不是全都需要，基本上挂载的这些就够了。 关于Hexo主要设置了啥在此记录一下，<s>这玩意儿，几百年不动，怕忘了</s>。</p><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><blockquote><p>Hexo主配置文件</p></blockquote><h3 id="设置中文" tabindex="-1"><a class="header-anchor" href="#设置中文" aria-hidden="true">#</a> 设置中文</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># Site</span>
<span class="token key atrule">title</span><span class="token punctuation">:</span> yinyu985&#39;s blog
<span class="token key atrule">subtitle</span><span class="token punctuation">:</span> <span class="token string">&#39;&#39;</span>
<span class="token key atrule">description</span><span class="token punctuation">:</span> <span class="token string">&#39;&#39;</span>
<span class="token key atrule">keywords</span><span class="token punctuation">:</span>
<span class="token key atrule">author</span><span class="token punctuation">:</span> yinyu985
<span class="token key atrule">language</span><span class="token punctuation">:</span>  zh<span class="token punctuation">-</span>CN 
<span class="token key atrule">timezone</span><span class="token punctuation">:</span> <span class="token string">&#39;&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置主题" tabindex="-1"><a class="header-anchor" href="#设置主题" aria-hidden="true">#</a> 设置主题</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># Extensions</span>
<span class="token comment">## Plugins: https://hexo.io/plugins/</span>
<span class="token comment">## Themes: https://hexo.io/themes/</span>
<span class="token key atrule">theme</span><span class="token punctuation">:</span> next
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置部署方式" tabindex="-1"><a class="header-anchor" href="#设置部署方式" aria-hidden="true">#</a> 设置部署方式</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># Deployment</span>
<span class="token comment">## Docs: https://hexo.io/docs/one-command-deployment</span>
<span class="token key atrule">deploy</span><span class="token punctuation">:</span>
  <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">&#39;git&#39;</span>
  <span class="token key atrule">repo</span><span class="token punctuation">:</span> git@github.com<span class="token punctuation">:</span>yinyu985/yinyu985.github.io.git
  <span class="token key atrule">branch</span><span class="token punctuation">:</span> master
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设置链接格式" tabindex="-1"><a class="header-anchor" href="#设置链接格式" aria-hidden="true">#</a> 设置链接格式</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># URL</span>
<span class="token comment">## Set your site url here. For example, if you use GitHub Page, set url as &#39;https://username.github.io/project&#39;</span>
<span class="token key atrule">url</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//example.com
<span class="token key atrule">permalink</span><span class="token punctuation">:</span> posts/<span class="token punctuation">:</span>abbrlink.html
<span class="token key atrule">permalink_defaults</span><span class="token punctuation">:</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>Next主题配置文件</p></blockquote><h3 id="设置字数统计" tabindex="-1"><a class="header-anchor" href="#设置字数统计" aria-hidden="true">#</a> 设置字数统计</h3><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># Post wordcount display settings</span>
<span class="token comment"># Dependencies: https://github.com/next-theme/hexo-word-counter</span>
<span class="token key atrule">symbols_count_time</span><span class="token punctuation">:</span>
  <span class="token key atrule">separated_meta</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">item_text_post</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">item_text_total</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">awl</span><span class="token punctuation">:</span> <span class="token number">4</span>
  <span class="token key atrule">wpm</span><span class="token punctuation">:</span> <span class="token number">275</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>没了，剩下的都是一些无关痛痒的样式修改，后续对Next主题配置优化再更新。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token keyword">function</span> <span class="token function-name function">h</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> hexo hexo <span class="token variable">$1</span> <span class="token variable">$2</span>
<span class="token punctuation">}</span>
<span class="token keyword">function</span> <span class="token function-name function">n</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> hexo hexo new <span class="token variable">$1</span> <span class="token variable">$2</span>
<span class="token punctuation">}</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">c</span><span class="token operator">=</span><span class="token string">&#39;docker exec -it hexo hexo clean&#39;</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">g</span><span class="token operator">=</span><span class="token string">&#39;docker exec -it hexo hexo generate&#39;</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">d</span><span class="token operator">=</span><span class="token string">&#39;docker exec -it hexo hexo deploy&#39;</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">s</span><span class="token operator">=</span><span class="token string">&#39;docker exec -it hexo hexo server&#39;</span>
<span class="token builtin class-name">alias</span> <span class="token assign-left variable">gkd</span><span class="token operator">=</span><span class="token string">&#39;docker exec -it hexo hexo clean &amp;&amp;  docker exec -it hexo hexo generate  &amp;&amp; docker exec -it hexo hexo deploy&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,35),t=[l];function p(c,o){return a(),s("div",null,t)}const r=n(i,[["render",p],["__file","使用Docker运行Hexo博客.html.vue"]]);export{r as default};
