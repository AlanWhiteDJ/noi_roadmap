# 第 40 章  高级排序——STL sort 与自定义排序

---

> 🏗️ **前情回顾**：上一章你手写了冒泡、选择和插入三种 O(n²) 排序。虽然代码不难，但每次排序都要写十几行，而且只能处理小数据。从现在开始，我们要用 C++ 的标准武器——`sort()` 函数。它藏在 `<algorithm>` 头文件里，O(n log n)，一行调用搞定。在竞赛中，除非题目明确要求手写，`sort()` 就是你的默认选择。

---

## 🎯 本章目标

学完这一章，你能：

- 熟练使用 `sort()` 函数进行升序和降序排序
- 使用 `greater<int>()` 实现降序
- 编写自定义比较函数 `cmp()`，实现复杂的排序规则
- 对结构体数组进行多关键字排序
- 了解 `stable_sort()` 和它的用途
- 理解 `sort()` 背后的快速排序思想（原理层面）
- 识别排序题中的常见模式

---

## 📖 故事引入

小林参加 CSP-J 模拟赛，碰到一道题："给 n 个人的姓名和成绩，按成绩从高到低排，成绩相同时按姓名字典序升序排。"

小林心想：这简单！我写冒泡排序，比较时加上判断……于是一个双重循环的冒泡写了出来。结果呢？n = 100000，程序跑了 15 秒，超时。

老师走过来看了一眼，把 20 行代码删掉，换成了：

```cpp
sort(a, a + n, cmp);
```

提交，0.1 秒通过。

小林震惊了。老师说："你以为竞赛是在考你写排序吗？不，竞赛考的**是你用排序解决问题的能力**。`sort()` 才是你的工具，把精力花在写比较规则上，而不是排序本身。"

---

## 🧱 知识讲解

### 40.1  sort 函数基础

`sort()` 定义在 `<algorithm>` 头文件中，用法：

```cpp
#include <algorithm>
using namespace std;

sort(起始地址, 结束地址);       // 默认升序
sort(起始地址, 结束地址, 比较规则); // 自定义规则
```

**基本示例**：

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int a[] = {3, 1, 4, 1, 5, 9, 2, 6};
    int n = 8;

    sort(a, a + n);            // 升序排序
    // a = {1, 1, 2, 3, 4, 5, 6, 9}

    for (int i = 0; i < n; i++)
        cout << a[i] << " ";
    return 0;
}
```

> 📝 **注意**：`a` 是数组首地址，`a + n` 是**尾后**地址（最后一个元素之后的位置）。这是 STL 的统一约定：左闭右开 `[a, a+n)`。

### 40.2  降序：greater\<int\>()

想要从大到小排？用 `greater<int>()`：

```cpp
sort(a, a + n, greater<int>());
// a = {9, 6, 5, 4, 3, 2, 1, 1}
```

`greater<int>()` 是一个 STL 内置的函数对象，含义是"a > b 才算正确"。类似地，`less<int>()` 就是默认的升序（a < b）。

对 `double` 类型：`greater<double>()`；对 `string` 类型：`greater<string>()`。

### 40.3  自定义比较函数 cmp

最强大的用法——自己写比较规则！比较函数接收两个元素，返回 `true` 表示它们"顺序正确"。

**定义方式**：

```cpp
bool cmp(const Type &a, const Type &b) {
    return /* 你希望的顺序规则 */;
}
```

> 💡 **记忆口诀**：`return a 应该排在 b 前面;`

**实例 1：按绝对值升序排列**：

```cpp
bool cmpAbs(int a, int b) {
    return abs(a) < abs(b);    // 绝对值小的排前面
}
// ...
int a[] = {-5, 3, -2, 4, -1};
sort(a, a + 5, cmpAbs);
// 结果：{-1, -2, 3, 4, -5}    1<2<3<4<5，绝对值升序
```

**实例 2：偶数在前、奇数在后，同类内部升序**：

```cpp
bool cmp(int a, int b) {
    if (a % 2 != b % 2)
        return a % 2 < b % 2;      // 偶数(0)在奇数(1)前
    return a < b;                   // 同类内部升序
}
```

### 40.4  结构体排序（多关键字）

竞赛中最常见的情景——对结构体数组按多个字段排序。

**题目**：学生有姓名、语文成绩、数学成绩。先按总分降序；总分相同时按语文降序；再相同时按姓名升序。

```cpp
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;

