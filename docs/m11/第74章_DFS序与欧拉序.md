# 第 74 章  DFS 序与欧拉序

---

> 🏗️ **前情回顾**：第 44 章写过递归，第 66 章用 DFS 遍历过图。当时 `vis` 只用来防重复访问；这一章给每个点记一个"到达时间"，把树的结构变成一段段区间。

---

## 🎯 本章目标

学完这一章，你能：

- 用一次 DFS 求出 `dfn` 与 `out`，把任意子树映射成连续区间
- 分清先序、后序、欧拉序，知道各自的长度和用途
- 用欧拉序 + ST 表在 O(1) 时间内回答 LCA
- 把"子树加、子树和、单点查"搬到树状数组或线段树上
- 在 O(nlogn) 时间内统计"子树内满足条件的点数"

---

## 🌱 故事引入：点名册上的一个班

校庆拍集体照，每个班站成一列。校长手里只有一份"全校到校顺序"的名单，他想知道"高二(3)班站在第几号到第几号"。

按"进校门后先走到自己班、再走到下一个班"的顺序记录，同一个班的人一定挤在一起；校长只要记住第一个和最后一个进班的人，就能一刀切出整个班。

DFS 序就是这份"进校顺序"：进入一个点时记下序号，离开时记下当前最大序号。于是"以 u 为根的子树"变成序列上的一段 `[dfn[u], out[u]]`。欧拉序则把"走进"和"走出"都记下来，得到一条长 `2n-1` 的路线，沿着它能用 RMQ 求 LCA。

---

## 🧱 知识讲解

### 74.1  时间戳：dfn 与 out

每进入一个点，计数器加一，记作 `dfn`；递归处理所有儿子；等儿子都处理完，把当前计数器记作 `out`。

```cpp
const int N = 100005;
vector<int> g[N];
int dfn[N], out[N], timer;

void dfs(int u, int fa) {
    dfn[u] = ++timer;                 // 进入 u
    for (int i = 0; i < (int)g[u].size(); ++i) {
        int v = g[u][i];
        if (v == fa) continue;        // 只防止走回父亲
        dfs(v, u);
    }
    out[u] = timer;                   // 离开 u：子树已全部访问完
}
```

关键性质：

> **子树 u 的所有点，其 `dfn` 恰好填满 `[dfn[u], out[u]]`，一个不多，一个不少。**

进入 u 后，返回前不会访问子树外的点；而这段时间访问到的点，都只能经 u 的儿子递归下去，必定是 u 的后代。两头都成立，区间被卡死。于是：

```cpp
sz[u] = out[u] - dfn[u] + 1;
```

> 💡 `dfn` 从 1 开始；BIT 的 `x & -x` 在 0 处会死循环。

### 74.2  三种序：先序、后序、欧拉序

以 1 为根、1 的儿子是 2 和 3、2 的儿子是 4 的树为例：

| 序 | 记录时机 | 结果 | 长度 | 典型用途 |
|----|----------|------|------|----------|
| 先序（dfn） | 进入点时 | 1 2 4 3 | n | 子树转区间 |
| 后序 | 离开点时 | 4 2 3 1 | n | 自底向上 DP、差分累加 |
| 欧拉序 | 进入时 + 每次从儿子返回时 | 1 2 4 2 1 3 1 | 2n-1 | LCA、RMQ |

欧拉序像在树上散步：每走到一个点记一笔，每从一个儿子走回来再记一笔。每条边向下、向上各走一次，所以长度是 `2(n-1)+1 = 2n-1`。

```cpp
int euler[2 * N], tot, first[N], dep[N];

void edfs(int u, int fa) {
    first[u] = ++tot;                 // 第一次出现的下标
    euler[tot] = u;
    for (int i = 0; i < (int)g[u].size(); ++i) {
        int v = g[u][i];
        if (v == fa) continue;
        dep[v] = dep[u] + 1;
        edfs(v, u);
        euler[++tot] = u;             // 从儿子返回，再记一次 u
    }
}
```

`first[u]` 只在进入时赋值。设 `first[u] <= first[v]`，则：

> `LCA(u, v)` 等于 `euler[first[u]..first[v]]` 中 `dep` 最小的点。

从 u 走到 v 一定会经过 LCA，且不会走到 LCA 的祖先。路上深度最小的点自然就是 LCA。把区间最小值交给 ST 表：

```cpp
int lg[2 * N], st[21][2 * N];

void buildST(int m) {
    lg[1] = 0;
    for (int i = 2; i <= m; ++i) lg[i] = lg[i / 2] + 1;
    for (int i = 1; i <= m; ++i) st[0][i] = euler[i];
    for (int k = 1; (1 << k) <= m; ++k)
        for (int i = 1; i + (1 << k) - 1 <= m; ++i) {
            int a = st[k - 1][i];
            int b = st[k - 1][i + (1 << (k - 1))];
            st[k][i] = (dep[a] < dep[b]) ? a : b;
        }
}
int rmq(int l, int r) {
    int k = lg[r - l + 1];
    int a = st[k][l], b = st[k][r - (1 << k) + 1];
    return (dep[a] < dep[b]) ? a : b;
}
int lca(int u, int v) {
    if (first[u] > first[v]) swap(u, v);
    return rmq(first[u], first[v]);
}
```

