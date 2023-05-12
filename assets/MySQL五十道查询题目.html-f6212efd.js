import{_ as e,W as s,X as i,a1 as n}from"./framework-ab2cdc09.js";const d={},c=n(`<p>MySQL经典练习题及答案，常用SQL语句练习50题<!--more--></p><h2 id="表名和字段" tabindex="-1"><a class="header-anchor" href="#表名和字段" aria-hidden="true">#</a> 表名和字段</h2><p>–1.学生表 Student(s_id,s_name,s_birth,s_sex) –学生编号,学生姓名, 出生年月,学生性别 –2.课程表 Course(c_id,c_name,t_id) – –课程编号, 课程名称, 教师编号 –3.教师表 Teacher(t_id,t_name) –教师编号,教师姓名 –4.成绩表 Score(s_id,c_id,s_score) –学生编号,课程编号,分数</p><h2 id="测试数据" tabindex="-1"><a class="header-anchor" href="#测试数据" aria-hidden="true">#</a> 测试数据</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#–1.学生表 
#Student(s_id,s_name,s_birth,s_sex) –学生编号,学生姓名, 出生年月,学生性别
CREATE TABLE \`Student\` (
    \`s_id\` VARCHAR(20),
    s_name VARCHAR(20) NOT NULL DEFAULT &#39;&#39;,
    s_brith VARCHAR(20) NOT NULL DEFAULT &#39;&#39;,
    s_sex VARCHAR(10) NOT NULL DEFAULT &#39;&#39;,
    PRIMARY KEY(s_id)
);

#–2.课程表 
#Course(c_id,c_name,t_id) – –课程编号, 课程名称, 教师编号 
create table Course(
    c_id varchar(20),
    c_name VARCHAR(20) not null DEFAULT &#39;&#39;,
    t_id VARCHAR(20) NOT NULL,
    PRIMARY KEY(c_id)
);

/*
–3.教师表 
Teacher(t_id,t_name) –教师编号,教师姓名 
*/
CREATE TABLE Teacher(
    t_id VARCHAR(20),
    t_name VARCHAR(20) NOT NULL DEFAULT &#39;&#39;,
    PRIMARY KEY(t_id)
);

/*
–4.成绩表 
Score(s_id,c_id,s_score) –学生编号,课程编号,分数
*/
Create table Score(
    s_id VARCHAR(20),
    c_id VARCHAR(20) not null default &#39;&#39;,
    s_score INT(3),
    primary key(\`s_id\`,\`c_id\`)
);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="插入数据" tabindex="-1"><a class="header-anchor" href="#插入数据" aria-hidden="true">#</a> 插入数据</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#--插入学生表测试数据#(&#39;01&#39; , &#39;赵雷&#39; , &#39;1990-01-01&#39; , &#39;男&#39;)
insert into Student values(&#39;01&#39; , &#39;赵雷&#39; , &#39;1990-01-01&#39; , &#39;男&#39;);
insert into Student values(&#39;02&#39; , &#39;钱电&#39; , &#39;1990-12-21&#39; , &#39;男&#39;);
insert into Student values(&#39;03&#39; , &#39;孙风&#39; , &#39;1990-05-20&#39; , &#39;男&#39;);
insert into Student values(&#39;04&#39; , &#39;李云&#39; , &#39;1990-08-06&#39; , &#39;男&#39;);
insert into Student values(&#39;05&#39; , &#39;周梅&#39; , &#39;1991-12-01&#39; , &#39;女&#39;);
insert into Student values(&#39;06&#39; , &#39;吴兰&#39; , &#39;1992-03-01&#39; , &#39;女&#39;);
insert into Student values(&#39;07&#39; , &#39;郑竹&#39; , &#39;1989-07-01&#39; , &#39;女&#39;);
insert into Student values(&#39;08&#39; , &#39;王菊&#39; , &#39;1990-01-20&#39; , &#39;女&#39;);
#--课程表测试数据
insert into Course values(&#39;01&#39; , &#39;语文&#39; , &#39;02&#39;);
insert into Course values(&#39;02&#39; , &#39;数学&#39; , &#39;01&#39;);
insert into Course values(&#39;03&#39; , &#39;英语&#39; , &#39;03&#39;);
#--教师表测试数据
insert into Teacher values(&#39;01&#39; , &#39;张三&#39;);
insert into Teacher values(&#39;02&#39; , &#39;李四&#39;);
insert into Teacher values(&#39;03&#39; , &#39;王五&#39;);
#--成绩表测试数据
insert into Score values(&#39;01&#39; , &#39;01&#39; , 80);insert into Score values(&#39;01&#39; , &#39;02&#39; , 90);insert into Score values(&#39;01&#39; , &#39;03&#39; , 99);insert into Score values(&#39;02&#39; , &#39;01&#39; , 70);insert into Score values(&#39;02&#39; , &#39;02&#39; , 60);insert into Score values(&#39;02&#39; , &#39;03&#39; , 80);insert into Score values(&#39;03&#39; , &#39;01&#39; , 80);insert into Score values(&#39;03&#39; , &#39;02&#39; , 80);insert into Score values(&#39;03&#39; , &#39;03&#39; , 80);insert into Score values(&#39;04&#39; , &#39;01&#39; , 50);insert into Score values(&#39;04&#39; , &#39;02&#39; , 30);insert into Score values(&#39;04&#39; , &#39;03&#39; , 20);insert into Score values(&#39;05&#39; , &#39;01&#39; , 76);insert into Score values(&#39;05&#39; , &#39;02&#39; , 87);insert into Score values(&#39;06&#39; , &#39;01&#39; , 31);insert into Score values(&#39;06&#39; , &#39;03&#39; , 34);insert into Score values(&#39;07&#39; , &#39;02&#39; , 89);insert into Score values(&#39;07&#39; , &#39;03&#39; , 98);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="练习题和答案" tabindex="-1"><a class="header-anchor" href="#练习题和答案" aria-hidden="true">#</a> 练习题和答案</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>-- 1、查询&quot;01&quot;课程比&quot;02&quot;课程成绩高的学生的信息及课程分数select a.*,b.s_score as score01,c.s_score as score02 FROM	　　student a 	　　JOIN score b ON a.s_id=b.s_id and b.c_id=&#39;01&#39;	　　LEFT JOIN score c on a.s_id=c.s_id and c.c_id=&#39;02&#39; or c.c_id = NULL	WHERE b.s_score&gt;c.s_score	;
-- 2、查询&quot;01&quot;课程比&quot;02&quot;课程成绩低的学生的信息及课程分数
 
select a.* ,b.s_score as 01_score,c.s_score as 02_score from 
    student a left join score b on a.s_id=b.s_id and b.c_id=&#39;01&#39; or b.c_id=NULL 
     join score c on a.s_id=c.s_id and c.c_id=&#39;02&#39; where b.s_score&lt;c.s_score
 
 
-- 3、查询平均成绩大于等于60分的同学的学生编号和学生姓名和平均成绩
select b.s_id,b.s_name,ROUND(AVG(a.s_score),2) as avg_score from 
    student b 
    join score a on b.s_id = a.s_id
    GROUP BY b.s_id,b.s_name HAVING ROUND(AVG(a.s_score),2)&gt;=60;
 
 
-- 4、查询平均成绩小于60分的同学的学生编号和学生姓名和平均成绩
        -- (包括有成绩的和无成绩的)
 
select b.s_id,b.s_name,ROUND(AVG(a.s_score),2) as avg_score from 
    student b 
    left join score a on b.s_id = a.s_id
    GROUP BY b.s_id,b.s_name HAVING ROUND(AVG(a.s_score),2)&lt;60
    union
select a.s_id,a.s_name,0 as avg_score from 
    student a 
    where a.s_id not in (
                select distinct s_id from score);
 
 
-- 5、查询所有同学的学生编号、学生姓名、选课总数、所有课程的总成绩
select a.s_id,a.s_name,count(b.c_id) as sum_course,sum(b.s_score) as sum_score from 
    student a 
    left join score b on a.s_id=b.s_id
    GROUP BY a.s_id,a.s_name;
 
 
-- 6、查询&quot;李&quot;姓老师的数量 
select count(t_id) from teacher where t_name like &#39;李%&#39;;
 
-- 7、查询学过&quot;张三&quot;老师授课的同学的信息 
select a.* from 
    student a 
    join score b on a.s_id=b.s_id where b.c_id in(
        select c_id from course where t_id =(
            select t_id from teacher where t_name = &#39;张三&#39;));
 
-- 8、查询没学过&quot;张三&quot;老师授课的同学的信息 
select * from 
    student c 
    where c.s_id not in(
        select a.s_id from student a join score b on a.s_id=b.s_id where b.c_id in(
            select c_id from course where t_id =(
                select t_id from teacher where t_name = &#39;张三&#39;)));
-- 9、查询学过编号为&quot;01&quot;并且也学过编号为&quot;02&quot;的课程的同学的信息
 
select a.* from 
    student a,score b,score c 
    where a.s_id = b.s_id  and a.s_id = c.s_id and b.c_id=&#39;01&#39; and c.c_id=&#39;02&#39;;
 
-- 10、查询学过编号为&quot;01&quot;但是没有学过编号为&quot;02&quot;的课程的同学的信息
 
select a.* from 
    student a 
    where a.s_id in (select s_id from score where c_id=&#39;01&#39; ) and a.s_id not in(select s_id from score where c_id=&#39;02&#39;)
-- 11、查询没有学全所有课程的同学的信息 
select s.* from 
    student s where s.s_id in(
        select s_id from score where s_id not in(
            select a.s_id from score a 
                join score b on a.s_id = b.s_id and b.c_id=&#39;02&#39;
                join score c on a.s_id = c.s_id and c.c_id=&#39;03&#39;
            where a.c_id=&#39;01&#39;))
-- 12、查询至少有一门课与学号为&quot;01&quot;的同学所学相同的同学的信息 
select * from student where s_id in(
    select distinct a.s_id from score a where a.c_id in(select a.c_id from score a where a.s_id=&#39;01&#39;)
    );
 
-- 13、查询和&quot;01&quot;号的同学学习的课程完全相同的其他同学的信息 
 
select a.* from student a where a.s_id in(
    select distinct s_id from score where s_id!=&#39;01&#39; and c_id in(select c_id from score where s_id=&#39;01&#39;)
    group by s_id 
    having count(1)=(select count(1) from score where s_id=&#39;01&#39;));
-- 14、查询没学过&quot;张三&quot;老师讲授的任一门课程的学生姓名 
select a.s_name from student a where a.s_id not in (
    select s_id from score where c_id = 
                (select c_id from course where t_id =(
                    select t_id from teacher where t_name = &#39;张三&#39;)) 
                group by s_id);
 
-- 15、查询两门及其以上不及格课程的同学的学号，姓名及其平均成绩 
select a.s_id,a.s_name,ROUND(AVG(b.s_score)) from 
    student a 
    left join score b on a.s_id = b.s_id
    where a.s_id in(
            select s_id from score where s_score&lt;60 GROUP BY  s_id having count(1)&gt;=2)
    GROUP BY a.s_id,a.s_name
 
-- 16、检索&quot;01&quot;课程分数小于60，按分数降序排列的学生信息
select a.*,b.c_id,b.s_score from 
    student a,score b 
    where a.s_id = b.s_id and b.c_id=&#39;01&#39; and b.s_score&lt;60 ORDER BY b.s_score DESC;
 
-- 17、按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩
select a.s_id,(select s_score from score where s_id=a.s_id and c_id=&#39;01&#39;) as 语文,
                (select s_score from score where s_id=a.s_id and c_id=&#39;02&#39;) as 数学,
                (select s_score from score where s_id=a.s_id and c_id=&#39;03&#39;) as 英语,
            round(avg(s_score),2) as 平均分 from score a  GROUP BY a.s_id ORDER BY 平均分 DESC;
 
-- 18.查询各科成绩最高分、最低分和平均分：以如下形式显示：课程ID，课程name，最高分，最低分，平均分，及格率，中等率，优良率，优秀率
--及格为&gt;=60，中等为：70-80，优良为：80-90，优秀为：&gt;=90
select a.c_id,b.c_name,MAX(s_score),MIN(s_score),ROUND(AVG(s_score),2),
    ROUND(100*(SUM(case when a.s_score&gt;=60 then 1 else 0 end)/SUM(case when a.s_score then 1 else 0 end)),2) as 及格率,
    ROUND(100*(SUM(case when a.s_score&gt;=70 and a.s_score&lt;=80 then 1 else 0 end)/SUM(case when a.s_score then 1 else 0 end)),2) as 中等率,
    ROUND(100*(SUM(case when a.s_score&gt;=80 and a.s_score&lt;=90 then 1 else 0 end)/SUM(case when a.s_score then 1 else 0 end)),2) as 优良率,
    ROUND(100*(SUM(case when a.s_score&gt;=90 then 1 else 0 end)/SUM(case when a.s_score then 1 else 0 end)),2) as 优秀率
    from score a left join course b on a.c_id = b.c_id GROUP BY a.c_id,b.c_name
-- 19、按各科成绩进行排序，并显示排名(实现不完全)
-- mysql没有rank函数
    select a.s_id,a.c_id,
        @i:=@i +1 as i保留排名,
        @k:=(case when @score=a.s_score then @k else @i end) as rank不保留排名,
        @score:=a.s_score as score
    from (
        select s_id,c_id,s_score from score WHERE c_id=&#39;01&#39; GROUP BY s_id,c_id,s_score ORDER BY s_score DESC
)a,(select @k:=0,@i:=0,@score:=0)s
    union
    select a.s_id,a.c_id,
        @i:=@i +1 as i,
        @k:=(case when @score=a.s_score then @k else @i end) as rank,
        @score:=a.s_score as score
    from (
        select s_id,c_id,s_score from score WHERE c_id=&#39;02&#39; GROUP BY s_id,c_id,s_score ORDER BY s_score DESC
)a,(select @k:=0,@i:=0,@score:=0)s
    union
    select a.s_id,a.c_id,
        @i:=@i +1 as i,
        @k:=(case when @score=a.s_score then @k else @i end) as rank,
        @score:=a.s_score as score
    from (
        select s_id,c_id,s_score from score WHERE c_id=&#39;03&#39; GROUP BY s_id,c_id,s_score ORDER BY s_score DESC
)a,(select @k:=0,@i:=0,@score:=0)s
-- 20、查询学生的总成绩并进行排名
select a.s_id,
    @i:=@i+1 as i,
    @k:=(case when @score=a.sum_score then @k else @i end) as rank,
    @score:=a.sum_score as score
from (select s_id,SUM(s_score) as sum_score from score GROUP BY s_id ORDER BY sum_score DESC)a,
    (select @k:=0,@i:=0,@score:=0)s
-- 21、查询不同老师所教不同课程平均分从高到低显示 
    select a.t_id,c.t_name,a.c_id,ROUND(avg(s_score),2) as avg_score from course a
        left join score b on a.c_id=b.c_id 
        left join teacher c on a.t_id=c.t_id
        GROUP BY a.c_id,a.t_id,c.t_name ORDER BY avg_score DESC;
-- 22、查询所有课程的成绩第2名到第3名的学生信息及该课程成绩
 
            select d.*,c.排名,c.s_score,c.c_id from (
                select a.s_id,a.s_score,a.c_id,@i:=@i+1 as 排名 from score a,(select @i:=0)s where a.c_id=&#39;01&#39;    
            )c
            left join student d on c.s_id=d.s_id
            where 排名 BETWEEN 2 AND 3
            UNION
            select d.*,c.排名,c.s_score,c.c_id from (
                select a.s_id,a.s_score,a.c_id,@j:=@j+1 as 排名 from score a,(select @j:=0)s where a.c_id=&#39;02&#39;    
            )c
            left join student d on c.s_id=d.s_id
            where 排名 BETWEEN 2 AND 3
            UNION
            select d.*,c.排名,c.s_score,c.c_id from (
                select a.s_id,a.s_score,a.c_id,@k:=@k+1 as 排名 from score a,(select @k:=0)s where a.c_id=&#39;03&#39;    
            )c
            left join student d on c.s_id=d.s_id
            where 排名 BETWEEN 2 AND 3;
 
 
-- 23、统计各科成绩各分数段人数：课程编号,课程名称,[100-85],[85-70],[70-60],[0-60]及所占百分比
 
 
        select distinct f.c_name,a.c_id,b.\`85-100\`,b.百分比,c.\`70-85\`,c.百分比,d.\`60-70\`,d.百分比,e.\`0-60\`,e.百分比 from score a
                left join (select c_id,SUM(case when s_score &gt;85 and s_score &lt;=100 then 1 else 0 end) as \`85-100\`,
                                            ROUND(100*(SUM(case when s_score &gt;85 and s_score &lt;=100 then 1 else 0 end)/count(*)),2) as 百分比
                                from score GROUP BY c_id)b on a.c_id=b.c_id
                left join (select c_id,SUM(case when s_score &gt;70 and s_score &lt;=85 then 1 else 0 end) as \`70-85\`,
                                            ROUND(100*(SUM(case when s_score &gt;70 and s_score &lt;=85 then 1 else 0 end)/count(*)),2) as 百分比
                                from score GROUP BY c_id)c on a.c_id=c.c_id
                left join (select c_id,SUM(case when s_score &gt;60 and s_score &lt;=70 then 1 else 0 end) as \`60-70\`,
                                            ROUND(100*(SUM(case when s_score &gt;60 and s_score &lt;=70 then 1 else 0 end)/count(*)),2) as 百分比
                                from score GROUP BY c_id)d on a.c_id=d.c_id
                left join (select c_id,SUM(case when s_score &gt;=0 and s_score &lt;=60 then 1 else 0 end) as \`0-60\`,
                                            ROUND(100*(SUM(case when s_score &gt;=0 and s_score &lt;=60 then 1 else 0 end)/count(*)),2) as 百分比
                                from score GROUP BY c_id)e on a.c_id=e.c_id
                left join course f on a.c_id = f.c_id
-- 24、查询学生平均成绩及其名次 
        select a.s_id,
                @i:=@i+1 as &#39;不保留空缺排名&#39;,
                @k:=(case when @avg_score=a.avg_s then @k else @i end) as &#39;保留空缺排名&#39;,
                @avg_score:=avg_s as &#39;平均分&#39;
        from (select s_id,ROUND(AVG(s_score),2) as avg_s from score GROUP BY s_id)a,(select @avg_score:=0,@i:=0,@k:=0)b;
-- 25、查询各科成绩前三名的记录
            -- 1.选出b表比a表成绩大的所有组
            -- 2.选出比当前id成绩大的 小于三个的
        select a.s_id,a.c_id,a.s_score from score a 
            left join score b on a.c_id = b.c_id and a.s_score&lt;b.s_score
            group by a.s_id,a.c_id,a.s_score HAVING COUNT(b.s_id)&lt;3
            ORDER BY a.c_id,a.s_score DESC
 
-- 26、查询每门课程被选修的学生数 
 
        select c_id,count(s_id) from score a GROUP BY c_id
 
-- 27、查询出只有两门课程的全部学生的学号和姓名 
        select s_id,s_name from student where s_id in(
                select s_id from score GROUP BY s_id HAVING COUNT(c_id)=2);
 
-- 28、查询男生、女生人数 
        select s_sex,COUNT(s_sex) as 人数  from student GROUP BY s_sex
 
-- 29、查询名字中含有&quot;风&quot;字的学生信息
 
        select * from student where s_name like &#39;%风%&#39;;
 
-- 30、查询同名同性学生名单，并统计同名人数 
 
        select a.s_name,a.s_sex,count(*) from student a  JOIN 
                    student b on a.s_id !=b.s_id and a.s_name = b.s_name and a.s_sex = b.s_sex
        GROUP BY a.s_name,a.s_sex
 
 
 
-- 31、查询1990年出生的学生名单
 
        select s_name from student where s_birth like &#39;1990%&#39;
 
-- 32、查询每门课程的平均成绩，结果按平均成绩降序排列，平均成绩相同时，按课程编号升序排列 
 
    select c_id,ROUND(AVG(s_score),2) as avg_score from score GROUP BY c_id ORDER BY avg_score DESC,c_id ASC
 
-- 33、查询平均成绩大于等于85的所有学生的学号、姓名和平均成绩 
 
    select a.s_id,b.s_name,ROUND(avg(a.s_score),2) as avg_score from score a
        left join student b on a.s_id=b.s_id GROUP BY s_id HAVING avg_score&gt;=85
 
-- 34、查询课程名称为&quot;数学&quot;，且分数低于60的学生姓名和分数 
 
        select a.s_name,b.s_score from score b LEFT JOIN student a on a.s_id=b.s_id where b.c_id=(
                    select c_id from course where c_name =&#39;数学&#39;) and b.s_score&lt;60
 
-- 35、查询所有学生的课程及分数情况； 
 
 
        select a.s_id,a.s_name,
                    SUM(case c.c_name when &#39;语文&#39; then b.s_score else 0 end) as &#39;语文&#39;,
                    SUM(case c.c_name when &#39;数学&#39; then b.s_score else 0 end) as &#39;数学&#39;,
                    SUM(case c.c_name when &#39;英语&#39; then b.s_score else 0 end) as &#39;英语&#39;,
                    SUM(b.s_score) as  &#39;总分&#39;
        from student a left join score b on a.s_id = b.s_id 
        left join course c on b.c_id = c.c_id 
        GROUP BY a.s_id,a.s_name
 
 
 -- 36、查询任何一门课程成绩在70分以上的姓名、课程名称和分数； 
            select a.s_name,b.c_name,c.s_score from course b left join score c on b.c_id = c.c_id
                left join student a on a.s_id=c.s_id where c.s_score&gt;=70
 
 
 
-- 37、查询不及格的课程
        select a.s_id,a.c_id,b.c_name,a.s_score from score a left join course b on a.c_id = b.c_id
            where a.s_score&lt;60 
 
--38、查询课程编号为01且课程成绩在80分以上的学生的学号和姓名； 
        select a.s_id,b.s_name from score a LEFT JOIN student b on a.s_id = b.s_id
            where a.c_id = &#39;01&#39; and a.s_score&gt;80
 
-- 39、求每门课程的学生人数 
        select count(*) from score GROUP BY c_id;
 
-- 40、查询选修&quot;张三&quot;老师所授课程的学生中，成绩最高的学生信息及其成绩
 
 
        -- 查询老师id   
        select c_id from course c,teacher d where c.t_id=d.t_id and d.t_name=&#39;张三&#39;
        -- 查询最高分（可能有相同分数）
        select MAX(s_score) from score where c_id=&#39;02&#39;
        -- 查询信息
        select a.*,b.s_score,b.c_id,c.c_name from student a
            LEFT JOIN score b on a.s_id = b.s_id
            LEFT JOIN course c on b.c_id=c.c_id
            where b.c_id =(select c_id from course c,teacher d where c.t_id=d.t_id and d.t_name=&#39;张三&#39;)
            and b.s_score in (select MAX(s_score) from score where c_id=&#39;02&#39;)
-- 41、查询不同课程成绩相同的学生的学生编号、课程编号、学生成绩 
    select DISTINCT b.s_id,b.c_id,b.s_score from score a,score b where a.c_id != b.c_id and a.s_score = b.s_score
-- 42、查询每门功成绩最好的前两名 
        -- 牛逼的写法
    select a.s_id,a.c_id,a.s_score from score a
        where (select COUNT(1) from score b where b.c_id=a.c_id and b.s_score&gt;=a.s_score)&lt;=2 ORDER BY a.c_id
-- 43、统计每门课程的学生选修人数（超过5人的课程才统计）。要求输出课程号和选修人数，查询结果按人数降序排列，若人数相同，按课程号升序排列  
        select c_id,count(*) as total from score GROUP BY c_id HAVING total&gt;5 ORDER BY total,c_id ASC
-- 44、检索至少选修两门课程的学生学号 
        select s_id,count(*) as sel from score GROUP BY s_id HAVING sel&gt;=2
-- 45、查询选修了全部课程的学生信息 
        select * from student where s_id in(        
            select s_id from score GROUP BY s_id HAVING count(*)=(select count(*) from course))
--46、查询各学生的年龄
    -- 按照出生日期来算，当前月日 &lt; 出生年月的月日则，年龄减一
    select s_birth,(DATE_FORMAT(NOW(),&#39;%Y&#39;)-DATE_FORMAT(s_birth,&#39;%Y&#39;) - 
                (case when DATE_FORMAT(NOW(),&#39;%m%d&#39;)&gt;DATE_FORMAT(s_birth,&#39;%m%d&#39;) then 0 else 1 end)) as age
        from student;
 
 
-- 47、查询本周过生日的学生
    select * from student where WEEK(DATE_FORMAT(NOW(),&#39;%Y%m%d&#39;))=WEEK(s_birth)
    select * from student where YEARWEEK(s_birth)=YEARWEEK(DATE_FORMAT(NOW(),&#39;%Y%m%d&#39;))
 
    select WEEK(DATE_FORMAT(NOW(),&#39;%Y%m%d&#39;))
 
-- 48、查询下周过生日的学生
    select * from student where WEEK(DATE_FORMAT(NOW(),&#39;%Y%m%d&#39;))+1 =WEEK(s_birth)
 
-- 49、查询本月过生日的学生
 
    select * from student where MONTH(DATE_FORMAT(NOW(),&#39;%Y%m%d&#39;)) =MONTH(s_birth)
 
-- 50、查询下月过生日的学生
    select * from student where MONTH(DATE_FORMAT(NOW(),&#39;%Y%m%d&#39;))+1 =MONTH(s_birth)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9),l=[c];function r(a,v){return s(),i("div",null,l)}const m=e(d,[["render",r],["__file","MySQL五十道查询题目.html.vue"]]);export{m as default};
