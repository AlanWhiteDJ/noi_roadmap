# 第 76 章  倍增与 LCA

---

> 🏗️ **前情回顾**：第 74 章的欧拉序 + ST 表能 O(1) 求 LCA。这一章换一件更通用的武器——倍增：它还能顺手回答"第 k 个祖先""路径上第 k 个点"。

---

## 🎯 本章目标

学完这一章，你能：

- 写出 `up[k][u]` 的预处理，理解它表示"u 的第 2^k 个祖先"
- 用倍增在 O(log n) 时间内求 LCA
- 用 LCA 求树上两点距离
- 用二进制拆分求第 k 个祖先和路径上第 k 个点
- 正确设置 `LOG`，不把倍增数组开小

---

## 🧱 知识讲解

### 76.1  倍增表 up[k][u]

定义：

> `up[k][u]` 表示从 u 向上走 `2^k` 步到达的点；如果走出了根，就记为 0。

显然 `up[0][u]` 就是 u 的父亲。更高的幂次可以递推：

```cpp
up[k][u] = up[k - 1][ up[k - 1][u] ];
```

先走 `2^(k-1)` 步，再走 `2^(k-1)` 步，合起来就是 `2^k` 步。根的父亲设为 0，并令所有 `up[k][0] = 0`，这样越界后会自动停在 0，不用特判。

`LOG` 取"比 log2(n) 略大"的值。`n = 5 * 10^5` 时，`2^19 = 524288`，所以 `k` 取 0 到 19 就够，`LOG = 20`；`n = 10^6` 时用 21。保险起见可以写：

```cpp
int LOG = 1;
while ((1 << LOG) <= n) ++LOG;
```

但数组维度必须是编译期常量，所以比赛里通常直接开够，例如 `const int LOG = 20;`，再用 `n` 检查一遍。

预处理用 BFS 或 DFS 都可以。BFS 不依赖递归深度，链状数据更安全：

```cpp
const int N = 500005;
const int LOG = 20;
vector<int> g[N];
int up[LOG][N], dep[N];

void build(int root) {
    queue<int> q;
    q.push(root);
    dep[root] = 1;                 // 根深度设为 1，0 号点深度为 0
    up[0][root] = 0;
    for (int k = 1; k < LOG; ++k) up[k][root] = 0;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int i = 0; i < (int)g[u].size(); ++i) {
            int v = g[u][i];
            if (v == up[0][u]) continue;      // 跳过父亲
            dep[v] = dep[u] + 1;
            up[0][v] = u;
            for (int k = 1; k < LOG; ++k)
                up[k][v] = up[k - 1][ up[k - 1][v] ];
            q.push(v);
        }
    }
}
```

> ⚠️ 根的父亲必须是 0，且 `up[k][0]` 全为 0。全局数组默认就是 0，但多测时要手动清。

### 76.2  求 LCA

分三步：

1. 让更深的点 u 向上跳到和 v 同深度。
2. 如果此时 `u == v`，v 就是 LCA。
3. 否则从大到小枚举 k，如果 `up[k][u] != up[k][v]`，就一起往上跳。循环结束时，u 和 v 是 LCA 的两个不同儿子，答案是 `up[0][u]`。

```cpp
int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);

    int d = dep[u] - dep[v];
    for (int k = 0; k < LOG; ++k)
        if ((d >> k) & 1) u = up[k][u];       // 按二进制位跳

    if (u == v) return u;

    for (int k = LOG - 1; k >= 0; --k)
        if (up[k][u] != up[k][v]) {
            u = up[k][u];
            v = up[k][v];
        }
    return up[0][u];
}
```

第二步为什么从大到小？因为要找到"还能保持不同"的最大跳跃。先跳大的，可以把深度快速拉近；如果从小往大跳，可能先跳到一个相同点，反而错过正确答案。这和"用最少的二的幂凑出目标"是同一个道理。

复杂度：预处理 O(nlogn)，单次询问 O(log n)，空间 O(n log n)。

### 76.3  树上距离

设 `w = lca(u, v)`，则：

```cpp
dist(u, v) = dep[u] + dep[v] - 2 * dep[w];
```

因为 u 到 w、v 到 w 的两段路合起来正好是 u 到 v，而 w 以上被走了两次，要减掉。

```cpp
int distance(int u, int v) {
    return dep[u] + dep[v] - 2 * dep[lca(u, v)];
}
```

### 76.4  第 k 个祖先与路径第 k 个点

求 u 的第 k 个祖先，把 k 拆成二进制，哪一位是 1 就跳对应的 `up`：

