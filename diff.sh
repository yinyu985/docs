#!/bin/bash
# 获取远程仓库的最新代码
git fetch
# 获取差异文件名列表
diff_files=$(git diff --name-only HEAD origin/main)

# 如果没有差异，输出 "same" 并退出
if [ -z "$diff_files" ]; then
  echo "same"
  exit 0
fi

# 如果有差异，输出 "warning" 并比较差异的文件
echo "warning: files are different"
for file in $diff_files; do
  echo "diff $file:"
  diff $file <(git show origin/main:$file) $file
done