> ⚠️ ST 表里存的是点，但比较的键是 `dep`。写成 `min(a, b)` 就错了。

### 74.3  把子树操作变成区间操作

| 树上操作 | 序列上的对应操作 |
|----------|------------------|
| 单点加 a | 在 `dfn[u]` 处加 a |
| 子树加 a | 区间加 `[dfn[u], out[u]]` |
| 单点查 | 单点查询 |
| 子树和 | 区间和 `[dfn[u], out[u]]` |

**单点加 + 子树和**：普通树状数组。

```cpp
void add(int x, int v) { for (; x <= n; x += x & -x) bit[x] += v; }
int sum(int x) { int s = 0; for (; x > 0; x -= x & -x) s += bit[x]; return s; }
int subtreeSum(int u) { return sum(out[u]) - sum(dfn[u] - 1); }
```

**子树加 + 单点查**：差分树状数组，左端加、右端右边减，查询时求前缀和。

```cpp
void subtreeAdd(int u, int v) {
    add(dfn[u], v);
    add(out[u] + 1, -v);              // 树状数组开到 n+1
}
int pointValue(int u) { return sum(dfn[u]); }
```

**子树加 + 子树和**：需要"区间加、区间和"，可用线段树懒标记，也可用两个树状数组：

```cpp
long long b1[N], b2[N];
void add(long long *b, int x, long long v) {
    for (; x <= n + 1; x += x & -x) b[x] += v;
}
void rangeAdd(int l, int r, long long v) {
    add(b1, l, v);           add(b1, r + 1, -v);
    add(b2, l, v * (l - 1)); add(b2, r + 1, -v * r);
}
long long pre(long long *b, int x) {
    long long s = 0;
    for (; x > 0; x -= x & -x) s += b[x];
    return s;
}
long long prefixSum(int x) { return pre(b1, x) * x - pre(b2, x); }
long long rangeSum(int l, int r) { return prefixSum(r) - prefixSum(l - 1); }
```

原理是对差分数组再求一次前缀和：

```
sum(1..x) = Σ(j=1..x) d[j] * (x - j + 1)
          = (x + 1) * Σd[j] - Σ j*d[j]
```

### 74.4  实现细节

- 深链会爆栈：10^5 层递归在部分环境撑不住。本地可用 `ulimit -s 65536`，比赛里更稳的是写迭代 DFS。
- 多测要清 `g`、`timer`、`tot`，否则上一组的 `dfn` 会污染这一组。
- 欧拉序开 `2*N`；`out[u] + 1` 可能到 `n + 1`，BIT 上界留一位。

---

## 💻 例题

### 例 1  P3605 [USACO17JAN] Promotion Counting

**题意**：n 头牛构成以 1 为根的树，每头牛有能力值 `p[i]`。对每头牛，求它子树内能力值**严格大于**它的牛数。`n <= 10^5`。

**思路**：暴搜子树是 O(n^2)。用 dfn 把子树变成区间后，问题变成"询问区间内已加入的点数"。

把牛按能力值从大到小处理。处理 u 时，BIT 里恰好是所有能力值更大的牛，查询 `[dfn[u], out[u]]` 的区间和即可，然后把自己加入。能力值可能相同，而题目要求严格大于，所以相同能力值必须**整组先查、再整组加入**。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 100005;
int n, p[N], dfn[N], out[N], timer, bit[N], ans[N];
vector<int> g[N];

void dfs(int u, int fa) {
    dfn[u] = ++timer;
    for (int i = 0; i < (int)g[u].size(); ++i) {
        int v = g[u][i];
        if (v != fa) dfs(v, u);
    }
    out[u] = timer;
}
void add(int x, int v) { for (; x <= n; x += x & -x) bit[x] += v; }
int sum(int x) { int s = 0; for (; x > 0; x -= x & -x) s += bit[x]; return s; }

