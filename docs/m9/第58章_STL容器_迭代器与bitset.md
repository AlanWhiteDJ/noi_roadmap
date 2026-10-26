# 第 58 章  STL 容器、迭代器与 bitset

---

> 🏗️ **前情回顾**：你已经用 `vector` 存过序列，用 `sort` 排过序，用 `stack`、`queue` 模拟过过程和 BFS。它们都来自 C++ 标准模板库（STL）。这一章把常用容器排成一张地图——拿到题目时，先想清楚"数据该怎么存"，再动手写代码。

## 🎯 本章目标

学完这一章，你能：

- 分清序列容器、关联容器和容器适配器，按需求选容器
- 熟练使用 `vector`、`deque`、`set`、`map`、`unordered_map`
- 理解迭代器与范围 for，写出不依赖下标的遍历代码
- 会用 `pair`、`tuple` 和 STL 常用算法函数
- 用 `bitset` 做位运算、集合表示和可行性 DP
- 会用 `class` 与运算符重载封装高精度、矩阵等结构

---

## 📖 故事引入

学校要办运动会，体育委员小周接到三张表：

1. **报名顺序表**：谁先报名谁排在前面，方便点名；
2. **学号名单**：同一个学号重复报名只算一次，还要按学号从小到大打印；
3. **项目统计表**：给定一个学号，立刻回答"他报了几个项目"。

用数组硬做，第二张表要自己写排序和去重，第三张表每次都要从头扫。小周写了两百行，改一个需求就崩一次。

其实这三张表正好对应三种容器：`vector` 管顺序，`set` 管有序去重，`map` 管键值查询。选对容器，每张表都只需要几行代码。**数据结构的选择，往往比算法本身更早决定程序的命运。**

---

## 🧱 知识讲解

### 58.1  三类容器，一张地图

| 类别 | 代表 | 组织方式 | 特点 |
|---|---|---|---|
| 序列容器 | `vector`、`deque`、`list` | 按插入位置排列 | 关心"第几个" |
| 有序关联容器 | `set`、`multiset`、`map`、`multimap` | 红黑树 | 自动按 key 排序，查找 O(log n) |
| 无序关联容器 | `unordered_set`、`unordered_map` | 哈希表 | 平均 O(1)，无序，可能被卡 |
| 容器适配器 | `stack`、`queue`、`priority_queue` | 包住另一种容器 | 只暴露特定接口 |

### 58.2  vector：默认选择

`vector` 是动态数组，能自动扩容，随机访问 O(1)。

```cpp
vector<int> a;              // 空
vector<int> b(5, 0);        // 5 个 0
vector<int> c = {3, 1, 4};  // 列表初始化

a.push_back(10);            // 尾部插入
a.pop_back();               // 尾部删除
a.size();  a.empty();       // 元素个数 / 是否为空
a.clear(); a.resize(8);     // 清空 / 调整大小（多出的补 0）
a.reserve(1000);            // 预分配，避免反复扩容
```

二维数组也很自然：

```cpp
vector<vector<int>> g(n + 1);                        // 邻接表
vector<vector<int>> f(n + 1, vector<int>(m + 1, 0)); // 矩阵
```

> ⚠️ `push_back` 触发扩容时，指向旧内存的迭代器、指针、引用全部失效。不要在范围 for 里 `push_back`。

`deque` 两头插入删除都是 O(1)，也支持下标：

```cpp
deque<int> q;
q.push_back(1); q.push_front(2);
q.pop_back();   q.pop_front();
cout << q[0];
```

它适合滑动窗口、0-1 BFS。`list` 是双向链表，任意位置插入删除 O(1)，但不支持下标，竞赛里少用。

### 58.3  set 与 map：让数据自己排队

`set` 是有序集合，自动去重、自动升序：

```cpp
set<int> s;
s.insert(3); s.insert(1); s.insert(3);  // 重复插入失败
cout << s.size();                       // 2
s.erase(1);
if (s.count(3)) cout << "存在";
```

`s.find(x)` 返回迭代器，找不到返回 `s.end()`。`multiset` 允许重复，`erase(x)` 会删光所有 x；只删一个要写 `s.erase(s.find(x))`。

`map` 是键值对，按键升序：

```cpp
map<string, int> cnt;
cnt["apple"]++;             // 不存在时先插入 0，再加 1
for (auto &p : cnt)
    cout << p.first << ' ' << p.second << '\n';
```

`p.first` 是键，`p.second` 是值。`map` 的 `[]` 有副作用：查询不存在的键会把它插进去。只想查询时用 `find`：

```cpp
auto it = cnt.find("apple");
if (it != cnt.end()) cout << it->second;
```

