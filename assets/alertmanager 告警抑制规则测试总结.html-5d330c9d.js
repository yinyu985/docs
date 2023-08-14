import{_ as n,W as s,X as a,a0 as e}from"./framework-b4edc447.js";const t={},p=e(`<h1 id="alertmanager-告警抑制规则测试总结" tabindex="-1"><a class="header-anchor" href="#alertmanager-告警抑制规则测试总结" aria-hidden="true">#</a> alertmanager 告警抑制规则测试总结</h1><p>测试环境：Prometheus，alertmanager，一台装了docker的电脑</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>原本已经通过docker运行了node_exporter
<span class="token function">docker</span> run <span class="token parameter variable">--name</span> nginx81 <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">81</span>:80 <span class="token parameter variable">--restart</span><span class="token operator">=</span>always  nginx
<span class="token function">docker</span> run <span class="token parameter variable">--name</span> nginx82 <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">82</span>:80 <span class="token parameter variable">--restart</span><span class="token operator">=</span>always  nginx
<span class="token function">docker</span> run <span class="token parameter variable">--name</span> nginx83 <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">83</span>:80 <span class="token parameter variable">--restart</span><span class="token operator">=</span>always  nginx
<span class="token function">docker</span> run <span class="token parameter variable">--name</span> nginx84 <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">84</span>:80 <span class="token parameter variable">--restart</span><span class="token operator">=</span>always  nginx
<span class="token function">docker</span> run <span class="token parameter variable">--name</span> nginx85 <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">85</span>:80 <span class="token parameter variable">--restart</span><span class="token operator">=</span>always  nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将以上六个对象添加到Prometheus</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">scrape_interval</span><span class="token punctuation">:</span> 3s
  <span class="token key atrule">evaluation_interval</span><span class="token punctuation">:</span> 3s
<span class="token key atrule">alerting</span><span class="token punctuation">:</span>
  <span class="token key atrule">alertmanagers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">static_configs</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.26.5.36:9093&#39;</span><span class="token punctuation">]</span>
<span class="token key atrule">rule_files</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> /data/prometheus<span class="token punctuation">-</span>2.31.1.linux<span class="token punctuation">-</span>amd64/rules.yml
<span class="token key atrule">scrape_configs</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&quot;node_exporter&quot;</span>
    <span class="token key atrule">static_configs</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.31.166.173:9100&#39;</span><span class="token punctuation">]</span>
         <span class="token key atrule">labels</span><span class="token punctuation">:</span>
           <span class="token key atrule">building</span><span class="token punctuation">:</span> <span class="token string">&#39;中海&#39;</span>
           <span class="token key atrule">city</span><span class="token punctuation">:</span> <span class="token string">&#39;北京&#39;</span>
           <span class="token key atrule">devicetype</span><span class="token punctuation">:</span> <span class="token string">&#39;linux&#39;</span>
           <span class="token key atrule">floor</span><span class="token punctuation">:</span> <span class="token string">&#39;16F&#39;</span>
           <span class="token key atrule">instance</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173:9100&#39;</span>
           <span class="token key atrule">instancehost</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173&#39;</span>
           <span class="token key atrule">job</span><span class="token punctuation">:</span> <span class="token string">&#39;node_exporter&#39;</span>
           <span class="token key atrule">monitortype</span><span class="token punctuation">:</span> <span class="token string">&#39;node_exporter&#39;</span>
           <span class="token key atrule">service</span><span class="token punctuation">:</span> <span class="token string">&#39;test_test&#39;</span>
  <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;tcp&#39;</span>
    <span class="token key atrule">metrics_path</span><span class="token punctuation">:</span> /probe
    <span class="token key atrule">params</span><span class="token punctuation">:</span>
      <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>tcp_connect<span class="token punctuation">]</span>
    <span class="token key atrule">static_configs</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.31.166.173:81&#39;</span><span class="token punctuation">]</span>
         <span class="token key atrule">labels</span><span class="token punctuation">:</span>
           <span class="token key atrule">building</span><span class="token punctuation">:</span> <span class="token string">&#39;中海&#39;</span>
           <span class="token key atrule">city</span><span class="token punctuation">:</span> <span class="token string">&#39;北京&#39;</span>
           <span class="token key atrule">devicetype</span><span class="token punctuation">:</span> <span class="token string">&#39;linux&#39;</span>
           <span class="token key atrule">floor</span><span class="token punctuation">:</span> <span class="token string">&#39;16F&#39;</span>
           <span class="token key atrule">instance</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173:81&#39;</span>
           <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token string">&#39;81&#39;</span>
           <span class="token key atrule">instancehost</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173&#39;</span>
           <span class="token key atrule">job</span><span class="token punctuation">:</span> <span class="token string">&#39;tcp&#39;</span>
           <span class="token key atrule">monitortype</span><span class="token punctuation">:</span> <span class="token string">&#39;tcp&#39;</span>
           <span class="token key atrule">service</span><span class="token punctuation">:</span> <span class="token string">&#39;test_test&#39;</span>
1<span class="token punctuation">-</span>5照着写1<span class="token punctuation">-</span>5照着写1<span class="token punctuation">-</span>5照着写1<span class="token punctuation">-</span>5照着写1<span class="token punctuation">-</span>5照着写1<span class="token punctuation">-</span>5照着写1<span class="token punctuation">-</span>5照着写
       <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.31.166.173:85&#39;</span><span class="token punctuation">]</span>
         <span class="token key atrule">labels</span><span class="token punctuation">:</span>
           <span class="token key atrule">building</span><span class="token punctuation">:</span> <span class="token string">&#39;中海&#39;</span>
           <span class="token key atrule">city</span><span class="token punctuation">:</span> <span class="token string">&#39;北京&#39;</span>
           <span class="token key atrule">devicetype</span><span class="token punctuation">:</span> <span class="token string">&#39;linux&#39;</span>
           <span class="token key atrule">floor</span><span class="token punctuation">:</span> <span class="token string">&#39;16F&#39;</span>
           <span class="token key atrule">instance</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173:85&#39;</span>
           <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token string">&#39;85&#39;</span>
           <span class="token key atrule">instancehost</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173&#39;</span>
           <span class="token key atrule">job</span><span class="token punctuation">:</span> <span class="token string">&#39;tcp&#39;</span>
           <span class="token key atrule">monitortype</span><span class="token punctuation">:</span> <span class="token string">&#39;tcp&#39;</span>
           <span class="token key atrule">service</span><span class="token punctuation">:</span> <span class="token string">&#39;test_test&#39;</span>
    <span class="token key atrule">relabel_configs</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__address__<span class="token punctuation">]</span>
         <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __param_target
       <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__param_target<span class="token punctuation">]</span>
         <span class="token key atrule">target_label</span><span class="token punctuation">:</span> instance
       <span class="token punctuation">-</span> <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __address__
         <span class="token key atrule">replacement</span><span class="token punctuation">:</span> 10.26.5.36<span class="token punctuation">:</span><span class="token number">9115</span>
  <span class="token punctuation">-</span> <span class="token key atrule">job_name</span><span class="token punctuation">:</span> <span class="token string">&#39;icmp&#39;</span>
    <span class="token key atrule">metrics_path</span><span class="token punctuation">:</span> /probe
    <span class="token key atrule">params</span><span class="token punctuation">:</span>
      <span class="token key atrule">module</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>icmp<span class="token punctuation">]</span>
    <span class="token key atrule">static_configs</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> <span class="token key atrule">targets</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;10.31.166.173&#39;</span><span class="token punctuation">]</span>
         <span class="token key atrule">labels</span><span class="token punctuation">:</span>
           <span class="token key atrule">building</span><span class="token punctuation">:</span> <span class="token string">&#39;中海&#39;</span>
           <span class="token key atrule">city</span><span class="token punctuation">:</span> <span class="token string">&#39;北京&#39;</span>
           <span class="token key atrule">devicetype</span><span class="token punctuation">:</span> <span class="token string">&#39;linux&#39;</span>
           <span class="token key atrule">floor</span><span class="token punctuation">:</span> <span class="token string">&#39;16F&#39;</span>
           <span class="token key atrule">instance</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173&#39;</span>
           <span class="token key atrule">instancehost</span><span class="token punctuation">:</span> <span class="token string">&#39;10.31.166.173&#39;</span>
           <span class="token key atrule">job</span><span class="token punctuation">:</span> <span class="token string">&#39;icmp&#39;</span>
           <span class="token key atrule">monitortype</span><span class="token punctuation">:</span> <span class="token string">&#39;icmp&#39;</span>
           <span class="token key atrule">service</span><span class="token punctuation">:</span> <span class="token string">&#39;test_test&#39;</span>
    <span class="token key atrule">relabel_configs</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__address__<span class="token punctuation">]</span>
         <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __param_target
       <span class="token punctuation">-</span> <span class="token key atrule">source_labels</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>__param_target<span class="token punctuation">]</span>
         <span class="token key atrule">target_label</span><span class="token punctuation">:</span> instance
       <span class="token punctuation">-</span> <span class="token key atrule">target_label</span><span class="token punctuation">:</span> __address__
         <span class="token key atrule">replacement</span><span class="token punctuation">:</span> 10.26.5.36<span class="token punctuation">:</span><span class="token number">9115</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>rule.yml如下</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">groups</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Linux告警规则
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
<span class="token comment">#  - alert: Host_ping不通了</span>
<span class="token comment">#    expr: probe_success{monitortype=&quot;icmp&quot;,instancehost=&quot;10.31.166.173&quot;}==0</span>
<span class="token comment">#    for: 5s</span>
<span class="token comment">#    labels:</span>
<span class="token comment">#      severity: Disaster</span>
<span class="token comment">#    annotations:</span>
<span class="token comment">#      summary: ping不通了</span>
<span class="token comment">#      description:  &quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot; </span>
<span class="token comment">#这个不太好触发，注释掉</span>
  <span class="token punctuation">-</span> <span class="token key atrule">alert</span><span class="token punctuation">:</span> Host_exporter没了
    <span class="token key atrule">expr</span><span class="token punctuation">:</span> up<span class="token punctuation">{</span>instancehost=&quot;10.31.166.173&quot;<span class="token punctuation">}</span>==0  <span class="token comment">##假设这个规则是断网时的规则，来进行模拟停电时，屏蔽因为停电造成的掉铺天盖地的告警。</span>
    <span class="token key atrule">for</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">severity</span><span class="token punctuation">:</span> Warning 
    <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      <span class="token key atrule">summary</span><span class="token punctuation">:</span> exporter没了
      <span class="token key atrule">description</span><span class="token punctuation">:</span>  <span class="token string">&quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot;</span> 
  <span class="token punctuation">-</span> <span class="token key atrule">alert</span><span class="token punctuation">:</span> Host_nginx1没了
    <span class="token key atrule">expr</span><span class="token punctuation">:</span> probe_success<span class="token punctuation">{</span>monitortype=&quot;tcp&quot;<span class="token punctuation">,</span>instancehost=&quot;10.31.166.173&quot;<span class="token punctuation">,</span>port=&quot;81&quot;<span class="token punctuation">}</span>==0
    <span class="token key atrule">for</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">severity</span><span class="token punctuation">:</span> Average
    <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      <span class="token key atrule">summary</span><span class="token punctuation">:</span> nginx1没了
      <span class="token key atrule">description</span><span class="token punctuation">:</span>  <span class="token string">&quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot;</span> 
  <span class="token punctuation">-</span> <span class="token key atrule">alert</span><span class="token punctuation">:</span> Host_nginx2没了
    <span class="token key atrule">expr</span><span class="token punctuation">:</span> probe_success<span class="token punctuation">{</span>monitortype=&quot;tcp&quot;<span class="token punctuation">,</span>instancehost=&quot;10.31.166.173&quot;<span class="token punctuation">,</span>port=&quot;82&quot;<span class="token punctuation">}</span>==0
    <span class="token key atrule">for</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">severity</span><span class="token punctuation">:</span> Average  
    <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      <span class="token key atrule">summary</span><span class="token punctuation">:</span> nginx2没了
      <span class="token key atrule">description</span><span class="token punctuation">:</span>  <span class="token string">&quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot;</span> 
  <span class="token punctuation">-</span> <span class="token key atrule">alert</span><span class="token punctuation">:</span> Host_nginx3没了
    <span class="token key atrule">expr</span><span class="token punctuation">:</span> probe_success<span class="token punctuation">{</span>monitortype=&quot;tcp&quot;<span class="token punctuation">,</span>instancehost=&quot;10.31.166.173&quot;<span class="token punctuation">,</span>port=&quot;83&quot;<span class="token punctuation">}</span>==0
    <span class="token key atrule">for</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">severity</span><span class="token punctuation">:</span> Critical
    <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      <span class="token key atrule">summary</span><span class="token punctuation">:</span> nginx3没了
      <span class="token key atrule">description</span><span class="token punctuation">:</span>  <span class="token string">&quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot;</span> 
  <span class="token punctuation">-</span> <span class="token key atrule">alert</span><span class="token punctuation">:</span> Host_nginx4没了
    <span class="token key atrule">expr</span><span class="token punctuation">:</span> probe_success<span class="token punctuation">{</span>monitortype=&quot;tcp&quot;<span class="token punctuation">,</span>instancehost=&quot;10.31.166.173&quot;<span class="token punctuation">,</span>port=&quot;84&quot;<span class="token punctuation">}</span>==0
    <span class="token key atrule">for</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">severity</span><span class="token punctuation">:</span> Warning
    <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      <span class="token key atrule">summary</span><span class="token punctuation">:</span> nginx4没了
      <span class="token key atrule">description</span><span class="token punctuation">:</span>  <span class="token string">&quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot;</span> 
  <span class="token punctuation">-</span> <span class="token key atrule">alert</span><span class="token punctuation">:</span> Host_5nginx5没了
    <span class="token key atrule">expr</span><span class="token punctuation">:</span> probe_success<span class="token punctuation">{</span>monitortype=&quot;tcp&quot;<span class="token punctuation">,</span>instancehost=&quot;10.31.166.173&quot;<span class="token punctuation">,</span>port=&quot;85&quot;<span class="token punctuation">}</span>==0
    <span class="token key atrule">for</span><span class="token punctuation">:</span> 5s
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">severity</span><span class="token punctuation">:</span> Disaster
    <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      <span class="token key atrule">summary</span><span class="token punctuation">:</span> 5nginx5没了
      <span class="token key atrule">description</span><span class="token punctuation">:</span>  <span class="token string">&quot;Devicetype: {{ $labels.devicetype }},  Service: {{ $labels.service }},  IP: {{ $labels.instancehost }} &quot;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>alertmanager.yml规则如下</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">global</span><span class="token punctuation">:</span>
<span class="token key atrule">route</span><span class="token punctuation">:</span>
  <span class="token key atrule">receiver</span><span class="token punctuation">:</span> <span class="token string">&quot;Warnings&quot;</span>
  <span class="token key atrule">group_by</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;instancehost&#39;</span><span class="token punctuation">]</span>
  <span class="token key atrule">routes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">receiver</span><span class="token punctuation">:</span> <span class="token string">&quot;Average&quot;</span>
      <span class="token key atrule">repeat_interval</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">severity</span><span class="token punctuation">:</span> Average  
    <span class="token punctuation">-</span> <span class="token key atrule">receiver</span><span class="token punctuation">:</span> <span class="token string">&quot;Warning&quot;</span>
      <span class="token key atrule">repeat_interval</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">severity</span><span class="token punctuation">:</span> Warning
    <span class="token punctuation">-</span> <span class="token key atrule">receiver</span><span class="token punctuation">:</span> <span class="token string">&quot;Disaster&quot;</span>
      <span class="token key atrule">repeat_interval</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">severity</span><span class="token punctuation">:</span> Disaster
<span class="token comment">################################################################################################################</span>
    <span class="token punctuation">-</span> <span class="token key atrule">receiver</span><span class="token punctuation">:</span> <span class="token string">&quot;Critical&quot;</span>
      <span class="token key atrule">repeat_interval</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">severity</span><span class="token punctuation">:</span> Critical
    <span class="token punctuation">-</span> <span class="token key atrule">receiver</span><span class="token punctuation">:</span> <span class="token string">&quot;Warnings&quot;</span>
      <span class="token key atrule">repeat_interval</span><span class="token punctuation">:</span> 10s
      <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">severity</span><span class="token punctuation">:</span> Warnings
<span class="token comment">################################################################################################################</span>
<span class="token comment">#试验过程</span>
<span class="token comment">#################################################</span>
<span class="token comment">#inhibit_rules: </span>
<span class="token comment">#  - source_match:</span>
<span class="token comment">#      severity: Warning</span>
<span class="token comment">#    target_match_re:</span>
<span class="token comment">#      alertname: &quot;Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了&quot;</span>
<span class="token comment">#    equal: [&#39;instancehost&#39;]</span>
<span class="token comment">#  - source_match:</span>
<span class="token comment">#      severity: Disaster</span>
<span class="token comment">#    target_match_re:</span>
<span class="token comment">#      alertname: &quot;Host_nginx1没了&quot;</span>
<span class="token comment">#    equal: [&#39;instancehost&#39;] </span>
<span class="token comment">#这种方式是，Warning抑制了&quot;Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了&quot;这几个告警，并且Disater抑制了&quot;Host_nginx1没了&quot;这个告警，经过实验，确实只发送了Warning的告警，12345都被抑制了，符合预期。</span>
<span class="token comment">#################################################</span>
<span class="token comment">#inhibit_rules:   </span>
<span class="token comment">#   - source_matchers:</span>
<span class="token comment">#       - alertname = &quot;Host_exporter没了&quot;</span>
<span class="token comment">#     target_match_re:</span>
<span class="token comment">#       alertname: &quot;Host_nginx.*&quot;</span>
<span class="token comment">#     equal: [&#39;instancehost&#39;] </span>
<span class="token comment">#这种方式是&quot;Host_exporter没了&quot;抑制了，所有以Host_nginx开头的告警。经过测试这样写，也只发送&quot;Host_exporter没了&quot;这个告警，符合预期。</span>
<span class="token comment">#################################################</span>
<span class="token key atrule">inhibit_rules</span><span class="token punctuation">:</span>   
   <span class="token punctuation">-</span> <span class="token key atrule">source_matchers</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> alertname = &quot;Host_exporter没了&quot;
     <span class="token key atrule">target_matchers</span><span class="token punctuation">:</span>
       <span class="token punctuation">-</span> alertname =~ &quot;Host_nginx2没了<span class="token punctuation">|</span>Host_nginx3没了<span class="token punctuation">|</span>Host_nginx4没了<span class="token punctuation">|</span>Host_nginx5没了&quot;
     <span class="token key atrule">equal</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">&#39;instancehost&#39;</span><span class="token punctuation">]</span> 
<span class="token comment">#这种情况是&quot;Host_exporter没了&quot;屏蔽了&quot;Host_nginx2没了|Host_nginx3没了|Host_nginx4没了|Host_nginx5没了&quot;这几个告警，此时发出来的有，&quot;Host_exporter没了&quot;和&quot;Host_nginx1没了&quot;这两个告警，符合预期。</span>
<span class="token comment">################################################################################################################</span>
<span class="token key atrule">receivers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;Warning&quot;</span>
    <span class="token key atrule">webhook_configs</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">&quot;http://10.26.5.36:9000/warning_alertinfo&quot;</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;Critical&quot;</span>
    <span class="token key atrule">webhook_configs</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">&quot;http://10.26.5.36:9000/critical_alertinfo&quot;</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;Average&quot;</span>
    webhook_configs<span class="token punctuation">:</span>f
      <span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">&quot;http://10.26.5.36:9000/average_alertinfo&quot;</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;Disaster&quot;</span>
    <span class="token key atrule">webhook_configs</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">&quot;http://10.26.5.36:9000/disaster_alertinfo&quot;</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">&quot;Warnings&quot;</span>
    <span class="token key atrule">webhook_configs</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">url</span><span class="token punctuation">:</span> <span class="token string">&quot;http://10.26.5.36:9000/warning_alertinfo&quot;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此已经完整掌握inhibit_rules的写法</p><p>第三列均为示例，可以根据告警等级，告警名称，进行匹配。</p><table><thead><tr><th style="text-align:center;">写死单个</th><th>source_match</th><th>target_match</th><th>severity: Warning</th></tr></thead><tbody><tr><td style="text-align:center;">写死多个</td><td>source_matchers</td><td>target_matchers</td><td>- alertname = &quot;Host_exporter&quot;</td></tr><tr><td style="text-align:center;">正则匹配</td><td>source_match_re</td><td>target_match_re</td><td>alertname: &quot;Host_nginx.*&quot;</td></tr></tbody></table><p>以上，前两列的六种匹配模式可以混用，互相搭配，但是第三列必须对应，也就是各种匹配模式的必须写对应的匹配表达式，不然报错。</p>`,13),l=[p];function c(i,o){return s(),a("div",null,l)}const r=n(t,[["render",c],["__file","alertmanager 告警抑制规则测试总结.html.vue"]]);export{r as default};
