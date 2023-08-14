import{_ as d,W as s,X as r,Y as a,Z as e,$ as t,a0 as n,D as l}from"./framework-b4edc447.js";const c={},u=n(`<h1 id="mysql基础总结" tabindex="-1"><a class="header-anchor" href="#mysql基础总结" aria-hidden="true">#</a> MySQL基础总结</h1><h2 id="登录数据库" tabindex="-1"><a class="header-anchor" href="#登录数据库" aria-hidden="true">#</a> 登录数据库</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mysql -u root -p
-u指定用户
-h指定登录的主机IP，不写就是本机。
-p写密码的
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="新建用户-赋权限" tabindex="-1"><a class="header-anchor" href="#新建用户-赋权限" aria-hidden="true">#</a> 新建用户，赋权限</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GRANT ALL PRIVILEGES ON grafana.* TO &#39;test&#39;@&#39;%&#39; IDENTIFIED BY &#39;testpassword&#39;
授予test用户所有权限，并允许他从任意的IP登录，如果要限制网段，例如，&#39;10.23.140.%&#39;,限制了数据库grafana里面的所有表，*通配符，表示所有表
*.*意味着授权所有数据库的所有表。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基本操作" tabindex="-1"><a class="header-anchor" href="#基本操作" aria-hidden="true">#</a> 基本操作</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>创建数据库
create test;
命令后加分号，才会被执行
drop database test;
删除数据库
use test;
进入数据库
show tables;
显示表
describe test;
显示表结构
delete from test;
删除数据，一般都加where条件。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="创建表" tabindex="-1"><a class="header-anchor" href="#创建表" aria-hidden="true">#</a> 创建表</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>CREATE TABLE test(
   -&gt; id INT NOT NULL AUTO_INCREMENT, #不是空的，自增。
   -&gt; name VARCHAR(100) NOT NULL, #姓名，字符类型，varchar会根据具体长短伸缩，char就是固定长短，有点费空间
   -&gt; date DATE,#日期类型
   -&gt; PRIMARY KEY ( runoob_id )#定义主键
   -&gt; )ENGINE=InnoDB DEFAULT CHARSET=utf8; #设定数据库引擎和字符编码
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="删除表" tabindex="-1"><a class="header-anchor" href="#删除表" aria-hidden="true">#</a> 删除表</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DROP TABLE test;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="插入数据" tabindex="-1"><a class="header-anchor" href="#插入数据" aria-hidden="true">#</a> 插入数据</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>INSERT INTO test ( id, name,date )
                       VALUES
                       ( value1, value2,...valueN );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果数据是字符型，必须使用单引号或者双引号，如：&quot;value&quot;。</p><h2 id="查询" tabindex="-1"><a class="header-anchor" href="#查询" aria-hidden="true">#</a> 查询</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>select * from test;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="修改数据" tabindex="-1"><a class="header-anchor" href="#修改数据" aria-hidden="true">#</a> 修改数据</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>UPDATE test SET id=1, name=&#39;test&#39; where &#39;条件&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="修改数据-1" tabindex="-1"><a class="header-anchor" href="#修改数据-1" aria-hidden="true">#</a> 修改数据</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>DELETE FROM test where &#39;条件&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,20),v=a("strong",null,"=",-1),o={href:"http://RUNOOB.COM",target:"_blank",rel:"noopener noreferrer"},h=n(`<p>但是有时候我们需要获取 runoob_author 字段含有 &quot;COM&quot; 字符的所有记录，这时我们就需要在 WHERE 子句中使用 SQL LIKE 子句。</p><p>SQL LIKE 子句中使用百分号 **%**字符来表示任意字符，类似于UNIX或正则表达式中的星号 *****。</p><p>如果没有使用百分号 <strong>%</strong>, LIKE 子句与等号 <strong>=</strong> 的效果是一样的。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SELECT id, name
FROM test
WHERE info LIKE &#39;%a&#39;
查找info这一列中结尾是a的id,和name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="group分组" tabindex="-1"><a class="header-anchor" href="#group分组" aria-hidden="true">#</a> Group分组</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>SELECT id, sum(id)
FROM test
WHERE id =1
GROUP BY name;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="联合查询" tabindex="-1"><a class="header-anchor" href="#联合查询" aria-hidden="true">#</a> 联合查询</h2><p>可以在 SELECT, UPDATE 和 DELETE 语句中使用 Mysql 的 JOIN 来联合多表查询。</p><p>JOIN 按照功能大致分为如下三类：</p><ul><li><strong>INNER JOIN（内连接,或等值连接）</strong>：获取两个表中字段匹配关系的记录。</li><li>**LEFT JOIN（左连接）：**获取左表所有记录，即使右表没有对应匹配的记录。</li><li><strong>RIGHT JOIN（右连接）：</strong> 与 LEFT JOIN 相反，用于获取右表所有记录，即使左表没有对应匹配的记录。</li></ul><h2 id="数据导出" tabindex="-1"><a class="header-anchor" href="#数据导出" aria-hidden="true">#</a> 数据导出</h2><p>mysqldump 是 mysql 用于转存储数据库的实用程序。它主要产生一个 SQL 脚本，其中包含从头重新创建数据库所必需的命令 CREATE TABLE INSERT 等。使用 mysqldump 导出数据需要使用 --tab 选项来指定导出文件指定的目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mysqldump -u db_username -p db_name table_name &gt; ~/db.sql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,13);function m(b,g){const i=l("ExternalLinkIcon");return s(),r("div",null,[u,a("p",null,[e("WHERE 子句中可以使用等号 "),v,e(` 来设定获取数据的条件，如 "runoob_author = '`),a("a",o,[e("RUNOOB.COM"),t(i)]),e(`'"。`)]),h])}const p=d(c,[["render",m],["__file","MySQL基础总结.html.vue"]]);export{p as default};
