# 第 68 章  最短路（一）Dijkstra / SPFA / Bellman-Ford

---

> 🏗️ **前情回顾**：BFS 能求无权图最短路；边权不为 1 时，就要用最短路算法。

## 🎯 本章目标

- 写出堆优化 Dijkstra
- 理解 Bellman-Ford 与 SPFA 的适用边界
- 处理负权边、负环
- 会建分层图、反向图

## 🧱 知识讲解

### 68.1  Dijkstra

要求边权非负。每次取出当前距离最小的点，用它松弛邻居：

```cpp
priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
dis[s] = 0; pq.push({0, s});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d != dis[u]) continue;          // 过期
    for (auto [v, w] : g[u])
        if (dis[v] > d + w) {
            dis[v] = d + w;
            pq.push({dis[v], v});
        }
}
```

复杂度 O((n+m) log n)。

### 68.2  Bellman-Ford / SPFA

- Bellman-Ford：松弛 n-1 轮，能处理负权，O(nm)
- SPFA：队列优化，平均较快，但可被网格图卡到 O(nm)

负环判定：某个点入队超过 n 次，或第 n 轮仍能松弛。

### 68.3  建图技巧

- 反向图：求"所有点到某点"的最短路
- 分层图：状态多一维（如免费 k 次）
- 拆点：把点拆成入点/出点

## 💻 例题

**例 1**：洛谷 P4779 单源最短路（标准版）。

**例 2**：洛谷 P1629 邮递员送信——正向 + 反向最短路。

## ⚠️ 常见坑

1. Dijkstra 处理负权边会错
2. 堆里过期元素没跳过
3. SPFA 在网格图上退化
4. `INF` 相加溢出

## 📝 练习

- 基础：P4779、P3371
- 提高：P4568 飞行路线（分层图）
- 挑战：CSP-S 2022 假期计划

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

