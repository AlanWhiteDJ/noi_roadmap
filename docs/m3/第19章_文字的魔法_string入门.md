# 第 19 章  不只是数字——string 入门

---

> 🏗️ **前情回顾**：上一章你学会了二维数组——用 `a[行][列]` 把成绩单、棋盘、矩阵这些"有行有列"的数据全部搞定。数组装数字是一把好手，但回头看——你的名字、聊天记录、网页内容……全是文字！数字能存了，文字呢？你的名字可不是 `int`。
>
> 💡 **本章要解决的问题**：**C++ 里怎么存文字、读文字、拼接文字？数字和文字之间怎么互相转换？** 这一章，C++ 的文字专家 `string` 正式登场——它就像一张能随意裁剪拼接的"文字纸条"。

---

## 🎯 本章目标

学完这一章，你能：

- 正确声明和初始化 `string` 类型的变量
- 用 `cin` 和 `getline` 两种方式读入字符串，知道它们的区别
- 用 `+` 拼接字符串，用 `size()` 获取长度
- 在数字和字符串之间互相转换（`to_string` 和 `stoi`）
- 用 `stringstream` 把字符串当"输入流"来解析

---

## 📖 故事引入

小美在做一个"名片生成器"。用户输入名字和年龄，程序输出一张漂亮的名片：

```
========== 名片 ==========
姓名：张小美
年龄：12 岁
欢迎语：你好，张小美！你今年 12 岁呀！
==========================
```

这看起来简单，但小美遇到了麻烦：名字是文字（`string`），年龄是数字（`int`）。怎么把它们"粘"在一起变成一句话？怎么判断名字有多长？怎么把用户输入的一整行（带空格）都读进来？

这就像做手工——你有剪刀、胶水、尺子、彩笔。`string` 就是一张能随意裁剪拼接的"文字纸条"。本章我们就来熟悉这件新工具的基本用法。

---

## 🧱 知识讲解

### 19.1  string 是什么

`string` 的中文意思是"字符串"。你可以把它理解成**一串字符**——一串字母、数字、符号、甚至中文的序列。

```cpp
string name = "Alice";          // 一串英文字母
string greeting = "你好！";      // 中文也可以
string mixed = "Player2_Win!";  // 字母、数字、符号混在一起
```

在第 3 章你见过 `char`——它只能存**一个**字符。而 `string` 可以存**一串**，就像 `char` 是"一颗糖"，`string` 是"一包糖"。

> ⚠️ 别忘了：用 `string` 需要 `#include <string>`。

### 19.2  声明与初始化

```cpp
string s1;                       // 空字符串（""）
string s2 = "Hello";             // 常规初始化
string s3("World");              // 用括号也行
string s4 = s2;                  // 复制另一个 string
string s5(5, 'A');               // "AAAAA"——5 个字符 'A'
```

最后一种你可能第一次见：`string(5, 'A')` 意思是"把字符 A 重复 5 遍"。这在生成分隔线时特别好用：

```cpp
cout << string(30, '-') << endl; // 输出 30 个短横线
```

### 19.3  输入字符串：cin 和 getline

**cin >> 读字符串**：

```cpp
string name;
cin >> name;
```

但这有一个坑：`cin >>` 读到**空格、换行、制表符**就会停。用户输入 `Zhang Xiao Ming`，`cin` 只读到 `Zhang`。

**getline 读一整行**：

```cpp
string line;
getline(cin, line);              // 读一整行，包括空格，直到换行
```

现在输入 `Zhang Xiao Ming`，`getline` 能完整读到。

**混合使用的坑**：

```cpp
int age;
string name;

cin >> age;                       // 用户输入 "12\n"
getline(cin, name);               // 直接读到了一个空行！
```

> ❌ **经典踩坑——cin 和 getline 混用时残留换行符：**
>
> 为什么 getline 读到了空行？因为 `cin >> age` 读取了 `12`，但把后面的换行符 `\n` 留在了输入缓冲区里。`getline` 一上来就撞到了这个换行符，立刻认为"这行结束了"，于是读了个空字符串。
>
> 就像你吃完饭，碗里留了一粒米——下一个用碗的人看到的不是空碗。
>
> ✅ **解决方法**：在 `cin >>` 和 `getline` 之间加一个 `cin.ignore()`，把残留的换行符吞掉：
>
> ```cpp
> cin >> age;
> cin.ignore();                   // 吞掉换行符
> getline(cin, name);             // 现在能正常读了
> ```

### 19.4  字符串拼接：+

C++ 里字符串可以用 `+` 直接拼接，就像拼积木：

```cpp
string first = "Hello";
string second = "World";
string result = first + " " + second;  // "Hello World"
```

> ❌ **常见踩坑——两边都是字面量直接 `+`：**
>
> ```cpp
> string s = "Hello" + "World";        // ❌ 报错！两边都是 C 风格字符串
> ```
>
> ✅ **正确：**
>
> ```cpp
> string s = string("Hello") + "World"; // ✅ 先把一边变成 string
> // 或者分开写：
> string s = "Hello";
> s += "World";                          // ✅ 也没问题
> ```

