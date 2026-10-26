# 第 69 章  最短路（二）Floyd 与次短路

---

> 🏗️ **前情回顾**：Dijkstra 解决"一个起点到所有点"。可如果题目要一张"任意两点之间距离"的表，从每个点各跑一次 Dijkstra 是 $O(nm\log n)$；点不多时，Floyd 的三重循环更短、更好写。

---

## 🎯 本章目标

学完这一章，你能：

- 说清 Floyd 的 DP 含义，并解释为什么 $k$ 必须在最外层
- 用 Floyd 求全源最短路、传递闭包、最小环
- 用两种方法求次短路
- 根据数据范围在 Floyd 与 Dijkstra 之间选型

---

## 📖 故事引入

小镇上有 6 个快递站，站长想要一张表：任意两个站之间最少走多少公里。他让实习生从每个站跑一次 Dijkstra，跑了 6 遍，代码又长又容易错。

小元看了看说："点这么少，直接三重循环不就好了？"

他的想法是：先只允许"经过 1 号站中转"，更新所有点对；再允许"经过 1、2 号站中转"，再更新；……允许经过所有站之后，表就完整了。

这就是 Floyd。它不挑起点，一次算出**所有点对**的最短路；代价是 $O(n^3)$，所以只适合 $n \le 500$ 左右的图。但它带来的两个副产品——传递闭包和最小环——常常比最短路本身更有用。

---

## 🧱 知识讲解

### 69.1  Floyd 的 DP 本质

设 $f_k(i,j)$ 表示"只允许经过编号 $\le k$ 的点作为中转时，i 到 j 的最短距离"。转移只有两种选择：

$$f_k(i,j) = \min\big(f_{k-1}(i,j),\ f_{k-1}(i,k) + f_{k-1}(k,j)\big)$$

要么不用 k 中转，要么用。Floyd 用二维数组原地滚动，把第一维省掉了：

```cpp
for (int k = 1; k <= n; k++)                 // 阶段：允许经过 1..k
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            if (dis[i][k] != INF && dis[k][j] != INF)
                dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
```

**为什么 k 必须在最外层？** 因为 $k$ 是 DP 的"阶段"，第 $k$ 层只依赖第 $k-1$ 层。把 k 放内层，等价于"用还没算完的状态去更新别人"，会得到错误答案。

初始化：

```cpp
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= n; j++)
        dis[i][j] = (i == j ? 0 : INF);
// 读边
dis[u][v] = min(dis[u][v], w);      // 有向图
dis[v][u] = min(dis[v][u], w);      // 无向图
```

- 重边取最小，别直接赋值。
- 复杂度 $O(n^3)$，空间 $O(n^2)$；$n=500$ 时约 $1.25 \times 10^8$ 次，需要压常数（`if` 判断、`register` 不必、开 `-O2`）。
- 自环 `dis[i][i]=0`；若题中有负权边，Floyd 也能处理，但负环会让 `dis[i][i]<0`。

### 69.2  传递闭包

只关心"能不能到"，把加法换成逻辑或、$\min$ 换成或：

```cpp
bool reach[N][N];
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        if (reach[i][k])
            for (int j = 1; j <= n; j++)
                if (reach[k][j]) reach[i][j] = true;
```

这就是 Warshall 算法，$O(n^3)$。$n$ 到 $2000$ 时可用 `bitset` 加速到 $O(n^3/64)$：

```cpp
bitset<N> reach[N];
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        if (reach[i][k]) reach[i] |= reach[k];
```

### 69.3  最小环

无向图的最小环，可以看成"i 到 j 的一条不经过 k 的路径，加上 i—k、k—j 两条边"。在 Floyd 的第 $k$ 轮**更新之前**统计：

```cpp
int ans = INF;
for (int k = 1; k <= n; k++) {
    for (int i = 1; i < k; i++)
        for (int j = i + 1; j < k; j++)
            if (w[i][k] != INF && w[k][j] != INF && dis[i][j] != INF)
                ans = min(ans, dis[i][j] + w[i][k] + w[k][j]);
    // 然后再用 k 做正常的 Floyd 松弛
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
}
```

此时 `dis[i][j]` 还没经过 k，环不会退化成"走两遍同一条边"。

### 69.4  次短路

**次短路**是"长度第二短"的路径。分两种：