`unordered_map` 用哈希表实现，平均 O(1)，但不保证顺序，可能被特殊数据卡到 O(n)。键是整数且数据不强时它很划算；正式比赛担心被卡，就换 `map` 或手写哈希。

### 58.4  迭代器与范围 for

迭代器是"容器里的指针"，`*it` 取值，`++it` 前进：

```cpp
vector<int> a = {10, 20, 30};
for (vector<int>::iterator it = a.begin(); it != a.end(); ++it)
    cout << *it << ' ';
```

`begin()` 指向第一个元素，`end()` 指向最后一个元素的**下一个位置**，所以条件是 `it != a.end()`。

范围 for 更常用：

```cpp
for (int x : a) cout << x << ' ';        // 拷贝，改 x 不影响容器
for (int &x : a) x *= 2;                 // 引用，能修改
for (const auto &x : a) cout << x;       // 只读，避免拷贝
```

`set/map` 的迭代器只能 `++/--`，不能 `+k`。找第一个大于等于 x 的位置：

```cpp
auto it = s.lower_bound(x);   // 第一个 >= x
auto jt = s.upper_bound(x);   // 第一个 > x
```

在 `set` 里边遍历边删除，要接住返回值：

```cpp
for (auto it = s.begin(); it != s.end(); ) {
    if (*it % 2 == 0) it = s.erase(it);
    else ++it;
}
```

### 58.5  bitset：把 01 状态压进一个字

`bitset<N>` 是长度固定的位集，N 必须是编译期常量。100 万个状态只占 125 KB。

```cpp
bitset<8> b;              // 00000000
b[0] = 1;                 // 00000001
b.set(3);                 // 00001001
b.set();  b.reset(3);     // 全置 1 / 清掉第 3 位
b.flip(0);                // 第 0 位取反

cout << b.count();        // 7（此时 b = 11110110）
cout << b.any() << b.none() << b.all();
cout << b.test(3);        // 0
cout << b.to_string();    // "11110110"
```

它支持整组位运算：`x & y`、`x | y`、`x ^ y`、`x << 2`，一次处理一整排 bit。

最漂亮的应用是**可行性 DP**：

```cpp
bitset<100005> f;
f[0] = 1;
for (int i = 1; i <= n; i++) {
    int w; cin >> w;
    f |= (f << w);        // 选或不选，一次移位完成
}
```

`f << w` 表示"每个已凑出的重量都加上 w"，再与原集合取并，正好对应 0/1 背包。它也能做集合交并和状压表示。

### 58.6  pair、tuple 与常用算法

`pair` 把两个值绑在一起，天生支持比较（先 first，后 second）：

```cpp
pair<int, int> p = {3, 5};
vector<pair<int, int>> v;
v.push_back({1, 2});
sort(v.begin(), v.end());
```

`tuple` 可以装三个及以上，用 `get<k>(t)` 取第 k 项，用 `tie` 解包：

```cpp
tuple<int, int, string> t = make_tuple(1, 2, "abc");
int a, b; string s;
tie(a, b, s) = t;
```

STL 算法都接收左闭右开区间 `[begin, end)`：

```cpp
sort(a.begin(), a.end());                      // 升序
sort(a.begin(), a.end(), greater<int>());      // 降序
a.erase(unique(a.begin(), a.end()), a.end());  // 去重（要求已排序）
reverse(a.begin(), a.end());
int s = accumulate(a.begin(), a.end(), 0);     // 求和
int mx = *max_element(a.begin(), a.end());
int pos = lower_bound(a.begin(), a.end(), x) - a.begin();
```

> ⚠️ `unique` 只把重复元素移到后面，并不会真正删除；必须配合 `erase`，而且调用前必须排序。

### 58.7  类与运算符重载

把"一组数据 + 一组操作"打包成类：

```cpp
class Point {
public:
    int x, y;
    Point(int x = 0, int y = 0) : x(x), y(y) {}
    Point operator+(const Point &o) const {
        return Point(x + o.x, y + o.y);
    }
    bool operator<(const Point &o) const {
        if (x != o.x) return x < o.x;
        return y < o.y;
    }
};
```

- `public` 外部可访问，`private` 只能内部用；
- 构造函数负责初始化，`: x(x), y(y)` 是初始化列表；
- 末尾 `const` 表示不修改对象，`sort` 和 `set` 都要求比较运算符能处理 const 对象。

竞赛里最需要写类的地方：**高精度整数、矩阵、分数、几何向量**。

---

## 💻 例题

### 例 1  明明的随机数（P1059）

**题意**：输入 n 个 1 到 1000 的整数，去重后从小到大输出。