`+` 两边可以都是 `string`，也可以一边是 `string`、一边是字符串字面量（用双引号括起来的文字）。但不能两边都是字面量。

### 19.5  字符串长度：size() 和 length()

想知道一个字符串里有几个字符？

```cpp
string s = "Hello";
cout << s.size() << endl;        // 5
cout << s.length() << endl;      // 5（和 size() 完全一样）
```

中文也算一个字符：

```cpp
string s = "你好世界";
cout << s.size() << endl;        // 4（4 个中文字）
```

长度判断常用场景：

```cpp
if (s.size() == 0)  cout << "空字符串" << endl;
if (s.size() > 10)  cout << "名字好长！" << endl;
```

### 19.6  数字与字符串的转换

程序里经常需要在数字和文字之间来回转换——比如用户输入 "123"，你需要把它变成能计算的 `int` 类型；或者你要把计算结果拼进一句话里。

**字符串 → 整数：`stoi`**（string to int）

```cpp
string s = "2026";
int year = stoi(s);              // year = 2026
cout << year + 1 << endl;        // 2027——可以参与运算了
```

**整数 → 字符串：`to_string`**

```cpp
int score = 95;
string msg = "你的分数是 " + to_string(score) + " 分";
cout << msg << endl;             // 你的分数是 95 分
```

> ❌ **常见踩坑——stoi 转换非数字字符串：**
>
> ```cpp
> string s = "abc";
> int x = stoi(s);                 // ❌ 运行时崩溃！"abc" 不是数字
> ```
>
> ✅ 确保传入的字符串确实是数字。后续学到异常处理时可以安全地判断。

### 19.7  stringstream：把字符串当输入流

有时候你拿到一整行字符串，里面用空格分隔了多个信息（比如 "张三 12 95.5"），你想分别提取出姓名、年龄、分数。

`stringstream` 就像一个"假键盘"——你把字符串塞给它，然后用 `>>` 从里面读出一个个值，就像从 `cin` 读取一样。

需要 `#include <sstream>`。

```cpp
#include <sstream>
// ...
string line = "张三 12 95.5";
stringstream ss(line);           // 把 line 塞进 ss

string name; int age; double score;
ss >> name >> age >> score;      // 像 cin 一样提取

cout << name << " " << age << " " << score << endl;
// 输出：张三 12 95.5
```

> 💡 `stringstream` 是竞赛中的利器——很多题目会给你一整行数据让你解析，这时它比手动拆分方便得多。

---

## ✋ 动手试试

**试试 1**：写一个程序，让用户先输入年龄（int），再输入一句话（带空格）。用 `cin.ignore()` 解决残留换行符的问题。确认两样都能正确读入。

**试试 2**：询问用户的姓（string）和名（string），然后用 `+` 拼成全名，用 `size()` 输出全名的字符数。

**试试 3**：用 `stringstream` 解析字符串 `"2026 6 5"`（年 月 日），分别提取到三个 int 变量中，然后输出 `2026年6月5日`。

---

## 🦶 你踩过这些坑吗？

- [ ] **坑 1**：用户输入带空格的姓名，`cin >>` 只读到空格前第一个词——该用 `getline`
- [ ] **坑 2**：先 `cin >>` 再 `getline`，getline 直接读了个空行——忘加 `cin.ignore()`
- [ ] **坑 3**：写 `"Hello" + "World"` 拼接——两边都是字面量，编译报错
- [ ] **坑 4**：`stoi("abc")` 试图把文字转数字——运行时崩溃
- [ ] **坑 5**：用了 `stringstream` 但没 `#include <sstream>`——编译不通过

---

## 📝 练习

### 基础题

**1. 选择题**

（1）读入带空格的整行字符串，应该用：  
A. `cin >>` &emsp; B. `getline` &emsp; C. `scanf` &emsp; D. `read`

（2）`string("abc") + "def"` 的结果是：  
A. `"abc"` &emsp; B. `"def"` &emsp; C. `"abcdef"` &emsp; D. 编译错误

（3）把整数 2026 转成字符串，应该用：  
A. `stoi(2026)` &emsp; B. `to_string(2026)` &emsp; C. `int_to_string(2026)` &emsp; D. `(string)2026`

（4）`string s(3, '#');` 执行后，s 的值是：  
A. `"#"` &emsp; B. `"###"` &emsp; C. `"3#"` &emsp; D. 编译错误

**2. 填空题**

（1）`cin >>` 读到 \_\_\_\_、\_\_\_\_、\_\_\_\_ 时会停止。

（2）用 `stringstream` 需要 `#include <`\_\_\_\_`>`。

（3）在 `cin >>` 后接 `getline`，中间需要加 \_\_\_\_ 来清空缓冲。

### 提高题

**3. 编程题 — 名片生成器**

询问用户的姓名（可能带空格）、年龄、最喜欢的颜色，生成一张名片：

```
========== 名片 ==========
姓名：xxx
年龄：xxx 岁
喜欢的颜色：xxx
==========================
```

**4. 编程题 — 加法计算器**

