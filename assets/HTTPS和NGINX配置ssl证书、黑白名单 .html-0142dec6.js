import{_ as i,W as t,X as l,Y as n,Z as s,$ as c,a0 as a,D as p}from"./framework-b4edc447.js";const o={},r=a(`<h1 id="https和nginx配置ssl证书、黑白名单" tabindex="-1"><a class="header-anchor" href="#https和nginx配置ssl证书、黑白名单" aria-hidden="true">#</a> HTTPS和NGINX配置ssl证书、黑白名单</h1><h2 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> HTTP</h2><p>HTTP（超文本传输协议） 是一种用于分布式、协作式和超媒体信息系统的应用层协议。HTTP 是互联网数据通信的基础。</p><p>HTTP 属于 TCP/IP 模型中的应用层协议，当浏览器与服务器进行互相通信时，需要先建立TCP 连接，之后服务器才会接收浏览器的请求信息，当接收到信息之后，服务器返回相应的信息。浏览器接受对服务器的信息应答后，对这些数据进行解释执行。</p><p>HTTP 协议由于其简单快速、占用资源少，一直被用于网站服务器和浏览器之间进行数据传输。但是在数据传输的过程中也存在很明显的问题，由于 HTTP 是明文协议，不会对数据进行任何方式的加密。当黑客攻击窃取了网站服务器和浏览器之间的传输报文的时，可以直接读取传输的信息，造成网站、用户资料的泄密。因此 HTTP 不适用于敏感信息的传播，这个时候需要引入 HTTPS（超文本传输安全协议）。</p><h2 id="https" tabindex="-1"><a class="header-anchor" href="#https" aria-hidden="true">#</a> HTTPS</h2><p>HTTPS（Hypertext Transfer Protocol Secure ）是一种以计算机网络安全通信为目的的传输协议。在HTTP下加入了SSL层，从而具有了保护交换数据隐私和完整性和提供对网站服务器身份认证的功能，简单来说它就是安全版的 HTTP 。</p><h2 id="在nginx服务器上安装证书" tabindex="-1"><a class="header-anchor" href="#在nginx服务器上安装证书" aria-hidden="true">#</a> 在Nginx服务器上安装证书</h2><p>您可以将已签发的SSL证书安装到Nginx或Tengine服务器上。本文介绍如何下载SSL证书并在Nginx或Tengine服务器上安装证书。</p><p>编辑Nginx配置文件（nginx.conf），修改与证书相关的配置。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#以下属性中，以ssl开头的属性表示与证书配置有关。</span>
server <span class="token punctuation">{</span>
    listen <span class="token number">443</span> ssl<span class="token punctuation">;</span>
    <span class="token comment">#配置HTTPS的默认访问端口为443。</span>
    <span class="token comment">#如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。</span>
    <span class="token comment">#如果您使用Nginx 1.15.0及以上版本，请使用listen 443 ssl代替listen 443和ssl on。</span>
    <span class="token comment">#网上有些文档还在写ssl on 这个写法已经被官方弃用了。</span>
    server_name yourdomain<span class="token punctuation">;</span>
    root html<span class="token punctuation">;</span>
    index index.html index.htm<span class="token punctuation">;</span>
    ssl_certificate cert/yourdomain.com.crt     <span class="token comment">##(服务器证书)  </span>
    ssl_certificate_key cert/yourdomain.com.key   <span class="token comment">##(私钥文件）</span>
    ssl_session_timeout 5m<span class="token punctuation">;</span>
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:<span class="token operator">!</span>NULL:<span class="token operator">!</span>aNULL:<span class="token operator">!</span>MD5:<span class="token operator">!</span>ADH:<span class="token operator">!</span>RC4<span class="token punctuation">;</span>
    <span class="token comment">#表示使用的加密套件的类型。</span>
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3<span class="token punctuation">;</span> <span class="token comment">#表示使用的TLS协议的类型，您需要自行评估是否配置TLSv1.1协议。</span>
    ssl_prefer_server_ciphers on<span class="token punctuation">;</span>
    location / <span class="token punctuation">{</span>
        root html<span class="token punctuation">;</span>  <span class="token comment">#Web网站程序存放目录。</span>
        index index.html index.htm<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="设置http请求自动跳转https" tabindex="-1"><a class="header-anchor" href="#设置http请求自动跳转https" aria-hidden="true">#</a> 设置HTTP请求自动跳转HTTPS</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>server <span class="token punctuation">{</span>
    listen <span class="token number">80</span><span class="token punctuation">;</span>
    server_name yourdomain<span class="token punctuation">;</span> <span class="token comment">#需要将yourdomain替换成证书绑定的域名。</span>
    rewrite ^<span class="token punctuation">(</span>.*<span class="token punctuation">)</span>$ https://<span class="token variable">$host</span><span class="token variable">$1</span><span class="token punctuation">;</span> <span class="token comment">#将所有HTTP请求通过rewrite指令重定向到HTTPS。</span>
    location / <span class="token punctuation">{</span>
        index index.html index.htm<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="或者可以这样" tabindex="-1"><a class="header-anchor" href="#或者可以这样" aria-hidden="true">#</a> 或者可以这样</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>server <span class="token punctuation">{</span>
    listen <span class="token number">80</span><span class="token punctuation">;</span>
    server_name dev.wangsl.com<span class="token punctuation">;</span>
    <span class="token builtin class-name">return</span>  <span class="token number">301</span> https://<span class="token variable">$server_name</span><span class="token variable">$request_uri</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还有其他网页服务器，其他语言的写法，不赘述了。</p><h2 id="记录一个ssl配置生成器" tabindex="-1"><a class="header-anchor" href="#记录一个ssl配置生成器" aria-hidden="true">#</a> 记录一个ssl配置生成器</h2>`,17),d=n("strong",null,"SSL Configuration Generator",-1),u={href:"https://ssl-config.mozilla.org/",target:"_blank",rel:"noopener noreferrer"},m=a(`<h2 id="nginx的黑白名单" tabindex="-1"><a class="header-anchor" href="#nginx的黑白名单" aria-hidden="true">#</a> nginx的黑白名单</h2><p>nginx提供了简单的基于IP的访问控制功能，比如我们要禁止<code>1.2.3.4</code>这个IP地址访问服务器，可以在配置文件中这样写：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>deny <span class="token number">1.2</span>.3.4<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 屏蔽单个ip访问</span>
deny IP<span class="token punctuation">;</span>
<span class="token comment"># 允许单个ip访问</span>
allow IP<span class="token punctuation">;</span>
<span class="token comment"># 屏蔽所有ip访问</span>
deny all<span class="token punctuation">;</span>
<span class="token comment"># 允许所有ip访问</span>
allow all<span class="token punctuation">;</span>
<span class="token comment">#屏蔽整个段即从123.0.0.1到123.255.255.254访问的命令</span>
deny <span class="token number">123.0</span>.0.0/8
<span class="token comment">#屏蔽IP段即从123.45.0.1到123.45.255.254访问的命令</span>
deny <span class="token number">124.45</span>.0.0/16
<span class="token comment">#屏蔽IP段即从123.45.6.1到123.45.6.254访问的命令</span>
deny <span class="token number">123.45</span>.6.0/24
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还有其他网页服务器，其他语言的写法，不赘述了。</p><h2 id="ssl-证书格式" tabindex="-1"><a class="header-anchor" href="#ssl-证书格式" aria-hidden="true">#</a> SSL 证书格式</h2><p>.csr Certificate Signing Request，即证书签名请求文件。证书申请者在生成私钥的同时也生成证书请求文件。把CSR文件提交给证书颁发机构后，证书颁发机构使用其根证书私钥签名就生成了证书公钥文件，也就是颁发给用户的证书。安装时可忽略该文件</p><p>.key 私钥，与证书一一配对</p><p>.crt .cert .cer 可以是二进制格式(der)，可以是文本格式(pem)。只包含证书，不保存私钥。一般Linux使用.crt后缀，.cer是windows后缀。</p><p>此外，可以将多级证书导入同一个证书文件中，形成一个包含完整证书链的证书</p><p>.pem</p><p>证书文件（可忽略该文件）</p><blockquote><p>配置ssl证书时，必要的是crt和key</p></blockquote>`,13);function v(h,b){const e=p("ExternalLinkIcon");return t(),l("div",null,[r,n("p",null,[d,s(),n("a",u,[s("https://ssl-config.mozilla.org/"),c(e)])]),m])}const T=i(o,[["render",v],["__file","HTTPS和NGINX配置ssl证书、黑白名单 .html.vue"]]);export{T as default};
