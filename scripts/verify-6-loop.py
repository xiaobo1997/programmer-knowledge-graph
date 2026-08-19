#!/usr/bin/env python3
"""
6 Loop 一键自检脚本 - 仓库通用版（脱离 Hermes 可运行）
用法:
  python3 scripts/verify-6-loop.py <article.md>            # 自动识别类型（frontmatter type）
  python3 scripts/verify-6-loop.py <dir>/                  # 验证目录下所有 .md
  python3 scripts/verify-6-loop.py <article.md> --type biz # 强制指定类型
  python3 scripts/verify-6-loop.py <article.md> --verbose  # 打印全部锚点明细

检查项（对应 docs/conventions/article-verification.md 6 Loop）:
  Loop 1: 完整性（按文章类型必选 section）
  Loop 2: Mermaid 数量 + 全角标点黑名单
  Loop 3: 隐私红线（公司名/真实数据/内部代号）
  Loop 4: 画像锚点命中统计（9 维）
  Loop 5: 画像标签红线（严格 + 灰区）
  Loop 6: 字数（中文字符数）
"""
import re
import sys
import os
import glob
import argparse

# ========== 按文章类型的 section 要求 ==========
# 与 docs/conventions/ 下 SOP 保持一致；section 名按出现过的最大公约数设计
SECTION_SETS = {
    "concept": ["一句话摘要", "5W 速记卡", "自测三问", "数据与事实声明", "参考资料"],
    "problem": ["一句话摘要", "自测三问", "数据与事实声明", "参考资料"],
    "deep-dive": ["一句话摘要", "数据与事实声明", "参考资料"],
    "overview": ["数据与事实声明"],  # 导读/全景轻量化（directory-layering.md 7.2.1）
    "biz": ["一句话定义", "业务背景与价值", "业务术语表", "业务流程图", "系统架构", "服务模型", "核心功能用例", "业务打法与策略", "Trade-off", "行业洞察", "一句话总结", "数据与事实声明"],
    "practice": ["一句话摘要", "数据与事实声明", "参考资料"],
    "default": ["一句话摘要", "数据与事实声明", "参考资料"],
}


# 各类型 Mermaid 最低数量
MERMAID_MIN = {
    "concept": 2, "problem": 2, "deep-dive": 2,
    "overview": 1,  # 导读/全景硬性 1 张（directory-layering.md 7.2.1）
    "biz": 2, "practice": 2, "default": 1,
}
# 各类型字数区间（中文字符）
WORD_RANGE = {
    "concept": (4000, 8000), "problem": (4000, 8000), "deep-dive": (6000, 12000),
    "overview": (500, 1500),  # 导读/全景硬性 ≤1500（directory-layering.md 7.2.1）
    "biz": (4000, 8000), "practice": (4000, 10000), "default": (3000, 10000),
}

# ========== 配置 ==========
# Loop 5: 严格画像标签红线（绝对禁止）
STRICT_LABEL_REDLINE = [
    r"(?<!\d)P7(?!\d)(?:\s|$|[+、，。])",
    r"(?<!\d)P8(?!\d)(?:\s|$|[+、，。])",
    r"(?<!\d)P9(?!\d)(?:\s|$|[+、，。])",
    r"P7\+", r"P8\+", r"P9\+",
    r"P[789] 视角", r"P[789] 架构师",
    r"资深架构师", r"全局架构师", r"业务架构师",
]

# Loop 5: 灰区（默认替换）
GRAY_ZONE = [
    r"资深工程师", r"资深开发", r"资深岗位", r"资深职位",
    r"高级架构师",
]

# Loop 3: 隐私红线（公开仓库绝对禁止）
PRIVACY_REDLINE = [
    "postar", "星驿付", "满帮", "小贷", "xiaobo", "货车帮",
]

# Loop 4: 画像锚点关键词（9 维）
ANCHOR_KEYWORDS = {
    "跨周期经验": ["过去 5 年", "2015", "2019", "2022", "2025", "演变"],
    "机制穿透": ["机制", "底层", "穿透", "原理"],
    "跨系统架构": ["架构", "模块边界", "上下游"],
    "生产事故推演": ["事故", "Bug", "损失", "出错"],
    "量级演进": ["TPS", "亿", "万", "规模", "百万", "千万"],
    "Trade-off 跨期": ["Trade-off", "代价", "取舍"],
    "监管意图": ["监管", "合规", "硬性要求", "报送"],
    "战略判断": ["战略", "5 年后回头看", "护城河"],
    "跨公司视角": ["头部公司", "中型公司", "小公司"],
}

