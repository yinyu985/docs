import{_ as s,W as n,X as a,a0 as e}from"./framework-b4edc447.js";const l={},i=e(`<h1 id="每隔一秒输出证明进程存活" tabindex="-1"><a class="header-anchor" href="#每隔一秒输出证明进程存活" aria-hidden="true">#</a> 每隔一秒输出证明进程存活</h1><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token assign-left variable">i</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token keyword">while</span> <span class="token boolean">true</span>
<span class="token keyword">do</span> <span class="token builtin class-name">echo</span> “test_<span class="token variable">$i</span>”
<span class="token function">sleep</span> <span class="token number">1</span>
<span class="token builtin class-name">let</span> <span class="token assign-left variable">i</span><span class="token operator">+=</span><span class="token number">1</span>
<span class="token keyword">done</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="输出1-99" tabindex="-1"><a class="header-anchor" href="#输出1-99" aria-hidden="true">#</a> 输出1-99</h1><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token assign-left variable">num</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token keyword">while</span><span class="token variable"><span class="token punctuation">((</span> $num<span class="token operator">&lt;=</span><span class="token number">99</span> <span class="token punctuation">))</span></span>
<span class="token keyword">do</span>
    <span class="token builtin class-name">echo</span> <span class="token variable">$num</span>
    <span class="token builtin class-name">let</span> <span class="token string">&quot;num++&quot;</span>
<span class="token keyword">done</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),t=[i];function c(o,p){return n(),a("div",null,t)}const d=s(l,[["render",c],["__file","每隔一秒输出，证明进程存活.html.vue"]]);export{d as default};
