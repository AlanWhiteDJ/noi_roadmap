# 第 97 章  容斥与 Catalan

---

> 🏗️ **前情回顾**：第 96 章用排列组合直接数「合法方案」。但很多题问的是「至少有一个」「一个都没有」，正面分类会重复；这一章用容斥把重叠部分剥掉，并认识计数里的常客 Catalan 数。

---

## 🎯 本章目标

学完这一章，你能：

- 写出两集合、三集合与一般形式的容斥式
- 用补集转化把「至少」改成「一个都没有」
- 用二进制枚举实现容斥，正确处理符号与 `lcm`
- 识别 Catalan 数的五类经典模型
- 在模意义下计算 Catalan 数，不踩除法的坑

---

## 🧱 知识讲解

### 97.1  容斥原理

两个集合：

```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

三个集合：

```
|A ∪ B ∪ C| = |A| + |B| + |C|
            - |A∩B| - |A∩C| - |B∩C|
            + |A∩B∩C|
```

一般形式：

```
|A₁ ∪ … ∪ A_k| = Σ|A_i| - Σ|A_i∩A_j| + Σ|A_i∩A_j∩A_l| - …
```

**奇数个集合的交集取正号，偶数个取负号。** 这是容斥最容易写反的地方。

为什么对？考虑一个恰好属于 `t` 个集合的元素。它在右边被计算的次数是

```
C(t,1) - C(t,2) + C(t,3) - … + (-1)^(t-1) C(t,t)
= 1 - (1-1)^t = 1
```

所以每个元素恰好被算一次。

### 97.2  补集转化

容斥最常用的形态不是直接求并集，而是求「一个都不满足」：

```
|A₁ᶜ ∩ … ∩ A_kᶜ| = 全集 - |A₁ ∪ … ∪ A_k|
```

于是

```
至少一个发生 = 全集 - 一个都不发生
恰好一个 = 至少一个 - 至少两个
```

当「合法」情况复杂、「非法」情况简单时，先算非法再减，往往一步到位。注意全集要按题目范围算准，别把不存在的方案算进去。

**例子**：`1..100` 中能被 `2` 或 `3` 或 `5` 整除的数有多少个？

```
|A₂| = 50，|A₃| = 33，|A₅| = 20
|A₂∩A₃| = 16（6 的倍数）
|A₂∩A₅| = 10（10 的倍数）
|A₃∩A₅| = 6（15 的倍数）
|A₂∩A₃∩A₅| = 3（30 的倍数）
```

所以

```
50 + 33 + 20 - 16 - 10 - 6 + 3 = 74
```

### 97.3  容斥的代码实现

求 `1..n` 中「不被任何 `p_i` 整除」的数的个数。枚举非空子集，子集大小为奇数时加，偶数时减；「同时被这些 `p_i` 整除」的数量是 `n / lcm`。

```cpp
long long gcdll(long long a, long long b) {
    return b == 0 ? a : gcdll(b, a % b);
}

long long countCoprime(long long n, vector<long long> p) {
    int k = p.size();
    long long bad = 0;
    for (int S = 1; S < (1 << k); ++S) {
        long long l = 1;
        int c = 0;
        bool ok = true;
        for (int i = 0; i < k && ok; ++i) {
            if (S >> i & 1) {
                ++c;
                l = l / gcdll(l, p[i]) * p[i];
                if (l > n) ok = false;       // lcm 已超过 n，贡献为 0
            }
        }
        if (ok) bad += (c & 1) ? n / l : -n / l;
    }
    return n - bad;
}
```

复杂度 `O(2^k · k · log)`，适合 `k ≤ 20`。`l > n` 时提前退出，既防溢出又省时间。

> ⚠️ 不要用 `std::gcd`：它是 C++17 才进入标准库的，本章统一 C++14，自己写一个更稳。

### 97.4  Catalan 数

Catalan 数 `Cat_n` 的前几项：

```
Cat₀ = 1
Cat₁ = 1
Cat₂ = 2
Cat₃ = 5
Cat₄ = 14
Cat₅ = 42
Cat₆ = 132
```

通项：

```
Cat_n = C(2n, n) / (n+1) = C(2n, n) - C(2n, n-1)
```

递推：

```
Cat_n = Cat_{n-1} × (4n - 2) / (n + 1)
```

**五类经典模型**，答案都是 `Cat_n`：

1. `n` 对括号的合法序列数；
2. `n` 个元素依次入栈，可能的出栈序列数；
3. `n` 个结点的不同二叉树形态数；
4. 从 `(0,0)` 走到 `(n,n)`，不越过对角线 `y = x` 的路径数；
5. 凸 `n+2` 边形的三角剖分数。

它们的共同点是：任意前缀中，某一类元素的数量不少于另一类。把「左括号」记作向右，「右括号」记作向上，合法括号序列就对应不越过对角线的路径。

**反射原理**：从 `(0,0)` 到 `(n,n)` 的所有路径有 `C(2n,n)` 条。不合法路径一定碰到 `y = x + 1`，把碰到之后的部分沿这条线翻折，终点变成 `(n-1, n+1)`，与从 `(0,0)` 到 `(n-1,n+1)` 的路径一一对应，共 `C(2n, n-1)` 条。相减得

```
Cat_n = C(2n, n) - C(2n, n-1)
```

**模意义下的代码**（`MOD` 为素数，`n+1 < MOD`）：

```cpp
const int N = 1000005;
const long long MOD = 1000000007;
long long cat[N], inv[N];

