import{_ as r,W as n,X as o,Y as t,Z as e,$ as s,a0 as d,D as c}from"./framework-b4edc447.js";const i={},l=d(`<h1 id="dockerfile-中copy和add的选择" tabindex="-1"><a class="header-anchor" href="#dockerfile-中copy和add的选择" aria-hidden="true">#</a> Dockerfile 中COPY和ADD的选择</h1><p>创建 Dockerfile 时，你可以使用两个命令将文件/目录复制到其中 -<strong><code>ADD</code><strong>和</strong><code>COPY</code></strong>. 尽管它们的功能范围略有不同，但它们基本上执行相同的任务。</p><p>那么，为什么我们有两个命令，我们如何知道何时使用一个或另一个？</p><h2 id="docker-add命令" tabindex="-1"><a class="header-anchor" href="#docker-add命令" aria-hidden="true">#</a> Docker ADD命令</h2><p>Docker ADD与COPY有哪些不同？让我们首先注意到该**<code>ADD</code><strong>命令比</strong><code>COPY</code><strong>. 自 Docker 平台推出以来，该</strong><code>ADD</code>**指令已成为其命令列表的一部分。</p><p>该命令将文件/目录复制到指定容器的文件系统。</p><p>**<code>ADD</code>**命令的基本语法是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ADD &lt;src&gt; … &lt;dest&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>它包括要复制的源 ( <strong><code>&lt;src&gt;</code></strong>)，后跟要存储它的目标 ( <strong><code>&lt;dest&gt;</code></strong>)。如果源是目录，则**<code>ADD</code>**复制其中的所有内容（包括文件系统元数据）。</p><p>例如，如果文件在本地可用，并且你想将其添加到图像目录中，请键入：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ADD /source/file/path  /destination/path
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong><code>ADD</code></strong> 还可以从 URL 复制文件。它可以下载外部文件并将其复制到所需的目的地。例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ADD http://source.file/url  /destination/path
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>另一个功能是它复制压缩文件，自动提取给定目的地的内容。此功能仅适用于本地存储的压缩文件/目录。</p><p>输入来源以及你希望命令提取内容的位置，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ADD source.file.tar.gz /temp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>请记住，你无法从 URL 下载和提取压缩文件/目录。将外部包复制到本地文件系统时，该命令不会解压缩它们。</p><p><strong>注：<strong>该</strong>ADD</strong>命令仅提取，如果它是在其中完全基于文件（而不是文件名）的内容识别的压缩格式压缩的源。公认的压缩格式包括<strong>identity</strong>、<strong>gzip</strong>、<strong>bzip</strong>和<strong>xz</strong>。</p><p>Docker ADD与COPY有哪些不同？由于一些功能问题，Docker 不得不引入一个额外的命令来复制内容—— <strong><code>COPY</code></strong>.</p><p>与其密切相关的**<code>ADD</code><strong>命令不同，它</strong><code>COPY</code>**只有一个指定的功能。它的作用是以现有格式在指定位置复制文件/目录。这意味着它不处理提取压缩文件，而是按原样复制它。</p><p>该指令只能用于本地存储的文件。因此，你不能将它与 URL 一起使用以将外部文件复制到你的容器。</p><p>要使用该**<code>COPY</code>**指令，请遵循基本命令格式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>COPY &lt;src&gt; … &lt;dest&gt; 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>例如：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>COPY /source/file/path  /destination/path 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="docker-add与copy比较差异" tabindex="-1"><a class="header-anchor" href="#docker-add与copy比较差异" aria-hidden="true">#</a> Docker ADD与COPY比较差异</h2><p>为什么需要添加一个新的、类似的命令？</p>`,27),p={href:"https://www.lsbin.com/tag/docker-add%E4%B8%8Ecopy%E6%9C%89%E4%BB%80%E4%B9%88%E5%8C%BA%E5%88%AB/",target:"_blank",rel:"noopener noreferrer"},g=t("code",null,"ADD",-1),D=d(`<p>由于现有的许多用法，Docker 无法完全取代该命令。为了避免向后兼容，最安全的选择是添加**<code>COPY</code>**命令——一个不太多样化但更可靠的命令。</p><h2 id="使用哪个-最佳实践" tabindex="-1"><a class="header-anchor" href="#使用哪个-最佳实践" aria-hidden="true">#</a> 使用哪个（最佳实践）</h2><p>考虑到**<code>COPY</code><strong>引入该命令的情况，显然保留 ADD 是必要的。Docker 发布了一份官方文档，概述了编写 Dockerfiles 的最佳实践，其中</strong>明确建议不要使用<code>ADD</code>命令**。</p><p>Docker 的官方文档指出**<code>COPY</code><strong>应该始终是首选指令，因为它比</strong><code>ADD</code>**更透明，COPY只支持将本地文件基本复制到容器中，而ADD的一些特性(比如只本地的tar提取和远程URL支持)不是很有效。</p><p>如果你需要从本地构建上下文复制到容器中，请坚持使用**<code>COPY</code>**.</p><p>Docker ADD与COPY有哪些不同？Docker 团队还强烈反对使用**<code>ADD</code><strong>从 URL 下载和复制包。相反，在命令中使用</strong>wget<strong>或</strong>curl<strong>更安全、更有效</strong><code>RUN</code>**。通过这样做，你可以避免创建额外的图像层并节省空间。</p><p>假设你要从 URL 下载压缩包、提取内容并清理存档。</p><p>而不是使用**<code>ADD</code>**和运行以下命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ADD http://source.file/package.file.tar.gz /temp
RUN tar -xjf /temp/package.file.tar.gz \\
  &amp;&amp; make -C /tmp/package.file \\
  &amp;&amp; rm /tmp/ package.file.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你应该使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>RUN curl http://source.file/package.file.tar.gz \\
  | tar -xjC /tmp/ package.file.tar.gz \\
  &amp;&amp; make -C /tmp/ package.file.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意：<strong>你唯一需要使用</strong>ADD</strong>命令的时间是将本地 tar 文件提取到映像中。</p><h2 id="结论" tabindex="-1"><a class="header-anchor" href="#结论" aria-hidden="true">#</a> 结论</h2><p>Docker ADD与COPY有什么区别？总结一下 使用<strong>COPY</strong>。正如 Docker 本身所建议的，除非你需要提取本地 tar 文件，否则请避免使用 ADD 命令。</p>`,14);function u(m,v){const a=c("ExternalLinkIcon");return n(),o("div",null,[l,t("p",null,[t("a",p,[e("Docker ADD与COPY有什么区别"),s(a)]),e("？事实**"),g,e("**证明，具有如此多功能的事实在实践中是有问题的，因为它的行为极其不可预测。这种不可靠的性能的结果通常归结为在你想提取时复制和在你想复制时提取。")]),D])}const x=r(i,[["render",u],["__file","Dockerfile 中COPY和ADD的选择.html.vue"]]);export{x as default};