struct Student {
    string name;
    int chinese, math;
    int total() const { return chinese + math; }
};

bool cmp(const Student &a, const Student &b) {
    if (a.total() != b.total())
        return a.total() > b.total();    // 总分高在前
    if (a.chinese != b.chinese)
        return a.chinese > b.chinese;    // 语文高在前
    return a.name < b.name;              // 姓名字典序
}

int main() {
    Student s[100];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> s[i].name >> s[i].chinese >> s[i].math;

    sort(s, s + n, cmp);

    for (int i = 0; i < n; i++)
        cout << s[i].name << " " << s[i].total() << endl;
    return 0;
}
```

> 🎯 **分级优先级模式**：用 `if (...) return ...;` 逐级判断，非常清晰，不容易出错。

### 40.5  stable_sort — 稳定排序

`sort()` 是**不稳定**的——相等元素的相对顺序可能被改变。

当你需要**稳定性**（比如已经按姓名排好了，再按成绩排还不能打乱同分者的姓名顺序），用 `stable_sort()`：

```cpp
stable_sort(a, a + n, cmp);
```

用法和 `sort()` 完全一样，但保证稳定。代价是略微多占一点内存，但对竞赛规模的 n 完全不是问题。

> 📊 **使用建议**：不确定要不要稳定，就用 `stable_sort()`。多一点点开销，换来的是确定的正确性。不过，多数情况下写好了 cmp 就不需要稳定排序——把所有规则都写进 cmp 就行了。

### 40.6  sort 背后的快排思想

`sort()` 内部使用的是**快速排序**的变体（实际上是内省排序 Introsort，混合了快排、堆排和插入排序），平均 O(n log n)。

快速排序的核心思想（了解即可，第 41 章会详细讲）：

1. 选一个"基准值"（pivot）
2. 把小于基准的放左边，大于的放右边
3. 对左右两部分递归地重复此过程

```
选基准： [3, 7, 1, 5, 2, 6, 4]  基准选 4
分区：   [3, 1, 2]  4  [7, 5, 6]   小于4的左边，大于4的右边
递归排左边：[1, 2, 3]
递归排右边：[5, 6, 7]
合并：   [1, 2, 3, 4, 5, 6, 7]
```

> 🏆 **竞赛原则**：直接用 `sort()`，不要手写快排，除非题目明确要求。

### 40.7  排序题的常见模式

学完用 `sort` 之后，你会发现竞赛中排序无处不在：

1. **直接排序**："把 n 个数从小到大输出"——直接用 `sort`
2. **多关键字排序**：排行榜问题——结构体 + cmp
3. **排序后处理**：去重（相邻元素比较）、求中位数（取中间位置）
4. **贪心的前置步骤**：很多贪心算法需要先排序（M7 会大量用到）
5. **二分查找的前置步骤**：`lower_bound` / `upper_bound` 要求数据有序

---

## ✋ 动手试试

**试试 1**：输入 10 个整数，分别用默认升序和 `greater<int>()` 降序输出。

**试试 2**：定义一个结构体 `Book{string title; int price; int sales;}`。输入 5 本书，按销量降序排；销量相同按价格升序。

**试试 3**：把 `{"cat", "dog", "apple", "banana", "car"}` 按字符串长度升序排列；长度相同时按字典序。

---

## ⚠️ 容易犯的错

### 错 1：cmp 函数里写了 `<=` 或 `>=`

❌ `return a.score >= b.score;`——C++ 标准要求严格弱序，用 `>=` 会导致崩溃！

✅ `return a.score > b.score;`——只用 `>` 或 `<`

> 这条非常重要！很多初学者在这一条上踩坑，程序直接 RE（运行时错误）。

### 错 2：sort 对 vector 的用法写错

❌ `sort(v, v + v.size());`——`v` 不是数组名，不能这样取地址

✅ `sort(v.begin(), v.end());`——vector 用迭代器

### 错 3：忘记包含 \<algorithm\>

❌ 使用 `sort` 但只包含了 `<iostream>`

✅ `#include <algorithm>`

