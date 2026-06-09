# 第 52 章  万能容器——STL vector 入门

---

> 🏗️ **前情回顾**：学完了二维数组，你能用 `a[100][100]` 这样的固定大小表格处理矩阵问题。但现实中有一种场景让你头疼：你不知道用户会输入多少个数据——可能是 3 个，也可能是 300 个。如果一律声明 `a[1000000]`，内存浪费巨大；如果声明 `a[100]`，又可能不够用。这章的主角——`vector`——完美解决了"大小不固定"的问题。

## 🎯 本章目标

学完这一章，你能：

- 说出 `vector` 和普通数组的区别（动态大小 vs 固定大小）
- 用 `vector<int>` 声明一个动态数组
- 用 `push_back` 追加元素、`size()` 获取大小
- 用下标访问和范围 for 遍历 vector
- 用 `pop_back` 删除末尾元素、`clear` 清空容器
- 用 `sort` 对 vector 排序

---

## 📖 故事引入

双十一到了，小红在网上买了一堆东西。她把购物车打开，开始往里面扔东西——先是一本书，然后一盒笔，再加一包零食，最后又加了一双袜子……

购物车的特点是什么？**你加一个，它就多一个位置；你删一个，它就少一个位置。没有人事先告诉你"你的购物车最多装 10 件"**——它可以一直伸缩。

但到目前为止，你学的数组是这样的：

```cpp
int arr[100];  // 不管用不用，先占 100 个位置
```

小红想：如果数组能像购物车一样自动伸缩该多好？

C++ 的 `vector` 就是这个"魔法购物车"——它是一个**动态数组**，大小可以在运行时随时改变。你往里加东西，它自动变大；你往外拿东西，它可以变小。

---

## 🧱 知识讲解

### 52.1  vector vs 普通数组

| 对比维度 | 普通数组 | vector |
|----------|----------|--------|
| 大小 | 编译时确定，不可变 | 运行时确定，可变 |
| 声明 | `int a[100];` | `vector<int> v;` |
| 追加元素 | ❌ 不行，大小固定 | ✅ `v.push_back(x)` |
| 获取大小 | 需要自己记住变量 | `v.size()` 直接获取 |
| 越界检查 | ❌ 不检查，危险 | ✅ `v.at(i)` 会检查 |
| 内存 | 在栈上（有大小限制） | 在堆上（可以很大） |

一句话总结：**不确定数据量用 vector，确定数据量且不超百万用数组，都行就选你习惯的。**

### 52.2  声明 vector

`vector` 是 C++ 标准模板库（STL）提供的模板类，使用前需要：

```cpp
#include <vector>        // 必须包含的头文件
using namespace std;     // 或者用 std::vector
```

声明方式：

```cpp
vector<int> v;                // 空的 vector，存 int
vector<double> scores;        // 空的 vector，存 double
vector<string> names;         // 空的 vector，存 string

vector<int> v2(10);           // 10 个元素，全部默认初始化为 0
vector<int> v3(5, 42);        // 5 个元素，每个都是 42
vector<int> v4 = {1, 2, 3};   // 初始化为 {1, 2, 3}
```

注意 `vector<int>` 的语法：尖括号里是元素类型。`vector<int>` 读作"装着 int 的 vector"。

### 52.3  push_back：往里面加东西

这是 vector 最常用的操作——往末尾追加元素：

```cpp
vector<int> v;          // 空的，size = 0

v.push_back(10);        // v 现在是 {10}，size = 1
v.push_back(20);        // v 现在是 {10, 20}，size = 2
v.push_back(30);        // v 现在是 {10, 20, 30}，size = 3

cout << v.size() << endl;  // 输出 3
```

`push_back` 就像往购物车里扔东西——不用管购物车有多大，扔进去就自动有地方。

常见的使用模式——读取不确定数量的输入：

```cpp
vector<int> v;
int x;
while (cin >> x) {     // 一直读到输入结束
    v.push_back(x);
}
cout << "共读入了 " << v.size() << " 个数" << endl;
```

> 💡 在竞赛中，可以用 `while (cin >> x)` 读到文件末尾自动停止。本地测试时按 Ctrl+Z（Windows）或 Ctrl+D（Linux/Mac）结束输入。

### 52.4  遍历 vector：两种方式

**方式一：下标访问（和普通数组一模一样）**

```cpp
vector<int> v = {10, 20, 30, 40, 50};

for (int i = 0; i < v.size(); i++) {
    cout << v[i] << " ";   // v[i] 和数组用法完全一样
}
```

**方式二：范围 for（C++11，更简洁）**

```cpp
for (int x : v) {
    cout << x << " ";      // x 依次是 10, 20, 30, 40, 50
}
```

范围 for 的意思是："对于 v 里的每一个元素 x，执行循环体"。不需要下标、不需要 `v.size()`，非常清爽。

如果要修改元素，用引用 `&`：

