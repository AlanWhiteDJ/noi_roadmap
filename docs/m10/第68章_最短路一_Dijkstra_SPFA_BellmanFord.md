# 第 68 章  最短路（一）Dijkstra / SPFA / Bellman-Ford

---

> 🏗️ **前情回顾**：BFS 能求无权图最短路，因为每走一步代价相同。可现实里的边往往带权：这段路 3 公里、那条地铁 7 分钟。边权不再相等，BFS 的"层"就失效了。

---

## 🎯 本章目标

学完这一章，你能：

- 说清"松弛"是什么，为什么所有最短路算法都在做同一件事
- 手写堆优化 Dijkstra，并说明它为什么要求边权非负
- 用 Bellman-Ford 判负环，写出 SPFA 并知道它何时退化
- 用反向图、分层图把陌生问题改造成标准最短路

---

## 📖 故事引入

小元要做一个"最快到达"表：路口是点，路是边，边权是骑行分钟数。他先用 BFS，结果错了——BFS 选"经过 2 条路"的路线，可那两条一条 20 分钟、一条 15 分钟；另一条绕 4 个路口，却只要 12 分钟。

带权之后，"步数少"不等于"总代价小"。他换了个办法：起点设 0，其余无穷大；不断找当前距离最小的点，用它更新邻居——到 u 要 10 分钟，u 到 v 要 3 分钟，那到 v 至多 13 分钟。

这个"把估计值改小"的动作叫**松弛**。本章三种算法，区别只在"按什么顺序挑点"。

---

## 🧱 知识讲解

### 68.1  松弛

设 `dis[v]` 是"目前已知的起点到 v 的最短距离"。对边 $u \to v$（权 $w$）：

```cpp
if (dis[v] > dis[u] + w)
    dis[v] = dis[u] + w;
```

依据是三角形不等式；所有边都松弛不动时，`dis` 就是答案。

### 68.2  Dijkstra

**前提：边权非负。**

1. `dis[s]=0`，其余 `INF`；
2. 取出未确定点中 `dis` 最小的 u，标记确定；
3. 用 u 的出边松弛邻居；
4. 重复，直到全部确定或队列空。

**为什么对？** 当前 `dis` 最小的 u 不可能再被改小：其他未定点都不小于它，边权非负，绕路只会更远。

暴力是 $O(n^2)$，适合稠密图；堆优化 $O((n+m)\log n)$：

```cpp
typedef long long ll;
typedef pair<ll,int> pli;          // (距离, 点)
priority_queue<pli, vector<pli>, greater<pli> > pq;

dis[s] = 0;
pq.push(make_pair(0, s));
while (!pq.empty()) {
    pli cur = pq.top();
    pq.pop();
    ll d = cur.first;
    int u = cur.second;
    if (d != dis[u]) continue;     // 过期元素
    for (int e = head[u]; e; e = nxt[e]) {
        int v = to[e];
        if (dis[v] > d + w[e]) {
            dis[v] = d + w[e];
            pq.push(make_pair(dis[v], v));
        }
    }
}
```

> ⚠️ `if (d != dis[u]) continue;` 不能省，否则同一点重复入堆，复杂度退化。

### 68.3  为什么怕负权

反例：$s \to a$ 权 2，$s \to b$ 权 3，$b \to a$ 权 $-2$。Dijkstra 先给 $a$ 盖章 `dis=2`，实际 $s \to b \to a=1$ 更短。有负权就换 Bellman-Ford / SPFA。

### 68.4  Bellman-Ford

无负环时最短路最多 $n-1$ 条边，所以把所有边松弛 $n-1$ 轮即可；第 $n$ 轮还能松弛，就说明有负环。

