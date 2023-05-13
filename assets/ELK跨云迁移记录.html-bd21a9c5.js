import{_ as a,W as s,X as t,Y as e,Z as d,$ as o,a0 as i,D as l}from"./framework-b4edc447.js";const r={},c=i('<h1 id="elk跨云迁移记录" tabindex="-1"><a class="header-anchor" href="#elk跨云迁移记录" aria-hidden="true">#</a> ELK跨云迁移记录</h1><h2 id="前情提要" tabindex="-1"><a class="header-anchor" href="#前情提要" aria-hidden="true">#</a> 前情提要</h2><p>有一共有两套Es需要迁移到新的阿里云Es服务集群中，继上一篇ElasticSearch迁移方案对比之后，考虑到数据量，毫不犹豫的选择的Snapshot的方式，本来应该可以使用MinIO这种自建的OSS，但是受限于网络连通性，只能用阿里云提供的OSS服务，其实后来一想，是可以在阿里云的VPC的机器上自己装个MinIO的，好处是省钱，坏处是，要多维护一个组件，多一个风险。想来想去没必要为公司省钱吧。开搞！</p><h2 id="前置条件" tabindex="-1"><a class="header-anchor" href="#前置条件" aria-hidden="true">#</a> 前置条件</h2><p>两个Es都能连接到OSS、OSS的插件（因为你想把快照存储到阿里云，就需要安装阿里云的OSS插件）、很久很久的时间。</p><h2 id="安装插件" tabindex="-1"><a class="header-anchor" href="#安装插件" aria-hidden="true">#</a> 安装插件</h2>',6),u={href:"https://help.aliyun.com/document_detail/170022.html?spm=a2c4g.137323.0.0.4ef21a2ecL8PaX",target:"_blank",rel:"noopener noreferrer"},h=i(`<p>这是阿里云提供的参考文档，我们要按照文中提到的插件，非常操蛋的是，他不是每个小版本都有release，你只能找一个相近的然后去手动改version信息。 因为我们的Es是7.9,我下载7.7解压重启查询能看到，结果创建快照就不好使，重启Es分片都重新分布，一看控制台，第一次重启，我还吓一跳，集群状态红色的，其实就是主分片没有成功分布，不用担心，让子弹飞一会儿。过一会儿就好了，7.7不好使，只能换7.10了，又是下载解压重启，又红一遍。插件算是搞好了，开始下一步操作。</p><h2 id="创建仓库" tabindex="-1"><a class="header-anchor" href="#创建仓库" aria-hidden="true">#</a> 创建仓库</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT _snapshot/network_logs
{
  &quot;type&quot;: &quot;oss&quot;,
    &quot;settings&quot;: {
        &quot;endpoint&quot;: &quot;http://oss-cn-shanghai.aliyuncs.com&quot;,
        &quot;access_key_id&quot;: &quot;************************&quot;,
        &quot;secret_access_key&quot;: &quot;************************&quot;,
        &quot;bucket&quot;: &quot;XXXXXXXXXXXXXX&quot;,
        &quot;compress&quot; : &quot;true&quot;,
        &quot;chunk_size&quot;: &quot;1gb&quot;,
        &quot;base_path&quot;: &quot;network_logs/&quot;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在Kibana开发工具执行这个，解释一下</p><ul><li>指定快照仓库的类型为OSS,不装插件的话，是不支持这个类型的。</li><li>快照仓库设置OSS的地址，id，key，桶名。</li><li>设置是否压缩，那必然压缩啊。</li><li>设置chunk_size，就是一次发多大的包。</li><li>设置这个快照仓库在OSS中的路径</li><li>还有一些我没设置的参数</li><li>max_restore_bytes_per_sec,看了下上篇文里写了，纠错，默认改成了40M/s。</li></ul><h2 id="创建快照" tabindex="-1"><a class="header-anchor" href="#创建快照" aria-hidden="true">#</a> 创建快照</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PUT /_snapshot/network_logs/netops_fw_device-2023-03-3xing?wait_for_completion=false
{
  &quot;indices&quot;: &quot;netops_fw_device-2023-03-3*&quot;,
  &quot;include_global_state&quot;: true,
  &quot;ignore_unavailable&quot;: false
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有两个重要的设置，是否包括全局状态，和是否忽略不可用的，network_logs是刚才注册的仓库名，<code>netops_fw_device-2023-03-3xing</code>是为了让快照名能够看出里面有哪些索引，但是快照名不让写特殊符号就写了xing，后面的<code>?wait_for_completion=false</code>指是否等待完成，我选否，让他自己后台。</p><h2 id="恢复快照" tabindex="-1"><a class="header-anchor" href="#恢复快照" aria-hidden="true">#</a> 恢复快照</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /_snapshot/network_logs/netops_fw_device-2023-03-3xing/_restore?wait_for_completion=false
{
  &quot;indices&quot;: &quot;netops_fw_device-2023-03-3*&quot;,
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面三行用于指定某个快照里的某种索引，还支持对索引的改名，不过我们其实都用不到，甚至可以不写索引名，默认会回复快照中的全部索引</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>POST /_snapshot/network_logs/netops_fw_device-2023-03-3xing/_restore?wait_for_completion=false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="坑坑坑坑" tabindex="-1"><a class="header-anchor" href="#坑坑坑坑" aria-hidden="true">#</a> 坑坑坑坑</h2><p>看起来很美好的操作，但是实际上你要考虑的东西很多，就算使用通配符也有十几种索引的类型，并且有的使用统配之后，一个快照大小达到一两个TB,只能再进一步写让每个快照的大小适中，如果你不小心创建错了快照，想删除，也不像在文件上右键删除这么简单，能删到timeout，哎，简直苦逼，要是网络直连，直接配置个跨集群同步岂不是省不少事？可惜，话语权都没有，只配搬砖。</p>`,14);function v(_,m){const n=l("ExternalLinkIcon");return s(),t("div",null,[c,e("p",null,[e("a",u,[d("通过OSS将自建Elasticsearch数据迁移至阿里云"),o(n)])]),h])}const b=a(r,[["render",v],["__file","ELK跨云迁移记录.html.vue"]]);export{b as default};