```cpp
for (int& x : v) {
    x *= 2;    // 每个元素翻倍——因为 x 是引用，直接修改原数据
}
```

### 52.5  pop_back 和 clear

```cpp
vector<int> v = {10, 20, 30};

v.pop_back();     // 删除最后一个元素，v 变成 {10, 20}
v.pop_back();     // v 变成 {10}

v.clear();        // 清空所有元素，v 变成 {}，size = 0
```

`pop_back` 没有返回值——它只是把最后一个元素扔掉。如果想知道扔了什么，先取出来：

```cpp
int last = v.back();  // 获取最后一个元素的值
v.pop_back();         // 再扔掉
```

### 52.6  sort：给 vector 排序

`sort` 来自 `<algorithm>` 头文件，可以对 vector（和数组）排序：

```cpp
#include <algorithm>  // sort 需要这个头文件
#include <vector>
using namespace std;

vector<int> v = {5, 2, 8, 1, 9};

sort(v.begin(), v.end());  // 从小到大排序
// v 现在是 {1, 2, 5, 8, 9}

// 从大到小排序
sort(v.begin(), v.end(), greater<int>());
// v 现在是 {9, 8, 5, 2, 1}
```

`v.begin()` 和 `v.end()` 是两个"迭代器"——你可以先理解为"指向第一个元素的指针"和"指向最后一个元素之后位置的指针"。现阶段记住这个写法即可。

对普通数组排序也一样：

```cpp
int a[5] = {5, 2, 8, 1, 9};
sort(a, a + 5);  // 数组名是指向首元素的指针，a+5 是尾后指针
```

### 52.7  其他常用操作速查

```cpp
vector<int> v = {10, 20, 30};

v.front()       // 第一个元素 → 10
v.back()        // 最后一个元素 → 30
v.empty()       // 判断是否为空 → false（v 有 3 个元素）
v[1] = 99;      // 修改第二个元素 → v 变成 {10, 99, 30}
```

对比数组和 vector 的常见操作：

| 操作 | 普通数组 | vector |
|------|----------|--------|
| 读第 i 个元素 | `a[i]` | `v[i]` 或 `v.at(i)` |
| 获取元素个数 | 需要自己记 | `v.size()` |
| 追加元素 | ❌ | `v.push_back(x)` |
| 删除末尾 | ❌ | `v.pop_back()` |
| 清空 | ❌ | `v.clear()` |
| 排序 | `sort(a, a+n)` | `sort(v.begin(), v.end())` |

---

## ✋ 动手试试

**试试 1**：创建一个空的 `vector<int>`，用循环依次 `push_back` 1 到 10，然后用两种方式（下标和范围 for）分别输出。

**试试 2**：写程序让用户不断输入整数（以 0 结束），把所有输入存进 vector。输入结束后，输出元素个数、第一个元素、最后一个元素，然后排序输出。

**试试 3**：创建一个 `vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6}`，用 `pop_back` 依次弹出并输出每个被弹出的元素（注意先用 `back()` 取值），直到 vector 为空。

**试试 4**：对比实验——创建一个固定大小的普通数组 `int a[100]` 和一个 `vector<int> v`，分别存入 0~99。用 `sizeof` 和 `v.size()` 看看它们各自报告的大小。注意：vector 对象本身的 `sizeof` 和它内部数据的大小是两回事。

---

## ⚠️ 容易犯的错

### 错 1：忘记 `#include <vector>`

❌ 用了 `vector<int> v;` 但没写 `#include <vector>` → 编译错误

✅ 文件开头加上 `#include <vector>`

### 错 2：对空 vector 使用 `[]` 或 `front()`/`back()`

❌ `vector<int> v; cout << v[0];` // v 是空的，访问越界！行为未定义

✅ 先判断 `if (!v.empty())` 再访问，或者先 `push_back` 再访问。

### 错 3：把 vector 的大小当成和数组一样在声明时就定好

❌ `vector<int> v(10); v[15] = 5;` // 虽然声明时预留了 10 个，但下标 15 还是越界

✅ 下标访问时范围是 `0 ~ v.size()-1`。想加新元素用 `push_back`。

### 错 4：sort 忘了 `#include <algorithm>`

❌ 用了 `sort(v.begin(), v.end());` 但没 `#include <algorithm>`

✅ 加上 `#include <algorithm>`

---

## 📝 练习

### 基础题

**1. 填空题**

（1）`vector<int> v;` 声明了一个存 \_\_\_\_ 类型的动态数组。

（2）向 vector 末尾添加元素用 `v.`\_\_\_\_`(x)`，获取元素个数用 `v.`\_\_\_\_`()`。

（3）删除最后一个元素用 `v.`\_\_\_\_`()`，清空用 `v.`\_\_\_\_`()`。

（4）对 vector 排序用 `sort(v.`\_\_\_\_`(), v.`\_\_\_\_`())`。

**2. 读代码写结果**

