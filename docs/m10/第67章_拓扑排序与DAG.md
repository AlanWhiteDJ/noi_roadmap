# 第 67 章  拓扑排序与 DAG

---

> 🏗️ **前情回顾**：第 66 章你学会了把图存起来并遍历。但遍历只回答"能不能到"，不回答"先做哪件事"。当边表示**先后依赖**时，你需要一种带顺序的遍历——拓扑排序。

---

## 🎯 本章目标

学完这一章，你能：

- 说清 DAG、入度、拓扑序的定义
- 手写 Kahn 算法，并判断有向图是否有环
- 用优先队列求字典序最小的拓扑序
- 在 DAG 上按拓扑序做最长路、方案数 DP

---

## 🧱 知识讲解

### 67.1  DAG 与拓扑序

**DAG**（Directed Acyclic Graph）是有向无环图。**拓扑序**是点的一个排列，满足：对每条边 $u \to v$，$u$ 都排在 $v$ 前面。

三个基本事实：

- 有环的有向图**不存在**拓扑序；
- DAG 的拓扑序**不一定唯一**；
- DAG 中一定存在入度为 0 的点和出度为 0 的点。

### 67.2  Kahn 算法

最常用的拓扑排序，思路像"剥洋葱"：

1. 统计每个点的入度 `ind[v]`；
2. 所有入度为 0 的点入队；
3. 取出队头 u，把 u 加入答案；对 u 的每条出边 $u \to v$，令 `ind[v]--`，减到 0 就入队；
4. 队列空时，若答案里有 $n$ 个点，说明无环；否则剩下的点被环卡住。

```cpp
const int N = 100005;
vector<int> g[N];
int ind[N], n, m;
vector<int> ans;

bool topo() {
    queue<int> q;
    for (int i = 1; i <= n; i++)
        if (ind[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        ans.push_back(u);
        for (int i = 0; i < (int)g[u].size(); i++) {
            int v = g[u][i];
            if (--ind[v] == 0) q.push(v);
        }
    }
    return (int)ans.size() == n;      // false 表示有环
}
```

复杂度 $O(n+m)$：每点入队一次，每边检查一次。

**为什么正确？** 入度 0 意味着前置都完成了，可以安全输出；删掉它相当于删掉它的出边，让后来者逐渐解锁。最后仍有入度不为 0 的点，说明它们互相等待，构成了环。

### 67.3  字典序最小的拓扑序

如果题目要求"编号小的尽量靠前"，把 `queue` 换成小根堆：

```cpp
priority_queue<int, vector<int>, greater<int> > pq;
for (int i = 1; i <= n; i++) if (!ind[i]) pq.push(i);
while (!pq.empty()) {
    int u = pq.top();
    pq.pop();
    ans.push_back(u);
    for (int v : g[u]) if (--ind[v] == 0) pq.push(v);
}
```

每步都从"当前所有可做的点"里挑最小的，得到的正是字典序最小的拓扑序。复杂度多一个 $\log n$。

> ⚠️ 换成堆后 `ind` 已被修改，判环请用输出点数；多测时重新统计入度。

### 67.4  用 DFS 求拓扑序

DFS 也能求：对每个点做 DFS，**在回溯时**把点压入栈，最后倒序输出。

```cpp
int vis[N];              // 0 未访问，1 在栈中，2 已完成
vector<int> order;
bool ok = true;

void dfs(int u) {
    vis[u] = 1;
    for (int v : g[u]) {
        if (vis[v] == 1) { ok = false; return; }   // 找到返祖边 → 有环
        if (vis[v] == 0) dfs(v);
    }
    vis[u] = 2;
    order.push_back(u);
}
// 全部 dfs 完后 reverse(order.begin(), order.end())
```

三色标记的含义：白色未访问、灰色在当前递归栈中、黑色已完成。**遇到灰色点就说明有环**，这是 DFS 判环的标准写法。

### 67.5  DAG 上的 DP

DAG 是"天然的 DP 顺序"：按拓扑序递推，处理一个点时，它的所有前驱一定已经算完。

**最长路**（点权或边权）：

```cpp
for (int u : ans)
    for (int v : g[u])
        f[v] = max(f[v], f[u] + 1);      // 边权为 1；带权图用 pair 存边
```

**方案数**（最短路计数同理）：

```cpp
for (int i = 1; i <= n; i++) if (!ind0[i]) f[i] = 1;   // ind0 为原始入度
for (int u : ans)
    for (int v : g[u])
        f[v] = (f[v] + f[u]) % MOD;
```

要点：递推必须**严格按拓扑序**；起点初值单独设（最长路设点权，方案数设 1）；多终点时答案是所有终点的汇总。

