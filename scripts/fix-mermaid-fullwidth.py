#!/usr/bin/env python3
"""
fix-mermaid-fullwidth.py
========================
批量修复 .md 文件中 mermaid 块内的中文全角括号 `（）` → 半角方括号 `[]`。

为什么需要这个脚本：
- Mermaid 不支持中文全角括号，会导致 Lexical error 或时序图标签错位
- 浅析业务 14_/15_/16_ 三篇都踩坑，每篇都修了 14-58 处字符
- 一次写完后必跑本脚本，避免 build 后才发现报错

使用方法：
    python3 fix-mermaid-fullwidth.py <file1.md> [file2.md ...]

或者用 stdin 传文件列表：
    python3 fix-mermaid-fullwidth.py $(git ls-files '*.md')

修复原理：
- 用正则 `\`\`\`mermaid\\n(.*?)\\n\`\`\`` 提取所有 mermaid 块
- 在每个块内替换 `（` → `[`，`）` → `]`
- 其他全角字符（":" ";" 等）暂不处理（Mermaid 容忍度更高）

输出：
- 修改的行数 + 字符数
- 修复后再次 grep 验证 0 处全角括号
"""

import re
import sys
from pathlib import Path


def fix_file(path: Path) -> tuple[int, int]:
    """修复单个文件中的 mermaid 全角括号。返回 (修复块数, 替换字符数)。"""
    content = path.read_text(encoding='utf-8')
    original = content
    blocks_fixed = 0

    def fix_block(match: re.Match) -> str:
        nonlocal blocks_fixed
        block = match.group(0)
        new_block = block.replace('（', '[').replace('）', ']')
        if new_block != block:
            blocks_fixed += 1
        return new_block

    content = re.sub(r'```mermaid\n.*?\n```', fix_block, content, flags=re.DOTALL)

    if content != original:
        path.write_text(content, encoding='utf-8')

    # 计算替换字符数
    diff_chars = sum(1 for a, b in zip(original, content) if a != b)
    return blocks_fixed, diff_chars


def verify(path: Path) -> int:
    """验证文件中 mermaid 块已无全角括号。返回残留块数。"""
    content = path.read_text(encoding='utf-8')
    blocks = re.findall(r'```mermaid\n(.*?)\n```', content, re.DOTALL)
    return sum(1 for b in blocks if '（' in b or '）' in b)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    total_blocks = 0
    total_chars = 0
    files_fixed = 0

    for arg in sys.argv[1:]:
        path = Path(arg)
        if not path.exists():
            print(f"❌ 文件不存在: {arg}")
            continue

        blocks, chars = fix_file(path)
        if blocks > 0:
            files_fixed += 1
            total_blocks += blocks
            total_chars += chars
            print(f"✅ {arg}: 修复 {blocks} 个 mermaid 块（{chars} 字符）")
        else:
            print(f"⏭  {arg}: 无需修复")

        # 验证
        leftover = verify(path)
        if leftover > 0:
            print(f"   ⚠️  仍有 {leftover} 个块含全角括号，需手动检查")

    print()
    print(f"📊 总计: {files_fixed} 文件修复 / {total_blocks} 块 / {total_chars} 字符")


if __name__ == '__main__':
    main()