# 第 69 章  最短路（二）Floyd 与次短路

---

> 🏗️ **前情回顾**：Dijkstra 求单源最短路；如果要求任意两点之间的最短路，Floyd 更直接。

## 🎯 本章目标

- 掌握 Floyd 的三重循环与传递闭包
- 求次短路
- 理解全源最短路与可达性

## 🧱 知识讲解

### 69.1  Floyd

```cpp
for (int k = 1; k <= n; k++)
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);
```

- k 必须在最外层
- 复杂度 O(n³)，适合 n ≤ 500
- 初始化：`dis[i][i]=0`，边 `dis[u][v]=w`

### 69.2  传递闭包

把 `dis[i][j]` 换成 `reach[i][j]`（能否到达），用 Floyd 求可达性：

```cpp
reach[i][j] |= reach[i][k] && reach[k][j];
```

### 69.3  次短路

- 枚举边：次短路一定是最短路换掉一条边
- 或改 Dijkstra，同时维护最短路和次短路两个距离

## 💻 例题

**例 1**：洛谷 P2419 Cow Contest——Floyd 传递闭包。

**例 2**：洛谷 P2865 Roadblocks——次短路模板。

## ⚠️ 常见坑

1. k 循环写在内层
2. INF 相加溢出
3. 次短路与最短路共用数组导致覆盖
4. 重边取最小边权

## 📝 练习

- 基础：P2419、P2910
- 提高：P1522 牛的旅行、P2865
- 挑战：初赛 2024 次短路完善程序

## 📝 配套练习

> 📋 **本模块题单**：[M10 图论（下册）](https://hydro.ac/d/atto/training/6ade00405f809f20a8672c50)

> 共10题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | atto#395 | https://hydro.ac/d/atto/p/395 | 来自下册题单 |
| ★ 核心 | luogu-P1250 | https://hydro.ac/d/atto/p/luogu-P1250 | 来自下册题单 |
| ★ 核心 | luogu-P5960 | https://hydro.ac/d/atto/p/luogu-P5960 | 来自下册题单 |
| ◆ 拓展 | luogu-P1993 | https://hydro.ac/d/atto/p/luogu-P1993 | 来自下册题单 |
| ◆ 拓展 | luogu-P4878 | https://hydro.ac/d/atto/p/luogu-P4878 | 来自下册题单 |
| ◆ 拓展 | luogu-P3275 | https://hydro.ac/d/atto/p/luogu-P3275 | 来自下册题单 |
| ★★★ 挑战 | luogu-P7624 | https://hydro.ac/d/atto/p/luogu-P7624 | 来自下册题单 |
| ★★★ 挑战 | luogu-P2474 | https://hydro.ac/d/atto/p/luogu-P2474 | 来自下册题单 |
| ★★★ 挑战 | luogu-P3084 | https://hydro.ac/d/atto/p/luogu-P3084 | 来自下册题单 |
| ★★★ 挑战 | luogu-P4926 | https://hydro.ac/d/atto/p/luogu-P4926 | 来自下册题单 |