```cpp
int kthAncestor(int u, int k) {
    for (int i = 0; i < LOG; ++i)
        if ((k >> i) & 1) u = up[i][u];
    return u;                    // k 超过深度时返回 0
}
```

求路径 u → v 上第 k 个点（从 u 数起，k 从 1 开始）：

```cpp
int kthOnPath(int u, int v, int k) {
    int w = lca(u, v);
    int du = dep[u] - dep[w];    // u 到 w 的边数
    int dv = dep[v] - dep[w];
    if (k <= du + 1) return kthAncestor(u, k - 1);   // 还在 u 到 w 的上行段
    int down = k - (du + 1);                         // 从 w 往下走几步
    return kthAncestor(v, dv - down);                // 从 v 往上退
}
```

检查边界：`k = du + 1` 时返回 w；`k = du + dv + 1` 时 `down = dv`，返回 v。

---

## 💻 例题

### 例 1  P3379 【模板】最近公共祖先（LCA）

**题意**：n 个点的树，给定根，q 次询问 u、v 的 LCA。`n, q <= 5 * 10^5`。

**思路**：倍增模板。BFS 预处理，询问时先抬到同深度，再一起跳。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 500005;
const int LOG = 20;
int n, q, root;
vector<int> g[N];
int up[LOG][N], dep[N];

void build() {
    queue<int> que;
    que.push(root);
    dep[root] = 1;
    for (int k = 0; k < LOG; ++k) up[k][root] = 0;
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = 0; i < (int)g[u].size(); ++i) {
            int v = g[u][i];
            if (v == up[0][u]) continue;
            dep[v] = dep[u] + 1;
            up[0][v] = u;
            for (int k = 1; k < LOG; ++k)
                up[k][v] = up[k - 1][ up[k - 1][v] ];
            que.push(v);
        }
    }
}
int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    int d = dep[u] - dep[v];
    for (int k = 0; k < LOG; ++k)
        if ((d >> k) & 1) u = up[k][u];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k)
        if (up[k][u] != up[k][v]) {
            u = up[k][u];
            v = up[k][v];
        }
    return up[0][u];
}
int main() {
    scanf("%d%d%d", &n, &q, &root);
    for (int i = 1; i < n; ++i) {
        int u, v; scanf("%d%d", &u, &v);
        g[u].push_back(v); g[v].push_back(u);
    }
    build();
    while (q--) {
        int u, v; scanf("%d%d", &u, &v);
        printf("%d\n", lca(u, v));
    }
    return 0;
}
```

**复杂度**：预处理 O(n log n)，每次询问 O(log n)，空间 O(n log n)。`up[20][500005]` 占 40 MB

### 例 2  P4281 [AHOI2008] 紧急集合

**题意**：n 个点的树，q 次询问，每次给出 a、b、c 三个点，选一个点 x 作为集合点，使 `dist(a,x) + dist(b,x) + dist(c,x)` 最小。输出 x 和最小距离和。

**思路**：三个点两两求 LCA，得到 `lca(a,b)`、`lca(b,c)`、`lca(a,c)`。这三个值里必有两个相等，另一个就是最优集合点（三条路径的"分叉点"）。三个距离和等于

```
(dist(a,b) + dist(b,c) + dist(a,c)) / 2
```

因为每条边在三个点两两之间的路径里恰好被算两次。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 500005;
const int LOG = 20;
int n, q;
vector<int> g[N];
int up[LOG][N], dep[N];

void build() {
    queue<int> que; que.push(1); dep[1] = 1;
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = 0; i < (int)g[u].size(); ++i) {
            int v = g[u][i];
            if (v == up[0][u]) continue;
            dep[v] = dep[u] + 1; up[0][v] = u;
            for (int k = 1; k < LOG; ++k)
                up[k][v] = up[k - 1][ up[k - 1][v] ];
            que.push(v);
        }
    }
}
int lca(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    int d = dep[u] - dep[v];
    for (int k = 0; k < LOG; ++k) if ((d >> k) & 1) u = up[k][u];
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; --k)
        if (up[k][u] != up[k][v]) u = up[k][u], v = up[k][v];
    return up[0][u];
}
int dist(int u, int v) { return dep[u] + dep[v] - 2 * dep[lca(u, v)]; }

int main() {
    scanf("%d%d", &n, &q);
    for (int i = 1; i < n; ++i) {
        int u, v; scanf("%d%d", &u, &v);
        g[u].push_back(v); g[v].push_back(u);
    }
    build();
    while (q--) {
        int a, b, c; scanf("%d%d%d", &a, &b, &c);
        int x1 = lca(a, b), x2 = lca(b, c), x3 = lca(a, c);
        int x = x1 ^ x2 ^ x3;        // 两个相同，异或后只剩唯一值
        long long s = (long long)dist(a, b) + dist(b, c) + dist(a, c);
        printf("%d %lld\n", x, s / 2);
    }
    return 0;
}
```

