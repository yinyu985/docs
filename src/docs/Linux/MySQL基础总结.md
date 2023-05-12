# MySQL基础总结
## 登录数据库

```
mysql -u root -p
-u指定用户
-h指定登录的主机IP，不写就是本机。
-p写密码的
```

## 新建用户，赋权限

```
GRANT ALL PRIVILEGES ON grafana.* TO 'test'@'%' IDENTIFIED BY 'testpassword'
授予test用户所有权限，并允许他从任意的IP登录，如果要限制网段，例如，'10.23.140.%',限制了数据库grafana里面的所有表，*通配符，表示所有表
*.*意味着授权所有数据库的所有表。
```

## 基本操作

```
创建数据库
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
```

## 创建表

```
CREATE TABLE test(
   -> id INT NOT NULL AUTO_INCREMENT, #不是空的，自增。
   -> name VARCHAR(100) NOT NULL, #姓名，字符类型，varchar会根据具体长短伸缩，char就是固定长短，有点费空间
   -> date DATE,#日期类型
   -> PRIMARY KEY ( runoob_id )#定义主键
   -> )ENGINE=InnoDB DEFAULT CHARSET=utf8; #设定数据库引擎和字符编码
```

## 删除表

```
DROP TABLE test;
```

## 插入数据

```
INSERT INTO test ( id, name,date )
                       VALUES
                       ( value1, value2,...valueN );
```

如果数据是字符型，必须使用单引号或者双引号，如："value"。

## 查询

```
select * from test;
```

## 修改数据

```
UPDATE test SET id=1, name='test' where '条件'
```

## 修改数据

```
DELETE FROM test where '条件'
```

WHERE 子句中可以使用等号 **=** 来设定获取数据的条件，如 "runoob_author = 'RUNOOB.COM'"。

但是有时候我们需要获取 runoob_author 字段含有 "COM" 字符的所有记录，这时我们就需要在 WHERE 子句中使用 SQL LIKE 子句。

SQL LIKE 子句中使用百分号 **%**字符来表示任意字符，类似于UNIX或正则表达式中的星号 *****。

如果没有使用百分号 **%**, LIKE 子句与等号 **=** 的效果是一样的。

```
SELECT id, name
FROM test
WHERE info LIKE '%a'
查找info这一列中结尾是a的id,和name
```

## Group分组

```
SELECT id, sum(id)
FROM test
WHERE id =1
GROUP BY name;
```

## 联合查询

可以在 SELECT, UPDATE 和 DELETE 语句中使用 Mysql 的 JOIN 来联合多表查询。

JOIN 按照功能大致分为如下三类：

- **INNER JOIN（内连接,或等值连接）**：获取两个表中字段匹配关系的记录。
- **LEFT JOIN（左连接）：**获取左表所有记录，即使右表没有对应匹配的记录。
- **RIGHT JOIN（右连接）：** 与 LEFT JOIN 相反，用于获取右表所有记录，即使左表没有对应匹配的记录。

## 数据导出

mysqldump 是 mysql 用于转存储数据库的实用程序。它主要产生一个 SQL 脚本，其中包含从头重新创建数据库所必需的命令 CREATE TABLE INSERT 等。使用 mysqldump 导出数据需要使用 --tab 选项来指定导出文件指定的目录

```
mysqldump -u db_username -p db_name table_name > ~/db.sql
```

