import{_ as p,W as t,X as l,Y as n,Z as a,$ as e,a1 as c,D as o}from"./framework-ab2cdc09.js";const i={},u=c(`<p>我承认我可能是标题党了，因为每个人对大的理解肯定是不一样的，更何况我说的是超大。其实就是10TB，对我一个没见过大世面的行业新人和fdisk来说，它确实算大的了，本文介绍对parted的学习和实际使用。<!--more--></p><p><code>parted</code>是由GNU组织开发的一款功能强大的磁盘分区和分区大小调整工具，与fdisk不同，它支持调整分区的大小。作为一种设计用于Linux的工具，它没有构建成处理与fdisk关联的多种分区类型，但是，它可以处理最常见的分区格式，包括：ext2、ext3、fat16、fat32、NTFS、ReiserFS、JFS、XFS、UFS、HFS以及Linux交换分区。</p><h2 id="前情提要" tabindex="-1"><a class="header-anchor" href="#前情提要" aria-hidden="true">#</a> 前情提要：</h2><blockquote><ol><li>我们可以使用 fdisk命令对硬盘进行快速的分区，但对高于 2TB 的硬盘分区，此命令却无能为力。</li><li>MBR分区表，仅支持最大四个主分区，且不支持2TB以上的磁盘，因此，大磁盘更适合使用parted进行GPT的分区。</li><li>fdisk工具虽然很好用，但对于大于2T以上的硬盘分区特别慢，可能一部分容量识别不了，也不支持非交互模式。</li></ol></blockquote><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">###查看现在的硬盘容量</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># df -mh</span>
文件系统                 容量  已用  可用 已用% 挂载点
devtmpfs                 <span class="token number">7</span>.8G     <span class="token number">0</span>  <span class="token number">7</span>.8G    <span class="token number">0</span>% /dev
tmpfs                    <span class="token number">7</span>.8G     <span class="token number">0</span>  <span class="token number">7</span>.8G    <span class="token number">0</span>% /dev/shm
tmpfs                    <span class="token number">7</span>.8G  124M  <span class="token number">7</span>.7G    <span class="token number">2</span>% /run
tmpfs                    <span class="token number">7</span>.8G     <span class="token number">0</span>  <span class="token number">7</span>.8G    <span class="token number">0</span>% /sys/fs/cgroup
/dev/mapper/centos-root  <span class="token number">2</span>.3T  <span class="token number">2</span>.2T  181G   <span class="token number">93</span>% /
/dev/sda1                197M  128M   69M   <span class="token number">66</span>% /boot
tmpfs                    <span class="token number">1</span>.6G     <span class="token number">0</span>  <span class="token number">1</span>.6G    <span class="token number">0</span>% /run/user/0
<span class="token comment">###查看现在一共有多少块盘，可以看到sdd是10T，可惜不是SSD哈哈哈。</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lsblk</span>
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               <span class="token number">8</span>:0    <span class="token number">0</span>  300G  <span class="token number">0</span> disk 
├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>  200M  <span class="token number">0</span> part /boot
├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span> <span class="token number">59</span>.8G  <span class="token number">0</span> part 
│ ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
│ └─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    8G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span>
└─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>  240G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdb               <span class="token number">8</span>:16   <span class="token number">0</span>    1T  <span class="token number">0</span> disk 
└─sdb1            <span class="token number">8</span>:17   <span class="token number">0</span> 1024G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdc               <span class="token number">8</span>:32   <span class="token number">0</span>    1T  <span class="token number">0</span> disk 
└─sdc1            <span class="token number">8</span>:33   <span class="token number">0</span> 1024G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdd               <span class="token number">8</span>:48   <span class="token number">0</span>   10T  <span class="token number">0</span> disk 
sr0              <span class="token number">11</span>:0    <span class="token number">1</span>  973M  <span class="token number">0</span> rom  
<span class="token comment">###fdisk头铁试一试，其实是我一开始并不知道fdisk对于大硬盘不好使。</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># fdisk -l</span>

磁盘 /dev/sda：322.1 GB, <span class="token number">322122547200</span> 字节，629145600 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x000d93fa

   设备 Boot      Start         End      Blocks   Id  System
/dev/sda1   *        <span class="token number">2048</span>      <span class="token number">411647</span>      <span class="token number">204800</span>   <span class="token number">83</span>  Linux
/dev/sda2          <span class="token number">411648</span>   <span class="token number">125829119</span>    <span class="token number">62708736</span>   8e  Linux LVM
/dev/sda3       <span class="token number">125829120</span>   <span class="token number">629145599</span>   <span class="token number">251658240</span>   <span class="token number">83</span>  Linux

磁盘 /dev/mapper/centos-root：2512.3 GB, <span class="token number">2512329375744</span> 字节，4906893312 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节


磁盘 /dev/mapper/centos-swap：8589 MB, <span class="token number">8589934592</span> 字节，16777216 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节


磁盘 /dev/sdb：1099.5 GB, <span class="token number">1099511627776</span> 字节，2147483648 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x3d4c36cf

   设备 Boot      Start         End      Blocks   Id  System
/dev/sdb1            <span class="token number">2048</span>  <span class="token number">2147483647</span>  <span class="token number">1073740800</span>   <span class="token number">83</span>  Linux

磁盘 /dev/sdc：1099.5 GB, <span class="token number">1099511627776</span> 字节，2147483648 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x4125e7ff

   设备 Boot      Start         End      Blocks   Id  System
/dev/sdc1            <span class="token number">2048</span>  <span class="token number">2147483647</span>  <span class="token number">1073740800</span>   <span class="token number">83</span>  Linux

磁盘 /dev/sdd：10995.1 GB, <span class="token number">10995116277760</span> 字节，21474836480 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
<span class="token comment">###还没有意识到问题的严重性</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># fdisk /dev/sdd </span>
欢迎使用 <span class="token function">fdisk</span> <span class="token punctuation">(</span>util-linux <span class="token number">2.23</span>.2<span class="token punctuation">)</span>。

更改将停留在内存中，直到您决定将更改写入磁盘。
使用写入命令前请三思。

Device does not contain a recognized partition table
使用磁盘标识符 0x4dde7e22 创建新的 DOS 磁盘标签。

WARNING: The size of this disk is <span class="token number">11.0</span> TB <span class="token punctuation">(</span><span class="token number">10995116277760</span> bytes<span class="token punctuation">)</span>.
DOS partition table <span class="token function">format</span> can not be used on drives <span class="token keyword">for</span> volumes
larger than <span class="token punctuation">(</span><span class="token number">2199023255040</span> bytes<span class="token punctuation">)</span> <span class="token keyword">for</span> <span class="token number">512</span>-byte sectors. Use parted<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> and GUID 
partition table <span class="token function">format</span> <span class="token punctuation">(</span>GPT<span class="token punctuation">)</span>.
<span class="token comment">###上面直接写了larget than，叫你用parted并且叫你用GPT格式，然而我没看到</span>

命令<span class="token punctuation">(</span>输入 m 获取帮助<span class="token punctuation">)</span>：n
Partition type:
   p   primary <span class="token punctuation">(</span><span class="token number">0</span> primary, <span class="token number">0</span> extended, <span class="token number">4</span> <span class="token function">free</span><span class="token punctuation">)</span>
   e   extended
Select <span class="token punctuation">(</span>default p<span class="token punctuation">)</span>: 
Using default response p
分区号 <span class="token punctuation">(</span><span class="token number">1</span>-4，默认 <span class="token number">1</span><span class="token punctuation">)</span>：
起始 扇区 <span class="token punctuation">(</span><span class="token number">2048</span>-4294967295，默认为 <span class="token number">2048</span><span class="token punctuation">)</span>：
将使用默认值 <span class="token number">2048</span>
Last 扇区, +扇区 or +size<span class="token punctuation">{</span>K,M,G<span class="token punctuation">}</span> <span class="token punctuation">(</span><span class="token number">2048</span>-4294967294，默认为 <span class="token number">4294967294</span><span class="token punctuation">)</span>：
将使用默认值 <span class="token number">4294967294</span>
分区 <span class="token number">1</span> 已设置为 Linux 类型，大小设为 <span class="token number">2</span> TiB

命令<span class="token punctuation">(</span>输入 m 获取帮助<span class="token punctuation">)</span>：n
Partition type:
   p   primary <span class="token punctuation">(</span><span class="token number">1</span> primary, <span class="token number">0</span> extended, <span class="token number">3</span> <span class="token function">free</span><span class="token punctuation">)</span>
   e   extended
Select <span class="token punctuation">(</span>default p<span class="token punctuation">)</span>: 
Using default response p
分区号 <span class="token punctuation">(</span><span class="token number">2</span>-4，默认 <span class="token number">2</span><span class="token punctuation">)</span>：
起始 扇区 <span class="token punctuation">(</span><span class="token number">4294967295</span>-4294967295，默认为 <span class="token number">4294967295</span><span class="token punctuation">)</span>：
将使用默认值 <span class="token number">4294967295</span>
分区 <span class="token number">2</span> 已设置为 Linux 类型，大小设为 <span class="token number">512</span> B

命令<span class="token punctuation">(</span>输入 m 获取帮助<span class="token punctuation">)</span>：p

磁盘 /dev/sdd：10995.1 GB, <span class="token number">10995116277760</span> 字节，21474836480 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x4dde7e22

   设备 Boot      Start         End      Blocks   Id  System
/dev/sdd1            <span class="token number">2048</span>  <span class="token number">4294967294</span>  <span class="token number">2147482623</span>+  <span class="token number">83</span>  Linux
/dev/sdd2      <span class="token number">4294967295</span>  <span class="token number">4294967295</span>           <span class="token number">0</span>+  <span class="token number">83</span>  Linux
<span class="token comment">###新建一个发现只有一个好使，第二个是0，灰溜溜的不保存退出了</span>
命令<span class="token punctuation">(</span>输入 m 获取帮助<span class="token punctuation">)</span>：q
<span class="token comment">###关于保存退出，需要注意的是parted 中所有的操作都是立即生效的，没有保存生效的概念。这一点和 fdisk 交互命令明显不同，所以做的所有操作大家要加倍小心。                                                           </span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sdd</span>
GNU Parted <span class="token number">3.1</span>
使用 /dev/sdd
Welcome to GNU Parted<span class="token operator">!</span> Type <span class="token string">&#39;help&#39;</span> to view a list of commands.
<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> p                                                                
错误: /dev/sdd: unrecognised disk label
<span class="token comment">###这里报错不认识的硬盘标签，没事，后面就认识了。</span>
Model: VMware Virtual disk <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span>                                         
Disk /dev/sdd: <span class="token number">11</span>.0TB
Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B
Partition Table: unknown
Disk Flags: 
<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> mklabel gpt
<span class="token comment">###修改分区表命令                                                 </span>
<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> mkpart
<span class="token comment">###输入创建分区命令，后面不要参数，全部靠交互</span>
分区名称？  <span class="token punctuation">[</span><span class="token punctuation">]</span>? sdd1
文件系统类型？  <span class="token punctuation">[</span>ext2<span class="token punctuation">]</span>? xfs                                      
起始点？ <span class="token number">0</span>                                                                
结束点？ <span class="token number">11</span>.0TB                                                           
警告: The resulting partition is not properly aligned <span class="token keyword">for</span> best performance.
<span class="token comment">###这里需要注意了，它说这样分的话，没有正确对齐的分区会影响硬盘的性能。</span>
忽略/Ignore/放弃/Cancel? cancel    
<span class="token comment">###于是我取消了这一步操作，这个跟前面的注意事项不冲突，毕竟这是他跟我说可以取消的。</span>
<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> q                                                                
信息: You may need to update /etc/fstab.

<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lsblk    </span>
<span class="token comment">###一看硬盘没啥变化。</span>
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               <span class="token number">8</span>:0    <span class="token number">0</span>  300G  <span class="token number">0</span> disk 
├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>  200M  <span class="token number">0</span> part /boot
├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span> <span class="token number">59</span>.8G  <span class="token number">0</span> part 
│ ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
│ └─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    8G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span>
└─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>  240G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdb               <span class="token number">8</span>:16   <span class="token number">0</span>    1T  <span class="token number">0</span> disk 
└─sdb1            <span class="token number">8</span>:17   <span class="token number">0</span> 1024G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdc               <span class="token number">8</span>:32   <span class="token number">0</span>    1T  <span class="token number">0</span> disk 
└─sdc1            <span class="token number">8</span>:33   <span class="token number">0</span> 1024G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdd               <span class="token number">8</span>:48   <span class="token number">0</span>   10T  <span class="token number">0</span> disk 
sr0              <span class="token number">11</span>:0    <span class="token number">1</span>  973M  <span class="token number">0</span> rom                                                               
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># fdisk -l  </span>
<span class="token comment">###再看看，发现还是有变化的，至少变成了GPT。</span>

磁盘 /dev/sda：322.1 GB, <span class="token number">322122547200</span> 字节，629145600 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x000d93fa

   设备 Boot      Start         End      Blocks   Id  System
/dev/sda1   *        <span class="token number">2048</span>      <span class="token number">411647</span>      <span class="token number">204800</span>   <span class="token number">83</span>  Linux
/dev/sda2          <span class="token number">411648</span>   <span class="token number">125829119</span>    <span class="token number">62708736</span>   8e  Linux LVM
/dev/sda3       <span class="token number">125829120</span>   <span class="token number">629145599</span>   <span class="token number">251658240</span>   <span class="token number">83</span>  Linux

磁盘 /dev/mapper/centos-root：2512.3 GB, <span class="token number">2512329375744</span> 字节，4906893312 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节


磁盘 /dev/mapper/centos-swap：8589 MB, <span class="token number">8589934592</span> 字节，16777216 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节


磁盘 /dev/sdb：1099.5 GB, <span class="token number">1099511627776</span> 字节，2147483648 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x3d4c36cf

   设备 Boot      Start         End      Blocks   Id  System
/dev/sdb1            <span class="token number">2048</span>  <span class="token number">2147483647</span>  <span class="token number">1073740800</span>   <span class="token number">83</span>  Linux

磁盘 /dev/sdc：1099.5 GB, <span class="token number">1099511627776</span> 字节，2147483648 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：dos
磁盘标识符：0x4125e7ff

   设备 Boot      Start         End      Blocks   Id  System
/dev/sdc1            <span class="token number">2048</span>  <span class="token number">2147483647</span>  <span class="token number">1073740800</span>   <span class="token number">83</span>  Linux
WARNING: <span class="token function">fdisk</span> GPT support is currently new, and therefore <span class="token keyword">in</span> an experimental phase. Use at your own discretion.
<span class="token comment">###这里说fdisk现在支持GPT了，不过是在试验阶段，用不用你自己决定。</span>
磁盘 /dev/sdd：10995.1 GB, <span class="token number">10995116277760</span> 字节，21474836480 个扇区
Units <span class="token operator">=</span> 扇区 of <span class="token number">1</span> * <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
扇区大小<span class="token punctuation">(</span>逻辑/物理<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
I/O 大小<span class="token punctuation">(</span>最小/最佳<span class="token punctuation">)</span>：512 字节 / <span class="token number">512</span> 字节
磁盘标签类型：gpt
Disk identifier: FE3E929B-4D5C-440D-8373-92F8AB438821

Start          End    Size  Type            Name
<span class="token comment">###查了一遍资料的我又回来了，刚才说没对齐就是因为下面的四个参数，正确的做法还需要计算，不过好在这是一块新硬盘，没数据，搞不坏。</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># cat /sys/block/sdd/queue/optimal_io_size</span>
<span class="token number">0</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># cat /sys/block/sdd/queue/minimum_io_size</span>
<span class="token number">512</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># cat /sys/block/sdd/alignment_offset</span>
<span class="token number">0</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># cat /sys/block/sdd/queue/physical_block_size</span>
<span class="token number">512</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># parted /dev/sdd</span>
GNU Parted <span class="token number">3.1</span>
使用 /dev/sdd
Welcome to GNU Parted<span class="token operator">!</span> Type <span class="token string">&#39;help&#39;</span> to view a list of commands.
<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> p                                                                
Model: VMware Virtual disk <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span>
Disk /dev/sdd: <span class="token number">11</span>.0TB
Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B
Partition Table: gpt
Disk Flags: 

Number  Start  End  Size  File system  Name  标志

<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> print
Model: VMware Virtual disk <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span>
Disk /dev/sdd: <span class="token number">11</span>.0TB
Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B
Partition Table: gpt
Disk Flags: 

Number  Start  End  Size  File system  Name  标志

<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> mkpart primary <span class="token number">0</span>.00T <span class="token number">100</span>%
<span class="token comment">###这样就不用计算了，也不会存在没对齐的情况，parted /dev/sdb mkpart primary xfs 0% 100%，这是一条非交互式命令，在mkpart的时候选中整个硬盘，新建为一个分区，和我所使用的命令类似,至于如何创建多个分区，请查看mkpart的具体用法。</span>


<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> p                                                                
Model: VMware Virtual disk <span class="token punctuation">(</span>scsi<span class="token punctuation">)</span>
Disk /dev/sdd: <span class="token number">11</span>.0TB
Sector size <span class="token punctuation">(</span>logical/physical<span class="token punctuation">)</span>: 512B/512B
Partition Table: gpt
Disk Flags: 

Number  Start   End     Size    File system  Name     标志
 <span class="token number">1</span>      1049kB  <span class="token number">11</span>.0TB  <span class="token number">11</span>.0TB               primary

<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> align-check optimal <span class="token number">1</span>                                            
<span class="token number">1</span> aligned
<span class="token punctuation">(</span>parted<span class="token punctuation">)</span> quit                                                             
信息: You may need to update /etc/fstab.
<span class="token comment">###这里提示你可能需要更新/etc/fatab</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lsblk</span>
<span class="token comment">###10T硬盘，一个分区，其实稳妥起见多分几个区是最好的，不至于一坏全坏，但是谁叫咱这是小作坊呢。爱咋咋滴！</span>
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               <span class="token number">8</span>:0    <span class="token number">0</span>  300G  <span class="token number">0</span> disk 
├─sda1            <span class="token number">8</span>:1    <span class="token number">0</span>  200M  <span class="token number">0</span> part /boot
├─sda2            <span class="token number">8</span>:2    <span class="token number">0</span> <span class="token number">59</span>.8G  <span class="token number">0</span> part 
│ ├─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
│ └─centos-swap <span class="token number">253</span>:1    <span class="token number">0</span>    8G  <span class="token number">0</span> lvm  <span class="token punctuation">[</span>SWAP<span class="token punctuation">]</span>
└─sda3            <span class="token number">8</span>:3    <span class="token number">0</span>  240G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdb               <span class="token number">8</span>:16   <span class="token number">0</span>    1T  <span class="token number">0</span> disk 
└─sdb1            <span class="token number">8</span>:17   <span class="token number">0</span> 1024G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdc               <span class="token number">8</span>:32   <span class="token number">0</span>    1T  <span class="token number">0</span> disk 
└─sdc1            <span class="token number">8</span>:33   <span class="token number">0</span> 1024G  <span class="token number">0</span> part 
  └─centos-root <span class="token number">253</span>:0    <span class="token number">0</span>  <span class="token number">2</span>.3T  <span class="token number">0</span> lvm  /
sdd               <span class="token number">8</span>:48   <span class="token number">0</span>   10T  <span class="token number">0</span> disk 
└─sdd1            <span class="token number">8</span>:49   <span class="token number">0</span>   10T  <span class="token number">0</span> part 
sr0              <span class="token number">11</span>:0    <span class="token number">1</span>  973M  <span class="token number">0</span> rom  
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># cat /etc/fstab </span>
<span class="token comment">#/etc/fstab Created by anaconda on Sat Oct 22 16:59:09 2022</span>
<span class="token comment">#Accessible filesystems, by reference, are maintained under &#39;/dev/disk&#39;</span>
See <span class="token function">man</span> pages fstab<span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>, findfs<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span>, mount<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> and/or blkid<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> <span class="token keyword">for</span> <span class="token function">more</span> info
<span class="token comment">#</span>
/dev/mapper/centos-root /                       xfs     defaults        <span class="token number">0</span> <span class="token number">0</span>
<span class="token assign-left variable">UUID</span><span class="token operator">=</span><span class="token number">74925622</span>-e002-42b3-aa1c-034b87432c32 /boot                   xfs     defaults        <span class="token number">0</span> <span class="token number">0</span>
/dev/mapper/centos-swap swap                    swap    defaults        <span class="token number">0</span> <span class="token number">0</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># </span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># </span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># </span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># partprobe</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># </span>
<span class="token comment">###后面就是新建PV加到VG的LVM扩容操作了</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># pvscan</span>
  PV /dev/sda2   VG centos          lvm2 <span class="token punctuation">[</span><span class="token number">59.80</span> GiB / <span class="token number">0</span>    free<span class="token punctuation">]</span>
  PV /dev/sda3   VG centos          lvm2 <span class="token punctuation">[</span><span class="token operator">&lt;</span><span class="token number">240.00</span> GiB / <span class="token number">0</span>    free<span class="token punctuation">]</span>
  PV /dev/sdb1   VG centos          lvm2 <span class="token punctuation">[</span><span class="token operator">&lt;</span><span class="token number">1024.00</span> GiB / <span class="token number">0</span>    free<span class="token punctuation">]</span>
  PV /dev/sdc1   VG centos          lvm2 <span class="token punctuation">[</span><span class="token operator">&lt;</span><span class="token number">1024.00</span> GiB / <span class="token number">0</span>    free<span class="token punctuation">]</span>
  Total: <span class="token number">4</span> <span class="token punctuation">[</span><span class="token number">2.29</span> TiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> use: <span class="token number">4</span> <span class="token punctuation">[</span><span class="token number">2.29</span> TiB<span class="token punctuation">]</span> / <span class="token keyword">in</span> no VG: <span class="token number">0</span> <span class="token punctuation">[</span><span class="token number">0</span>   <span class="token punctuation">]</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># </span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># pvcreate /dev/sdd1</span>
  Physical volume <span class="token string">&quot;/dev/sdd1&quot;</span> successfully created.
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># pvs</span>
  PV         VG     Fmt  Attr PSize     PFree  
  /dev/sda2  centos lvm2 a--     <span class="token number">59</span>.80g      <span class="token number">0</span> 
  /dev/sda3  centos lvm2 a--   <span class="token operator">&lt;</span><span class="token number">240</span>.00g      <span class="token number">0</span> 
  /dev/sdb1  centos lvm2 a--  <span class="token operator">&lt;</span><span class="token number">1024</span>.00g      <span class="token number">0</span> 
  /dev/sdc1  centos lvm2 a--  <span class="token operator">&lt;</span><span class="token number">1024</span>.00g      <span class="token number">0</span> 
  /dev/sdd1         lvm2 ---    <span class="token operator">&lt;</span><span class="token number">10</span>.00t <span class="token operator">&lt;</span><span class="token number">10</span>.00t
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lvs</span>
  LV   VG     Attr       LSize Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  root centos -wi-ao---- <span class="token number">2</span>.28t                                                    
  swap centos -wi-ao---- <span class="token number">8</span>.00g                                                    
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># vgextend centos /dev/sdd1</span>
  Volume group <span class="token string">&quot;centos&quot;</span> successfully extended
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># lvextend -l +100%FREE /dev/centos/root</span>
  Size of logical volume centos/root changed from <span class="token number">2.28</span> TiB <span class="token punctuation">(</span><span class="token number">598986</span> extents<span class="token punctuation">)</span> to <span class="token number">12.28</span> TiB <span class="token punctuation">(</span><span class="token number">3220425</span> extents<span class="token punctuation">)</span>.
  Logical volume centos/root successfully resized.
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># df -T</span>
文件系统                类型          1K-块       已用      可用 已用% 挂载点
devtmpfs                devtmpfs    <span class="token number">8111856</span>          <span class="token number">0</span>   <span class="token number">8111856</span>    <span class="token number">0</span>% /dev
tmpfs                   tmpfs       <span class="token number">8123796</span>          <span class="token number">0</span>   <span class="token number">8123796</span>    <span class="token number">0</span>% /dev/shm
tmpfs                   tmpfs       <span class="token number">8123796</span>     <span class="token number">126632</span>   <span class="token number">7997164</span>    <span class="token number">2</span>% /run
tmpfs                   tmpfs       <span class="token number">8123796</span>          <span class="token number">0</span>   <span class="token number">8123796</span>    <span class="token number">0</span>% /sys/fs/cgroup
/dev/mapper/centos-root xfs      <span class="token number">2453420136</span> <span class="token number">2278811760</span> <span class="token number">174608376</span>   <span class="token number">93</span>% /
/dev/sda1               xfs          <span class="token number">201380</span>     <span class="token number">130924</span>     <span class="token number">70456</span>   <span class="token number">66</span>% /boot
tmpfs                   tmpfs       <span class="token number">1624760</span>          <span class="token number">0</span>   <span class="token number">1624760</span>    <span class="token number">0</span>% /run/user/0
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># </span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># xfs_growfs /dev/centos/data</span>
xfs_growfs: /dev/centos/data is not a mounted XFS filesystem
<span class="token comment">###这里有一处小细节，格式化以前都是这么干，没出问题，这次报错了，查了一下，因为它太大了，只能格式化挂在点</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># df -T</span>
文件系统                类型          1K-块       已用      可用 已用% 挂载点
devtmpfs                devtmpfs    <span class="token number">8111856</span>          <span class="token number">0</span>   <span class="token number">8111856</span>    <span class="token number">0</span>% /dev
tmpfs                   tmpfs       <span class="token number">8123796</span>          <span class="token number">0</span>   <span class="token number">8123796</span>    <span class="token number">0</span>% /dev/shm
tmpfs                   tmpfs       <span class="token number">8123796</span>     <span class="token number">126632</span>   <span class="token number">7997164</span>    <span class="token number">2</span>% /run
tmpfs                   tmpfs       <span class="token number">8123796</span>          <span class="token number">0</span>   <span class="token number">8123796</span>    <span class="token number">0</span>% /sys/fs/cgroup
/dev/mapper/centos-root xfs      <span class="token number">2453420136</span> <span class="token number">2280066416</span> <span class="token number">173353720</span>   <span class="token number">93</span>% /
/dev/sda1               xfs          <span class="token number">201380</span>     <span class="token number">130924</span>     <span class="token number">70456</span>   <span class="token number">66</span>% /boot
tmpfs                   tmpfs       <span class="token number">1624760</span>          <span class="token number">0</span>   <span class="token number">1624760</span>    <span class="token number">0</span>% /run/user/0
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># xfs_growfs /</span>
meta-data<span class="token operator">=</span>/dev/mapper/centos-root <span class="token assign-left variable">isize</span><span class="token operator">=</span><span class="token number">512</span>    <span class="token assign-left variable">agcount</span><span class="token operator">=</span><span class="token number">181</span>, <span class="token assign-left variable">agsize</span><span class="token operator">=</span><span class="token number">3394816</span> blks
         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">attr</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">projid32bit</span><span class="token operator">=</span><span class="token number">1</span>
         <span class="token operator">=</span>                       <span class="token assign-left variable">crc</span><span class="token operator">=</span><span class="token number">1</span>        <span class="token assign-left variable">finobt</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">spinodes</span><span class="token operator">=</span><span class="token number">0</span>
data     <span class="token operator">=</span>                       <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">613361664</span>, <span class="token assign-left variable">imaxpct</span><span class="token operator">=</span><span class="token number">25</span>
         <span class="token operator">=</span>                       <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span>      <span class="token assign-left variable">swidth</span><span class="token operator">=</span><span class="token number">0</span> blks
naming   <span class="token operator">=</span>version <span class="token number">2</span>              <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   ascii-ci<span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">ftype</span><span class="token operator">=</span><span class="token number">1</span>
log      <span class="token operator">=</span>internal               <span class="token assign-left variable">bsize</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">6630</span>, <span class="token assign-left variable">version</span><span class="token operator">=</span><span class="token number">2</span>
         <span class="token operator">=</span>                       <span class="token assign-left variable">sectsz</span><span class="token operator">=</span><span class="token number">512</span>   <span class="token assign-left variable">sunit</span><span class="token operator">=</span><span class="token number">0</span> blks, lazy-count<span class="token operator">=</span><span class="token number">1</span>
realtime <span class="token operator">=</span>none                   <span class="token assign-left variable">extsz</span><span class="token operator">=</span><span class="token number">4096</span>   <span class="token assign-left variable">blocks</span><span class="token operator">=</span><span class="token number">0</span>, <span class="token assign-left variable">rtextents</span><span class="token operator">=</span><span class="token number">0</span>
data blocks changed from <span class="token number">613361664</span> to <span class="token number">3297715200</span>
<span class="token comment">###扩容成功，圆满完成。</span>
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># df -T</span>
文件系统                类型           1K-块       已用        可用 已用% 挂载点
devtmpfs                devtmpfs     <span class="token number">8111856</span>          <span class="token number">0</span>     <span class="token number">8111856</span>    <span class="token number">0</span>% /dev
tmpfs                   tmpfs        <span class="token number">8123796</span>          <span class="token number">0</span>     <span class="token number">8123796</span>    <span class="token number">0</span>% /dev/shm
tmpfs                   tmpfs        <span class="token number">8123796</span>     <span class="token number">126632</span>     <span class="token number">7997164</span>    <span class="token number">2</span>% /run
tmpfs                   tmpfs        <span class="token number">8123796</span>          <span class="token number">0</span>     <span class="token number">8123796</span>    <span class="token number">0</span>% /sys/fs/cgroup
/dev/mapper/centos-root xfs      <span class="token number">13190834280</span> <span class="token number">2278001048</span> <span class="token number">10912833232</span>   <span class="token number">18</span>% /
/dev/sda1               xfs           <span class="token number">201380</span>     <span class="token number">130924</span>       <span class="token number">70456</span>   <span class="token number">66</span>% /boot
tmpfs                   tmpfs        <span class="token number">1624760</span>          <span class="token number">0</span>     <span class="token number">1624760</span>    <span class="token number">0</span>% /run/user/0
<span class="token punctuation">[</span>root@localhost ~<span class="token punctuation">]</span><span class="token comment"># df -Th</span>
文件系统                类型      容量  已用  可用 已用% 挂载点
devtmpfs                devtmpfs  <span class="token number">7</span>.8G     <span class="token number">0</span>  <span class="token number">7</span>.8G    <span class="token number">0</span>% /dev
tmpfs                   tmpfs     <span class="token number">7</span>.8G     <span class="token number">0</span>  <span class="token number">7</span>.8G    <span class="token number">0</span>% /dev/shm
tmpfs                   tmpfs     <span class="token number">7</span>.8G  124M  <span class="token number">7</span>.7G    <span class="token number">2</span>% /run
tmpfs                   tmpfs     <span class="token number">7</span>.8G     <span class="token number">0</span>  <span class="token number">7</span>.8G    <span class="token number">0</span>% /sys/fs/cgroup
/dev/mapper/centos-root xfs        13T  <span class="token number">2</span>.2T   11T   <span class="token number">18</span>% /
/dev/sda1               xfs       197M  128M   69M   <span class="token number">66</span>% /boot
tmpfs                   tmpfs     <span class="token number">1</span>.6G     <span class="token number">0</span>  <span class="token number">1</span>.6G    <span class="token number">0</span>% /run/user/0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>`,6),r={href:"http://c.biancheng.net/view/905.html",target:"_blank",rel:"noopener noreferrer"},m={href:"https://wangchujiang.com/linux-command/c/parted.html",target:"_blank",rel:"noopener noreferrer"},d={href:"https://www.cnblogs.com/lvzhenjiang/p/14391479.html",target:"_blank",rel:"noopener noreferrer"};function b(k,v){const s=o("ExternalLinkIcon");return t(),l("div",null,[u,n("p",null,[n("a",r,[a("parted命令用法详解：创建分区"),e(s)])]),n("p",null,[n("a",m,[a("parted：磁盘分区和分区大小调整工具"),e(s)])]),n("p",null,[n("a",d,[a("parted的详解及常用分区使用方法 "),e(s)])])])}const h=p(i,[["render",b],["__file","使用parted操作对超大硬盘进行分区.html.vue"]]);export{h as default};