- **非严格次短路**：允许与最短路等长（只要路径不同）；
- **严格次短路**：必须比最短路长。

最常用的做法是让 Dijkstra 同时维护两个距离：

```cpp
int d1[N], d2[N];        // 最短路、次短路
fill(d1, d1 + n + 1, INF);
fill(d2, d2 + n + 1, INF);
d1[s] = 0;
pq.push(make_pair(0, s));
while (!pq.empty()) {
    int d = pq.top().first, u = pq.top().second;
    pq.pop();
    if (d > d2[u]) continue;             // 比次短路还长，无用
    for (auto e : g[u]) {
        int v = e.first, nd = d + e.second;
        if (nd < d1[v]) {
            d2[v] = d1[v];
            d1[v] = nd;
            pq.push(make_pair(nd, v));
        } else if (nd > d1[v] && nd < d2[v]) {
            d2[v] = nd;
            pq.push(make_pair(nd, v));
        }
    }
}
```

> ⚠️ 上面的写法求的是**严格**次短路（`nd > d1[v]`）。若题目允许与最短路等长的另一条路径，把条件改成 `nd >= d1[v]` 即可。

另一种思路：次短路一定由某条最短路"换掉一条边"得到，枚举非最短路边，用"起点到 u 的最短路 + 该边 + v 到终点的最短路"更新。它适合边数不多的图，但要注意路径重复问题。

### 69.5  Floyd 还是 Dijkstra

| 需求 | 选择 |
|------|------|
| 单源、稀疏、非负权 | 堆优化 Dijkstra |
| 全源、$n \le 500$ | Floyd |
| 只要可达性、$n \le 2000$ | Floyd + bitset |
| 最小环 | Floyd 变体 |
| 单源次短路 | 双距离 Dijkstra |

---

## 💻 例题

### 例 1  洛谷 P2419 Cow Contest

**题意**：$n$ 头牛两两比赛，给出 $m$ 条胜负关系（传递的）。问有多少头牛的排名可以唯一确定。

**思路**：若一头牛能确定与其余 $n-1$ 头牛的胜负关系，它的排名就唯一。用传递闭包求出所有"能打败"的关系，统计每头牛的关系数是否为 $n-1$。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 105;
int n, m;
bool win[N][N];

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        win[u][v] = true;
    }
    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            if (win[i][k])
                for (int j = 1; j <= n; j++)
                    if (win[k][j]) win[i][j] = true;
    int ans = 0;
    for (int i = 1; i <= n; i++) {
        int cnt = 0;
        for (int j = 1; j <= n; j++)
            if (i != j && (win[i][j] || win[j][i])) cnt++;
        if (cnt == n - 1) ans++;
    }
    printf("%d\n", ans);
    return 0;
}
```

### 例 2  洛谷 P2865 Roadblocks

**题意**：无向带权图，求从 1 到 $n$ 的**严格次短路**（可以重复经过点和边）。

**思路**：双距离 Dijkstra。`d1` 存最短路，`d2` 存次短路；每个点可能以两种距离入堆，出堆时若比 `d2` 还大就丢弃。

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef pair<int,int> pii;
const int N = 5005, M = 200005;
const int INF = 0x3f3f3f3f;

int n, m, d1[N], d2[N];
vector<pii> g[N];
priority_queue<pii, vector<pii>, greater<pii> > pq;

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; i++) {
        int u, v, w;
        scanf("%d%d%d", &u, &v, &w);
        g[u].push_back(make_pair(v, w));
        g[v].push_back(make_pair(u, w));
    }
    for (int i = 1; i <= n; i++) d1[i] = d2[i] = INF;
    d1[1] = 0;
    pq.push(make_pair(0, 1));
    while (!pq.empty()) {
        int d = pq.top().first, u = pq.top().second;
        pq.pop();
        if (d > d2[u]) continue;
        for (int i = 0; i < (int)g[u].size(); i++) {
            int v = g[u][i].first, nd = d + g[u][i].second;
            if (nd < d1[v]) {
                d2[v] = d1[v];
                d1[v] = nd;
                pq.push(make_pair(nd, v));
            } else if (nd > d1[v] && nd < d2[v]) {
                d2[v] = nd;
                pq.push(make_pair(nd, v));
            }
        }
    }
    printf("%d\n", d2[n]);
    return 0;
}
```

