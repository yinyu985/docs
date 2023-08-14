# 配置nginx代理多个grafana实现域名访问
## 目的：

#### 通过Nginx服务器对grafana进行代理，根据不同的路由可以访问不同的grafana

修改Nginx配置(nginx.conf)文件，添加访问grafana的配置

```
     upstream grafana-it {
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
```

## 修改grafana服务器的配置文件(grafana.ini)

```
[server]
domain = 填写你的域名地址
root_url = %(protocol)s://%(domain)s:%(http_port)s/oldgrafana/
serve_from_sub_path = true  #false成true
```

详细参考[官网文档](https://grafana.com/tutorials/run-grafana-behind-a-proxy/#1)