# 纯业务维度：只对 biz 文章要求；其他类型不适用（跳过避免误报）
BIZ_ONLY_ANCHORS = {"生产事故推演", "量级演进", "监管意图", "战略判断", "跨公司视角"}

def anchors_for_type(atype):
    """按文章类型返回应检查的锚点维度：biz 全 9 维，其余只查通用维度"""
    if atype == "biz":
        return list(ANCHOR_KEYWORDS.keys())
    return [k for k in ANCHOR_KEYWORDS if k not in BIZ_ONLY_ANCHORS]

# Loop 2: Mermaid 全角标点黑名单（所有图类型）
MERMAID_FULLWIDTH = ["（", "）", "“", "”", "：", "；", "，", "？", "！", "、"]

ARTICLE_TYPE_HINTS = {
    "concept": ["一句话摘要", "5W 速记卡", "下篇预告", "type: concept"],
    "problem": ["一句话摘要", "问题", "type: problem"],
    "deep-dive": ["type: deep-dive", "深度", "附录"],
    "overview": ["type: overview", "全景导读", "系列导读", "维护说明"],
    "biz": ["业务术语表", "业务流程图", "type: biz"],
    "practice": ["type: practice", "踩坑", "步骤"],
}


def detect_type(content, frontmatter_type=None):
    """检测文章类型：优先 frontmatter type 字段，其次内容特征"""
    if frontmatter_type and frontmatter_type in SECTION_SETS:
        return frontmatter_type
    scores = {}
    for t, hints in ARTICLE_TYPE_HINTS.items():
        scores[t] = sum(1 for h in hints if h in content)
    best = max(scores, key=lambda k: scores[k])
    return best if scores[best] > 0 else "default"


def extract_frontmatter_type(content):
    m = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if m:
        fm = m.group(1)
        tm = re.search(r"^type:\s*[\"']?([\w-]+)", fm, re.M)
        if tm:
            return tm.group(1).strip()
    return None


def check_mermaid_blocks(content):
    blocks = re.findall(r"```mermaid\n(.*?)\n```", content, re.DOTALL)
    issues = []
    for i, b in enumerate(blocks):
        for c in MERMAID_FULLWIDTH:
            if c in b:
                issues.append(f"块 {i} 含全角字符 '{c}': {b[:50]}...")
    return len(blocks), issues


def check_privacy(content):
    hits = []
    low = content.lower()
    for w in PRIVACY_REDLINE:
        if w.lower() in low:
            idx = low.find(w.lower())
            ctx = content[max(0, idx-30):idx+30].replace('\n', ' ')
            hits.append(f"{w}: ...{ctx}...")
    return hits


def check_labels_strict(content):
    hits = []
    for pattern in STRICT_LABEL_REDLINE:
        for m in re.finditer(pattern, content):
            idx = m.start()
            ctx = content[max(0, idx-30):idx+30].replace('\n', ' ')
            hits.append(f"严格红线 {pattern}: ...{ctx}...")
    return hits


def check_labels_gray(content):
    hits = []
    for pattern in GRAY_ZONE:
        for m in re.finditer(pattern, content):
            idx = m.start()
            ctx = content[max(0, idx-30):idx+30].replace('\n', ' ')
            hits.append(f"灰区 {pattern}: ...{ctx}...")
    return hits


def check_anchors(content, atype):
    stats = {}
    for k in anchors_for_type(atype):
        stats[k] = sum(content.count(kw) for kw in ANCHOR_KEYWORDS[k])
    return stats


def check_completeness(content, sections):
    return [s for s in sections if s not in content]


def check_word_count(content):
    return len(re.findall(r'[\u4e00-\u9fff]', content))