### 67.6  依赖关系建模

先修课、任务调度、编译顺序、车站分级，都是同一套建模：**点 = 任务，边 = 依赖，方向从"先发生"指向"后发生"**。方向建反，拓扑序就整体颠倒，这是最常见的失分点。

---

## 💻 例题

### 例 1  洛谷 P1113 杂务

**题意**：有 $n$ 项杂务，第 $i$ 项耗时 $len_i$，必须在若干前置杂务完成后才能开始，可以并行。求完成全部杂务的最短时间。

**思路**：设 $f_i$ 为第 $i$ 项杂务**最早完成时刻**。它开始得等所有前置都完成，所以

$$f_i = len_i + \max_{u \to i} f_u$$

没有前置时 $f_i = len_i$。按拓扑序递推，答案是 $\max f_i$。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 10005;
int n, len[N], ind[N], f[N];
vector<int> g[N];
queue<int> q;

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        int id, l, pre;
        scanf("%d%d", &id, &l);
        len[id] = l;
        while (scanf("%d", &pre) == 1 && pre != 0) {
            g[pre].push_back(id);      // 前置 → 当前
            ind[id]++;
        }
    }
    for (int i = 1; i <= n; i++) {
        if (ind[i] == 0) {
            q.push(i);
            f[i] = len[i];
        }
    }
    int ans = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        ans = max(ans, f[u]);
        for (int i = 0; i < (int)g[u].size(); i++) {
            int v = g[u][i];
            f[v] = max(f[v], f[u] + len[v]);
            if (--ind[v] == 0) q.push(v);
        }
    }
    printf("%d\n", ans);
    return 0;
}
```

复杂度 $O(n+m)$。`f[v]` 在"前驱 u 出队"时更新，而不是 v 出队时——这样 v 入队前就拿到了所有前驱的最大值。

### 例 2  洛谷 P4017 最大食物链计数

**题意**：给定食物网（DAG），求从"生产者"（入度 0）到"顶级消费者"（出度 0）的路径条数，对 80112002 取模。

**思路**：设 $f_u$ 为从生产者走到 u 的路径数。入度 0 的点 $f_u=1$，按拓扑序向后继累加，答案是所有出度 0 的点的 $f$ 之和。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 5005, M = 500005, MOD = 80112002;
int n, m, ind[N], outd[N], f[N];
vector<int> g[N];
queue<int> q;

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        g[u].push_back(v);
        ind[v]++;
        outd[u]++;
    }
    for (int i = 1; i <= n; i++)
        if (ind[i] == 0) { f[i] = 1; q.push(i); }

    int ans = 0;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        if (outd[u] == 0) ans = (ans + f[u]) % MOD;   // 到终点了，计入答案
        for (int i = 0; i < (int)g[u].size(); i++) {
            int v = g[u][i];
            f[v] = (f[v] + f[u]) % MOD;
            if (--ind[v] == 0) q.push(v);
        }
    }
    printf("%d\n", ans);
    return 0;
}
```

> 🧠 计数 DP：**出队时结算终点**（此时 f[u] 已收齐前驱贡献）；**每步取模**。

### 例 3  字典序最小的拓扑序

**题意**：$n$ 点 $m$ 边 DAG，输出字典序最小的拓扑序；若有环输出 `-1`。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 100005;
int n, m, ind[N];
vector<int> g[N], ans;
priority_queue<int, vector<int>, greater<int> > pq;

int main() {
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= m; i++) {
        int u, v;
        scanf("%d%d", &u, &v);
        g[u].push_back(v);
        ind[v]++;
    }
    for (int i = 1; i <= n; i++) if (!ind[i]) pq.push(i);
    while (!pq.empty()) {
        int u = pq.top();
        pq.pop();
        ans.push_back(u);
        for (int i = 0; i < (int)g[u].size(); i++) {
            int v = g[u][i];
            if (--ind[v] == 0) pq.push(v);
        }
    }
    if ((int)ans.size() < n) { puts("-1"); return 0; }
    for (int i = 0; i < (int)ans.size(); i++) printf("%d ", ans[i]);
    return 0;
}
```

**易错点**：不能先随便求一个拓扑序再排序，那会破坏依赖关系；要每一步都在**当前可选集合**中取最小。

---

## ⚠️ 常见错误

1. **边方向建反**。把"先修课 → 后续课"写成相反方向，拓扑序整体颠倒。
2. **只在 1 号点入队**。图可能不连通，必须扫描所有入度为 0 的点。
3. **重边导致入度多算**。两条 $u \to v$ 会让 `ind[v]` 加 2，但出边也会遍历两次，恰好抵消；若中途去重则要同步。
4. **有环不特判**。输出会少几个点，评测直接 WA，而不是 RE。
5. **DP 不按拓扑序**。写 `for (u=1..n)` 递推，前驱可能还没算完。
6. **终点答案写死 `f[n]`**。终点可能有多个，也可能不是 $n$。
7. **多测忘清空**。`g`、`ind`、`outd`、`f`、`ans` 都要重置。

---

## 🧠 本章小结

```
DAG：有向无环图；拓扑序：每条边都从前指向后

