import { defineConfig } from 'vitepress'

// 侧边栏章节列表
const sidebarGuide = [
  {
    text: 'M1 认识编程世界',
    collapsed: false,
    items: [
      { text: '第1章 你好，计算机！', link: '/m1/第01章_你好计算机' },
      { text: '第2章 你的第一个程序', link: '/m1/第02章_第一个程序' },
      { text: '第3章 程序的记忆盒子——变量', link: '/m1/第03章_程序的记忆盒子_变量' },
      { text: '第4章 程序的六种容器——数据类型', link: '/m1/第04章_程序的六种容器' },
      { text: '第5章 让程序跟你聊天——输入输出', link: '/m1/第05章_让程序跟你聊天' },
      { text: '第6章 做算术题——运算符', link: '/m1/第06章_做算术题' },
      { text: '第7章 变量进阶与数学工具箱', link: '/m1/第07章_变量进阶与数学工具箱' },
      { text: '第8章 M1 综合实战', link: '/m1/第08章_M1综合实战_你的第一个计算器' },
    ]
  },
  {
    text: 'M2 选择与重复',
    collapsed: true,
    items: [
      { text: '第9章 岔路口——if-else 分支', link: '/m2/第09章_岔路口_if_else分支' },
      { text: '第10章 switch 与三目运算符', link: '/m2/第10章_选项太多怎么办_switch与三目' },
      { text: '第11章 重复的力量——for 循环', link: '/m2/第11章_重复的力量_for循环' },
      { text: '第12章 while 与 do-while', link: '/m2/第12章_不知道次数怎么办_while与do_while' },
      { text: '第13章 一层不够——嵌套循环', link: '/m2/第13章_一层不够_嵌套循环' },
      { text: '第14章 break 与 continue', link: '/m2/第14章_刹车与跳过_break与continue' },
      { text: '第15章 选择与重复的联合作战', link: '/m2/第15章_岔路口上跑圈_选择与重复的联合作战' },
    ]
  },
  {
    text: 'M3 循环与数据容器',
    collapsed: true,
    items: [
      { text: '第16章 一排柜子——一维数组', link: '/m3/第16章_一排柜子_一维数组' },
      { text: '第17章 数组的魔法——统计与变换', link: '/m3/第17章_数组的魔法_统计与变换' },
      { text: '第18章 表格世界——二维数组', link: '/m3/第18章_表格世界_二维数组' },
      { text: '第19章 文字的魔法——string 入门', link: '/m3/第19章_文字的魔法_string入门' },
      { text: '第20章 字符串的十八般武艺', link: '/m3/第20章_字符串的十八般武艺' },
      { text: '第21章 字符与编码——ASCII 的世界', link: '/m3/第21章_字符与编码_ASCII的世界' },
      { text: '第22章 数据容器综合实战', link: '/m3/第22章_数据容器综合实战' },
    ]
  },
  {
    text: 'M4 函数与进阶类型',
    collapsed: true,
    items: [
      { text: '第23章 封装你的代码——函数入门', link: '/m4/第23章_封装你的代码_函数入门' },
      { text: '第24章 参数的秘密——值传递与引用传递', link: '/m4/第24章_参数的秘密_值传递与引用传递' },
      { text: '第25章 变量的领地——作用域与生命周期', link: '/m4/第25章_变量的领地_作用域与生命周期' },
      { text: '第26章 自己调用自己——递归入门', link: '/m4/第26章_自己调用自己_递归入门' },
      { text: '第27章 数据打包——结构体 struct', link: '/m4/第27章_数据打包_结构体struct' },
      { text: '第28章 地址的秘密——指针基础', link: '/m4/第28章_地址的秘密_指针基础' },
      { text: '第29章 存档读档——文件操作入门', link: '/m4/第29章_存档读档_文件操作入门' },
    ]
  },
  {
    text: 'M5 暴力与基础技巧',
    collapsed: true,
    items: [
      { text: '第30章 暴力枚举——逐个尝试', link: '/m5/第30章_暴力枚举_逐个尝试' },
      { text: '第31章 模拟——让程序模仿现实', link: '/m5/第31章_模拟_让程序模仿现实' },
      { text: '第32章 枚举进阶——排列与子集', link: '/m5/第32章_枚举进阶_排列与子集' },
      { text: '第33章 模拟进阶——大模拟与规则', link: '/m5/第33章_模拟进阶_大模拟与规则' },
      { text: '第34章 两只手指——双指针', link: '/m5/第34章_两只手指_双指针' },
      { text: '第35章 预制计算——前缀和与差分', link: '/m5/第35章_预制计算_前缀和与差分' },
      { text: '第36章 压缩空间——离散化', link: '/m5/第36章_压缩空间_离散化' },
      { text: '第37章 大数计算——高精度运算', link: '/m5/第37章_大数计算_高精度运算' },
    ]
  },
  {
    text: 'M6 排序与复杂度',
    collapsed: true,
    items: [
      { text: '第38章 算法的速度——复杂度分析', link: '/m6/第38章_算法的速度_复杂度分析' },
      { text: '第39章 基础排序——冒泡/选择/插入', link: '/m6/第39章_基础排序_冒泡选择与插入' },
      { text: '第40章 高级排序——STL sort', link: '/m6/第40章_高级排序_STL_sort与自定义' },
      { text: '第41章 分治排序——归并与快速', link: '/m6/第41章_分治排序_归并与快速' },
      { text: '第42章 不比较的排序——计数与基数', link: '/m6/第42章_不比较的排序_计数与基数' },
      { text: '第43章 排序全景——八种排序对比与选择', link: '/m6/第43章_排序全景_八种排序对比与选择' },
    ]
  },
  {
    text: 'M7 递归贪心分治',
    collapsed: true,
    items: [
      { text: '第44章 递归深潜——汉诺塔与全排列', link: '/m7/第44章_递归深潜_汉诺塔与全排列' },
      { text: '第45章 记忆化搜索——让递归飞起来', link: '/m7/第45章_记忆化搜索_让递归飞起来' },
      { text: '第46章 一分为二——二分查找', link: '/m7/第46章_一分为二_二分查找' },
      { text: '第47章 二分答案——从查找值到查找可行域', link: '/m7/第47章_二分答案_从查找值到查找可行域' },
      { text: '第48章 贪心算法——局部最优的智慧', link: '/m7/第48章_贪心算法_局部最优的智慧' },
      { text: '第49章 分治算法——大而化小', link: '/m7/第49章_分治算法_大而化小' },
      { text: '第50章 翻倍的力量——倍增与快速幂', link: '/m7/第50章_翻倍的力量_倍增与快速幂' },
    ]
  },
  {
    text: 'M8 线性结构与数论',
    collapsed: true,
    items: [
      { text: '第51章 栈与队列——线性结构入门', link: '/m8/第51章_栈与队列_线性结构入门' },
      { text: '第52章 vector——动态数组', link: '/m8/第52章_vector_动态数组' },
      { text: '第53章 链式连接——链表入门', link: '/m8/第53章_链式连接_链表入门' },
      { text: '第54章 数字的奥秘——初等数论', link: '/m8/第54章_数字的奥秘_初等数论' },
      { text: '第55章 辗转相除——GCD 与 LCM', link: '/m8/第55章_辗转相除_最大公约数与最小公倍数' },
      { text: '第56章 有多少种可能——排列组合', link: '/m8/第56章_有多少种可能_排列组合基础' },
    ]
  },
]

