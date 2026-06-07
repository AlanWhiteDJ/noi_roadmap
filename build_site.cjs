// build_site.js - 构建 OI Wiki 风格站点
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'master', '学生用书', '上册');
const DST = path.resolve(__dirname, 'docs');

// 模块映射: 源目录 → 目标目录 + 章节信息
const modules = [
  {
    id: 'm1', name: 'M1 认识编程世界',
    srcDir: 'M1_认识编程世界',
    chapters: [
      '第01章_你好计算机.md',
      '第02章_第一个程序.md',
      '第03章_程序的记忆盒子_变量.md',
      '第04章_程序的六种容器.md',
      '第05章_让程序跟你聊天.md',
      '第06章_做算术题.md',
      '第07章_变量进阶与数学工具箱.md',
      '第08章_M1综合实战_你的第一个计算器.md',
    ]
  },
  {
    id: 'm2', name: 'M2 选择与重复',
    srcDir: 'M2_选择与重复',
    chapters: [
      '第09章_岔路口_if_else分支.md',
      '第10章_选项太多怎么办_switch与三目.md',
      '第11章_重复的力量_for循环.md',
      '第12章_不知道次数怎么办_while与do_while.md',
      '第13章_一层不够_嵌套循环.md',
      '第14章_刹车与跳过_break与continue.md',
      '第15章_岔路口上跑圈_选择与重复的联合作战.md',
    ]
  },
  {
    id: 'm3', name: 'M3 循环与数据容器',
    srcDir: 'M3_循环与数据容器',
    chapters: [
      '第16章_一排柜子_一维数组.md',
      '第17章_数组的魔法_统计与变换.md',
      '第18章_表格世界_二维数组.md',
      '第19章_文字的魔法_string入门.md',
      '第20章_字符串的十八般武艺.md',
      '第21章_字符与编码_ASCII的世界.md',
      '第22章_数据容器综合实战.md',
    ]
  },
  {
    id: 'm4', name: 'M4 函数与进阶类型',
    srcDir: 'M4_函数与进阶类型',
    chapters: [
      '第23章_封装你的代码_函数入门.md',
      '第24章_参数的秘密_值传递与引用传递.md',
      '第25章_变量的领地_作用域与生命周期.md',
      '第26章_自己调用自己_递归入门.md',
      '第27章_数据打包_结构体struct.md',
      '第28章_地址的秘密_指针基础.md',
      '第29章_存档读档_文件操作入门.md',
    ]
  },
  {
    id: 'm5', name: 'M5 暴力与基础技巧',
    srcDir: 'M5_暴力与基础技巧',
    chapters: [
      '第30章_暴力枚举_逐个尝试.md',
      '第31章_模拟_让程序模仿现实.md',
      '第32章_枚举进阶_排列与子集.md',
      '第33章_模拟进阶_大模拟与规则.md',
      '第34章_两只手指_双指针.md',
      '第35章_预制计算_前缀和与差分.md',
      '第36章_压缩空间_离散化.md',
      '第37章_大数计算_高精度运算.md',
    ]
  },
  {
    id: 'm6', name: 'M6 排序与复杂度',
    srcDir: 'M6_排序与复杂度',
    chapters: [
      '第38章_算法的速度_复杂度分析.md',
      '第39章_基础排序_冒泡选择与插入.md',
      '第40章_高级排序_STL_sort与自定义.md',
      '第41章_分治排序_归并与快速.md',
      '第42章_不比较的排序_计数与基数.md',
      '第43章_排序全景_八种排序对比与选择.md',
    ]
  },
  {
    id: 'm7', name: 'M7 递归贪心分治',
    srcDir: 'M7_递归贪心分治',
    chapters: [
      '第44章_递归深潜_汉诺塔与全排列.md',
      '第45章_记忆化搜索_让递归飞起来.md',
      '第46章_一分为二_二分查找.md',
      '第47章_二分答案_从查找值到查找可行域.md',
      '第48章_贪心算法_局部最优的智慧.md',
      '第49章_分治算法_大而化小.md',
      '第50章_翻倍的力量_倍增与快速幂.md',
    ]
  },
  {
    id: 'm8', name: 'M8 线性结构与数论',
    srcDir: 'M8_线性结构与数论',
    chapters: [
      '第51章_栈与队列_线性结构入门.md',
      '第52章_vector_动态数组.md',
      '第53章_链式连接_链表入门.md',
      '第54章_数字的奥秘_初等数论.md',
      '第55章_辗转相除_最大公约数与最小公倍数.md',
      '第56章_有多少种可能_排列组合基础.md',
    ]
  },
];

let copied = 0;
let missing = [];

for (const mod of modules) {
  const dstDir = path.join(DST, mod.id);
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });

  for (const ch of mod.chapters) {
    const srcFile = path.join(SRC, mod.srcDir, ch);
    const dstFile = path.join(dstDir, ch);

    if (fs.existsSync(srcFile)) {
      let content = fs.readFileSync(srcFile, 'utf-8');

      fs.writeFileSync(dstFile, content, 'utf-8');
      copied++;
    } else {
      missing.push(srcFile);
    }
  }
}

console.log(`✅ 已复制 ${copied} 个章节`);
if (missing.length > 0) {
  console.log(`⚠️ 缺失 ${missing.length} 个文件:`);
  missing.forEach(f => console.log(`   - ${f}`));
}