Kahn：
  统计入度 → 入度 0 入队 → 出队输出 → 后继入度减 1 → 减到 0 入队
  输出点数 < n ⇔ 有环
  字典序最小：queue 换 priority_queue

DAG 上 DP：
  最长路 f[v] = max(f[v], f[u] + w)
  方案数 f[v] += f[u]（起点初始化为 1）
  必须按拓扑序递推，答案看所有终点
```

---

## ✅ 自查清单

- [ ] 我能不看模板写出 Kahn 算法
- [ ] 我知道怎么用拓扑排序判断有向图是否有环
- [ ] 我会用优先队列求字典序最小的拓扑序
- [ ] 我能在 DAG 上写最长路和方案数 DP
- [ ] 我建图时不会把依赖边的方向搞反

---

## 📝 配套练习

> 📋 **本模块题单**：[M10 图论（后续）](https://hydro.ac/d/atto/training/6ade00405f809f20a8672c50)

> 共20题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P1807 | https://hydro.ac/d/atto/p/luogu-P1807 | 知识点：最长路 |
| ★ 核心 | luogu-P8893 | https://hydro.ac/d/atto/p/luogu-P8893 | 知识点：「UOI-R1」智能推荐 |
| ★ 核心 | luogu-P2712 | https://hydro.ac/d/atto/p/luogu-P2712 | 知识点：摄像头 |
| ★ 核心 | luogu-P3074 | https://hydro.ac/d/atto/p/luogu-P3074 | 知识点：[USACO13FEB] Milk Scheduling |
| ★ 核心 | luogu-P6145 | https://hydro.ac/d/atto/p/luogu-P6145 | 知识点：[USACO20FEB] Timeline G |
| ★ 核心 | luogu-P1137 | https://hydro.ac/d/atto/p/luogu-P1137 | 知识点：旅行计划 |
| ◆ 拓展 | luogu-P10166 | https://hydro.ac/d/atto/p/luogu-P10166 | 知识点：[DTCPC 2024] 环 |
| ◆ 拓展 | luogu-P1038 | https://hydro.ac/d/atto/p/luogu-P1038 | 知识点：[NOIP 2003 提高组] 神经网络 |
| ◆ 拓展 | luogu-P7113 | https://hydro.ac/d/atto/p/luogu-P7113 | 知识点：[NOIP2020] 排水系统 |
| ◆ 拓展 | luogu-P1983 | https://hydro.ac/d/atto/p/luogu-P1983 | 知识点：[NOIP 2013 普及组] 车站分级 |
| ◆ 拓展 | luogu-P1685 | https://hydro.ac/d/atto/p/luogu-P1685 | 知识点：游览 |
| ◆ 拓展 | luogu-P5603 | https://hydro.ac/d/atto/p/luogu-P5603 | 知识点：小 C 与桌游 |
| ★★★ 挑战 | luogu-P3243 | https://hydro.ac/d/atto/p/luogu-P3243 | 知识点：[HNOI2015] 菜肴制作 |
| ★★★ 挑战 | luogu-P4376 | https://hydro.ac/d/atto/p/luogu-P4376 | 知识点：[USACO18OPEN] Milking Order  |
| ★★★ 挑战 | luogu-P3588 | https://hydro.ac/d/atto/p/luogu-P3588 | 知识点：[POI 2015] PUS |
| ★★★ 挑战 | luogu-P2597 | https://hydro.ac/d/atto/p/luogu-P2597 | 知识点：[ZJOI2012] 灾难 |
| ★★★ 挑战 | luogu-P2505 | https://hydro.ac/d/atto/p/luogu-P2505 | 知识点：[HAOI2012] 道路 |
| ★★★ 挑战 | luogu-P9534 | https://hydro.ac/d/atto/p/luogu-P9534 | 知识点：[YsOI2023] 广度优先遍历 |
| ★★★ 挑战 | luogu-P1600 | https://hydro.ac/d/atto/p/luogu-P1600 | 知识点：[NOIP 2016 提高组] 天天爱跑步 |
| ★★★ 挑战 | atto#924 | https://hydro.ac/d/atto/p/924 | 知识点：924 [NOIP 2015 提高组] 运输计划 |

