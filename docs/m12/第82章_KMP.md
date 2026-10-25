# 第 82 章  KMP

---
> 🏗️ **前情回顾**：上册第 19–21 章你用 `string` 做过查找，暴力匹配在主串每个位置都从头比，最坏 O(nm)。KMP 让指针永不回退。
💡 **动机**：暴力匹配在 `aaaa…ab` 上会退化到 O(nm)，KMP 用一块数组存下历史信息，是“用空间换时间”的典型。
## 🎯 本章目标
- 理解前缀函数（next/pi 数组）的含义与递推
- 手写 KMP 匹配并正确处理成功后跳转
- 用 `n - pi[n-1]` 求最小周期

## 🧱 知识讲解
### 82.1  前缀函数
`pi[i]` 表示子串 `s[0..i]` 的最长相等真前缀与真后缀长度。它既是"最长公共前后缀"，也是失配后模式串该跳到的位置。

### 82.2  递推求 pi
```cpp
vector<int> pi(n);
for (int i = 1; i < n; i++) {
    int j = pi[i - 1];
    while (j && s[i] != s[j]) j = pi[j - 1];
    if (s[i] == s[j]) j++;
    pi[i] = j;
}
```
求 `pi[i]` 时继承 `pi[i-1]`，失配就沿 `pi` 链回跳，总复杂度 O(n)。
### 82.3  匹配
```cpp
for (int i = 0, j = 0; i < m; i++) {
    while (j && t[i] != p[j]) j = pi[j - 1];
    if (t[i] == p[j]) j++;
    if (j == (int)p.size()) {
        cout << i - j + 2 << '\n';   // 1-based 起始位置
        j = pi[j - 1];               // 继续找下一次
    }
}
```
### 82.4  最小周期
`n - pi[n-1]` 总是最短周期；若它能整除 n，整串就由这个循环节重复构成。
## 💻 例题
**例 1**：[P3375](https://hydro.ac/p/luogu-P3375) 【模板】KMP。先输出每个前缀的 `pi[i]`，再输出所有匹配位置，注意 1-based 下标。
**例 2**：[P4391](https://hydro.ac/p/luogu-P4391) Radio Transmission。答案就是 `n - pi[n-1]`，即最短循环节。

## ⚠️ 常见坑
1. 下标 0/1 混用：`pi[j-1]` 与 `pi[j]` 差一位，调试时先打印数组
2. 匹配成功后忘了 `j = pi[j-1]`，会漏掉重叠的匹配

## 📝 练习
- 基础：[P3375](https://hydro.ac/p/luogu-P3375)，默写 pi 与匹配两段
- 进阶：[P4824](https://hydro.ac/p/luogu-P4824) Censoring，KMP + 栈在线删除
## 📝 配套练习

> 共5题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P4391 | https://hydro.ac/d/atto/p/luogu-P4391 | 来自下册题单 |
| ◆ 拓展 | luogu-P8112 | https://hydro.ac/d/atto/p/luogu-P8112 | 来自下册题单 |
| ★★★ 挑战 | luogu-P3435 | https://hydro.ac/d/atto/p/luogu-P3435 | 来自下册题单 |
| ★★★ 挑战 | luogu-P3375 | https://hydro.ac/d/atto/p/luogu-P3375 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1470 | https://hydro.ac/d/atto/p/luogu-P1470 | 来自下册题单 |