```cpp
vector<int> v = {5, 3, 8, 1};
v.push_back(2);
v.pop_back();
sort(v.begin(), v.end());
for (int x : v) cout << x << " ";
```

输出是什么？

### 提高题

**3. 编程题 — 去重**

输入 N 个整数（N 不确定，读到 EOF 为止），去重后按从小到大的顺序输出。

（提示：先 `push_back` 全部读入，再 `sort`，然后遍历：如果当前元素和上一个不同，就输出。）

**4. 编程题 — 动态平均分**

让用户不断输入分数（0~100），以 -1 结束。将所有有效分数存入 vector，计算并输出：总人数、平均分（保留 2 位小数）、最高分、最低分。

### 挑战题

**5. 编程题 — 荷兰国旗问题**

给定一个只包含 0、1、2 的 vector（如 `{2, 0, 1, 2, 0, 1, 0}`），要求原地排序使所有 0 在最前面、1 在中间、2 在最后面。不能使用 `sort`——需要自己想出 O(n) 的算法。

（提示：用三个指针 low、mid、high。这其实是经典的"三路快排"原型。想想如何通过交换把 0 赶到前面、2 赶到后面。）

**6. 编程题 — 区间合并**

输入 N 个区间 `[L, R]`（用两个 vector 分别存 L 和 R），将重叠的区间合并后输出所有不重叠的区间。

示例：

```
输入区间：[1,3], [2,6], [8,10], [15,18]
合并后：  [1,6], [8,10], [15,18]
```

---

## 🧠 本章小结

```
vector<int> v;          声明（空的）
v.push_back(x);         末尾追加
v.pop_back();           末尾删除
v.size();               元素个数
v.clear();              清空
v[i];                   下标访问（和数组一样）
for (int x : v)         范围 for 遍历
sort(v.begin(), v.end()) 排序（需 #include <algorithm>）

vector 的核心优势：大小动态可变
```



---

## 📝 配套练习

> 共6题。vector从基本操作→二维→排序，和M3数组知识无缝对接。。★核心（课堂必做） ◆拓展（课后练习）

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P3156 | https://hydro.ac/p/luogu-P3156 | vector、push_back、下标 |
| ◆ 拓展 | luogu-P1428 | https://hydro.ac/p/luogu-P1428 | vector、嵌套循环（数组改vector） |
| ◆ 拓展 | luogu-P5727 | https://hydro.ac/p/luogu-P5727 | vector、push_back、reverse |
| ◆ 拓展 | luogu-P5731 | https://hydro.ac/p/luogu-P5731 | vector、二维vector、蛇形 |
| ◆ 拓展 | luogu-P5732 | https://hydro.ac/p/luogu-P5732 | vector、二维递推、杨辉三角 |
| ◆ 拓展 | luogu-P1781 | https://hydro.ac/p/luogu-P1781 | vector\<string\>、排序 |

> 💡 **练习建议**：先完成 1 道★核心题，确保掌握本章基本方法；再完成 5 道◆拓展题，覆盖不同变式和细节。




---

## 配套练习

> 共6题。vector从基本操作→二维→排序，和M3数组知识无缝对接。★核心（课堂必做） · ◆拓展（课后练习）

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P3156 | https://hydro.ac/p/luogu-P3156 | vector、push_back、下标 |
| ◆ 拓展 | luogu-P1428 | https://hydro.ac/p/luogu-P1428 | vector、嵌套循环（数组改vector） |
| ◆ 拓展 | luogu-P5727 | https://hydro.ac/p/luogu-P5727 | vector、push_back、reverse |
| ◆ 拓展 | luogu-P5731 | https://hydro.ac/p/luogu-P5731 | vector、二维vector、蛇形 |
| ◆ 拓展 | luogu-P5732 | https://hydro.ac/p/luogu-P5732 | vector、二维递推、杨辉三角 |
| ◆ 拓展 | luogu-P1781 | https://hydro.ac/p/luogu-P1781 | vector\<string\>、排序 |

> **练习建议**：先在课堂完成 1 道★核心题，掌握本章基本方法；课后完成 5 道◆拓展题，覆盖不同变式和细节。


**自查清单**：

- [ ] 我会声明 `vector<int>` 并往里 `push_back` 数据
- [ ] 我会用 `v.size()` 获取元素个数
- [ ] 我会用下标和范围 for 两种方式遍历 vector
- [ ] 我会用 `pop_back` 和 `clear` 管理元素
- [ ] 我会用 `sort` 对 vector 排序
- [ ] 我知道 vector 和普通数组的区别
- [ ] 我知道 vector 需要 `#include <vector>`、sort 需要 `#include <algorithm>`

---

## 🚀 下章预告

vector 解决了"大小不定"的问题，但它只支持在末尾增减——想在开头插入？对不起，很慢。有些场景天然需要"后进先出"（如撤销操作）或"先进先出"（如排队）。下一章，STL 工具箱再添两员大将：**stack**（栈）和 **queue**（队列）。
