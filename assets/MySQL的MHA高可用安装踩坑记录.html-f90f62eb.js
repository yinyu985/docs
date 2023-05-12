import{_ as i,W as l,X as t,a0 as r,Y as s,Z as a,$ as e,a1 as p,D as o}from"./framework-ab2cdc09.js";const c={},d=s("p",null,"MHA是一种MySQL高可用解决方案，可用于Position或者GTID模式下的主从复制架构，可以在主从故障时自动完成主从切换，并且最大程度的去保持数据一致性。MHA由管理节点（Manager）和数据节点（Node）组成，一套MHA Manager可以管理多套MySQL集群。当Manager发现MySQL Master出现故障时自动将一个拥有最新数据的Slave提升为Master，并让另外的Slave重新指向到新的Master上来。",-1),m=p(`<blockquote><p>在MySQL故障切换过程中，MHA能做到在0~30秒之内自动完成数据库的故障切换操作，并且在进行故障切换的过程中，MHA能在最大程度上保证数据的一致性，以达到真正意义上的高可用。</p><p><strong>该软件由两部分组成：MHA Manager（管理节点）和MHA Node（数据节点）</strong>。MHA Manager可以单独部署在一台独立的机器上管理多个master-slave集群，也可以部署在一台slave节点上。MHA Node运行在每台MySQL服务器上，MHA Manager会定时探测集群中的master节点，当master出现故障时，它可以自动将最新数据的slave提升为新的master，然后将所有其他的slave重新指向新的master。整个故障转移过程对应用程序完全透明。</p><p>在MHA自动故障切换过程中，MHA试图从宕机的主服务器上保存二进制日志，最大程度的保证数据的不丢失，但这并不总是可行的。例如，如果主服务器硬件故障或无法通过ssh访问，MHA没法保存二进制日志，只进行故障转移而丢失了最新的数据。使用MySQL 5.5的半同步复制，可以大大降低数据丢失的风险。MHA可以与半同步复制结合起来。如果只有一个slave已经收到了最新的二进制日志，MHA可以将最新的二进制日志应用于其他所有的slave服务器上，因此可以保证所有节点的数据一致性。</p><p>目前MHA主要支持一主多从的架构，要搭建MHA,要求一个复制集群中必须最少有三台数据库服务器，一主二从，即一台充当master，一台充当备用master，另外一台充当从库，因为至少需要三台服务器</p></blockquote><h3 id="准备工作" tabindex="-1"><a class="header-anchor" href="#准备工作" aria-hidden="true">#</a> 准备工作</h3><h4 id="编写hosts、hostname" tabindex="-1"><a class="header-anchor" href="#编写hosts、hostname" aria-hidden="true">#</a> 编写hosts、hostname</h4><p>让集群里的每台机器都互相认识（如无特殊说明，以下操作均要在三台机器执行）</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>三台机器分别设置hostname，然后添加hosts。
hostnamectl set-hostname mysql_master
hostnamectl set-hostname mysql_slave1
hostnamectl set-hostname mysql_slave2
<span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> /etc/hosts <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
10.23.188.107  mysql_master
10.23.188.91   mysql_slave1
10.23.188.92   mysql_slave2
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置免密登录" tabindex="-1"><a class="header-anchor" href="#配置免密登录" aria-hidden="true">#</a> 配置免密登录</h4><p>生成公钥，让三台机器可以互相免密登录，这个特性也让MHA变得看起来不是特别安全。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>ssh-keygen <span class="token parameter variable">-t</span> rsa
一路回车
<span class="token keyword">for</span> <span class="token for-or-select variable">i</span> <span class="token keyword">in</span> mysql_master mysql_slave1 mysql_slave2<span class="token punctuation">;</span><span class="token keyword">do</span> ssh-copy-id <span class="token variable">$i</span><span class="token punctuation">;</span><span class="token keyword">done</span>
for循环发送到三台机器
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="安装mysql" tabindex="-1"><a class="header-anchor" href="#安装mysql" aria-hidden="true">#</a> 安装MySQL</h4><p>CentOS 7将MySQL从默认的yum源中移除，用mariadb代替了,所以单独导入安装源</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>查看系统自带的Mariadb
<span class="token function">rpm</span> -qa<span class="token operator">|</span><span class="token function">grep</span> <span class="token parameter variable">-i</span> mariadb
卸载系统自带的Mariadb
<span class="token function">rpm</span> -qa<span class="token operator">|</span><span class="token function">grep</span> <span class="token parameter variable">-i</span> mariadb <span class="token operator">|</span><span class="token function">xargs</span> <span class="token function">rpm</span> <span class="token parameter variable">-e</span>
导入安装源
<span class="token function">rpm</span> <span class="token parameter variable">-ivh</span> https://repo.mysql.com/mysql57-community-release-el7-9.noarch.rpm
yum <span class="token function">install</span> mysql-community-server
报错
<span class="token string">&quot;MySQL 5.7 Community Server&quot;</span> 的 GPG 密钥已安装，但是不适用于此软件包。请检查源的公钥 URL 是否配置正确。
失败的软件包是：mysql-community-libs-compat-5.7.37-1.el7.x86_64
yum <span class="token function">install</span> mysql-community-server <span class="token parameter variable">--nogpgcheck</span>
加入--nogpgcheck配置跳过校验。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="mysql配置" tabindex="-1"><a class="header-anchor" href="#mysql配置" aria-hidden="true">#</a> MySQL配置</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">touch</span> /etc/my.cnf
<span class="token function">chmod</span> <span class="token number">644</span> /etc/my.cnf
<span class="token function">cat</span> /etc/my.cnf
<span class="token punctuation">[</span>client<span class="token punctuation">]</span>
port <span class="token operator">=</span> <span class="token number">3307</span>
socket <span class="token operator">=</span> /tmp/mysql.sock
<span class="token comment">#character-set-server = utf8</span>
<span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
port <span class="token operator">=</span> <span class="token number">3307</span>
socket <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
pid-file <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
user <span class="token operator">=</span> mysql
bind-address <span class="token operator">=</span> <span class="token number">0.0</span>.0.0
server-id <span class="token operator">=</span> <span class="token number">1</span> 
skip-external-locking 
explicit_defaults_for_timestamp
datadir <span class="token operator">=</span> /home/mysql_data
init-connect <span class="token operator">=</span> <span class="token string">&#39;SET NAMES utf8&#39;</span>
<span class="token comment">#character-set-server = utf8</span>
<span class="token comment">#skip-name-resolve</span>
back_log <span class="token operator">=</span> <span class="token number">300</span>
max_connections <span class="token operator">=</span> <span class="token number">1000</span>
max_connect_errors <span class="token operator">=</span> <span class="token number">6000</span>
open_files_limit <span class="token operator">=</span> <span class="token number">65535</span>
table_open_cache <span class="token operator">=</span> <span class="token number">128</span>
max_allowed_packet <span class="token operator">=</span> 4M
binlog_cache_size <span class="token operator">=</span> 1M
max_heap_table_size <span class="token operator">=</span> 8M
tmp_table_size <span class="token operator">=</span> 16M
read_buffer_size <span class="token operator">=</span> 2M
read_rnd_buffer_size <span class="token operator">=</span> 8M
sort_buffer_size <span class="token operator">=</span> 8M
join_buffer_size <span class="token operator">=</span> 8M
<span class="token comment">#key_buffer_size = 4M</span>
thread_cache_size <span class="token operator">=</span> <span class="token number">8</span>
query_cache_type <span class="token operator">=</span> <span class="token number">1</span>
query_cache_size <span class="token operator">=</span> 8M
query_cache_limit <span class="token operator">=</span> 2M
ft_min_word_len <span class="token operator">=</span> <span class="token number">4</span>
performance_schema <span class="token operator">=</span> <span class="token number">0</span>
explicit_defaults_for_timestamp
lower_case_table_names <span class="token operator">=</span> <span class="token number">1</span>
skip-external-locking
default_storage_engine <span class="token operator">=</span> InnoDB
innodb_file_per_table <span class="token operator">=</span> <span class="token number">1</span>
innodb_open_files <span class="token operator">=</span> <span class="token number">500</span>
innodb_buffer_pool_size <span class="token operator">=</span> 128M
innodb_write_io_threads <span class="token operator">=</span> <span class="token number">4</span>
innodb_read_io_threads <span class="token operator">=</span> <span class="token number">4</span>
innodb_thread_concurrency <span class="token operator">=</span> <span class="token number">0</span>
innodb_purge_threads <span class="token operator">=</span> <span class="token number">1</span>
innodb_flush_log_at_trx_commit <span class="token operator">=</span> <span class="token number">2</span>
innodb_log_buffer_size <span class="token operator">=</span> 2M
innodb_log_file_size <span class="token operator">=</span> 32M
innodb_log_files_in_group <span class="token operator">=</span> <span class="token number">3</span>
innodb_max_dirty_pages_pct <span class="token operator">=</span> <span class="token number">90</span>
innodb_lock_wait_timeout <span class="token operator">=</span> <span class="token number">120</span>
bulk_insert_buffer_size <span class="token operator">=</span> 8M
myisam_sort_buffer_size <span class="token operator">=</span> 8M
myisam_max_sort_file_size <span class="token operator">=</span> 10G
interactive_timeout <span class="token operator">=</span> <span class="token number">28800</span>
wait_timeout <span class="token operator">=</span> <span class="token number">28800</span>
skip-ssl
-------------------------------------------------------------------------------------------------------------------

systemctl start mysqld
systemctl status mysqld
systemctl <span class="token builtin class-name">enable</span> mysqld
<span class="token function">grep</span> <span class="token string">&#39;temporary password&#39;</span> /var/log/mysqld.log
<span class="token comment">#查看MySQL安装时的默认随机密码</span>
mysql <span class="token parameter variable">-u</span> root -p<span class="token string">&#39;随机密码&#39;</span>
ALTER <span class="token environment constant">USER</span> <span class="token string">&#39;root&#39;</span>@<span class="token string">&#39;localhost&#39;</span> IDENTIFIED BY <span class="token string">&#39;OMxZrf4_k&#39;</span><span class="token punctuation">;</span>
<span class="token comment">#修改root用户密码</span>
GRANT ALL PRIVILEGES ON *.* TO <span class="token string">&#39;root&#39;</span>@<span class="token string">&#39;%&#39;</span> IDENTIFIED BY <span class="token string">&#39;OMxZrf4_k&#39;</span> WITH GRANT OPTION<span class="token punctuation">;</span>
<span class="token comment">#设置允许root用户远程登录</span>
FLUSH PRIVILEGES<span class="token punctuation">;</span>
<span class="token comment">#刷新权限</span>
SELECT User, Host FROM user<span class="token punctuation">;</span>
<span class="token comment">#检查root用户登录权限是不是%</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>三台机器的角色分别是，master，备用master，slave。mha4mysql-node需要在三台机器分别安装，mha4mysql-manager为了能够在master出现故障时，切换到备用master，所以安装在slave。</p><table><thead><tr><th style="text-align:left;">角色</th><th>master</th><th>Slave1</th><th>Slave2</th></tr></thead><tbody><tr><td style="text-align:left;"></td><td>msyql5.7.40</td><td>msyql5.7.40</td><td>msyql5.7.40</td></tr><tr><td style="text-align:left;"></td><td>mha4mysql-node0.58</td><td>mha4mysql-node0.58</td><td>mha4mysql-node0.58</td></tr><tr><td style="text-align:left;"></td><td></td><td></td><td>mha4mysql-manager0.58</td></tr><tr><td style="text-align:left;"></td><td>10.23.188.107</td><td>10.23.188.91</td><td>10.23.188.92</td></tr></tbody></table><h3 id="配置mysql" tabindex="-1"><a class="header-anchor" href="#配置mysql" aria-hidden="true">#</a> 配置MySQL</h3><p>安装MySQL插件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#进入数据库执行如下命名，查询MySQL插件地址</span>
mysql<span class="token operator">&gt;</span> show variables like <span class="token string">&#39;%plugin_dir%&#39;</span><span class="token punctuation">;</span>
+---------------+--------------------------+
<span class="token operator">|</span> Variable_name <span class="token operator">|</span> Value                    <span class="token operator">|</span>
+---------------+--------------------------+
<span class="token operator">|</span> plugin_dir    <span class="token operator">|</span> /usr/lib64/mysql/plugin/ <span class="token operator">|</span>
+---------------+--------------------------+
mysql<span class="token operator">&gt;</span> <span class="token function">install</span> plugin rpl_semi_sync_master SONAME <span class="token string">&#39;semisync_master.so&#39;</span><span class="token punctuation">;</span>
mysql<span class="token operator">&gt;</span> <span class="token function">install</span> plugin rpl_semi_sync_slave SONAME <span class="token string">&#39;semisync_slave.so&#39;</span><span class="token punctuation">;</span>
mysql<span class="token operator">&gt;</span> show plugins<span class="token punctuation">;</span>
<span class="token comment"># 或者</span>
mysql<span class="token operator">&gt;</span> <span class="token keyword">select</span> * from information_schema.plugins<span class="token punctuation">;</span>
<span class="token comment">#检查最下方是否有刚才安装的两个插件</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查看半同步相关信息" tabindex="-1"><a class="header-anchor" href="#查看半同步相关信息" aria-hidden="true">#</a> 查看半同步相关信息</h4><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>mysql&gt; show variables like &#39;%rpl_semi_sync%&#39;;
+-------------------------------------------+------------+
| Variable_name                             | Value      |
+-------------------------------------------+------------+
| rpl_semi_sync_master_enabled              | OFF        |
| rpl_semi_sync_master_timeout              | 10000      |
| rpl_semi_sync_master_trace_level          | 32         |
| rpl_semi_sync_master_wait_for_slave_count | 1          |
| rpl_semi_sync_master_wait_no_slave        | ON         |
| rpl_semi_sync_master_wait_point           | AFTER_SYNC |
| rpl_semi_sync_slave_enabled               | OFF        |
| rpl_semi_sync_slave_trace_level           | 32         |
+-------------------------------------------+------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到半同步插件还是未启用的off状态，所以需要修改my.cnf配置文件（加入以下内容），如下： master和slave1加入如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>log-error<span class="token operator">=</span>/usr/local/mysql/data/mysqld.err
log-bin<span class="token operator">=</span>mysql-bin
<span class="token assign-left variable">binlog_format</span><span class="token operator">=</span>mixed
<span class="token assign-left variable">rpl_semi_sync_master_enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">rpl_semi_sync_master_timeout</span><span class="token operator">=</span><span class="token number">1000</span>
<span class="token assign-left variable">rpl_semi_sync_slave_enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token assign-left variable">relay_log_purge</span><span class="token operator">=</span><span class="token number">0</span>
relay-log <span class="token operator">=</span> relay-bin
relay-log-index <span class="token operator">=</span> slave-relay-bin.index
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>slave2加入如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>log-bin <span class="token operator">=</span> mysql-bin
relay-log <span class="token operator">=</span> relay-bin
relay-log-index <span class="token operator">=</span> slave-relay-bin.index
read_only <span class="token operator">=</span> <span class="token number">1</span>
<span class="token assign-left variable">rpl_semi_sync_slave_enabled</span><span class="token operator">=</span><span class="token number">1</span>
<span class="token comment">#由于slave2只是用来做一个slave主机，所以无需开启master的半同步</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="定时清理中继日志" tabindex="-1"><a class="header-anchor" href="#定时清理中继日志" aria-hidden="true">#</a> 定时清理中继日志</h4><p>在配置主从复制中，由于主和备主这两台主机上设置了参数relay_log_purge=0（表示不自动清除中继日志），所以slave节点需要定期删除中继日志，建议每个slave节点删除中继日志的时间错开。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">crontab</span> <span class="token parameter variable">-e</span>
<span class="token number">0</span> <span class="token number">5</span> * * * /usr/local/bin/purge_relay_logs - <span class="token parameter variable">-user</span><span class="token operator">=</span>root <span class="token parameter variable">--password</span><span class="token operator">=</span>密码 <span class="token parameter variable">--port</span><span class="token operator">=</span>端口 <span class="token parameter variable">--disable_relay_log_purge</span> <span class="token operator">&gt;&gt;</span> /var/log/purge_relay.log <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>更改配置文件后，需要执行以下命令进行重启MySQL，使配置文件生效。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl restart mysqld
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看半同步状态，确认已开启：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>mysql&gt; show variables like &#39;%rpl_semi_sync%&#39;;       #查看半同步是否开启
+-------------------------------------------+------------+
| Variable_name                             | Value      |
+-------------------------------------------+------------+
| rpl_semi_sync_master_enabled              | ON         |    #这个值要为ON
| rpl_semi_sync_master_timeout              | 1000       |
| rpl_semi_sync_master_trace_level          | 32         |
| rpl_semi_sync_master_wait_for_slave_count | 1          |
| rpl_semi_sync_master_wait_no_slave        | ON         |
| rpl_semi_sync_master_wait_point           | AFTER_SYNC |
| rpl_semi_sync_slave_enabled               | ON         |    #这个值也要为ON。
| rpl_semi_sync_slave_trace_level           | 32         |
+-------------------------------------------+------------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><ul><li>rpl_semi_sync_master_status ：显示主服务是异步复制模式还是半同步复制模式，ON为半同步；</li><li>rpl_semi_sync_master_clients ：显示有多少个从服务器配置为半同步复制模式；</li><li>rpl_semi_sync_master_yes_tx ：显示从服务器确认成功提交的数量</li><li>rpl_semi_sync_master_no_tx ：显示从服务器确认不成功提交的数量</li><li>rpl_semi_sync_master_tx_avg_wait_time ：事务因开启 semi_sync ，平均需要额外等待的时间</li><li>rpl_semi_sync_master_net_avg_wait_time ：事务进入等待队列后，到网络平均等待时间</li></ul></blockquote><h4 id="创建相关用户" tabindex="-1"><a class="header-anchor" href="#创建相关用户" aria-hidden="true">#</a> 创建相关用户</h4><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>master主机操作如下：
grant replication slave on *.* to mharep@&#39;10.23.188.%&#39; identified by &#39;vfZ5u7o_H&#39;;
# 创建用于同步的用户
grant all on *.* to manager@&#39;10.23.188.%&#39; identified by &#39;vfZ5u7o_H&#39;;
# 创建用户mha的manager监控的用户
# 查看master二进制相关的信息
mysql&gt; show master status\\G
*************************** 1. row ***************************
             File: mysql-bin.000001
         Position: 744
     Binlog_Do_DB: 
 Binlog_Ignore_DB: 
Executed_Gtid_Set: 
1 row in set (0.00 sec)

slave1主机操作如下：
grant replication slave on *.* to mharep@&#39;10.23.188.%&#39; identified by &#39;vfZ5u7o_H&#39;;
grant all on *.* to manager@&#39;10.23.188.%&#39; identified by &#39;vfZ5u7o_H&#39;;

slave2主机操作如下
由于slave2无需做备主，所以不用创建用于同步数据的账户
grant all on *.* to manager@&#39;10.23.188.%&#39; identified by &#39;vfZ5u7o_H&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置主从复制" tabindex="-1"><a class="header-anchor" href="#配置主从复制" aria-hidden="true">#</a> 配置主从复制</h4><p>以下操作需要在slave1和slave2主机上分别执行一次，以便同步master主机的数据。</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>#指定master主机的相关信息
mysql&gt; change master to
    -&gt; master_host=&#39;10.23.188.107&#39;,
    -&gt; master_port=3307,
    -&gt; master_user=&#39;mharep&#39;,
    -&gt; master_password=&#39;vfZ5u7o_H&#39;,
    -&gt; master_log_file = &#39;mysql-bin.000001&#39;,     #这是在master主机上查看到的二进制日志名
    -&gt; master_log_pos=744;     #同上，这是查看到的二进制日志的position
Query OK, 0 rows affected, 2 warnings (0.01 sec)

mysql&gt; start slave;      #启动slave
Query OK, 0 rows affected (0.00 sec)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后查看slave主机的状态 在master主机上查看半同步相关信息，会发现同步的client已经变成了2</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>安装基础依赖包
在所有机器上执行:
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> perl-ExtUtils-CBuilder perl-ExtUtils-MakeMaker perl-CPAN perl-DBD-MySQL perl-Config-Tiny perl-Log-Dispatch perl-Parallel-ForkManager perl-Time-HiRes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="安装mha-node" tabindex="-1"><a class="header-anchor" href="#安装mha-node" aria-hidden="true">#</a> 安装MHA-node</h3><h3 id="注-需要mha-node需要在所有节点安装-包括manager主机节点" tabindex="-1"><a class="header-anchor" href="#注-需要mha-node需要在所有节点安装-包括manager主机节点" aria-hidden="true">#</a> <strong>注：需要MHA-node需要在所有节点安装（包括manager主机节点）</strong></h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#下载包</span>
<span class="token function">wget</span> https://github.com/yoshinorim/mha4mysql-node/releases/download/v0.58/mha4mysql-node-0.58.tar.gz
<span class="token comment">#安装</span>
<span class="token function">tar</span> zxf mha4mysql-node-0.58.tar.gz 
<span class="token builtin class-name">cd</span> mha4mysql-node-0.58/
perl Makefile.PL 
<span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注：接下来的所有操作，如果没有特别标注，则只需要在manager主机节点上执行即可。</strong></p><h3 id="安装mha-manager" tabindex="-1"><a class="header-anchor" href="#安装mha-manager" aria-hidden="true">#</a> 安装MHA-manager</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#下载包</span>
<span class="token function">wget</span> https://github.com/yoshinorim/mha4mysql-manager/releases/download/v0.58/mha4mysql-manager-0.58.tar.gz
<span class="token comment">#安装</span>
<span class="token function">tar</span> zxf mha4mysql-manager-0.58.tar.gz 
<span class="token builtin class-name">cd</span> mha4mysql-manager-0.58/
perl Makefile.PL 
<span class="token function">make</span> <span class="token operator">&amp;&amp;</span> <span class="token function">make</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建相应目录及复制所需文件" tabindex="-1"><a class="header-anchor" href="#创建相应目录及复制所需文件" aria-hidden="true">#</a> 创建相应目录及复制所需文件</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> /etc/masterha
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /masterha/app1
<span class="token function">mkdir</span> /scripts
<span class="token function">cp</span> samples/conf/* /etc/masterha/
<span class="token function">cp</span> samples/scripts/* /scripts/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改mha-manager配置文件" tabindex="-1"><a class="header-anchor" href="#修改mha-manager配置文件" aria-hidden="true">#</a> 修改mha-manager配置文件</h3><p>注：manager共有两个主要的配置文件，一个是通用默认的，一个是单独的。需要将默认通用的配置文件的内容清空，如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#清空默认的配置文件</span>
<span class="token operator">&gt;</span> /etc/masterha/masterha_default.cnf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>cat<span class="token operator">&gt;</span> /etc/masterha/app1.cnf <span class="token operator">&lt;&lt;</span><span class="token string">EPF
[server default]
manager_workdir=/masterha/app1   #指定工作目录
manager_log=/masterha/app1/manager.log    #指定日志文件
user=root    #指定manager管理数据库节点所使用的用户名
password=OMxZrf4_k    #对应的是上面用户的密码
ssh_user=root      #指定配置了ssh免密登录的系统用户
repl_user=mharep    #指定用于同步数据的用户名
repl_password=vfZ5u7o_H   #对应的是上面同步用户的 密码
ping_interval=1   #设置监控主库，发送ping包的时间间隔，默认是3秒，尝试三次没有回应时自动进行切换
master_ip_failover_script=/scripts/master_ip_failover
[server1]
hostname=10.23.188.91
port=3307
master_binlog_dir=/home/mysql_data/
candidate_master=1   #设置为候选master

[server2]
hostname=10.23.188.107
port=3307
master_binlog_dir=/home/mysql_data/
candidate_master=1   #设置为候选master，设置该参数后，发生主从切换以后将会将此库提升为主库

[server3]
hostname=10.23.188.92
port=3307
master_binlog_dir=/home/mysql_data/
no_master=1   #设置的不为备选主库
EPF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：MHA在读取配置文件时，不会忽略注释，所以，看完了看懂了把注释删除。 验证SSH有效性：</p><blockquote><p>masterha_check_ssh --global_conf=/etc/masterha/masterha_default.cnf --conf=/etc/masterha/app1.cnf</p></blockquote><p>验证集群复制的有效性（MySQL必须都启动）：</p><blockquote><p>masterha_check_repl --global_conf=/etc/masterha/masterha_default.cnf --conf=/etc/masterha/app1.cnf</p></blockquote><p>启动masterha_manager ：</p><blockquote><p>nohup masterha_manager --conf=/etc/masterha/app1.cnf --remove_dead_master_conf --ignore_last_failover &amp;&gt; /var/log/mha_manager.log &amp;</p></blockquote><blockquote><p><code>--ignore_last_failover</code> 忽略上次切换。<code>MHA</code>每次故障切换后都会生成一个<code>app1.failover.complete</code>这样的文件，如果不加这个参数，需要删除这个文件才能再次启动</p></blockquote><h3 id="配置vip" tabindex="-1"><a class="header-anchor" href="#配置vip" aria-hidden="true">#</a> 配置VIP</h3><p>vip配置可以采用两种方式，一种通过keepalived的方式管理虚拟ip的浮动；另外一种通过脚本方式启动虚拟ip的方式（即不需要keepalived或者heartbeat类似的软件）。为了防止脑裂发生，推荐生产环境采用脚本的方式来管理虚拟ip，而不是使用keepalived来完成。</p><h4 id="创建一个vip" tabindex="-1"><a class="header-anchor" href="#创建一个vip" aria-hidden="true">#</a> 创建一个VIP</h4><p>ens192是机器的网卡名，根据具体情况写。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>/sbin/ifconfig ens192:1 <span class="token number">10.23</span>.188.96/24 netmask <span class="token number">255.255</span>.255.0 up
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>注意：vip需要设置一个，当前网络内没有其他人用的ip</p><h4 id="关闭一个vip" tabindex="-1"><a class="header-anchor" href="#关闭一个vip" aria-hidden="true">#</a> 关闭一个vip</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> /sbin/ifconfig eth0:1 down
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="编写脚本实现虚拟漂移" tabindex="-1"><a class="header-anchor" href="#编写脚本实现虚拟漂移" aria-hidden="true">#</a> 编写脚本实现虚拟漂移</h4><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token comment">#!/usr/bin/env perl</span>
<span class="token keyword">use</span> strict<span class="token punctuation">;</span>
<span class="token keyword">use</span> warnings FATAL <span class="token operator">=&gt;</span> <span class="token string">&#39;all&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">use</span> Getopt<span class="token punctuation">:</span><span class="token punctuation">:</span>Long<span class="token punctuation">;</span>

<span class="token keyword">my</span> <span class="token punctuation">(</span>
    <span class="token variable">$command</span><span class="token punctuation">,</span>          <span class="token variable">$ssh_user</span><span class="token punctuation">,</span>        <span class="token variable">$orig_master_host</span><span class="token punctuation">,</span> <span class="token variable">$orig_master_ip</span><span class="token punctuation">,</span>
    <span class="token variable">$orig_master_port</span><span class="token punctuation">,</span> <span class="token variable">$new_master_host</span><span class="token punctuation">,</span> <span class="token variable">$new_master_ip</span><span class="token punctuation">,</span>    <span class="token variable">$new_master_port</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">my</span> <span class="token variable">$vip</span> <span class="token operator">=</span> <span class="token string">&#39;10.23.188.96/24&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">my</span> <span class="token variable">$key</span> <span class="token operator">=</span> <span class="token string">&#39;1&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">my</span> <span class="token variable">$ssh_start_vip</span> <span class="token operator">=</span> <span class="token string">&quot;/sbin/ifconfig ens192:$key $vip&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">my</span> <span class="token variable">$ssh_stop_vip</span> <span class="token operator">=</span> <span class="token string">&quot;/sbin/ifconfig ens192:$key down&quot;</span><span class="token punctuation">;</span>

GetOptions<span class="token punctuation">(</span>
    <span class="token string">&#39;command=s&#39;</span>          <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$command</span><span class="token punctuation">,</span>
    <span class="token string">&#39;ssh_user=s&#39;</span>         <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$ssh_user</span><span class="token punctuation">,</span>
    <span class="token string">&#39;orig_master_host=s&#39;</span> <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$orig_master_host</span><span class="token punctuation">,</span>
    <span class="token string">&#39;orig_master_ip=s&#39;</span>   <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$orig_master_ip</span><span class="token punctuation">,</span>
    <span class="token string">&#39;orig_master_port=i&#39;</span> <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$orig_master_port</span><span class="token punctuation">,</span>
    <span class="token string">&#39;new_master_host=s&#39;</span>  <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$new_master_host</span><span class="token punctuation">,</span>
    <span class="token string">&#39;new_master_ip=s&#39;</span>    <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$new_master_ip</span><span class="token punctuation">,</span>
    <span class="token string">&#39;new_master_port=i&#39;</span>  <span class="token operator">=&gt;</span> <span class="token operator">\\</span><span class="token variable">$new_master_port</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

exit <span class="token variable">&amp;main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">sub</span> <span class="token function">main</span> <span class="token punctuation">{</span>

    <span class="token keyword">print</span> <span class="token string">&quot;\\n\\nIN SCRIPT TEST====$ssh_stop_vip==$ssh_start_vip===\\n\\n&quot;</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span> <span class="token variable">$command</span> <span class="token operator">eq</span> <span class="token string">&quot;stop&quot;</span> <span class="token operator">||</span> <span class="token variable">$command</span> <span class="token operator">eq</span> <span class="token string">&quot;stopssh&quot;</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">my</span> <span class="token variable">$exit_code</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token keyword">eval</span> <span class="token punctuation">{</span>
            <span class="token keyword">print</span> <span class="token string">&quot;Disabling the VIP on old master: $orig_master_host \\n&quot;</span><span class="token punctuation">;</span>
            <span class="token variable">&amp;stop_vip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token variable">$exit_code</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token variable">$@</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            warn <span class="token string">&quot;Got Error: $@\\n&quot;</span><span class="token punctuation">;</span>
            exit <span class="token variable">$exit_code</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        exit <span class="token variable">$exit_code</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">elsif</span> <span class="token punctuation">(</span> <span class="token variable">$command</span> <span class="token operator">eq</span> <span class="token string">&quot;start&quot;</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">my</span> <span class="token variable">$exit_code</span> <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>
        <span class="token keyword">eval</span> <span class="token punctuation">{</span>
            <span class="token keyword">print</span> <span class="token string">&quot;Enabling the VIP - $vip on the new master - $new_master_host \\n&quot;</span><span class="token punctuation">;</span>
            <span class="token variable">&amp;start_vip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token variable">$exit_code</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token variable">$@</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            warn <span class="token variable">$@</span><span class="token punctuation">;</span>
            exit <span class="token variable">$exit_code</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        exit <span class="token variable">$exit_code</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">elsif</span> <span class="token punctuation">(</span> <span class="token variable">$command</span> <span class="token operator">eq</span> <span class="token string">&quot;status&quot;</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">print</span> <span class="token string">&quot;Checking the Status of the script.. OK \\n&quot;</span><span class="token punctuation">;</span>
        exit <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token variable">&amp;usage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        exit <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">sub</span> <span class="token function">start_vip</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token string">\`ssh $ssh_user\\@$new_master_host \\&quot; $ssh_start_vip \\&quot;\`</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">sub</span> <span class="token function">stop_vip</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     <span class="token keyword">return</span> <span class="token number">0</span>  <span class="token keyword">unless</span>  <span class="token punctuation">(</span><span class="token variable">$ssh_user</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token string">\`ssh $ssh_user\\@$orig_master_host \\&quot; $ssh_stop_vip \\&quot;\`</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">sub</span> <span class="token function">usage</span> <span class="token punctuation">{</span>
    <span class="token keyword">print</span>
    <span class="token string">&quot;Usage: master_ip_failover --command=start|stop|stopssh|status --orig_master_host=host --orig_master_ip=ip --orig_master_port=port --new_master_host=host --new_master_ip=ip --new_master_port=port\\n&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个脚本在软件包里自带，前面的步骤已经将example拷贝到指定目录，修改成对应的网卡和vip，记得加上执行权限。</p><h3 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h3><p>测试方法：停掉当前的master数据库，然后在slave数据库里执行show slave status\\G，看当前的master节点和vip是否已经切换。</p><h3 id="踩坑总结" tabindex="-1"><a class="header-anchor" href="#踩坑总结" aria-hidden="true">#</a> 踩坑总结</h3><blockquote><p>当有slave节点宕机时，manager服务是无法启动的，建议在配置文件中暂时注释掉宕机节点的信息，待修复后再取消注释。</p></blockquote><blockquote><ol><li>vip 自动从原来的 master 切换到新的 master,同时,manager 节点的监控进程自动退出。（正常退出，可以配置切换时发送邮件）</li><li>在日志目录(/masterha/app1/)产生一个 app1.failover.complete 文件</li><li>/etc/masterha/app1.cnf 配置文件中原来老的 master 配置被删除。</li><li>所以要将恢复后的主节点，配置文件重写。</li><li>启动MySQL，然后再检查同步状态</li><li>失败，报错，因为server_id得改，集群里，server_id必须唯一。</li></ol></blockquote><blockquote><p>初次安装MySQL，通过rpm -hiv安装官网下载的rpm包，然后再检查同步状态时，报[error][/usr/share/perl5/vendor_perl/MHA/ServerManager.pm, ln301] install_driver(mysql) failed: Attempt to reload DBD/mysql.pm aborted.这是因为MHA是由perl语言开发的，perl操作数据库需要相应的驱动，按照步骤安装驱动。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum install -y cpan
cpan -D DBI     
[yes---sudo]
cpan DBD::mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><blockquote><p>装完驱动发现又报cpan DBD::mysql Can&#39;t exec &quot;mysql_config&quot;: 没有那个文件或目录 这个文件MySQL安装好了应该自带的，通过rpm安装的5.7.36，居然没有，佛了，只能卸载掉，重新换一种姿势安装。</p><ol><li>首先通过rpm安装官方源，然后通过yum安装。（也就是本文记录的方式）</li><li>然后发现根本没有驱动的问题了，也没有报找不到mysql_config。</li></ol></blockquote><blockquote><p>问题又来了，安装的MySQL，yum安装完能正常启动，修改my.cnf之后启动就失败了(报错，data_dir非空，我把整个路径都删除了，启动还是继续报)。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>client<span class="token punctuation">]</span>
port <span class="token operator">=</span> <span class="token number">3307</span>
socket <span class="token operator">=</span> /tmp/mysql.sock
<span class="token comment">#character-set-server = utf8</span>
<span class="token punctuation">[</span>mysqld<span class="token punctuation">]</span>
port <span class="token operator">=</span> <span class="token number">3307</span>
socket <span class="token operator">=</span> /var/run/mysqld/mysqld.sock
pid-file <span class="token operator">=</span> /var/run/mysqld/mysqld.pid
user <span class="token operator">=</span> mysql
bind-address <span class="token operator">=</span> <span class="token number">0.0</span>.0.0
server-id <span class="token operator">=</span> <span class="token number">3</span>
skip-external-locking 
explicit_defaults_for_timestamp
datadir <span class="token operator">=</span> /home/mysql_data
init-connect <span class="token operator">=</span> <span class="token string">&#39;SET NAMES utf8&#39;</span>
<span class="token comment">#character-set-server = utf8</span>
<span class="token comment">#skip-name-resolve</span>
back_log <span class="token operator">=</span> <span class="token number">300</span>
max_connections <span class="token operator">=</span> <span class="token number">1000</span>
max_connect_errors <span class="token operator">=</span> <span class="token number">6000</span>
open_files_limit <span class="token operator">=</span> <span class="token number">65535</span>
table_open_cache <span class="token operator">=</span> <span class="token number">128</span>
max_allowed_packet <span class="token operator">=</span> 4M
binlog_cache_size <span class="token operator">=</span> 1M
max_heap_table_size <span class="token operator">=</span> 8M
tmp_table_size <span class="token operator">=</span> 16M
read_buffer_size <span class="token operator">=</span> 2M
read_rnd_buffer_size <span class="token operator">=</span> 8M
sort_buffer_size <span class="token operator">=</span> 8M
join_buffer_size <span class="token operator">=</span> 8M
<span class="token comment">#key_buffer_size = 4M</span>
thread_cache_size <span class="token operator">=</span> <span class="token number">8</span>
query_cache_type <span class="token operator">=</span> <span class="token number">1</span>
query_cache_size <span class="token operator">=</span> 8M
query_cache_limit <span class="token operator">=</span> 2M
ft_min_word_len <span class="token operator">=</span> <span class="token number">4</span>
performance_schema <span class="token operator">=</span> <span class="token number">0</span>
explicit_defaults_for_timestamp
lower_case_table_names <span class="token operator">=</span> <span class="token number">1</span>
skip-external-locking
default_storage_engine <span class="token operator">=</span> InnoDB
innodb_file_per_table <span class="token operator">=</span> <span class="token number">1</span>
innodb_open_files <span class="token operator">=</span> <span class="token number">500</span>
innodb_buffer_pool_size <span class="token operator">=</span> 128M
innodb_write_io_threads <span class="token operator">=</span> <span class="token number">4</span>
innodb_read_io_threads <span class="token operator">=</span> <span class="token number">4</span>
innodb_thread_concurrency <span class="token operator">=</span> <span class="token number">0</span>
innodb_purge_threads <span class="token operator">=</span> <span class="token number">1</span>
innodb_flush_log_at_trx_commit <span class="token operator">=</span> <span class="token number">2</span>
innodb_log_buffer_size <span class="token operator">=</span> 2M
innodb_log_file_size <span class="token operator">=</span> 32M
innodb_log_files_in_group <span class="token operator">=</span> <span class="token number">3</span>
innodb_max_dirty_pages_pct <span class="token operator">=</span> <span class="token number">90</span>
innodb_lock_wait_timeout <span class="token operator">=</span> <span class="token number">120</span>
bulk_insert_buffer_size <span class="token operator">=</span> 8M
myisam_sort_buffer_size <span class="token operator">=</span> 8M
myisam_max_sort_file_size <span class="token operator">=</span> 10G
interactive_timeout <span class="token operator">=</span> <span class="token number">28800</span>
wait_timeout <span class="token operator">=</span> <span class="token number">28800</span>
skip-ssl
log-error<span class="token operator">=</span>/home/mysql_data/mysqld.err
log-bin <span class="token operator">=</span> mysql-bin
relay-log <span class="token operator">=</span> relay-bin
relay-log-index <span class="token operator">=</span> slave-relay-bin.index
read_only <span class="token operator">=</span> <span class="token number">1</span>
<span class="token assign-left variable">rpl_semi_sync_slave_enabled</span><span class="token operator">=</span><span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终修改my.cnf，将声明data_dir的一行，放到声明sock文件和pid文件路径之后MySQL终于启动正常了。(深坑)</p></blockquote><h3 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h3>`,78),u={href:"https://blog.51cto.com/u_14154700/2472806",target:"_blank",rel:"noopener noreferrer"},v={href:"http://xpbag.com/97.html#%E4%B8%80%E3%80%81mysql%E4%B8%BB%E4%BB%8E%E5%A4%8D%E5%88%B6",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.cnblogs.com/winstom/p/11022014.html#%E7%AE%80%E4%BB%8B",target:"_blank",rel:"noopener noreferrer"},k={href:"https://segmentfault.com/a/1190000017486693#item-2-6",target:"_blank",rel:"noopener noreferrer"},_={href:"https://gohalo.me/post/mysql-replication-mha.html",target:"_blank",rel:"noopener noreferrer"},h={href:"https://www.cnblogs.com/gomysql/p/3675429.html",target:"_blank",rel:"noopener noreferrer"},g={href:"https://www.jianshu.com/p/7d84696e7d98",target:"_blank",rel:"noopener noreferrer"};function y(f,q){const n=o("ExternalLinkIcon");return l(),t("div",null,[d,r("more"),m,s("p",null,[s("a",u,[a("MySQL高可用之MHA部署_Ray的技术博客_51CTO博客"),e(n)]),s("a",v,[a("MHA 通过主从复制 实现高可用-XPBag"),e(n)]),s("a",b,[a("MySQL 高可用架构 之 MHA (Centos 7.5 MySQL 5.7.18 MHA 0.58) - 司家勇 - 博客园"),e(n)]),s("a",k,[a("mysql - MySQL集群搭建(5)-MHA高可用架构_个人文章 - SegmentFault 思否"),e(n)]),s("a",_,[a("MySQL 高可用 MHA"),e(n)]),s("a",h,[a("MySQL高可用架构之MHA - yayun - 博客园"),e(n)]),s("a",g,[a("MHA搭建 - 简书"),e(n)])])])}const x=i(c,[["render",y],["__file","MySQL的MHA高可用安装踩坑记录.html.vue"]]);export{x as default};