### 错 4：cmp 写得逻辑混乱

❌ cmp 里不处理"相等"的情况，两个相等的元素既返回 true 又可能返回 false

✅ 确保对于任何 a 和 b，如果 `a == b`，`cmp(a,b)` 和 `cmp(b,a)` 都返回 false

---

## 📝 练习

### 基础题

**1. 选择题**

（1）`sort(a, a+n)` 默认按照什么顺序排列？  
A. 降序 &emsp; B. 升序 &emsp; C. 随机 &emsp; D. 取决于数据类型

（2）以下 cmp 函数哪一个是合法的？  
A. `bool cmp(int a,int b){return a>=b;}`  
B. `bool cmp(int a,int b){return a>b;}`  
C. `bool cmp(int a,int b){return a=b;}`  
D. `void cmp(int a,int b){return a<b;}`

（3）`stable_sort` 相比 `sort` 的优势是：  
A. 更快 &emsp; B. 更省内存 &emsp; C. 保持相等元素的相对顺序 &emsp; D. 代码更短

**2. 填空题**

（1）要使用 `sort` 函数，必须包含的头文件是 \_\_\_\_\_\_\_\_\_\_\_\_。

（2）`sort(a, a+n, greater<int>())` 将数组排为 \_\_\_\_\_\_（升序/降序）。

（3）cmp 函数中，`return a > b;` 表示 \_\_\_\_\_\_ 的元素排在前面。

### 提高题

**3. 编程题 — 年龄排序**

某班级有 n 个学生，每人有姓名（string）、出生年、月、日。请你按年龄从小到大排序（年龄大的排在前面，即出生早的在前）。如果年龄完全相同，按姓名字典序升序。

**4. 编程题 — 红包排序**

小红在班级群里发红包，共 n 个人抢到。每个人有姓名、金额（整数，单位分）、手气指数（= 金额 × 抢到的毫秒数）。请按手气指数降序排名；如果相等，按姓名升序。

### 挑战题

**5. 编程题 — 去重与统计**

输入 n 个整数（可能有重复），先从小到大排序并去重，输出不重复元素的个数 k 和这些元素。然后统计每个不重复元素在原数组中出现的次数，按出现次数降序输出；出现次数相同时按数值升序。

（提示：排序后用相邻比较去重；再用结构体存{数值,频次}排序）

---

## 🧠 本章小结

```
sort(begin, end)         → 默认升序 O(n log n)
sort(begin, end, greater<int>()) → 降序
sort(begin, end, cmp)    → 自定义规则
stable_sort(...)         → 稳定版

cmp 写法：
  bool cmp(const Type &a, const Type &b) {
      return a 应该排在 b 前面;
  }

结构体多关键字：
  if (a.key1 != b.key1) return a.key1 < b.key1;  // 第一关键字
  if (a.key2 != b.key2) return a.key2 < b.key2;  // 第二关键字
  return a.key3 < b.key3;                          // 第三关键字
```

**自查清单**：

- [ ] 我能用 `sort()` 对数组进行升序和降序排序
- [ ] 我能写 cmp 函数实现任意排序规则
- [ ] 我能对结构体按多关键字排序
- [ ] 我知道 `stable_sort` 和 `sort` 的区别
- [ ] 我了解 cmp 不能用 `<=` 或 `>=` 的原因
- [ ] 我理解 `sort` 的复杂度是 O(n log n)，不用手写 O(n²)

---

> 🚀 **下章预告**：`sort()` 好用，但它背后的快排到底是怎么实现 O(n log n) 的？它的"双胞胎"归并排序又是什么原理？下一章，我们深入分治排序的世界，手写两种 O(n log n) 排序——归并排序和快速排序，真正理解"分而治之"的威力。