void initCatalan(int n) {
    inv[1] = 1;
    for (int i = 2; i <= n + 1; ++i)
        inv[i] = (MOD - MOD / i) * inv[MOD % i] % MOD;
    cat[0] = 1;
    for (int i = 1; i <= n; ++i)
        cat[i] = cat[i-1] * (4LL * i - 2) % MOD * inv[i+1] % MOD;
}
```

> ⚠️ 不能写 `cat[i-1] * (4i-2) / (i+1) % MOD`。模意义下没有除法，必须乘 `inv[i+1]`。

如果 `n ≤ 18`，答案在 `long long` 内，可以直接用卷积递推，不取模：

```cpp
long long cat[20];
cat[0] = 1;
for (int i = 1; i <= n; ++i) {
    cat[i] = 0;
    for (int j = 0; j < i; ++j)
        cat[i] += cat[j] * cat[i-1-j];
}
```

这个式子来自「枚举第一对括号内包含多少对」，也是 `Cat_n` 的组合递推定义。

---

## 💻 例题与解析

### 例 1  越狱（P3197）

**题意**：监狱有 `n` 个房间排成一排，每个房间关一个犯人，犯人有 `m` 种宗教。若相邻两个房间的犯人宗教相同就可能越狱。求可能越狱的状态数，模 `100003`。

**解析**：正着数「相邻都不同」要考虑前面选了什么，不如数它的反面。总方案是每个房间 `m` 种，共 `m^n`；**不会越狱**的方案是第 1 间 `m` 种、之后每间不能与前一间相同，各有 `m-1` 种，共 `m × (m-1)^(n-1)`。两者相减即答案。

```cpp
#include <bits/stdc++.h>
using namespace std;

const long long MOD = 100003;

long long qpow(long long a, long long b) {
    long long res = 1 % MOD;
    a %= MOD;
    while (b > 0) {
        if (b & 1) res = res * a % MOD;
        a = a * a % MOD;
        b >>= 1;
    }
    return res;
}

int main() {
    long long m, n;
    cin >> m >> n;
    long long all = qpow(m, n);
    long long safe = m % MOD * qpow(m - 1, n - 1) % MOD;
    cout << (all - safe + MOD) % MOD << endl;
    return 0;
}
```

**易错点**：`n = 1` 时没有相邻房间，答案 `m - m = 0`；`m = 1` 且 `n ≥ 2` 时所有房间同教，答案 `1`，公式同样成立；指数是 `long long`，不要用 `int`。

### 例 2  栈（P1044）

**题意**：`1..n` 依次入栈，可以随时出栈，求可能的出栈序列数。`n ≤ 18`。

**解析**：设 `Cat_n` 为答案。枚举第一个出栈的元素是第 `j` 个入栈的：它入栈前有 `j-1` 个元素已经进出完毕，入栈后有 `n-j` 个元素在它之后处理，两部分独立，所以

```
Cat_n = Σ_{j=1}^{n} Cat_{j-1} × Cat_{n-j}
```

这就是 Catalan 递推。`n ≤ 18`，`Cat_18 = 477638700`，`long long` 足够，不必取模。

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    long long cat[20] = {0};
    cat[0] = 1;
    for (int i = 1; i <= n; ++i)
        for (int j = 0; j < i; ++j)
            cat[i] += cat[j] * cat[i-1-j];
    cout << cat[n] << endl;
    return 0;
}
```

**易错点**：`cat[0] = 1` 是递推的种子；循环上界是 `i`，不是 `n`；`n = 0` 时输出 `1`（空序列算一种），题目一般保证 `n ≥ 1`。

### 例 3  容斥手算

**题意**：`1..1000` 中既不能被 `2` 整除、也不能被 `3` 整除、也不能被 `5` 整除的数有多少个？

**解析**：先算能被至少一个整除的：

```
500 + 333 + 200 - 166 - 100 - 66 + 33 = 734
```

所以一个都不能整除的有 `1000 - 734 = 266` 个。

用 97.3 的代码验证：`p = {2,3,5}`，`n = 1000`，输出应为 `266`。注意 `lcm(2,3,5) = 30`，`1000/30 = 33`，最后一项是加号。

---

## ⚠️ 常见错误