**思路一**：排序 + `unique`：

```cpp
sort(a.begin(), a.end());
a.erase(unique(a.begin(), a.end()), a.end());
cout << a.size() << '\n';
for (int x : a) cout << x << ' ';
```

**思路二**：`set` 自动去重排序：

```cpp
set<int> s;
for (int i = 0, x; i < n; i++) { cin >> x; s.insert(x); }
cout << s.size() << '\n';
for (int x : s) cout << x << ' ';
```

**解析**：两版都是 O(n log n)。`set` 适合边读边维护；`vector` 常数小，只排一次时通常更快。

### 例 2  寄包柜（P3613）

**题意**：n 个柜子，q 次操作：`1 i j k` 把第 i 个柜子第 j 格放入 k；`2 i j` 查询该格，没有输出 0。

**思路**：柜子和格子都多，真正用到的位置少，用 `map<pair<int,int>, int>` 只记有东西的格子：

```cpp
map<pair<int, int>, int> box;
while (q--) {
    int op, i, j; cin >> op >> i >> j;
    if (op == 1) {
        int k; cin >> k;
        box[{i, j}] = k;
    } else {
        auto it = box.find({i, j});
        cout << (it == box.end() ? 0 : it->second) << '\n';
    }
}
```

**解析**：状态数不超过 q，空间 O(q)，每次 O(log q)。开 `n × m` 数组会爆空间——**稀疏数据用映射，稠密数据用数组**。

### 例 3  可行性背包

**题意**：给 n 个正整数重量，问能凑出多少种不同的正重量。

**思路**：`f[i]` 表示重量 i 能否凑出，用 `bitset` 把内层循环压成一次移位：

```cpp
bitset<100005> f;
f[0] = 1;
int sum = 0;
for (int i = 0; i < n; i++) {
    int w; cin >> w;
    f |= (f << w);
    sum += w;
}
int ans = 0;
for (int i = 1; i <= sum; i++) ans += f[i];
cout << ans;
```

**解析**：一次 `<<` 和 `|` 处理 64 位，复杂度 O(n·sum/64)。`bitset` 长度要大于最大重量，否则高位被截断。

---

## ⚠️ 常见错误

1. **在范围 for 里修改容器大小**：`for (int x : v) v.push_back(x);` 会让迭代器失效，甚至死循环。扩容时用下标循环，并提前记录原长度。
2. **以为 `multiset.erase(x)` 只删一个**：它会把所有 x 删光。只删一个用 `s.erase(s.find(x))`。
3. **用 `map[]` 查询**：不存在的键会被插入，`size()` 变大、遍历多出 0。查询请用 `find` 或 `count`。
4. **范围 for 用值拷贝修改**：`for (int x : v) x++;` 改的是副本，必须写 `int &x`。
5. **`lower_bound` 用在无序区间**：它要求升序，否则结果没有意义。
6. **`bitset` 长度写成变量**：`bitset<n>` 编译不过，n 必须是常量表达式。
7. **迷信 `unordered_map`**：同余键太多会退化成链，复杂度敏感时优先 `map`。

---

## 🧠 本章小结

```
序列容器：vector（默认）  deque（两头动）  list（少用）
关联容器：set/multiset（有序去重）  map/multimap（有序键值）
无序容器：unordered_map（平均 O(1)，可能被卡）
适配器：  stack / queue / priority_queue

迭代器：begin() 到 end() 前一个位置，++ 前进，* 取值
范围 for：for (int &x : v) 才能改

bitset<N>：N 为常量；count/any/none/set/reset/flip
           f |= (f << w) 是可行性背包的利器

算法：sort / unique / reverse / lower_bound / accumulate
      unique 前必须排序，且要配合 erase
```

**自查清单**：

- [ ] 我能说出 vector、deque、set、map 各自适合什么场景
- [ ] 我知道 `map[]` 会插入默认值，查询要用 `find`
- [ ] 我会用迭代器遍历，并能在遍历中安全删除
- [ ] 我理解 `begin/end` 的左闭右开区间
- [ ] 我会用 `bitset` 写可行性背包
- [ ] 我知道 `unique` 必须配合排序和 `erase`
- [ ] 我能写出带构造函数和运算符重载的简单类

---

## 📝 配套练习

> 📋 **本模块题单**：[M9 数据结构与 STL（后续）](https://hydro.ac/d/atto/training/6ade003484bee48834b2f46e)

> 共2题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P1059 | https://hydro.ac/d/atto/p/luogu-P1059 | 来自题单 |
| ★ 核心 | luogu-P3613 | https://hydro.ac/d/atto/p/luogu-P3613 | 来自题单 |