**复杂度**：每次询问 3 次 LCA，O(log n)。

> 💡 两个 LCA 相等，异或后正好剩下唯一值。

## ⚠️ 常见错误

1. **`LOG` 开小**：`n = 5 * 10^5` 时 `2^19` 才够，`LOG` 至少 20。写成 18 会在深链上跳不到根。
2. **根的父指针没设 0**：`up[0][root]` 是随机值时，`up[k][root]` 会一路读到脏数据。
3. **`dep[root]` 设成 0**：0 号点的深度也是 0，抬升时可能把真实节点和 0 混在一起。根深度设为 1 更安全。
4. **抬升时用 `dep[u] >= (1 << k)` 判断**：当 `up[k][u]` 已经是 0 时容易多跳。按 `d` 的二进制位判断最稳。
5. **`up` 两维写反**：统一用 `up[k][u]`，写成 `up[u][k]` 会越界。
6. **多测不清 `up`**：上一组的高位倍增指向旧点，答案会莫名其妙。至少清 `up[*][1..n]` 和 `dep`。
7. **距离用 `int` 累加**：三个距离相加可能超过 `2^31`，用 `long long`。

---

## 🧠 本章小结

```
up[k][u] = u 向上 2^k 步的点，up[0][u] = fa[u]
up[k][u] = up[k-1][ up[k-1][u] ]，up[*][0] = 0

LCA：
  1. 深的点按二进制差抬到同深度
  2. 相同则返回
  3. 从大到小一起跳，直到父亲相同
  答案 = up[0][u]

dist(u,v) = dep[u] + dep[v] - 2*dep[lca]

第 k 个祖先：把 k 拆成二进制，逐位跳
路径第 k 点：先判断在 w 的上行段还是下行段
```

倍增的适用范围远不止 LCA：只要"状态可以向上合并、步数可以二进制拆分"，就可以用倍增。第 79 章的很多树题，预处理阶段都是同一张 `up` 表。

---

## ✅ 自查清单

- [ ] 你能写出 `up[k][u]` 的递推，并解释它的含义
- [ ] 你知道 `LOG` 应该开多大，能根据 n 估算
- [ ] 你能默写倍增 LCA 的三步
- [ ] 你知道抬升时为什么按二进制位跳，而不是从大到小试
- [ ] 你能用 LCA 求树上距离
- [ ] 你能求第 k 个祖先和路径上第 k 个点
- [ ] 你知道多测要清 `up` 和 `dep`

---

## 📝 配套练习

> 共10题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P3379 | https://hydro.ac/d/atto/p/luogu-P3379 | 知识点：【模板】最近公共祖先（LCA） |
| ★ 核心 | luogu-P10113 | https://hydro.ac/d/atto/p/luogu-P10113 | 知识点：[GESP202312 八级] 大量的工作沟通 |
| ★ 核心 | luogu-P8805 | https://hydro.ac/d/atto/p/luogu-P8805 | 知识点：[蓝桥杯 2022 国 B] 机房 |
| ◆ 拓展 | luogu-P8855 | https://hydro.ac/d/atto/p/luogu-P8855 | 知识点：[POI 2002] 商务旅行 |
| ◆ 拓展 | luogu-P4427 | https://hydro.ac/d/atto/p/luogu-P4427 | 知识点：[BJOI2018] 求和 |
| ◆ 拓展 | luogu-P3258 | https://hydro.ac/d/atto/p/luogu-P3258 | 知识点：[JLOI2014] 松鼠的新家 |
| ★★★ 挑战 | luogu-P3128 | https://hydro.ac/d/atto/p/luogu-P3128 | 知识点：[USACO15DEC] Max Flow P |
| ★★★ 挑战 | luogu-P3833 | https://hydro.ac/d/atto/p/luogu-P3833 | 知识点：[SHOI2012] 魔法树 |
| ★★★ 挑战 | luogu-P9235 | https://hydro.ac/d/atto/p/luogu-P9235 | 知识点：[蓝桥杯 2023 省 A] 网络稳定性 |
| ★★★ 挑战 | luogu-P2680 | https://hydro.ac/d/atto/p/luogu-P2680 | 知识点：[NOIP 2015 提高组] 运输计划 |