- **符号写反**：奇数个集合取正，偶数个取负；三集合公式最后一项是 `+ |A∩B∩C|`。
- **空集算进去**：枚举子集从 `S = 1` 开始，`S = 0` 是空集，`lcm` 为 1，会把全集错误地加一遍。
- **`lcm` 溢出**：先 `l / gcd(l, p) * p`，并判断 `l > n` 提前退出。
- **补集全集算错**：例如「每个位置都有 `m` 种选择」这个前提不能漏。
- **Catalan 下标错位**：`n` 对括号、`n` 个结点、`n` 次入栈对应的都是 `Cat_n`，不是 `Cat_{n+1}`。
- **模意义下直接除以 `n+1`**：要乘逆元，并确认 `n+1` 不是模数的倍数。

---

## ✋ 动手试试

**试试 1**：用容斥求 `1..100` 中不能被 `2`、`3`、`7` 整除的数的个数，再用代码验证。

**试试 2**：写出 `n = 4` 的所有合法括号序列，数一数是否是 `14`。

**试试 3**：把例 2 的 `n` 改成 `20`，观察 `long long` 是否还够；如果不够，应该在哪一步取模？

---

## 🧠 本章小结

```
容斥：
  |A∪B| = |A| + |B| - |A∩B|
  奇数个交集取正，偶数个取负
  枚举非空子集，lcm 求交集大小

补集：
  至少一个 = 全集 - 一个都没有
  恰好一个 = 至少一个 - 至少两个

Catalan：
  Cat_0 = 1
  Cat_n = C(2n,n)/(n+1) = C(2n,n) - C(2n,n-1)
  Cat_n = Cat_{n-1}·(4n-2)/(n+1)
  模型：括号、出栈、二叉树、对角线路径、三角剖分

模意义：
  除法 → 乘逆元
  n+1 不能是模数的倍数
```

---

## ✅ 自查清单

- [ ] 我能写出三集合容斥式并解释每一项的符号
- [ ] 我会用补集转化简化「至少/至多」
- [ ] 我能用二进制枚举实现容斥，并处理 `lcm` 溢出
- [ ] 我至少能说出 Catalan 的五类模型
- [ ] 我能用通项和递推两种方式算 Catalan
- [ ] 我知道模意义下不能直接除以 `n+1`

---

## 📝 配套练习

> 共17题。核心/拓展/挑战分档。

| 级别 | 题号 | 链接 | 覆盖知识点 |
|------|------|------|-----------|
| ★ 核心 | luogu-P8557 | https://hydro.ac/d/atto/p/luogu-P8557 | 知识点：炼金术（Alchemy） |
| ★ 核心 | luogu-P5505 | https://hydro.ac/d/atto/p/luogu-P5505 | 知识点：[JSOI2011] 分特产 |
| ★ 核心 | luogu-P6298 | https://hydro.ac/d/atto/p/luogu-P6298 | 知识点：齿轮 |
| ★ 核心 | luogu-P6162 | https://hydro.ac/d/atto/p/luogu-P6162 | 知识点：[Cnoi2020] 四角链 |
| ★ 核心 | luogu-P6692 | https://hydro.ac/d/atto/p/luogu-P6692 | 知识点：出生点 |
| ◆ 拓展 | luogu-P6076 | https://hydro.ac/d/atto/p/luogu-P6076 | 知识点：[JSOI2015] 染色问题 |
| ◆ 拓展 | luogu-P5664 | https://hydro.ac/d/atto/p/luogu-P5664 | 知识点：[CSP-S2019] Emiya 家今天的饭 |
| ◆ 拓展 | luogu-P3197 | https://hydro.ac/d/atto/p/luogu-P3197 | 知识点：[HNOI2008] 越狱 |
| ◆ 拓展 | luogu-P1450 | https://hydro.ac/d/atto/p/luogu-P1450 | 知识点：[HAOI2008] 硬币购物 |
| ◆ 拓展 | codeforces-P803F | https://hydro.ac/d/atto/p/codeforces-P803F | 知识点：Coprime Subsequences |
| ★★★ 挑战 | luogu-P7118 | https://hydro.ac/d/atto/p/luogu-P7118 | 知识点：Galgame |
| ★★★ 挑战 | luogu-P3200 | https://hydro.ac/d/atto/p/luogu-P3200 | 知识点：[HNOI2009] 有趣的数列 |
| ★★★ 挑战 | luogu-P1976 | https://hydro.ac/d/atto/p/luogu-P1976 | 知识点：鸡蛋饼 |
| ★★★ 挑战 | luogu-P1722 | https://hydro.ac/d/atto/p/luogu-P1722 | 知识点：矩阵 II |
| ★★★ 挑战 | luogu-P1754 | https://hydro.ac/d/atto/p/luogu-P1754 | 知识点：球迷购票问题 |
| ★★★ 挑战 | luogu-P1375 | https://hydro.ac/d/atto/p/luogu-P1375 | 知识点：小猫 |
| ★★★ 挑战 | luogu-P1044 | https://hydro.ac/d/atto/p/luogu-P1044 | 知识点：[NOIP 2003 普及组] 栈 |

