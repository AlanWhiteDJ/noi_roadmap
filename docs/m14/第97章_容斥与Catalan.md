# 第 97 章 容斥与 Catalan
---
> 🏗️ **前情回顾**：第 96 章用排列组合直接数"合法方案"。但很多题问的是"至少有一个""一个都没有"，正面分类会重复；这一章用容斥把重叠部分剥掉，并认识计数里的常客 Catalan 数。
## 🎯 本章目标
- 写出一般容斥式，正确处理符号与交集
- 用补集转化简化"至少/至多"问题
- 识别 Catalan 数的四类经典模型
## 🎬 故事/动机

班里统计"会 C++ 或会 Python"的人，直接把两科人数相加会把两科都会的人算两次。减去交集就对了；三个集合时又要加回三重交集。容斥就是这套"加加减减"的系统化。另一类问题——n 对括号有多少种合法写法——答案不是 2^(2n)，而是 Catalan 数。
## 🧱 知识讲解
### 97.1 容斥原理

|A1∪…∪Ak| = Σ|Ai| - Σ|Ai∩Aj| + Σ|Ai∩Aj∩Al| - …。奇数个集合的交集取正，偶数个取负。实现时枚举非空子集，用 gcd/lcm 求"同时满足"的大小：
```cpp
long long bad = 0;
for (int S = 1; S < (1 << k); S++) {
    long long l = 1; int c = 0; bool ok = true;
    for (int i = 0; i < k && ok; i++) if (S >> i & 1) {
        c++; l = l / gcd(l, p[i]) * p[i];
        if (l > n) ok = false;
    }
    if (ok) bad += (c & 1 ? n / l : -n / l);
}
cout << n - bad;   // 1..n 中不被任何 p[i] 整除的个数
```
### 97.2 补集转化

"至少一个发生"= 全集 - "一个都不发生"；"恰好一个"= "至少一个" - "至少两个"。当合法情况复杂、非法情况简单时，先算非法再减，往往一步到位。注意全集要按题目范围算准，别把不存在的方案算进去。
### 97.3 Catalan 数

Cat_n = C(2n,n)/(n+1) = C(2n,n)-C(2n,n-1)，也满足 Cat_n=Cat_{n-1}·(4n-2)/(n+1)，Cat_0=1。经典模型：n 对合法括号、n 个元素的出栈序列、n 个节点的二叉树形态、从 (0,0) 到 (n,n) 不越过对角线的路径、凸 n+2 边形的三角剖分。它们都对应"任意前缀中某类元素不少于另一类"的约束。
```cpp
cat[0] = 1;
for (int i = 1; i <= n; i++)
    cat[i] = cat[i-1] * (4LL*i - 2) % MOD * inv[i+1] % MOD;
```
## 💻 例题
**例 1**：[P3197 越狱](https://hydro.ac/p/luogu-P3197)。m 种宗教、n 个房间，总方案 m^n；相邻不能同教：第 1 间 m 种，之后每间 m-1 种，共 m(m-1)^(n-1)。答案为两者之差取模，n=1 时差为 0。
**例 2**：[P1044 栈](https://hydro.ac/p/luogu-P1044)。入栈序列固定，出栈序列数就是 Catalan(n)。n≤18，直接按递推或 DP 用 `long long` 即可，不必取模。
## ⚠️ 常见坑
1. 容斥符号写反，或枚举子集从 0 开始把空集算进去。
2. 补集转化时全集算错，例如忽略"每个位置都有 m 种选择"这一前提。
3. Catalan 的 n 错位：n 对括号、n 个节点、n 次入栈对应的都是 Cat_n，不是 Cat_{n+1}。
4. 模意义下用 `/(n+1)` 直接除；应乘逆元，且确认 n+1 不被模数整除。
## 📝 练习
- 基础：[P1044](https://hydro.ac/p/luogu-P1044)，用递推与通项两种方式验证
- 进阶：[P3197](https://hydro.ac/p/luogu-P3197)，并手推 n=1,2,3 的小数据
- 竞赛：S 组计数题中的"至少一个/恰好"转化
## 📝 配套练习

> 共17题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P8557 | https://hydro.ac/d/atto/p/luogu-P8557 | 来自下册题单 |
| ★ 核心 | luogu-P5505 | https://hydro.ac/d/atto/p/luogu-P5505 | 来自下册题单 |
| ★ 核心 | luogu-P6298 | https://hydro.ac/d/atto/p/luogu-P6298 | 来自下册题单 |
| ★ 核心 | luogu-P6162 | https://hydro.ac/d/atto/p/luogu-P6162 | 来自下册题单 |
| ★ 核心 | luogu-P6692 | https://hydro.ac/d/atto/p/luogu-P6692 | 来自下册题单 |
| ◆ 拓展 | luogu-P6076 | https://hydro.ac/d/atto/p/luogu-P6076 | 来自下册题单 |
| ◆ 拓展 | luogu-P5664 | https://hydro.ac/d/atto/p/luogu-P5664 | 来自下册题单 |
| ◆ 拓展 | luogu-P3197 | https://hydro.ac/d/atto/p/luogu-P3197 | 来自下册题单 |
| ◆ 拓展 | luogu-P1450 | https://hydro.ac/d/atto/p/luogu-P1450 | 来自下册题单 |
| ◆ 拓展 | codeforces-P803F | https://hydro.ac/d/atto/p/codeforces-P803F | 来自下册题单 |
| ★★★ 挑战 | luogu-P7118 | https://hydro.ac/d/atto/p/luogu-P7118 | 来自下册题单 |
| ★★★ 挑战 | luogu-P3200 | https://hydro.ac/d/atto/p/luogu-P3200 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1976 | https://hydro.ac/d/atto/p/luogu-P1976 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1722 | https://hydro.ac/d/atto/p/luogu-P1722 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1754 | https://hydro.ac/d/atto/p/luogu-P1754 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1375 | https://hydro.ac/d/atto/p/luogu-P1375 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1044 | https://hydro.ac/d/atto/p/luogu-P1044 | 来自下册题单 |

