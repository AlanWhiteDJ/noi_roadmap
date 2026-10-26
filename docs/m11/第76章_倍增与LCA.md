# 第 76 章  倍增与 LCA

> 🏗️ **前情回顾**：第 74 章的欧拉序 + ST 表能 O(1) 求 LCA。这一章换一件更通用的武器——倍增：它还能顺手回答"第 k 个祖先""路径上第 k 个点"。
## 🎯 本章目标
- 写出 `up[k][u]` 预处理与倍增 LCA
- 用 LCA 求树上距离、第 k 个祖先
- 知道 `LOG ≈ log2(n)+1`，不会开小
## 🌱 故事：跳台阶的两个人
> 两个人站在不同高度，想用最少的步数碰面。先让高的那个下到同一层，再一起"试探性"往上跳——这就是倍增 LCA 的全部思想。
## 🧱 知识讲解
### 76.1  预处理
```cpp
int up[LOG][N], dep[N];
void dfs(int u, int fa) {
    dep[u] = dep[fa] + 1; up[0][u] = fa;
    for (int k = 1; k < LOG; k++) up[k][u] = up[k-1][up[k-1][u]];
    for (int v : g[u]) if (v != fa) dfs(v, u);
}
```
根的父亲设 0，`up[k][0]=0`，越界自动落在 0 上，不用特判。
### 76.2  求 LCA
```cpp
int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    for (int k = LOG-1; k >= 0; k--)
        if (dep[u] - (1 << k) >= dep[v]) u = up[k][u];
    if (u == v) return u;
    for (int k = LOG-1; k >= 0; k--)
        if (up[k][u] != up[k][v]) u = up[k][u], v = up[k][v];
    return up[0][u];
}
```
先抬到同深度，再从大到小"差一步就相同"地跳，单次 O(log n)。
### 76.3  距离与第 k 个祖先
```cpp
dis(u, v) = dep[u] + dep[v] - 2 * dep[lca(u, v)];
// 第 k 个祖先：把 k 二进制拆开，逐位跳 up[i][u]
```
## 💻 例题
**例 1**：P3379 【模板】最近公共祖先——直接套板子，注意输入量大用快读。
**例 2**：P3258 松鼠的新家——路径 `a[i] → a[i+1]` 做 `d[u]++, d[v]++, d[lca]--, d[fa[lca]]--`，最后自底向上累加。
## ⚠️ 常见坑
1. `LOG` 开小：`n=5e5` 时至少要 20
2. 根的父亲没设 0，`up` 读到脏值
3. 多测忘了重新清 `dep/up`
## 📝 练习
- 基础：P5836 [USACO19DEC] Milk Visits
- 提高：P4281 [AHOI2008] 紧急集合（三点 LCA）
- 挑战：2022 S 数据传输
## 📝 配套练习

> 共10题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P3379 | https://hydro.ac/d/atto/p/luogu-P3379 | 来自题单 |
| ★ 核心 | luogu-P10113 | https://hydro.ac/d/atto/p/luogu-P10113 | 来自题单 |
| ★ 核心 | luogu-P8805 | https://hydro.ac/d/atto/p/luogu-P8805 | 来自题单 |
| ◆ 拓展 | luogu-P8855 | https://hydro.ac/d/atto/p/luogu-P8855 | 来自题单 |
| ◆ 拓展 | luogu-P4427 | https://hydro.ac/d/atto/p/luogu-P4427 | 来自题单 |
| ◆ 拓展 | luogu-P3258 | https://hydro.ac/d/atto/p/luogu-P3258 | 来自题单 |
| ★★★ 挑战 | luogu-P3128 | https://hydro.ac/d/atto/p/luogu-P3128 | 来自题单 |
| ★★★ 挑战 | luogu-P3833 | https://hydro.ac/d/atto/p/luogu-P3833 | 来自题单 |
| ★★★ 挑战 | luogu-P9235 | https://hydro.ac/d/atto/p/luogu-P9235 | 来自题单 |
| ★★★ 挑战 | luogu-P2680 | https://hydro.ac/d/atto/p/luogu-P2680 | 来自题单 |