用户在一行内输入两个整数（空格分隔，如 "123 456"），用 `getline` 读入后，用 `stringstream` 解析，计算并输出两数之和。

**5. 编程题 — 名字分析器**

用户输入自己的全名（可能包含两个或三个词，如 "张 小美" 或 "欧阳 小小 美"）。用 `stringstream` 解析出姓（第一个词）和名（剩余的），分别输出。提示：用 `stringstream` 逐个读入 `string` 变量，第一个是姓，后面拼接成名为止。

### 挑战题

**6. 编程题 — 身份证信息提取**

用户输入一个 18 位身份证号（字符串），程序从中提取并输出出生年月日。

示例输入：`320106200805121234`  
示例输出：`出生日期：2008年5月12日`

（提示：用 `substr` 截取——第 7~14 位是出生日期。`substr` 我们下一章会详讲，这里先给个小预告：`s.substr(6, 8)` 从下标 6 开始取 8 个字符。）

**7. 编程题 — 秘密信息**

用户输入一个句子，程序把每个单词的首字母提取出来组成一个新的字符串输出。例如输入 `"Hello World From Cpp"`，输出 `"HWFC"`。

---

## 🧠 本章小结

```
string = 一串字符

声明初始化：
  string s = "Hello";
  string s2(5, '*');       // "*****"

输入：
  cin >> s;                // 读一个单词（空格停止）
  getline(cin, s);         // 读一整行（含空格）
  混用时加 cin.ignore();

拼接： s1 + s2 + "..."
长度： s.size() 或 s.length()

转换：
  stoi("123")  →  123      (string → int)
  to_string(123)  →  "123" (int → string)

stringstream：
  把字符串当输入流，用 >> 解析
```



---

## 📝 配套练习

> 共7题。string从读入→遍历→字符处理→查找映射逐步深入。。★核心（课堂必做） ◆拓展（课后练习）

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | J0089 | https://hydro.ac/d/srqc/p/J0089 | string、getline、length |
| ◆ 拓展 | J0085 | https://hydro.ac/d/srqc/p/J0085 | string、toupper、字符遍历 |
| ◆ 拓展 | J0092 | https://hydro.ac/d/srqc/p/J0092 | string、映射表、按键次数 |
| ◆ 拓展 | J0086 | https://hydro.ac/d/srqc/p/J0086 | string、字符偏移、模运算 |
| ◆ 拓展 | luogu-P5733 | https://hydro.ac/p/luogu-P5733 | string、toupper/tolower、全转换 |
| ◆ 拓展 | J0093 | https://hydro.ac/d/srqc/p/J0093 | string、查找相邻、计数 |
| ◆ 拓展 | J0088 | https://hydro.ac/d/srqc/p/J0088 | string、类型判断、格式解析 |

> 💡 **练习建议**：先完成 1 道★核心题，确保掌握本章基本方法；再完成 6 道◆拓展题，覆盖不同变式和细节。




---

## 配套练习

> 共7题。string从读入→遍历→字符处理→查找映射逐步深入。★核心（课堂必做） · ◆拓展（课后练习）

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | J0089 | https://hydro.ac/d/srqc/p/J0089 | string、getline、length |
| ◆ 拓展 | J0085 | https://hydro.ac/d/srqc/p/J0085 | string、toupper、字符遍历 |
| ◆ 拓展 | J0092 | https://hydro.ac/d/srqc/p/J0092 | string、映射表、按键次数 |
| ◆ 拓展 | J0086 | https://hydro.ac/d/srqc/p/J0086 | string、字符偏移、模运算 |
| ◆ 拓展 | luogu-P5733 | https://hydro.ac/p/luogu-P5733 | string、toupper/tolower、全转换 |
| ◆ 拓展 | J0093 | https://hydro.ac/d/srqc/p/J0093 | string、查找相邻、计数 |
| ◆ 拓展 | J0088 | https://hydro.ac/d/srqc/p/J0088 | string、类型判断、格式解析 |

> **练习建议**：先在课堂完成 1 道★核心题，掌握本章基本方法；课后完成 6 道◆拓展题，覆盖不同变式和细节。


**自查清单**：

- [ ] 我能用两种方式读入字符串，知道什么场景用哪个
- [ ] 我能解决 `cin >>` 和 `getline` 混用时的残留换行符问题
- [ ] 我会用 `+` 拼接字符串，知道两边都是字面量会报错
- [ ] 我会用 `size()` 获取字符串长度
- [ ] 我会 `stoi` 和 `to_string` 做数字与文字的转换
- [ ] 我会用 `stringstream` 解析字符串
- [ ] 我能区分 `char`（单字符）和 `string`（字符串）

---

## 🚀 下章预告

`string` 的基本功练完了——声明、输入、拼接、求长度、转数字，你已经能读写文字。但光会存不会改，就像拿到一把瑞士军刀只用了最外面那层。能查找某个词在第几个字吗？能截取一段文字吗？能删除、插入、替换吗？

下一章，我们把 `string` 的工具全翻出来——**查找、截取、删除、插入、替换、字符判断**……让文字在你手里"想怎么改就怎么改"！