```cpp
for (int i = 1; i <= n; i++) dis[i] = INF;
dis[s] = 0;
for (int round = 1; round <= n - 1; round++) {
    bool changed = false;
    for (int i = 1; i <= m; i++) {
        int u = eu[i], v = ev[i];
        if (dis[u] == INF) continue;
        if (dis[v] > dis[u] + ew[i]) {
            dis[v] = dis[u] + ew[i];
            changed = true;
        }
    }
    if (!changed) break;                 // 提前收敛
}
for (int i = 1; i <= m; i++)             // 第 n 轮
    if (dis[eu[i]] != INF && dis[ev[i]] > dis[eu[i]] + ew[i])
        { /* 存在负环 */ }
```

复杂度 $O(nm)$；也可解"最多经过 k 条边"。

### 68.5  SPFA

只有被松弛过的点才可能继续松弛别人，用队列存这些点：

```cpp
queue<int> q;
dis[s] = 0; q.push(s); in[s] = true;
while (!q.empty()) {
    int u = q.front(); q.pop(); in[u] = false;
    for (int e = head[u]; e; e = nxt[e]) {
        int v = to[e];
        if (dis[v] > dis[u] + w[e]) {
            dis[v] = dis[u] + w[e];
            cnt[v] = cnt[u] + 1;         // 经过边数
            if (cnt[v] >= n) { /* 负环 */ }
            if (!in[v]) { in[v] = true; q.push(v); }
        }
    }
}
```

平均快，最坏 $O(nm)$，网格图会被卡满；无负权优先 Dijkstra。

### 68.6  建图技巧

常用四招：**反向图**（多点到一点）、**分层图**（免费 k 次）、**拆点**（点权/方向限制）、**超级源汇**（连虚拟点，边权 0）。

分层图编号 `id(u,t) = u + t*n`：同层走原边权，跨层走特权边权。

---

## 💻 例题

### 例 1  洛谷 P4779 单源最短路（标准版）

$n \le 10^5$，$m \le 2 \times 10^5$，边权非负。距离用 `long long`：最坏 $10^5 \times 10^9 = 10^{14}$。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<ll,int> pli;
const int N = 100005, M = 200005;
const ll INF = (ll)1e18;

int n, m, s, head[N], to[M], nxt[M], w[M], ecnt = 0;
ll dis[N];

void add(int u, int v, int ww) {
    to[++ecnt] = v; w[ecnt] = ww;
    nxt[ecnt] = head[u]; head[u] = ecnt;
}

int main() {
    scanf("%d%d%d", &n, &m, &s);
    for (int i = 1; i <= m; i++) {
        int u, v, ww;
        scanf("%d%d%d", &u, &v, &ww);
        add(u, v, ww);
    }
    for (int i = 1; i <= n; i++) dis[i] = INF;
    dis[s] = 0;
    priority_queue<pli, vector<pli>, greater<pli> > pq;
    pq.push(make_pair(0, s));
    while (!pq.empty()) {
        pli cur = pq.top(); pq.pop();
        ll d = cur.first;
        int u = cur.second;
        if (d != dis[u]) continue;
        for (int e = head[u]; e; e = nxt[e]) {
            int v = to[e];
            if (dis[v] > d + w[e]) {
                dis[v] = d + w[e];
                pq.push(make_pair(dis[v], v));
            }
        }
    }
    for (int i = 1; i <= n; i++) printf("%lld ", dis[i]);
    return 0;
}
```

### 例 2  洛谷 P1629 邮递员送信

有向图，从 1 出发送信到各点再返回，求总路程。

去程一次 Dijkstra；回程若每点各跑一次太慢——**在反图上从 1 跑一次**，`dis[v]` 正是原图中 v 到 1 的距离。

```cpp
typedef long long ll;
typedef pair<ll,int> pli;
const int N = 1005;
const ll INF = (ll)1e18;
int n, m;
vector<pair<int,int> > g[N], rg[N];
ll d1[N], d2[N];

