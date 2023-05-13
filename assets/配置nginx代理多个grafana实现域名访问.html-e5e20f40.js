import{_ as i,W as r,X as s,Y as e,Z as n,$ as d,a0 as l,D as t}from"./framework-b4edc447.js";const o={},v=l(`<h1 id="配置nginx代理多个grafana实现域名访问" tabindex="-1"><a class="header-anchor" href="#配置nginx代理多个grafana实现域名访问" aria-hidden="true">#</a> 配置nginx代理多个grafana实现域名访问</h1><h2 id="目的" tabindex="-1"><a class="header-anchor" href="#目的" aria-hidden="true">#</a> 目的：</h2><h4 id="通过nginx服务器对grafana进行代理-根据不同的路由可以访问不同的grafana" tabindex="-1"><a class="header-anchor" href="#通过nginx服务器对grafana进行代理-根据不同的路由可以访问不同的grafana" aria-hidden="true">#</a> 通过Nginx服务器对grafana进行代理，根据不同的路由可以访问不同的grafana</h4><p>修改Nginx配置(nginx.conf)文件，添加访问grafana的配置</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>     upstream grafana-it {
        server 10.31.140.28:3000 weight=1 max_fails=0 fail_timeout=0;
   keepalive 1000;
    }
     server {
        listen       80;
        server_name  grafana-it.int.apple.com;
        charset UTF-8;
        access_log  /var/log/nginx/grafana-it.int.apple.com_access.log  main;
        error_log  /var/log/nginx/grafana-it.int.apple.com_error.log  error;
 
        location / {
            proxy_redirect off;
            proxy_pass http://grafana-it;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        location /oldgrafana {
            proxy_pass http://10.23.188.72:3000;
            proxy_redirect default;
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_buffer_size 16k;
            proxy_buffering on;
            proxy_busy_buffers_size 64k;
            proxy_max_temp_file_size 1024m;
            proxy_connect_timeout 30;
            proxy_send_timeout 60;
            proxy_read_timeout 60;
            proxy_next_upstream error timeout invalid_header http_502;
    }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="修改grafana服务器的配置文件-grafana-ini" tabindex="-1"><a class="header-anchor" href="#修改grafana服务器的配置文件-grafana-ini" aria-hidden="true">#</a> 修改grafana服务器的配置文件(grafana.ini)</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[server]
domain = 填写你的域名地址
root_url = %(protocol)s://%(domain)s:%(http_port)s/oldgrafana/
serve_from_sub_path = true  #false成true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),c={href:"https://grafana.com/tutorials/run-grafana-behind-a-proxy/#1",target:"_blank",rel:"noopener noreferrer"};function _(m,u){const a=t("ExternalLinkIcon");return r(),s("div",null,[v,e("p",null,[n("详细参考"),e("a",c,[n("官网文档"),d(a)])])])}const x=i(o,[["render",_],["__file","配置nginx代理多个grafana实现域名访问.html.vue"]]);export{x as default};