### 例 3  洛谷 P6175 无向图的最小环

**题意**：$n \le 100$ 的无向带权图，求长度最小的环，无解输出 `No solution.`。

**思路**：按 69.3 的做法，在第 $k$ 轮松弛前用 `dis[i][j] + w[i][k] + w[k][j]` 更新答案，其中 $i,j<k$，保证路径不经过 $k$。

```cpp
for (int k = 1; k <= n; k++) {
    for (int i = 1; i < k; i++)
        for (int j = i + 1; j < k; j++)
            if (w[i][k] != INF && w[k][j] != INF && dis[i][j] != INF)
                ans = min(ans, dis[i][j] + w[i][k] + w[k][j]);
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            if (dis[i][k] != INF && dis[k][j] != INF)
                dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
}
```

> 💡 最小环的统计必须放在松弛**之前**，否则 `dis[i][j]` 可能已经经过 k，环就重复走了 k。

---

## ⚠️ 常见错误

1. **$k$ 循环写在内层**。这是 Floyd 最经典的错误，答案随机偏小。
2. **`INF` 相加溢出**。`0x3f3f3f3f + 0x3f3f3f3f` 在 `int` 内安全，但自定义大值可能溢出；更稳妥是先判 `!= INF`。
3. **初始化漏掉 `dis[i][i]=0`**，导致中转自己时结果异常。
4. **重边直接赋值**，覆盖了更小的边权。
5. **次短路与最短路共用一个数组**，更新时互相覆盖。
6. **$n=2000$ 还写朴素 Floyd**，$8 \times 10^9$ 次运算必超时，应上 bitset 或换算法。
7. **最小环在松弛后统计**，把同一条边走了两遍。

---

## 🧠 本章小结

```
Floyd：f[k][i][j] = min(f[k-1][i][j], f[k-1][i][k] + f[k-1][k][j])
  原地滚动成 dis[i][j]；k 必须在最外层；O(n³)，n ≤ 500

传递闭包：加法→逻辑或；bitset 优化到 O(n³/64)
最小环：第 k 轮松弛前统计 dis[i][j] + w[i][k] + w[k][j]

次短路：d1/d2 双距离，nd 分别尝试更新 d1、d2
  严格次短路要求 nd > d1[v]
```

---

## ✅ 自查清单

- [ ] 我能解释 Floyd 的 DP 状态含义
- [ ] 我知道为什么 $k$ 必须在最外层
- [ ] 我会用 Floyd 求传递闭包
- [ ] 我会写 bitset 优化的传递闭包
- [ ] 我知道最小环要在松弛前统计
- [ ] 我能用双距离 Dijkstra 求次短路
- [ ] 我会根据 $n$ 的范围选择 Floyd 或 Dijkstra

---

## 📝 配套练习

> 📋 **本模块题单**：[M10 图论（后续）](https://hydro.ac/d/atto/training/6ade00405f809f20a8672c50)

> 共10题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | atto#395 | https://hydro.ac/d/atto/p/395 | 来自题单 |
| ★ 核心 | luogu-P1250 | https://hydro.ac/d/atto/p/luogu-P1250 | 来自题单 |
| ★ 核心 | luogu-P5960 | https://hydro.ac/d/atto/p/luogu-P5960 | 来自题单 |
| ◆ 拓展 | luogu-P1993 | https://hydro.ac/d/atto/p/luogu-P1993 | 来自题单 |
| ◆ 拓展 | luogu-P4878 | https://hydro.ac/d/atto/p/luogu-P4878 | 来自题单 |
| ◆ 拓展 | luogu-P3275 | https://hydro.ac/d/atto/p/luogu-P3275 | 来自题单 |
| ★★★ 挑战 | luogu-P7624 | https://hydro.ac/d/atto/p/luogu-P7624 | 来自题单 |
| ★★★ 挑战 | luogu-P2474 | https://hydro.ac/d/atto/p/luogu-P2474 | 来自题单 |
| ★★★ 挑战 | luogu-P3084 | https://hydro.ac/d/atto/p/luogu-P3084 | 来自题单 |
| ★★★ 挑战 | luogu-P4926 | https://hydro.ac/d/atto/p/luogu-P4926 | 来自题单 |