void dijkstra(int s, vector<pair<int,int> > gr[], ll dis[]) {
    for (int i = 1; i <= n; i++) dis[i] = INF;
    dis[s] = 0;
    priority_queue<pli, vector<pli>, greater<pli> > pq;
    pq.push(make_pair(0, s));
    while (!pq.empty()) {
        pli cur = pq.top(); pq.pop();
        ll d = cur.first;
        int u = cur.second;
        if (d != dis[u]) continue;
        for (int i = 0; i < (int)gr[u].size(); i++) {
            int v = gr[u][i].first, w = gr[u][i].second;
            if (dis[v] > d + w) {
                dis[v] = d + w;
                pq.push(make_pair(dis[v], v));
            }
        }
    }
}

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; i++) {
        int u, v, w;
        scanf("%d%d%d", &u, &v, &w);
        g[u].push_back(make_pair(v, w));
        rg[v].push_back(make_pair(u, w));
    }
    dijkstra(1, g, d1);
    dijkstra(1, rg, d2);
    ll ans = 0;
    for (int i = 2; i <= n; i++) ans += d1[i] + d2[i];
    printf("%lld\n", ans);
    return 0;
}
```

### 例 3  洛谷 P4568 飞行路线（分层图）

无向图，最多免费乘 $k$ 次，求 $s$ 到 $t$ 的最小花费。把"用了几次免费"作为新的一维，建 $k+1$ 层图：同层边权 $w$，跨层同一条边权 0。跑一次 Dijkstra，取各层 $t$ 的最小值。

```cpp
// id(u,t) = u + t*n；对每条边 e：
// 同层：add(eu+t*n, ev+t*n, w) 与反向
// 跨层：add(eu+t*n, ev+(t+1)*n, 0)（本次免费）
// 答案 = min{ dis[t + i*n] | 0 <= i <= k }
```

> 💡 出现"最多免费 k 次""可逆行一次""油量有限"，先想分层。

---

## ⚠️ 常见错误

1. **Dijkstra 用于负权图**，答案错且不报错。
2. **忘记跳过堆中过期元素**，大数据 TLE。
3. **`INF` 相加溢出**：`long long` 用 `1e18`，加前先判 `dis[u]==INF`。
4. **距离用 `int`**：$10^5$ 点、边权 $10^9$ 时路径可达 $10^{14}$。
5. **SPFA 判负环写错**：入队次数在成功松弛入队时统计。
6. **多测不清空**：`head`、`ecnt`、`in`、`cnt`、`dis` 需重置。
7. **无向图只加一条边**，或反向图忘了反向。

---

## 🧠 本章小结

```
松弛：if (dis[v] > dis[u] + w) dis[v] = dis[u] + w;

Dijkstra：每次取 dis 最小的未定点，边权必须非负
  暴力 O(n²) 稠密图；堆优化 O((n+m)log n)，跳过过期元素
Bellman-Ford：松弛 n-1 轮，O(nm)，可负权；第 n 轮还能松弛 ⇒ 负环
SPFA：队列版 BF，平均快、最坏 O(nm)

