import{_ as e,W as l,X as s,a0 as n}from"./framework-b4edc447.js";const o={},t=n(`<h1 id="使用confd和consul更新prometheus配置文件" tabindex="-1"><a class="header-anchor" href="#使用confd和consul更新prometheus配置文件" aria-hidden="true">#</a> 使用confd和consul更新Prometheus配置文件</h1><ol><li>首先，确认您的Prometheus已设置好警报规则配置。可以在Prometheus的配置文件（prometheus.yml）中添加以下内容：</li></ol><blockquote><ol><li>首先，确认您的Prometheus已设置好警报规则配置。可以在Prometheus的配置文件（prometheus.yml）中添加以下内容：</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># prometheus.yml
# ...
rule_files:
 - /etc/prometheus/rules/*.rules.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Prometheus将在已定义的规则文件中检查规则定义。这里使用了通配符*.rules.yml，以便加载所有以.rules.yml文件结尾的文件。</p><ol><li>在Consul中创建告警规则的存储路径和键值。例如，使用以下命令：</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ consul kv put myapp/prometheus/alerts/rule1 &#39;groups:\\n- name: cpu_alerts\\n rules:\\n - alert: High_CPU_Load\\n  expr: node_load1{job=&quot;node_exporter&quot;} &gt; 0.5\\n  for: 5m\\n  labels:\\n    severity: page\\n  annotations:\\n    summary: High CPU load detected\\n    description: &quot;{{ $labels.instance }} CPU usage is over 50% for 5 minutes.&quot;&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这创建了一个名为myapp/prometheus/alerts的存储路劲名，并将告警规则的键值设置为rule1。</p><ol><li>如前面所述，安装和配置confd和Consul。</li><li>创建confd配置文件(confd.toml)，用于从Consul存储中读取并生成Prometheus的告警规则配置文件：</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[template]
src = &quot;prometheus.rules.yml.tmpl&quot;
dest = &quot;/etc/prometheus/rules/allrules.yml&quot;
keys = [
 &quot;/myapp/prometheus/alerts&quot;,
]
# Use a reload command to trigger Prometheus to reload configuration
reload_cmd = &quot;curl -X POST http://localhost:9090/-/reload&quot;
backend = &quot;consul&quot;
prefix = &quot;myapp&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述配置在模板文件(prometheus.rules.yml.tmpl)中可以使用keys参数指定Consul键值的路径。这里使用了/oneminutemail作为应用程序名称和prometheus/alerts作为子路径以定义Prometheus的告警规则。</p><p>此配置还使用了reload_cmd来设置重新加载Prometheus的配置文件，该命令将通过特定的POST请求触发Prometheus的重载，确保告警规则被重新加载。</p><ol><li>创建告警规则模板文件(prometheus.rules.yml.tmpl)，将Consul存储中的告警规则键和值映射到Prometheus告警规则配置文件：</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># prometheus.rules.yml.tmpl
{{ $rules := key &quot;/myapp/prometheus/alerts&quot; }}
{{ range $rulename, $rulecontent := $rules }}
{{ $rulecontent }}{{ end }} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个文件使用Go模板语言，将规则内容从Consul存储中读取并将它们填充到Prometheus的告警规则配置文件中。功能key用于获取在Consul存储中存储的告警规则信息。</p><ol><li>启动confd服务，以将告警规则添加到Prometheus配置文件中：</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ confd -backend consul -config-file confd.toml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>confd将定期检查Consul存储以获取新的告警规则。一旦发现变化，规则文件将被重新生成，并重新加载Prometheus的配置文件。请注意，如果您已为Prometheus服务设置了自定义reload_cmd，则不需要使用reload_cmd参数来指定-prometheus.reload参数。例如，使用以下命令重新加载Prometheus配置文件：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ curl -X POST http://localhost:9090/-/reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>现在，您的Prometheus服务已经重新加载了新的告警规则，并可以根据这些规则发出告警通知。</p></blockquote><h1 id="来个示例-不需要生成规则-只需要confd把规则传送到prometheus" tabindex="-1"><a class="header-anchor" href="#来个示例-不需要生成规则-只需要confd把规则传送到prometheus" aria-hidden="true">#</a> 来个示例，不需要生成规则，只需要confd把规则传送到Prometheus</h1><p>好的，以下是一个示例，演示如何使用 ConfD 从 Consul 中获取告警规则，并将其传递给 Prometheus。</p><p>假设您已经有一个告警规则文件，例如 <code>alerts.yml</code>，并将其存储在 Consul 的路径 <code>config/alerts.yml</code> 中。</p><ol><li>配置 Consul 服务发现的相关参数</li></ol><p>在 Prometheus 的配置文件中，添加以下配置，以启用 Consul 服务发现：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Prometheus 配置文件
scrape_configs:
  - job_name: &#39;example&#39;
    consul_sd_configs:
      - server: &#39;localhost:8500&#39;
        query: &#39;config/alerts.yml&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述配置中，<code>server</code> 参数指定 Consul 服务的地址和端口，<code>query</code> 参数指定要查询的告警规则的路径。在这个示例中，我们要查询 <code>config/alerts.yml</code> 这个路径下的告警规则。</p><ol start="2"><li>添加告警规则的配置项</li></ol><p>在 Prometheus 的配置文件中，添加以下配置，以指定告警规则的存储位置和查询语句：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Prometheus 配置文件
rule_files:
  - &#39;config/alerts.yml&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述配置中，<code>rule_files</code> 参数指定告警规则文件的路径。在这个示例中，我们要加载 <code>config/alerts.yml</code> 这个路径下的告警规则。</p><ol start="3"><li>启动 Prometheus 和 ConfD</li></ol><p>启动 Prometheus 和 ConfD，它们将自动从 Consul 中获取告警规则，并将其放入 Prometheus 的配置文件中。如果您使用 systemd 等系统服务管理工具，可以通过以下命令来启动 Prometheus 和 ConfD：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>systemctl start prometheus
systemctl start confd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>以上就是一个简单的示例，演示了如何使用 ConfD 从 Consul 中获取告警规则，并将其传递给 Prometheus。如果您有其他问题或需要进一步的帮助，请随时告诉我。</p>`,18),i=[t];function r(d,a){return l(),s("div",null,i)}const c=e(o,[["render",r],["__file","使用confd和consul更新Prometheus配置文件.html.vue"]]);export{c as default};
