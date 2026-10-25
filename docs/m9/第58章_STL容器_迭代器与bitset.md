# 第 58 章  STL 容器、迭代器与 bitset

---

> 🏗️ **前情回顾**：上册你用过 `vector`、`sort`、`stack`、`queue`，它们都属于 C++ 标准模板库（STL）。这一章把 STL 的常用容器系统过一遍——它们是你写提高级代码的"工具箱"。

## 🎯 本章目标

- 掌握 vector / set / map / deque / priority_queue 的适用场景
- 理解迭代器与范围 for
- 会用 bitset 做位运算和状态压缩
- 知道什么时候用 unordered_map、什么时候用 map

## 🧱 知识讲解

### 58.1  容器总览

| 容器 | 结构 | 特点 | 常见用途 |
|---|---|---|---|
| `vector` | 动态数组 | 随机访问 O(1)，尾部插入快 | 存图、存序列 |
| `deque` | 双端队列 | 两头插入删除 O(1) | 0-1 BFS、滑动窗口 |
| `stack` | 栈 | 后进先出 | 括号、表达式 |
| `queue` | 队列 | 先进先出 | BFS |
| `priority_queue` | 堆 | 取最值 O(log n) | Dijkstra、Top-K |
| `set/multiset` | 有序集合 | 自动排序、去重（multiset 不去重） | 维护有序集合 |
| `map/multimap` | 有序映射 | 键值对，按键排序 | 计数、映射 |
| `unordered_map` | 哈希表 | 平均 O(1)，无序 | 快速查找 |
| `bitset` | 定长位集 | 位运算、空间小 | 状压、集合表示 |

### 58.2  迭代器与范围 for

```cpp
vector<int> a = {3, 1, 4};
for (auto it = a.begin(); it != a.end(); ++it)
    cout << *it << ' ';

for (int x : a) cout << x << ' ';   // 范围 for
```

- `begin()` 指向第一个元素，`end()` 指向最后一个元素的**下一个位置**
- `set/map` 的迭代器不支持随机访问，只能 `++/--`
- `lower_bound(s.begin(), s.end(), x)` 返回第一个 `>= x` 的位置

### 58.3  set 与 map

```cpp
set<int> s;
s.insert(3); s.insert(1); s.insert(3);   // {1,3}
s.erase(1);
if (s.count(3)) cout << "有 3";

map<string, int> cnt;
cnt["apple"]++;            // 不存在时自动插入 0
for (auto &p : cnt) cout << p.first << ' ' << p.second;
```

> ⚠️ `map` 的 `[]` 会插入默认值；只想查询用 `find` 或 `count`。

### 58.4  bitset

```cpp
bitset<100> b;
b[3] = 1; b.set(5); b.reset(3);
cout << b.count();          // 1 的个数
cout << b.any() << b.none();
```

`bitset` 适合：01 背包的可行性、集合交并、状态压缩。它比 `bool` 数组省空间，位运算一次处理 64 位。

## 💻 例题

**例 1**：输入 n 个数，去重后升序输出。

```cpp
set<int> s;
for (int i = 0, x; i < n; i++) { cin >> x; s.insert(x); }
for (int x : s) cout << x << ' ';
```

**例 2**：寄包柜——q 次操作，`1 i j k` 表示第 i 个柜子第 j 格放 k，`2 i j` 查询。

用 `map<pair<int,int>, int>` 或 `vector<map<int,int>>`，只存有东西的格子。

## ⚠️ 常见坑

1. `set` 的 `erase(it)` 会让迭代器失效；循环里用 `it = s.erase(it)`
2. `priority_queue` 默认大根堆，小根堆写 `greater<int>`
3. `unordered_map` 可能被卡哈希，竞赛里键是整数时用 `map` 或手写哈希
4. `bitset` 的长度必须是编译期常量

## 📝 练习

- 基础：用 `set` 完成去重排序；用 `map` 统计单词出现次数
- 提高：用 `priority_queue` 合并 k 个有序数组
- 挑战：用 `bitset` 优化 01 背包的可行性

## 📝 配套练习

> 📋 **本模块题单**：[M9 数据结构与 STL（下册）](https://hydro.ac/d/atto/training/6ade003484bee48834b2f46e)

> 共2题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P1059 | https://hydro.ac/d/atto/p/luogu-P1059 | 来自下册题单 |
| ★ 核心 | luogu-P3613 | https://hydro.ac/d/atto/p/luogu-P3613 | 来自下册题单 |