int main() {
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%d", &p[i]);
    for (int i = 2; i <= n; ++i) {
        int f; scanf("%d", &f);
        g[f].push_back(i); g[i].push_back(f);
    }
    dfs(1, 0);

    vector<int> id(n);
    for (int i = 0; i < n; ++i) id[i] = i + 1;
    sort(id.begin(), id.end(), [](int a, int b) { return p[a] > p[b]; });

    for (int i = 0; i < n; ) {
        int j = i;
        while (j < n && p[id[j]] == p[id[i]]) ++j;   // 相同能力值一组
        for (int k = i; k < j; ++k) {
            int u = id[k];
            ans[u] = sum(out[u]) - sum(dfn[u] - 1);
        }
        for (int k = i; k < j; ++k) add(dfn[id[k]], 1);
        i = j;
    }
    for (int i = 1; i <= n; ++i) printf("%d\n", ans[i]);
    return 0;
}
```

**复杂度**：O(n log n)

### 例 2  P3379 【模板】最近公共祖先（LCA）

**题意**：n 个点的树，q 次询问 LCA，`n, q <= 5 * 10^5`。

**思路**：欧拉序 + ST 表，预处理 O(n log n)，单次 O(1)。输入量大，用 `scanf`。

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 500005;
int n, q, root;
vector<int> g[N];
int euler[2 * N], tot, first[N], dep[N];
int lg[2 * N], st[21][2 * N];

void edfs(int u, int fa) {
    first[u] = ++tot; euler[tot] = u;
    for (int i = 0; i < (int)g[u].size(); ++i) {
        int v = g[u][i];
        if (v == fa) continue;
        dep[v] = dep[u] + 1;
        edfs(v, u);
        euler[++tot] = u;
    }
}
void buildST(int m) {
    lg[1] = 0;
    for (int i = 2; i <= m; ++i) lg[i] = lg[i / 2] + 1;
    for (int i = 1; i <= m; ++i) st[0][i] = euler[i];
    for (int k = 1; (1 << k) <= m; ++k)
        for (int i = 1; i + (1 << k) - 1 <= m; ++i) {
            int a = st[k - 1][i], b = st[k - 1][i + (1 << (k - 1))];
            st[k][i] = (dep[a] < dep[b]) ? a : b;
        }
}
int rmq(int l, int r) {
    int k = lg[r - l + 1];
    int a = st[k][l], b = st[k][r - (1 << k) + 1];
    return (dep[a] < dep[b]) ? a : b;
}
int lca(int u, int v) {
    if (first[u] > first[v]) swap(u, v);
    return rmq(first[u], first[v]);
}
int main() {
    scanf("%d%d%d", &n, &q, &root);
    for (int i = 1; i < n; ++i) {
        int u, v; scanf("%d%d", &u, &v);
        g[u].push_back(v); g[v].push_back(u);
    }
    edfs(root, 0);
    buildST(tot);
    while (q--) {
        int u, v; scanf("%d%d", &u, &v);
        printf("%d\n", lca(u, v));
    }
    return 0;
}
```

**注意**：`st[21][2*N]` 占 84 MB，内存吃紧时改用第 76 章的倍增。

---

## ⚠️ 常见错误

1. **`out[u]` 写成 `dfn[u]`**：区间长度永远为 1。必须在递归完所有儿子后取 `timer`。
2. **`dfn` 从 0 开始**：BIT 的 `x & -x` 在 0 处死循环，所有下标从 1 开始。
3. **欧拉序只开 `N`**：长度是 `2n-1`，必须开 `2*N`。
4. **RMQ 比较点编号**：存的是点，比较的键必须是 `dep`。
5. **多测不清 `timer`**：第二组的 `dfn` 会从上一组最大值继续加，全部错位。
6. **`out[u] + 1` 越界**：当 `out[u] = n` 时要访问 `n + 1`，BIT 上界要留一位。

---

## 🧠 本章小结

```
dfn[u] = ++timer;  递归儿子;  out[u] = timer;
子树 u = [dfn[u], out[u]]，长度 = out[u] - dfn[u] + 1 = sz[u]

欧拉序：进入记一次，每个儿子返回再记一次，长度 2n-1
LCA(u,v) = euler[first[u]..first[v]] 中 dep 最小的点

单点加 + 子树和：普通 BIT
子树加 + 单点查：差分 BIT
子树加 + 子树和：两个 BIT 或线段树懒标记

所有下标从 1 开始；欧拉序开 2N；RMQ 比深度
```

记住：**dfs 序管子树，欧拉序管 LCA**。

---

## ✅ 自查清单

- [ ] 你能手算一棵树的 `dfn/out`，并写出任意子树的区间
- [ ] 你知道 `out[u]` 的含义，不会把它写成 `dfn[u]`
- [ ] 你能写出欧拉序，并说清长度为什么是 `2n-1`
- [ ] 你会用 ST 表在欧拉序上求 LCA，且知道比较的是深度
- [ ] 你能把"子树加、子树和、单点查"翻译成区间操作
- [ ] 你知道 `dfn` 和树状数组下标都要从 1 开始
- [ ] 你能说出多测时需要清空哪些数组

---

## 📝 配套练习

> 共2题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P3605 | https://hydro.ac/d/atto/p/luogu-P3605 | 知识点：[USACO17JAN] Promotion Count |
| ★ 核心 | luogu-P2982 | https://hydro.ac/d/atto/p/luogu-P2982 | 知识点：本章练习 |