export default defineConfig({
  title: '信息学竞赛 C++ 教材',
  description: '面向小学高年级+初中低年级的信息学竞赛 C++ 教材 | CSP-J 第二轮 | GESP 1-5级',
  lang: 'zh-CN',
  base: '/noi_roadmap/',

  head: [
    ['link', { rel: 'icon', href: '/noi_roadmap/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/noi_roadmap/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '上册 · 入门级', link: '/m1/第01章_你好计算机' },
      {
        text: '模块',
        items: [
          { text: 'M1 认识编程世界', link: '/m1/第01章_你好计算机' },
          { text: 'M2 选择与重复', link: '/m2/第09章_岔路口_if_else分支' },
          { text: 'M3 循环与数据容器', link: '/m3/第16章_一排柜子_一维数组' },
          { text: 'M4 函数与进阶类型', link: '/m4/第23章_封装你的代码_函数入门' },
          { text: 'M5 暴力与基础技巧', link: '/m5/第30章_暴力枚举_逐个尝试' },
          { text: 'M6 排序与复杂度', link: '/m6/第38章_算法的速度_复杂度分析' },
          { text: 'M7 递归贪心分治', link: '/m7/第44章_递归深潜_汉诺塔与全排列' },
          { text: 'M8 线性结构与数论', link: '/m8/第51章_栈与队列_线性结构入门' },
        ]
      },
      { text: 'GitHub', link: 'https://github.com/AlanWhiteDJ/noi_roadmap' },
    ],

    sidebar: {
      '/m1/': sidebarGuide,
      '/m2/': sidebarGuide,
      '/m3/': sidebarGuide,
      '/m4/': sidebarGuide,
      '/m5/': sidebarGuide,
      '/m6/': sidebarGuide,
      '/m7/': sidebarGuide,
      '/m8/': sidebarGuide,
      '/': sidebarGuide,
    },

    outline: {
      level: [2, 3],
      label: '本章目录',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AlanWhiteDJ/noi_roadmap' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档' },
          modal: {
            noResultsText: '未找到结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换' },
          },
        },
      },
    },

    docFooter: {
      prev: '上一章',
      next: '下一章',
    },

    editLink: {
      pattern: 'https://github.com/AlanWhiteDJ/noi_roadmap/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: {
      text: '最后更新于',
    },
  },

  ignoreDeadLinks: true,

  markdown: {
    theme: 'github-dark',
    lineNumbers: true,
  },
})
