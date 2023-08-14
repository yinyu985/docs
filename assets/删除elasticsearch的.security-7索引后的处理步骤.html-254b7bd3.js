import{_ as s,W as e,X as a,a0 as n}from"./framework-b4edc447.js";const t={},i=n(`<h1 id="删除elasticsearch的-security-7索引后的处理步骤" tabindex="-1"><a class="header-anchor" href="#删除elasticsearch的-security-7索引后的处理步骤" aria-hidden="true">#</a> 删除elasticsearch的.security-7索引后的处理步骤</h1><p>搭建了一套新环境，为了测试kibana配置ldap，并且对es中超大的索引进行导出存档。 在搭建的过程中发现，kiban连接es失败，网上查找资料后发现解决方案，发现只要删除.security-7这个索引就能够清除之前设置的密码，重新设置。 .security-7索引中应该包含了用户登录等一些信息。 利用curl命令执行删除索引的操作时，删除了正式环境的该索引，删除后，一切认证相关的功能全都失效，kibana无法登录，查找资料进行恢复。 编辑<code>elasticsearch.yml</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>cluster.name: es_cluster
node.name: elasticssearch-master1
node.master: <span class="token boolean">true</span>
path.data: /data/elasticsearch_master/data
path.logs: /data/elasticsearch_master/logs
http.port: <span class="token number">9200</span>
network.host: <span class="token number">0.0</span>.0.0
cluster.initial_master_nodes: <span class="token punctuation">[</span><span class="token string">&quot;10.**.5.22&quot;</span><span class="token punctuation">]</span>
discovery.zen.ping.unicast.hosts: <span class="token punctuation">[</span><span class="token string">&quot;10.**.5.22&quot;</span>, <span class="token string">&quot;10.**.5.20&quot;</span>, <span class="token string">&quot;10.**.5.**&quot;</span><span class="token punctuation">]</span>
discovery.zen.minimum_master_nodes: <span class="token number">2</span>
discovery.zen.ping_timeout: 60s
search.max_buckets: <span class="token number">2000000</span>
http.cors.enabled: <span class="token boolean">true</span>
http.cors.allow-origin: <span class="token string">&quot;*&quot;</span>
http.cors.allow-headers: <span class="token string">&quot;Authorization,X-Requested-With,Content-Length,Content-Type&quot;</span>
xpack.security.enabled: <span class="token boolean">true</span>   <span class="token comment">#将这个设置成fasle,将下面xpack相关的都注释掉。</span>
xpack.security.transport.ssl.enabled: <span class="token boolean">true</span>
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: /data/elasticsearch_master/config/elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: /data/elasticsearch_master/config/elastic-certificates.p12
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建一个超级用户，这个用户不会存进索引所以不受影响，</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>bin/elasticsearch-users <span class="token function">useradd</span> restore_user <span class="token parameter variable">-p</span> XXXXXXXXXXXX <span class="token parameter variable">-r</span> superuser
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>用这个用户对所有security相关的索引全部删除</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> <span class="token function">curl</span> <span class="token parameter variable">-u</span> restore_user <span class="token parameter variable">-X</span> DELETE <span class="token string">&quot;localhost:9200/.security-*&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>恢复刚才对<code>elasticsearch.yml</code>执行的编辑操作 重新设置全部密码，就能够正常打开kibana界面了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>bin/elasticsearch-setup-passwords interactive
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,9),c=[i];function r(l,o){return e(),a("div",null,c)}const u=s(t,[["render",r],["__file","删除elasticsearch的.security-7索引后的处理步骤.html.vue"]]);export{u as default};
