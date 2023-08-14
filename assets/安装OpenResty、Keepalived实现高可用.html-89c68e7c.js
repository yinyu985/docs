import{_ as n,W as s,X as a,a0 as e}from"./framework-b4edc447.js";const i={},t=e(`<h1 id="安装openresty-keepalived实现高可用" tabindex="-1"><a class="header-anchor" href="#安装openresty-keepalived实现高可用" aria-hidden="true">#</a> 安装OpenResty&amp;Keepalived实现高可用</h1><h3 id="openresty下载安装包" tabindex="-1"><a class="header-anchor" href="#openresty下载安装包" aria-hidden="true">#</a> OpenResty下载安装包</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /home/resource <span class="token operator">&amp;&amp;</span> <span class="token function">wget</span> https://openresty.org/download/openresty-1.19.9.1.tar.gz   <span class="token comment">#下载安装包到/home/resource</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="openresty所需依赖的包安装" tabindex="-1"><a class="header-anchor" href="#openresty所需依赖的包安装" aria-hidden="true">#</a> OpenResty所需依赖的包安装</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum <span class="token function">install</span> gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel <span class="token parameter variable">-y</span>
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> openldap-devel 
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">git</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="下载第三方模块" tabindex="-1"><a class="header-anchor" href="#下载第三方模块" aria-hidden="true">#</a> 下载第三方模块</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> /opt/extra_modules <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> /opt/extra_modules/  <span class="token comment">#创建extra_modules，用于存放第三方模块</span>
<span class="token builtin class-name">cd</span> /opt/extra_modules/ <span class="token operator">&amp;&amp;</span> <span class="token function">git</span> clone https://github.com/kvspb/nginx-auth-ldap.git   <span class="token comment">#支持ldap网页认证</span>
<span class="token builtin class-name">cd</span> /opt/extra_modules/ <span class="token operator">&amp;&amp;</span> <span class="token function">wget</span> https://bitbucket.org/nginx-goodies/nginx-sticky-module-ng/get/master.tar.gz <span class="token comment">#支持cookie</span>
<span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> master.tar.gz
<span class="token function">mv</span> nginx-goodies-nginx-sticky-module-ng-08a395c66e42/ nginx-sticky-module  <span class="token comment">#把下载到的文件夹改成nginx-sticky-module，方便后面编译不然会报错./configure: error: no /opt/extra_modules/nginx-sticky-module/config was found</span>
<span class="token builtin class-name">cd</span> /opt/extra_modules <span class="token operator">&amp;&amp;</span> <span class="token function">git</span> clone https://github.com/FRiCKLE/ngx_cache_purge.git  <span class="token comment">#清除缓存</span>
<span class="token builtin class-name">cd</span> /opt/extra_modules <span class="token operator">&amp;&amp;</span> <span class="token function">git</span> clone https://github.com/yaoweibin/nginx_upstream_check_module.git   <span class="token comment">#用于ustream健康检查</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解压openresty安装包" tabindex="-1"><a class="header-anchor" href="#解压openresty安装包" aria-hidden="true">#</a> 解压OpenResty安装包</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /home/resource
<span class="token function">tar</span> <span class="token parameter variable">-xf</span> openresty-1.19.9.1.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编译需要安装的模块" tabindex="-1"><a class="header-anchor" href="#编译需要安装的模块" aria-hidden="true">#</a> 编译需要安装的模块</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /home/resource/openresty-1.19.9.1
<span class="token comment">#配置文件</span>
./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/home/openresty <span class="token punctuation">\\</span>
--pid-path<span class="token operator">=</span>/var/run/nginx.pid <span class="token punctuation">\\</span>
--http-log-path<span class="token operator">=</span>/var/log/nginx/access.log <span class="token punctuation">\\</span>
--error-log-path<span class="token operator">=</span>/var/log/nginx/error.log <span class="token punctuation">\\</span>
--with-luajit <span class="token punctuation">\\</span>
--with-pcre <span class="token punctuation">\\</span>
--with-http_v2_module <span class="token punctuation">\\</span>
--with-http_ssl_module <span class="token punctuation">\\</span>
--with-pcre-jit <span class="token punctuation">\\</span>
--with-compat <span class="token punctuation">\\</span>
--with-threads <span class="token punctuation">\\</span>
--with-file-aio <span class="token punctuation">\\</span>
--with-http_gunzip_module <span class="token punctuation">\\</span>
--with-http_iconv_module <span class="token punctuation">\\</span>
--with-http_realip_module <span class="token punctuation">\\</span>
--with-http_gzip_static_module <span class="token punctuation">\\</span>
--with-http_degradation_module <span class="token punctuation">\\</span>
--with-http_auth_request_module <span class="token punctuation">\\</span>
--with-http_stub_status_module <span class="token punctuation">\\</span>
--without-lua_resty_memcached <span class="token punctuation">\\</span>
--without-http_memcached_module <span class="token punctuation">\\</span>
--without-lua_resty_mysql <span class="token punctuation">\\</span>
--without-lua_redis_parser <span class="token punctuation">\\</span>
--without-lua_resty_redis <span class="token punctuation">\\</span>
--without-http_redis_module <span class="token punctuation">\\</span>
--without-http_redis2_module <span class="token punctuation">\\</span>
--without-lua_rds_parser <span class="token punctuation">\\</span>
--without-http_rds_csv_module <span class="token punctuation">\\</span>
--without-http_rds_json_module <span class="token punctuation">\\</span>
--without-mail_pop3_module <span class="token punctuation">\\</span>
--without-mail_imap_module <span class="token punctuation">\\</span>
--without-mail_smtp_module <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/nginx-auth-ldap <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/nginx-sticky-module <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/ngx_cache_purge <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/nginx_upstream_check_module <span class="token punctuation">\\</span>
<span class="token parameter variable">-j48</span><span class="token comment">#用全部的两个核心去编译#我们的机器就俩核心</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编译安装" tabindex="-1"><a class="header-anchor" href="#编译安装" aria-hidden="true">#</a> 编译安装</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>gmake <span class="token operator">&amp;&amp;</span> gmake <span class="token function">install</span>
/home/openresty/nginx/sbin/nginx <span class="token parameter variable">-t</span>  <span class="token comment">#查看新修改的nginx配置文件是否有语法错误/结构错误，如果能运行，证明编译安装成功</span>
/home/openresty/nginx/sbin/nginx <span class="token parameter variable">-V</span>    <span class="token comment">#显示所有的编译模块</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建可执行文件软链接" tabindex="-1"><a class="header-anchor" href="#创建可执行文件软链接" aria-hidden="true">#</a> 创建可执行文件软链接</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">ln</span> <span class="token parameter variable">-s</span> /home/openresty/nginx/sbin/nginx /usr/bin/
<span class="token comment">#ln创建链接；-s创建软链接</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="写入nginx配置文件" tabindex="-1"><a class="header-anchor" href="#写入nginx配置文件" aria-hidden="true">#</a> 写入Nginx配置文件</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /home/openresty/nginx/conf/nginx.conf  
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 定义作为web服务器/反向代理服务器时的 worder process 进程数</span>
worker_processes    auto<span class="token punctuation">;</span>
<span class="token comment"># 开启多核支持，且自动根据CPU个数均匀分配 worder process 进程数</span>
worker_cpu_affinity auto<span class="token punctuation">;</span>
<span class="token comment"># 指定一个nginx进程可以打开的最多文件描述符数目</span>
worker_rlimit_nofile    <span class="token number">65535</span><span class="token punctuation">;</span>
<span class="token comment"># error_log配置，等级类型：[ debug | info | notice | warn | error | crit ]</span>
error_log  /var/log/nginx/error.log  debug<span class="token punctuation">;</span>
<span class="token comment"># nginx的进程pid位置；</span>
pid        /var/run/nginx.pid<span class="token punctuation">;</span>
<span class="token comment"># 连接处理相关设置</span>
events<span class="token punctuation">{</span>
    <span class="token comment"># 使用epoll的 I/O 模型，必开项，极其有利于性能</span>
    use            epoll<span class="token punctuation">;</span>
    <span class="token comment"># 设置是否允许一个worker可以接受多个请求，默认是off；</span>
    <span class="token comment"># 值为OFF时，一个worker process进程一次只接收一个请求，由master进程自动分配worker（nginx精于此道，故建议设置为off）；</span>
    <span class="token comment"># 值为ON则一次可接收所有请求，可避免master进程额外调度，但是在高瞬时值的情况下可能导致tcp flood；</span>
    multi_accept off<span class="token punctuation">;</span>
    <span class="token comment"># 每个工作进程的并发连接数（默认为1024）</span>
    <span class="token comment"># 理论上nginx最大连接数 = worker_processes * worker_connections</span>
    worker_connections <span class="token number">65535</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
http <span class="token punctuation">{</span>
    <span class="token comment"># mime.types 指定了nginx可以接受的 Content-Type，该文件默认位于nginx.conf的同级目录</span>
    include       mime.types<span class="token punctuation">;</span>
    <span class="token comment"># 设置默认文件类型，application/octet-stream 表示未知的应用程序文件，浏览器一般不会自动执行或询问执行</span>
    default_type  application/octet-stream<span class="token punctuation">;</span>
    <span class="token comment"># 设置日志的记录格式</span>
    log_format main <span class="token assign-left variable">escape</span><span class="token operator">=</span>json <span class="token string">&#39;{ &quot;time&quot;: &quot;$time_iso8601&quot;, &#39;</span>
        <span class="token string">&#39;&quot;remote_addr&quot;: &quot;$remote_addr&quot;, &#39;</span>
        <span class="token string">&#39;&quot;status&quot;: &quot;$status&quot;, &#39;</span>
        <span class="token string">&#39;&quot;bytes_sent&quot;: &quot;$bytes_sent&quot;, &#39;</span>
        <span class="token string">&#39;&quot;host&quot;: &quot;$host&quot;, &#39;</span>
        <span class="token string">&#39;&quot;request_method&quot;: &quot;$request_method&quot;, &#39;</span>
        <span class="token string">&#39;&quot;request_uri&quot;: &quot;$request_uri&quot;, &#39;</span>
        <span class="token string">&#39;&quot;request_time&quot;: &quot;$request_time&quot;, &#39;</span>
        <span class="token string">&#39;&quot;response_time&quot;: &quot;$upstream_response_time&quot;,&#39;</span>
        <span class="token string">&#39;&quot;http_referer&quot;: &quot;$http_referer&quot;, &#39;</span>
        <span class="token string">&#39;&quot;body_bytes_sent&quot;: &quot;$body_bytes_sent&quot;, &#39;</span>
        <span class="token string">&#39;&quot;http_user_agent&quot;: &quot;$http_user_agent&quot;, &#39;</span>
        <span class="token string">&#39;&quot;http_x_forwarded_for&quot;: &quot;$http_x_forwarded_for&quot;, &#39;</span>
        <span class="token string">&#39;&quot;cookie&quot;: &quot;$http_cookie&quot; &#39;</span>
        <span class="token string">&#39;}&#39;</span><span class="token punctuation">;</span>
    <span class="token comment"># 用来指定日志文件的存放路径及内容格式</span>
    access_log  /var/log/nginx/access.log  main<span class="token punctuation">;</span>
    <span class="token comment"># 不记录404错误的日志</span>
    log_not_found   off<span class="token punctuation">;</span>
    <span class="token comment"># 隐藏nginx版本号</span>
    server_tokens   off<span class="token punctuation">;</span>
    <span class="token comment"># 开启0拷贝，提高文件传输效率</span>
    sendfile    on<span class="token punctuation">;</span>
    <span class="token comment"># 配合 sendfile 使用，启用后数据包会累计到一定大小之后才会发送，减小额外开销，提高网络效率；</span>
    tcp_nopush  on<span class="token punctuation">;</span>
    <span class="token comment"># 启用后表示禁用 Nagle 算法，尽快发送数据</span>
    <span class="token comment"># 与 tcp_nopush 结合使用的效果是：先填满包，再尽快发送</span>
    <span class="token comment"># Nginx 只会针对处于 keep-alive 状态的 TCP 连接才会启用 tcp_nodelay</span>
    tcp_nodelay on<span class="token punctuation">;</span>
    <span class="token comment"># 指定客户端与服务端建立连接后发送 request body 的超时时间，超时Nginx将返���http 408</span>
    client_body_timeout <span class="token number">10</span><span class="token punctuation">;</span>
    <span class="token comment"># 开启从client到nginx的连接长连接支持，指定每个 TCP 连接最多可以保持多长时间</span>
    <span class="token comment"># keepalive_timeout的值应该比 client_body_timeout 大</span>
    keepalive_timeout   <span class="token number">60</span><span class="token punctuation">;</span>
    <span class="token comment"># keepalive_requests指令用于设置一个keep-alive连接上可以服务的请求的最大数量，当最大请求数量达到时，连接将被关闭</span>
    keepalive_requests  <span class="token number">1000</span><span class="token punctuation">;</span>
    <span class="token comment"># 客户端请求头部的缓冲区大小，设置等于系统分页大小即可，如果header过大可根据实际情况调整；</span>
    <span class="token comment"># 查看系统分页：getconf PAGESIZE</span>
    client_header_buffer_size       32k<span class="token punctuation">;</span>
    <span class="token comment"># 设置客户端请求的Header头缓冲区大小，如果客户端的Cookie信息较大，按需增加</span>
    large_client_header_buffers     <span class="token number">4</span> 64k<span class="token punctuation">;</span>
    <span class="token comment"># 优化读取$request_body变量时的I/O性能</span>
    client_body_in_single_buffer    on<span class="token punctuation">;</span>
    <span class="token comment"># 设定request body的缓冲大小，仅在 Nginx被设置成使用内存缓冲时有效（使用文件缓冲���该参数无效）</span>
    client_body_buffer_size     128k<span class="token punctuation">;</span>
    <span class="token comment"># 开启proxy忽略客户端中断，避免499错误</span>
    proxy_ignore_client_abort       on<span class="token punctuation">;</span>
    <span class="token comment"># 默认的情况下nginx引用header变量时不能使用带下划线的变量，设置underscores_in_headers为 on取消该限制</span>
    underscores_in_headers      on<span class="token punctuation">;</span>
    <span class="token comment"># 默认的情况下nginx会忽略带下划线的变量，设置ignore_invalid_headers为off取消该限制</span>
    ignore_invalid_headers      off<span class="token punctuation">;</span>
    <span class="token comment"># 设置客户端向服务端发送一个完整的 request header 的超时时间，优化弱网场景下nginx的性能</span>
    client_header_timeout   <span class="token number">10</span><span class="token punctuation">;</span>
    <span class="token comment"># 设置向客户端传输数据的超时时间</span>
    send_timeout        <span class="token number">60</span><span class="token punctuation">;</span>
    <span class="token comment"># 用于启用文件功能时用限制文件大小；</span>
    client_max_body_size    50m<span class="token punctuation">;</span>
    <span class="token comment"># 文件压缩配置，对文本文件效果较好，对图像类应用效果一般反而徒增服务器资源消耗</span>
    <span class="token function">gzip</span>        on<span class="token punctuation">;</span>
    <span class="token comment"># 兼容http 1.0</span>
    gzip_http_version   <span class="token number">1.0</span><span class="token punctuation">;</span>
    <span class="token comment"># 压缩比，数值越大：压缩的程度越高、空间占用越低、压缩效率越低、资源消耗越大</span>
    gzip_comp_level <span class="token number">6</span><span class="token punctuation">;</span>
    <span class="token comment"># 设置压缩门限，小于该长度将不会进行压缩动作（数据过小的情况下，压缩效果不明显）</span>
    gzip_min_length 1k<span class="token punctuation">;</span>
    <span class="token comment"># 用于在nginx作为反向代理时，根据请求头中的“Via”字段决定是否启用压缩功能，默认值为off，any表示对所有请求启动压缩；</span>
    gzip_proxied    any<span class="token punctuation">;</span>
    <span class="token comment"># 用于在启动gzip压缩功能时，在http响应中添加Vary: Accept-Encoding头字段告知接收方使用了gzip压缩；</span>
    gzip_vary       on<span class="token punctuation">;</span>
    <span class="token comment"># 当Agent为IE6时禁用压缩：IE6对Gzip不友好，所以不压缩</span>
    gzip_disable    msie6<span class="token punctuation">;</span>
    <span class="token comment"># 设置系统用于存储gzip的压缩结果数据流的缓存大小（4 4k 代表以4k为单位，按照原始数据大小以4k为单位的4倍申请内存）</span>
    gzip_buffers    <span class="token number">4</span> 64k<span class="token punctuation">;</span>
    <span class="token comment"># 指定需要压缩的文件mime类型</span>
    gzip_types      text/xml text/plain text/css application/javascript application/x-javascript application/xml application/json application/rss+xml<span class="token punctuation">;</span>
    <span class="token comment"># 作为反向代理服务器配置</span>
    <span class="token comment"># 当请求未携带“Host”请求头时将Host设置为虚拟主机的主域名</span>
    proxy_set_header        Host <span class="token variable">$host</span><span class="token punctuation">;</span>
    <span class="token comment"># 设置真实客户端IP</span>
    proxy_set_header        X-Real-IP <span class="token variable">$remote_addr</span><span class="token punctuation">;</span>
    <span class="token comment"># 简称XFF头，即HTTP的请求端真实的IP，在有前置cdn或者负载均衡可能会被修改；如果要提取客户端真实IP，需要根据实际情况调整，如若后端程序获得对X-Forwarded-For兼容性不好的话（没有考虑到X-Forwarded-For含有多个IP的情况），建议设置为：$http_x_forwarded_for</span>
    proxy_set_header        X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span><span class="token punctuation">;</span>
    <span class="token comment"># 启用nginx和后端server（upstream）之间长连接支持（必设项，否则很影响nginx性能），HTTP协议中从1.1版本才支持长连接；启用时需要评估upstream的keepalive参数（默认是关闭的，比较懒的���学可以设置为500）</span>
    proxy_http_version <span class="token number">1.1</span><span class="token punctuation">;</span>
    <span class="token comment"># 为了兼容老的协议以及防止http头中有Connection close导致的keepalive失效，需要及时清掉HTTP头部的Connection；</span>
    <span class="token comment"># 该参数决定了访问完成后，后端server后如何处理本次连接，默认配置是主动close（会给后端server带来大量的TIME_WAIT连接，降低后端server性能），设置为&quot;&quot;结合proxy_http_version设置连接保持（长连接）；</span>
    proxy_set_header Connection <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
    <span class="token comment"># 用于对发送给客户端的URL进行修改，使用不到的话可以关闭</span>
    proxy_redirect          off<span class="token punctuation">;</span>
    <span class="token comment"># 设置缓冲区的大小和数量，用于放置被代理的后端服务器取得的响应内容</span>
    proxy_buffers           <span class="token number">64</span> 8k<span class="token punctuation">;</span>
    <span class="token comment"># 设置和后端建立连接的超时时间，单位秒</span>
    proxy_connect_timeout   <span class="token number">60</span><span class="token punctuation">;</span>
    <span class="token comment"># 设置Nginx向后端被代理服务器发送read请求后，等待响应的超时时间，默认60秒</span>
    proxy_read_timeout <span class="token number">60</span><span class="token punctuation">;</span>
    <span class="token comment"># 设置Nginx向后端���代理服务器发送write请求后，等待响应的超时时间，默认60秒</span>
    proxy_send_timeout <span class="token number">60</span><span class="token punctuation">;</span>
    <span class="token comment"># 用于配置存放HTTP报文头的哈希表容量，默认为512个字符。一般都设置为1024，这个大小是哈希表的总大小，</span>
    <span class="token comment">#设定了这个参数Nginx不是一次全部申请出来，需要用的时候才会申请；</span>
    <span class="token comment">#但是当真正需要使用的时候也不是一次全部申请，而是会设置一个单次申请最大值（proxy_headers_hash_bucket_size）</span>
    proxy_headers_hash_max_size <span class="token number">1024</span><span class="token punctuation">;</span>
    <span class="token comment"># 用于设置Nginx服务器申请存放HTTP报文头的哈希表容量的单位大小，默认为64个字符。一般配置为128。</span>
    <span class="token comment">#这个大小是单次申请最多申请多大，也就是每次用需要申请，但是每次申请最大申请多少，整个哈希表大小不可超过上面设置的值。</span>
    proxy_headers_hash_bucket_size <span class="token number">128</span><span class="token punctuation">;</span>
    <span class="token comment"># 预防 DDOS 攻击配置策略</span>
    <span class="token comment">#limit_req_zone          $binary_remote_addr  zone=req:20m   rate=3r/s;</span>
    <span class="token comment">#limit_req               zone=req  burst=60;</span>
    <span class="token comment">#limit_zone              conn $binary_remote_addr  20m;</span>
    <span class="token comment">#limit_conn              conn 5;</span>
    <span class="token comment">#limit_rate              50k;</span>
    <span class="token comment"># 设置nginx可以捕获的服务器名字（server_name）的最大数量</span>
    server_names_hash_max_size    <span class="token number">1024</span><span class="token punctuation">;</span>
    <span class="token comment"># 设置nginx中server_name支持的最大长度</span>
    server_names_hash_bucket_size <span class="token number">128</span><span class="token punctuation">;</span>
    include conf.d/*.conf<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置成服务-设置开机启动" tabindex="-1"><a class="header-anchor" href="#配置成服务-设置开机启动" aria-hidden="true">#</a> 配置成服务，设置开机启动</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> /etc/systemd/system/nginx.service <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
[Unit]
Description=Nginx(OpenResty ) - high performance web server
After=network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target
[Service]
User=root
Group=root
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/home/openresty/nginx/sbin/nginx -t -c /home/openresty/nginx/conf/nginx.conf
ExecStart=/home/openresty/nginx/sbin/nginx -c /home/openresty/nginx/conf/nginx.conf
ExecReload=/bin/kill -s HUP <span class="token variable">$MAINPID</span>
ExecStop=/bin/kill -s TERM <span class="token variable">$MAINPID</span>
LimitNOFILE=65535
[Install]
WantedBy=multi-user.target
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="重载-systemctl-启用nginx服务" tabindex="-1"><a class="header-anchor" href="#重载-systemctl-启用nginx服务" aria-hidden="true">#</a> 重载 systemctl&amp;启用Nginx服务</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl daemon-reload <span class="token operator">&amp;&amp;</span> systemctl <span class="token builtin class-name">enable</span> nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="下载解压keepalived、编译安装" tabindex="-1"><a class="header-anchor" href="#下载解压keepalived、编译安装" aria-hidden="true">#</a> 下载解压keepalived、编译安装</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /home/resource/
<span class="token function">wget</span> --no-check-certificate https://www.keepalived.org/software/keepalived-2.2.2.tar.gz
<span class="token function">tar</span> <span class="token parameter variable">-xf</span> keepalived-2.2.2.tar.gz
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> gcc openssl-devel popt-devel<span class="token comment">#安装编译依赖</span>
<span class="token builtin class-name">cd</span> keepalived-2.2.2
./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/home/keepalived/
<span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span>
<span class="token function">mkdir</span> /etc/keepalived
<span class="token comment">#，在安装好keepalived后有提供许多的配置文件模板（在keepalived/etc中）。启动Keepalived时默认会在/etc/keepalived目录中去找keepalived.conf文件，如果没有将配置文件放在该目录，启动Keepalived时需要使用-f选项来指定配置文件路径：</span>
<span class="token function">cp</span> /home/keepalived/etc/keepalived/keepalived.conf  /etc/keepalived/
<span class="token function">cp</span> /home/keepalived/etc/sysconfig/keepalived  /etc/sysconfig/
<span class="token function">ln</span> <span class="token parameter variable">-s</span> /home/keepalived/sbin/keepalived /usr/bin/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改keepalived配置文件" tabindex="-1"><a class="header-anchor" href="#修改keepalived配置文件" aria-hidden="true">#</a> 修改keepalived配置文件</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">vim</span> /etc/keepalived/keepalived.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="master" tabindex="-1"><a class="header-anchor" href="#master" aria-hidden="true">#</a> master</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span>/etc/keepalived/keepalived.conf<span class="token operator">&lt;&lt;</span><span class="token string">EOF
global_defs {
    router_id red_master137 #一个没重复的名字即可,主从不可重复
}
vrrp_script nginx_check { 
    script &quot;/etc/keepalived/nginx_check.sh&quot;  # 检测nginx是否运行
    interval 1 #脚本执行间隔，每1s检测一次
    weight 2
}
vrrp_instance VI_1 {
    state BACKUP
    #nopreempt  # 设置nopreempt防止抢占资源,即使master恢复了，也不会去抢，只有slave挂了，才到master
    interface ens192
    virtual_router_id 139 #局域网中有相同的virtual_router_id会失败
    priority 100      # 权重，master要大于slave
    advert_int 1      # 主备通讯时间间隔
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        10.23.188.139
    }
    track_script {
        nginx_check
    }
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="slave" tabindex="-1"><a class="header-anchor" href="#slave" aria-hidden="true">#</a> slave</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span>/etc/keepalived/keepalived.conf<span class="token operator">&lt;&lt;</span><span class="token string">EOF
global_defs {
    router_id red_slave138 #一个没重复的名字即可,主从不可重复
}
vrrp_script nginx_check {
    script &quot;/etc/keepalived/nginx_check.sh&quot; # 检测nginx是否运行
    interval 1 #脚本执行间隔，每1s检测一次
    weight 2
}
vrrp_instance VI_1 {
    state BACKUP
    #nopreempt  # 设置nopreempt防止抢占资源,即使master恢复了，也不会去抢，只有slave挂了，才到master
    interface ens192
    virtual_router_id 139 #局域网中有相同的virtual_router_id会失败
    priority 80      # 权重，master要大于slave
    advert_int 1       # 主备通讯时间间隔
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    virtual_ipaddress {
        10.23.188.139
    }
    track_script {
        nginx_check
    }
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="编写脚本停止脚本" tabindex="-1"><a class="header-anchor" href="#编写脚本停止脚本" aria-hidden="true">#</a> 编写脚本停止脚本</h3><p>当本机Nginx停止时，停止本机keepalived</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">touch</span> /etc/keepalived/nginx_check.sh
<span class="token function">chmod</span> +x /etc/keepalived/nginx_check.sh
<span class="token comment">#!/bin/bash</span>
pidof nginx
<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$?</span> <span class="token parameter variable">-ne</span> <span class="token number">0</span> <span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token keyword">then</span>
systemctl stop keepalived
<span class="token keyword">fi</span>
<span class="token comment">##############################</span>
<span class="token function">service</span> keepalived start
<span class="token comment"># 配置开机自启动</span>
systemctl <span class="token builtin class-name">enable</span> keepalived
<span class="token function">ps</span> <span class="token parameter variable">-aux</span> <span class="token operator">|</span><span class="token function">grep</span> keepalived
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h3><p>56、57 正常运行时，访问VIP时，显示master</p><blockquote><p>图片没了自己脑补 停止56，查看keepalived状态，也顺利的被脚本停掉了，再访问VIP时 图片没了自己脑补</p></blockquote><h3 id="添加模块" tabindex="-1"><a class="header-anchor" href="#添加模块" aria-hidden="true">#</a> 添加模块</h3><p>测试成功 假如用了一段时间，发现想要的功能忘了编译进去，可以重新编译。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@nginx1 /<span class="token punctuation">]</span><span class="token comment"># nginx -V  #查看现有的nginx编译的参数，在此基础上添加</span>
nginx version: openresty/1.19.9.1
built by gcc <span class="token number">4.8</span>.5 <span class="token number">20150623</span> <span class="token punctuation">(</span>Red Hat <span class="token number">4.8</span>.5-44<span class="token punctuation">)</span> <span class="token punctuation">(</span>GCC<span class="token punctuation">)</span> 
built with OpenSSL <span class="token number">1.0</span>.2k-fips  <span class="token number">26</span> Jan <span class="token number">2017</span>
TLS SNI support enabled
configure arguments: <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/home/openresty/nginx --with-cc-opt<span class="token operator">=</span>-O2 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/ngx_devel_kit-0.3.1 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/iconv-nginx-module-0.14 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/echo-nginx-module-0.62 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/xss-nginx-module-0.06 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/ngx_coolkit-0.2 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/set-misc-nginx-module-0.32 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/form-input-nginx-module-0.12 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/encrypted-session-nginx-module-0.08 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/srcache-nginx-module-0.32 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/ngx_lua-0.10.20 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/ngx_lua_upstream-0.07 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/headers-more-nginx-module-0.33 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/array-var-nginx-module-0.05 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/memc-nginx-module-0.19 --add-module<span class="token operator">=</span><span class="token punctuation">..</span>/ngx_stream_lua-0.0.10 --with-ld-opt<span class="token operator">=</span>-Wl,-rpath,/home/openresty/luajit/lib --pid-path<span class="token operator">=</span>/var/run/nginx.pid --http-log-path<span class="token operator">=</span>/var/log/nginx/access.log --error-log-path<span class="token operator">=</span>/var/log/nginx/error.log --with-pcre --with-http_v2_module --with-http_ssl_module --with-pcre-jit --with-compat --with-threads --with-file-aio --with-http_gunzip_module --with-http_realip_module --with-http_gzip_static_module --with-http_degradation_module --with-http_auth_request_module --with-http_stub_status_module --without-http_memcached_module --without-mail_pop3_module --without-mail_imap_module --without-mail_smtp_module --add-module<span class="token operator">=</span>/opt/extra_modules/nginx-auth-ldap --add-module<span class="token operator">=</span>/opt/extra_modules/nginx-sticky-module --add-module<span class="token operator">=</span>/opt/extra_modules/ngx_cache_purge --add-module<span class="token operator">=</span>/opt/extra_modules/ngx-fancyindex --add-module<span class="token operator">=</span>/opt/extra_modules/nginx_upstream_check_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再编译除了需要加上这些和新的模块，还需要添加--with-luajit参数，由于再次编译时没有生成动态链接库，需要手动链接。不然编译完后是不能使用,提示libluajit-5.1.so.2找不到，我已经上过当了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>root@nginx1 /<span class="token punctuation">]</span><span class="token comment"># nginx -V</span>
nginx: error <span class="token keyword">while</span> loading shared libraries: libluajit-5.1.so.2: cannot <span class="token function">open</span> shared object file: No such <span class="token function">file</span> or directory
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这就是重新编译时没有加--with-luajit参数 的下场</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/home/openresty <span class="token punctuation">\\</span>
--pid-path<span class="token operator">=</span>/var/run/nginx.pid <span class="token punctuation">\\</span>
--http-log-path<span class="token operator">=</span>/var/log/nginx/access.log <span class="token punctuation">\\</span>
--error-log-path<span class="token operator">=</span>/var/log/nginx/error.log <span class="token punctuation">\\</span>
--with-luajit <span class="token punctuation">\\</span>
--with-pcre <span class="token punctuation">\\</span>
--with-http_v2_module <span class="token punctuation">\\</span>
--with-http_ssl_module <span class="token punctuation">\\</span>
--with-pcre-jit <span class="token punctuation">\\</span>
--with-compat <span class="token punctuation">\\</span>
--with-threads <span class="token punctuation">\\</span>
--with-file-aio <span class="token punctuation">\\</span>
--with-luajit <span class="token punctuation">\\</span>  <span class="token comment">#新加的</span>
--with-http_gunzip_module <span class="token punctuation">\\</span>
--with-http_iconv_module <span class="token punctuation">\\</span>
--with-http_realip_module <span class="token punctuation">\\</span>
--with-http_gzip_static_module <span class="token punctuation">\\</span>
--with-http_degradation_module <span class="token punctuation">\\</span>
--with-http_auth_request_module <span class="token punctuation">\\</span>
--with-http_stub_status_module <span class="token punctuation">\\</span>
--without-lua_resty_memcached <span class="token punctuation">\\</span>
--without-http_memcached_module <span class="token punctuation">\\</span>
--without-lua_resty_mysql <span class="token punctuation">\\</span>
--without-lua_redis_parser <span class="token punctuation">\\</span>
--without-lua_resty_redis <span class="token punctuation">\\</span>
--without-http_redis_module <span class="token punctuation">\\</span>
--without-http_redis2_module <span class="token punctuation">\\</span>
--without-lua_rds_parser <span class="token punctuation">\\</span>
--without-http_rds_csv_module <span class="token punctuation">\\</span>
--without-http_rds_json_module <span class="token punctuation">\\</span>
--without-mail_pop3_module <span class="token punctuation">\\</span>
--without-mail_imap_module <span class="token punctuation">\\</span>
--without-mail_smtp_module <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/nginx-auth-ldap <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/nginx-sticky-module <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/ngx_cache_purge <span class="token punctuation">\\</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/ngx-fancyindex <span class="token punctuation">\\</span> <span class="token comment">#新加的</span>
--add-module<span class="token operator">=</span>/opt/extra_modules/nginx_upstream_check_module <span class="token punctuation">\\</span>
<span class="token parameter variable">-j2</span><span class="token comment">#用全部的两个核心去编译#我们的机器就俩核心</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后make，完成后/home/resource/openresty-1.19.9.1/build/nginx-1.19.9/objs这个路径下面会有一个nginx的可执行文件 备份好原来的，然后用这个替换。再用nginx -V检查新模块是不是已经加进来了。</p>`,44),l=[t];function o(p,c){return s(),a("div",null,l)}const r=n(i,[["render",o],["__file","安装OpenResty、Keepalived实现高可用.html.vue"]]);export{r as default};
