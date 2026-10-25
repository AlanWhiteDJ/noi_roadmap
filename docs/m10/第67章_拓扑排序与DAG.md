# 第 67 章  拓扑排序与 DAG

---

> 🏗️ **前情回顾**：有向无环图（DAG）是"没有环的有向图"。它有一个非常好的性质：可以排出一个线性顺序，让所有边都从前指向后。

## 🎯 本章目标

- 写出 Kahn 拓扑排序
- 判断有向图是否有环
- 在 DAG 上做最长路、方案数 DP
- 用拓扑序解决依赖关系问题

## 🧱 知识讲解

### 67.1  Kahn 算法

1. 统计每个点的入度
2. 入度为 0 的点入队
3. 取出队头 u，把 u 的所有出边 v 的入度减 1；若 v 入度变 0 则入队
4. 队列空时，若已输出 n 个点则无环，否则有环

```cpp
for (int i = 1; i <= n; i++) if (!in[i]) q.push(i);
while (!q.empty()) {
    int u = q.front(); q.pop();
    ans.push_back(u);
    for (int v : g[u]) if (--in[v] == 0) q.push(v);
}
```

### 67.2  DAG 上的 DP

按拓扑序递推，保证前驱先算完：

- 最长路：`dp[v] = max(dp[v], dp[u] + w)`
- 方案数：`dp[v] += dp[u]`
- 依赖关系：先修课、任务调度

### 67.3  环的判定

拓扑排序输出点数小于 n，说明剩下的点构成环。

## 💻 例题

**例 1**：洛谷 P1113 杂务——拓扑 + 最长路。

**例 2**：洛谷 P4017 最大食物链计数——拓扑 + 计数 DP。

## ⚠️ 常见坑

1. 重边导致入度多算
2. 图不连通时要从所有入度为 0 的点入队
3. DP 必须在拓扑序上做，不能随便遍历
4. 有环时输出不全，要特判

## 📝 练习

- 基础：P1113、P4017
- 提高：P1983 车站分级、P1807 最长路
- 挑战：CSP-S 2022 假期计划（DAG 建模，先写部分分）

## 📝 配套练习

> 📋 **本模块题单**：[M10 图论（下册）](https://hydro.ac/d/atto/training/6ade00405f809f20a8672c50)

> 共20题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P1807 | https://hydro.ac/d/atto/p/luogu-P1807 | 来自下册题单 |
| ★ 核心 | luogu-P8893 | https://hydro.ac/d/atto/p/luogu-P8893 | 来自下册题单 |
| ★ 核心 | luogu-P2712 | https://hydro.ac/d/atto/p/luogu-P2712 | 来自下册题单 |
| ★ 核心 | luogu-P3074 | https://hydro.ac/d/atto/p/luogu-P3074 | 来自下册题单 |
| ★ 核心 | luogu-P6145 | https://hydro.ac/d/atto/p/luogu-P6145 | 来自下册题单 |
| ★ 核心 | luogu-P1137 | https://hydro.ac/d/atto/p/luogu-P1137 | 来自下册题单 |
| ◆ 拓展 | luogu-P10166 | https://hydro.ac/d/atto/p/luogu-P10166 | 来自下册题单 |
| ◆ 拓展 | luogu-P1038 | https://hydro.ac/d/atto/p/luogu-P1038 | 来自下册题单 |
| ◆ 拓展 | luogu-P7113 | https://hydro.ac/d/atto/p/luogu-P7113 | 来自下册题单 |
| ◆ 拓展 | luogu-P1983 | https://hydro.ac/d/atto/p/luogu-P1983 | 来自下册题单 |
| ◆ 拓展 | luogu-P1685 | https://hydro.ac/d/atto/p/luogu-P1685 | 来自下册题单 |
| ◆ 拓展 | luogu-P5603 | https://hydro.ac/d/atto/p/luogu-P5603 | 来自下册题单 |
| ★★★ 挑战 | luogu-P3243 | https://hydro.ac/d/atto/p/luogu-P3243 | 来自下册题单 |
| ★★★ 挑战 | luogu-P4376 | https://hydro.ac/d/atto/p/luogu-P4376 | 来自下册题单 |
| ★★★ 挑战 | luogu-P3588 | https://hydro.ac/d/atto/p/luogu-P3588 | 来自下册题单 |
| ★★★ 挑战 | luogu-P2597 | https://hydro.ac/d/atto/p/luogu-P2597 | 来自下册题单 |
| ★★★ 挑战 | luogu-P2505 | https://hydro.ac/d/atto/p/luogu-P2505 | 来自下册题单 |
| ★★★ 挑战 | luogu-P9534 | https://hydro.ac/d/atto/p/luogu-P9534 | 来自下册题单 |
| ★★★ 挑战 | luogu-P1600 | https://hydro.ac/d/atto/p/luogu-P1600 | 来自下册题单 |
| ★★★ 挑战 | atto#924 | https://hydro.ac/d/atto/p/924 | 来自下册题单 |