建图：反向图、分层图、拆点、超级源汇
```

---

## ✅ 自查清单

- [ ] 我能写出松弛的两行核心代码
- [ ] 我能不看模板写出堆优化 Dijkstra
- [ ] 我知道 Dijkstra 为什么不能有负权边
- [ ] 我会用 Bellman-Ford 判负环
- [ ] 我能用反向图把"多点到一点"变成一次最短路
- [ ] 我理解分层图的编号方式

---

## 📝 配套练习

> 📋 **本模块题单**：[M10 图论（后续）](https://hydro.ac/d/atto/training/6ade00405f809f20a8672c50)

> 共34题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P2935 | https://hydro.ac/d/atto/p/luogu-P2935 | 来自题单 |
| ★ 核心 | luogu-P2984 | https://hydro.ac/d/atto/p/luogu-P2984 | 来自题单 |
| ★ 核心 | luogu-P1339 | https://hydro.ac/d/atto/p/luogu-P1339 | 来自题单 |
| ★ 核心 | luogu-P1821 | https://hydro.ac/d/atto/p/luogu-P1821 | 来自题单 |
| ★ 核心 | luogu-P1529 | https://hydro.ac/d/atto/p/luogu-P1529 | 来自题单 |
| ★ 核心 | luogu-P2888 | https://hydro.ac/d/atto/p/luogu-P2888 | 来自题单 |
| ★ 核心 | luogu-P2951 | https://hydro.ac/d/atto/p/luogu-P2951 | 来自题单 |
| ★ 核心 | luogu-P6770 | https://hydro.ac/d/atto/p/luogu-P6770 | 来自题单 |
| ★ 核心 | luogu-P3003 | https://hydro.ac/d/atto/p/luogu-P3003 | 来自题单 |
| ★ 核心 | luogu-P2419 | https://hydro.ac/d/atto/p/luogu-P2419 | 来自题单 |
| ★ 核心 | luogu-P1673 | https://hydro.ac/d/atto/p/luogu-P1673 | 来自题单 |
| ◆ 拓展 | luogu-P1629 | https://hydro.ac/d/atto/p/luogu-P1629 | 来自题单 |
| ◆ 拓展 | luogu-P6175 | https://hydro.ac/d/atto/p/luogu-P6175 | 来自题单 |
| ◆ 拓展 | luogu-P2176 | https://hydro.ac/d/atto/p/luogu-P2176 | 来自题单 |
| ◆ 拓展 | luogu-P2047 | https://hydro.ac/d/atto/p/luogu-P2047 | 来自题单 |
| ◆ 拓展 | luogu-P1078 | https://hydro.ac/d/atto/p/luogu-P1078 | 来自题单 |
| ◆ 拓展 | luogu-P1119 | https://hydro.ac/d/atto/p/luogu-P1119 | 来自题单 |
| ◆ 拓展 | luogu-P1522 | https://hydro.ac/d/atto/p/luogu-P1522 | 来自题单 |
| ◆ 拓展 | luogu-P9751 | https://hydro.ac/d/atto/p/luogu-P9751 | 来自题单 |
| ◆ 拓展 | luogu-P2914 | https://hydro.ac/d/atto/p/luogu-P2914 | 来自题单 |
| ◆ 拓展 | luogu-P6464 | https://hydro.ac/d/atto/p/luogu-P6464 | 来自题单 |
| ◆ 拓展 | luogu-P3371 | https://hydro.ac/d/atto/p/luogu-P3371 | 来自题单 |
| ★★★ 挑战 | luogu-P1186 | https://hydro.ac/d/atto/p/luogu-P1186 | 来自题单 |
| ★★★ 挑战 | luogu-P2865 | https://hydro.ac/d/atto/p/luogu-P2865 | 来自题单 |
| ★★★ 挑战 | luogu-P2966 | https://hydro.ac/d/atto/p/luogu-P2966 | 来自题单 |
| ★★★ 挑战 | luogu-P1491 | https://hydro.ac/d/atto/p/luogu-P1491 | 来自题单 |
| ★★★ 挑战 | luogu-P3831 | https://hydro.ac/d/atto/p/luogu-P3831 | 来自题单 |
| ★★★ 挑战 | luogu-P4822 | https://hydro.ac/d/atto/p/luogu-P4822 | 来自题单 |
| ★★★ 挑战 | luogu-P4568 | https://hydro.ac/d/atto/p/luogu-P4568 | 来自题单 |
| ★★★ 挑战 | luogu-P2939 | https://hydro.ac/d/atto/p/luogu-P2939 | 来自题单 |
| ★★★ 挑战 | luogu-P2371 | https://hydro.ac/d/atto/p/luogu-P2371 | 来自题单 |
| ★★★ 挑战 | luogu-P2446 | https://hydro.ac/d/atto/p/luogu-P2446 | 来自题单 |
| ★★★ 挑战 | luogu-P4042 | https://hydro.ac/d/atto/p/luogu-P4042 | 来自题单 |
| ★★★ 挑战 | luogu-P5100 | https://hydro.ac/d/atto/p/luogu-P5100 | 来自题单 |