def verify_file(filepath, forced_type=None, verbose=False):
    print(f"\n{'='*60}")
    print(f"📄 验证文件: {filepath}")
    print(f"{'='*60}")

    with open(filepath) as f:
        content = f.read()

    fm_type = extract_frontmatter_type(content)
    atype = forced_type or fm_type or detect_type(content)
    if forced_type:
        print(f"  类型: {atype}（--type 强制指定）")
    elif fm_type:
        print(f"  类型: {atype}（frontmatter）")
    else:
        print(f"  类型: {atype}（内容检测）")

    sections = SECTION_SETS.get(atype, SECTION_SETS["default"])
    mermaid_min = MERMAID_MIN.get(atype, 1)
    wmin, wmax = WORD_RANGE.get(atype, WORD_RANGE["default"])

    # Loop 1
    print("\n=== Loop 1 完整性 ===")
    missing = check_completeness(content, sections)
    if missing:
        print(f"  ❌ 缺: {missing}")
    else:
        print(f"  ✅ {len(sections)} 个必选 section 齐全")

    # Loop 2
    print("\n=== Loop 2 Mermaid ===")
    mc, m_issues = check_mermaid_blocks(content)
    if mc < mermaid_min:
        print(f"  ❌ Mermaid {mc} 张 (需 ≥ {mermaid_min})")
    else:
        print(f"  ✅ Mermaid {mc} 张 (≥ {mermaid_min})")
    if m_issues:
        for i in m_issues[:5]:
            print(f"    ❌ {i}")
    else:
        print("  ✅ 全角标点检查通过")

    # Loop 3
    print("\n=== Loop 3 隐私 ===")
    p_hits = check_privacy(content)
    if p_hits:
        for h in p_hits[:5]:
            print(f"  ❌ {h}")
    else:
        print("  ✅ 0 处公司名/真实数据/内部代号")

    # Loop 4
    print("\n=== Loop 4 画像锚点 ===")
    if atype != "biz":
        print(f"  （{atype} 文章：只查通用维度，跳过业务专属维度：生产事故/量级演进/监管/战略/跨公司）")
    stats = check_anchors(content, atype)
    for k, v in stats.items():
        marker = "✅" if v >= 3 else "⚠️" if v >= 1 else "❌"
        print(f"  {marker} {k}: {v} 次")

    # Loop 5
    print("\n=== Loop 5 画像标签红线 ===")
    s_hits = check_labels_strict(content)
    g_hits = check_labels_gray(content)
    if s_hits:
        for h in s_hits[:5]:
            print(f"  ❌ {h}")
    else:
        print("  ✅ 严格红线: 0 处")
    if g_hits:
        for h in g_hits[:5]:
            print(f"  ⚠️ 灰区（建议改）: {h}")
    else:
        print("  ✅ 灰区: 0 处")

    # Loop 6
    print("\n=== Loop 6 字数 ===")
    wc = check_word_count(content)
    fsize = os.path.getsize(filepath)
    print(f"  中文字符: {wc}")
    print(f"  文件大小: {fsize/1024:.1f} KB（英文密集文章参考此值，中文字符数会偏低）")
    if wmin <= wc <= wmax:
        print(f"  ✅ 区间合适 ({wmin}-{wmax})")
    elif wc < wmin:
        print(f"  ⚠️ 偏短 (建议 {wmin}+；英文密集时看文件大小 ≥ 8KB)")
    else:
        print(f"  ⚠️ 偏长 (建议 ≤ {wmax})")

    # 总结
    print("\n=== 总评 ===")
    has_critical = bool(missing) or mc < mermaid_min or p_hits or s_hits or m_issues
    if has_critical:
        print("  ❌ 有严重问题，必须修复才能 commit")
        return False
    print("  ✅ 6 Loop 通过，可以 commit")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="6 Loop 一键自检")
    parser.add_argument("target", help="文章 .md 文件或目录")
    parser.add_argument("--type", choices=list(SECTION_SETS.keys()),
                        help="强制文章类型（默认自动检测）")
    parser.add_argument("--verbose", action="store_true", help="打印明细")
    args = parser.parse_args()

    all_pass = True
    if os.path.isfile(args.target):
        all_pass = verify_file(args.target, args.type, args.verbose)
    elif os.path.isdir(args.target):
        files = glob.glob(os.path.join(args.target, "**/*.md"), recursive=True)
        files = [f for f in files if not f.endswith("index.md") and "PROGRESS" not in f]
        if not files:
            print(f"目录下无 .md 文件: {args.target}")
            sys.exit(1)
        for f in sorted(files):
            if not verify_file(f, args.type, args.verbose):
                all_pass = False
    else:
        print(f"路径不存在: {args.target}")
        sys.exit(1)

    sys.exit(0 if all_pass else 1)
