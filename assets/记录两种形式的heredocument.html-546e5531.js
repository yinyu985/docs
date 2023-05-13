import{_ as s,W as e,X as n,a0 as a}from"./framework-b4edc447.js";const i={},t=a(`<h1 id="记录两种形式的heredocument" tabindex="-1"><a class="header-anchor" href="#记录两种形式的heredocument" aria-hidden="true">#</a> 记录两种形式的heredocument</h1><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@ip-172-31-13-117:~<span class="token comment"># cat &gt;&gt; /etc/rancher/k3s/registries.yaml &lt;&lt;EOF</span>

mirrors:
  <span class="token string">&quot;harbor.kingsd.top&quot;</span><span class="token builtin class-name">:</span>
    endpoint:
      - <span class="token string">&quot;https://harbor.kingsd.top&quot;</span>
configs:
  <span class="token string">&quot;harbor.kingsd.top&quot;</span><span class="token builtin class-name">:</span>
    auth:
      username: admin <span class="token comment"># this is the registry username</span>
      password: Harbor12345 <span class="token comment"># this is the registry password</span>
EOF
systemctl restart k3s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@ip-172-31-13-117:~<span class="token comment"># cat &lt;&lt;EOF&gt;&gt; /etc/rancher/k3s/registries.yaml </span>
mirrors:
  <span class="token string">&quot;harbor.kingsd.top&quot;</span><span class="token builtin class-name">:</span>
    endpoint:
      - <span class="token string">&quot;https://harbor.kingsd.top&quot;</span>
configs:
  <span class="token string">&quot;harbor.kingsd.top&quot;</span><span class="token builtin class-name">:</span>
    auth:
      username: admin <span class="token comment"># this is the registry username</span>
      password: Harbor12345 <span class="token comment"># this is the registry password</span>
EOF
systemctl restart k3s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>功能效果都是一样的</p><h2 id="heredocument进阶" tabindex="-1"><a class="header-anchor" href="#heredocument进阶" aria-hidden="true">#</a> heredocument进阶</h2><p>如果你要输入的内容中含有全局变量，或者输入的是一个脚本，如果按照上面的方式，会导致，变量被填充，或者脚本中的命令比如<code>date</code>被执行了。这样你的脚本就不能用了，因为写进脚本的不是date命令而是指定date的结果，要想不让它这么干，可以使用引号包围第一个EOF。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cat &gt;&gt; ~/delete_index.sh &lt;&lt;&quot;EOF&quot;
#!/bin/bash
old_date=\`date -d &quot;120 day ago&quot; +&quot;%Y-%m-%d&quot;\`
curl -XDELETE  --user elastic:**********  http://10.26.*.*:9200/jumpserver23-\${old_date}
curl -XDELETE  --user elastic:**********  http://10.26.*.*:9200/jumpserver23_it-\${old_date}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),d=[t];function r(l,c){return e(),n("div",null,d)}const u=s(i,[["render",r],["__file","记录两种形式的heredocument.html.vue"]]);export{u as default};
