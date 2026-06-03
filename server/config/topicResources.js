// ═══════════════════════════════════════════════════════════════════
// Placivio — Topic-to-Resource Configuration
// Each topic has curated YouTube videos, LeetCode problems,
// HackerRank sets, GFG articles, and interview questions.
// Update this file to change resources shown in weekly roadmaps.
// ═══════════════════════════════════════════════════════════════════

const TOPIC_RESOURCES = {
  // ───────────── DSA ─────────────
  arrays: {
    topic: 'Arrays & Strings',
    skills: ['Arrays', 'Strings', 'Two Pointers', 'Sliding Window'],
    resources: [
      { title: 'NeetCode — Arrays & Hashing Playlist', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf', type: 'video' },
      { title: 'take U forward — Arrays Series', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rENwdL0nEH0uGom9no0nyB', type: 'video' },
      { title: 'LC #1 Two Sum (Easy)', url: 'https://leetcode.com/problems/two-sum/', type: 'leetcode' },
      { title: 'LC #121 Best Time to Buy & Sell Stock (Easy)', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', type: 'leetcode' },
      { title: 'LC #238 Product of Array Except Self (Medium)', url: 'https://leetcode.com/problems/product-of-array-except-self/', type: 'leetcode' },
      { title: 'LC #53 Maximum Subarray — Kadane\'s (Medium)', url: 'https://leetcode.com/problems/maximum-subarray/', type: 'leetcode' },
      { title: 'HackerRank — Arrays Practice', url: 'https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=arrays', type: 'hackerrank' },
      { title: 'GFG — Array Complete Guide', url: 'https://www.geeksforgeeks.org/array-data-structure/', type: 'article' },
    ],
    interviewQuestions: [
      'Explain Kadane\'s Algorithm for maximum subarray sum.',
      'What is the two-pointer technique? Give an example.',
      'How does sliding window differ from brute force for substring problems?',
    ],
  },

  linkedlists: {
    topic: 'Linked Lists',
    skills: ['Linked Lists', 'Pointers', 'Fast & Slow Pointers'],
    resources: [
      { title: 'take U forward — Linked List Series', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0rAuz8tVcM0AymmhTRsfaLU', type: 'video' },
      { title: 'MyCodeSchool — Pointers & Linked Lists', url: 'https://www.youtube.com/playlist?list=PL2_aWCzGMAwLZp6LMUKI3cc7pgGsasm2_', type: 'video' },
      { title: 'LC #206 Reverse Linked List (Easy)', url: 'https://leetcode.com/problems/reverse-linked-list/', type: 'leetcode' },
      { title: 'LC #21 Merge Two Sorted Lists (Easy)', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', type: 'leetcode' },
      { title: 'LC #141 Linked List Cycle (Easy)', url: 'https://leetcode.com/problems/linked-list-cycle/', type: 'leetcode' },
      { title: 'LC #19 Remove Nth Node From End (Medium)', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', type: 'leetcode' },
      { title: 'GFG — Linked List Tutorial', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/', type: 'article' },
    ],
    interviewQuestions: [
      'How do you detect a cycle in a linked list? (Floyd\'s Algorithm)',
      'Reverse a linked list iteratively and recursively.',
      'Find the middle element of a linked list in one pass.',
    ],
  },

  stacksqueues: {
    topic: 'Stacks & Queues',
    skills: ['Stacks', 'Queues', 'Monotonic Stack'],
    resources: [
      { title: 'Abdul Bari — Stack & Queue', url: 'https://www.youtube.com/watch?v=rHQI4a7ZtEQ', type: 'video' },
      { title: 'NeetCode — Stack Problems', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53lfODGXrwYoOmfrwBhkCIP5l', type: 'video' },
      { title: 'LC #20 Valid Parentheses (Easy)', url: 'https://leetcode.com/problems/valid-parentheses/', type: 'leetcode' },
      { title: 'LC #155 Min Stack (Medium)', url: 'https://leetcode.com/problems/min-stack/', type: 'leetcode' },
      { title: 'LC #84 Largest Rectangle in Histogram (Hard)', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', type: 'leetcode' },
      { title: 'HackerRank — Stacks & Queues', url: 'https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=stacks', type: 'hackerrank' },
      { title: 'GFG — Stack Data Structure', url: 'https://www.geeksforgeeks.org/stack-data-structure/', type: 'article' },
    ],
    interviewQuestions: [
      'Implement a stack using two queues.',
      'What is a monotonic stack and where is it used?',
      'How would you evaluate a postfix expression?',
    ],
  },

  trees: {
    topic: 'Binary Trees & BST',
    skills: ['Trees', 'Binary Search Tree', 'Recursion', 'DFS', 'BFS'],
    resources: [
      { title: 'Abdul Bari — Trees Playlist', url: 'https://www.youtube.com/playlist?list=PLWKjhJtqVAbkso-IbgiiP48n-O-JQA9PJ', type: 'video' },
      { title: 'take U forward — Binary Trees', url: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0q8Hkd7bK2Bpryj2xVJk8Vk', type: 'video' },
      { title: 'LC #104 Max Depth of Binary Tree (Easy)', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', type: 'leetcode' },
      { title: 'LC #226 Invert Binary Tree (Easy)', url: 'https://leetcode.com/problems/invert-binary-tree/', type: 'leetcode' },
      { title: 'LC #102 Binary Tree Level Order Traversal (Medium)', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', type: 'leetcode' },
      { title: 'LC #98 Validate BST (Medium)', url: 'https://leetcode.com/problems/validate-binary-search-tree/', type: 'leetcode' },
      { title: 'GFG — Tree Traversals (Inorder, Preorder, Postorder)', url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/', type: 'article' },
    ],
    interviewQuestions: [
      'Difference between BFS and DFS in trees.',
      'Find the lowest common ancestor (LCA) of two nodes.',
      'Serialize and deserialize a binary tree.',
    ],
  },

  heaps: {
    topic: 'Heaps & Priority Queues',
    skills: ['Heaps', 'Priority Queue', 'Top-K Problems'],
    resources: [
      { title: 'Abdul Bari — Heap Data Structure', url: 'https://www.youtube.com/watch?v=t0Cq6tVNRBA', type: 'video' },
      { title: 'NeetCode — Heap / Priority Queue', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53lf5C3HSjCnyFghlW0G1HHXo', type: 'video' },
      { title: 'LC #215 Kth Largest Element (Medium)', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', type: 'leetcode' },
      { title: 'LC #347 Top K Frequent Elements (Medium)', url: 'https://leetcode.com/problems/top-k-frequent-elements/', type: 'leetcode' },
      { title: 'LC #295 Find Median from Data Stream (Hard)', url: 'https://leetcode.com/problems/find-median-from-data-stream/', type: 'leetcode' },
      { title: 'GFG — Heap Data Structure', url: 'https://www.geeksforgeeks.org/heap-data-structure/', type: 'article' },
    ],
    interviewQuestions: [
      'How does a min-heap differ from a max-heap?',
      'Find the K closest points to the origin.',
      'Merge K sorted lists using a heap.',
    ],
  },

  graphs: {
    topic: 'Graphs (BFS, DFS, Shortest Path)',
    skills: ['Graphs', 'BFS', 'DFS', 'Dijkstra', 'Topological Sort'],
    resources: [
      { title: 'William Fiset — Graph Theory Playlist', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93B', type: 'video' },
      { title: 'take U forward — Graph Series', url: 'https://takeuforward.org/graph/striver-graph-series-top-algorithms/', type: 'video' },
      { title: 'LC #200 Number of Islands (Medium)', url: 'https://leetcode.com/problems/number-of-islands/', type: 'leetcode' },
      { title: 'LC #133 Clone Graph (Medium)', url: 'https://leetcode.com/problems/clone-graph/', type: 'leetcode' },
      { title: 'LC #207 Course Schedule — Topological Sort (Medium)', url: 'https://leetcode.com/problems/course-schedule/', type: 'leetcode' },
      { title: 'LC #743 Network Delay Time — Dijkstra (Medium)', url: 'https://leetcode.com/problems/network-delay-time/', type: 'leetcode' },
      { title: 'HackerRank — Graph Theory', url: 'https://www.hackerrank.com/domains/algorithms?filters%5Bsubdomains%5D%5B%5D=graph-theory', type: 'hackerrank' },
      { title: 'GFG — BFS & DFS Traversals', url: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/', type: 'article' },
    ],
    interviewQuestions: [
      'Explain BFS vs DFS — when to use which?',
      'How does Dijkstra\'s algorithm work?',
      'What is topological sorting and where is it used?',
    ],
  },

  dp: {
    topic: 'Dynamic Programming',
    skills: ['Dynamic Programming', 'Memoization', 'Tabulation'],
    resources: [
      { title: 'Aditya Verma — DP Playlist (Best in Hindi)', url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go', type: 'video' },
      { title: 'NeetCode — Dynamic Programming', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53lcvx_yhUmtahl3kEvJhQ1Ar', type: 'video' },
      { title: 'LC #70 Climbing Stairs (Easy)', url: 'https://leetcode.com/problems/climbing-stairs/', type: 'leetcode' },
      { title: 'LC #322 Coin Change (Medium)', url: 'https://leetcode.com/problems/coin-change/', type: 'leetcode' },
      { title: 'LC #300 Longest Increasing Subsequence (Medium)', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', type: 'leetcode' },
      { title: 'LC #1143 Longest Common Subsequence (Medium)', url: 'https://leetcode.com/problems/longest-common-subsequence/', type: 'leetcode' },
      { title: 'LC DP Patterns Article', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns', type: 'article' },
      { title: 'GFG — Dynamic Programming', url: 'https://www.geeksforgeeks.org/dynamic-programming/', type: 'article' },
    ],
    interviewQuestions: [
      'What is the difference between memoization and tabulation?',
      'Solve the 0/1 Knapsack problem with DP.',
      'How do you identify if a problem can be solved with DP?',
    ],
  },

  greedy: {
    topic: 'Greedy Algorithms',
    skills: ['Greedy', 'Interval Scheduling', 'Optimization'],
    resources: [
      { title: 'Abdul Bari — Greedy Algorithms', url: 'https://www.youtube.com/watch?v=ARvQcqJ_-NY', type: 'video' },
      { title: 'LC #55 Jump Game (Medium)', url: 'https://leetcode.com/problems/jump-game/', type: 'leetcode' },
      { title: 'LC #435 Non-overlapping Intervals (Medium)', url: 'https://leetcode.com/problems/non-overlapping-intervals/', type: 'leetcode' },
      { title: 'LC #763 Partition Labels (Medium)', url: 'https://leetcode.com/problems/partition-labels/', type: 'leetcode' },
      { title: 'HackerEarth — Greedy Basics', url: 'https://www.hackerearth.com/practice/algorithms/greedy/basics-of-greedy-algorithms/tutorial/', type: 'article' },
      { title: 'GFG — Greedy Algorithms', url: 'https://www.geeksforgeeks.org/greedy-algorithms/', type: 'article' },
    ],
    interviewQuestions: [
      'Greedy vs DP — when should you use greedy?',
      'Activity selection / interval scheduling problem.',
      'Fractional Knapsack vs 0/1 Knapsack.',
    ],
  },

  binarysearch: {
    topic: 'Binary Search',
    skills: ['Binary Search', 'Search Space Reduction'],
    resources: [
      { title: 'NeetCode — Binary Search Playlist', url: 'https://www.youtube.com/playlist?list=PLot-Xpze53lePRBRjL0sBnl0p8DqYjIcq', type: 'video' },
      { title: 'LC #704 Binary Search (Easy)', url: 'https://leetcode.com/problems/binary-search/', type: 'leetcode' },
      { title: 'LC #33 Search in Rotated Array (Medium)', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', type: 'leetcode' },
      { title: 'LC #4 Median of Two Sorted Arrays (Hard)', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', type: 'leetcode' },
      { title: 'GFG — Binary Search', url: 'https://www.geeksforgeeks.org/binary-search/', type: 'article' },
    ],
    interviewQuestions: [
      'Binary search on answer — explain with an example.',
      'Search in a rotated sorted array.',
      'Find the first and last position of an element in sorted array.',
    ],
  },

  recursion: {
    topic: 'Recursion & Backtracking',
    skills: ['Recursion', 'Backtracking', 'Permutations', 'Subsets'],
    resources: [
      { title: 'Aditya Verma — Recursion Playlist', url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY', type: 'video' },
      { title: 'LC #46 Permutations (Medium)', url: 'https://leetcode.com/problems/permutations/', type: 'leetcode' },
      { title: 'LC #78 Subsets (Medium)', url: 'https://leetcode.com/problems/subsets/', type: 'leetcode' },
      { title: 'LC #51 N-Queens (Hard)', url: 'https://leetcode.com/problems/n-queens/', type: 'leetcode' },
      { title: 'GFG — Backtracking Algorithms', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/', type: 'article' },
    ],
    interviewQuestions: [
      'Generate all permutations of a string.',
      'Solve the N-Queens problem.',
      'Subset Sum problem using backtracking.',
    ],
  },

  // ───────────── SQL / DBMS ─────────────
  sql: {
    topic: 'SQL Mastery',
    skills: ['SQL', 'Joins', 'Group By', 'Subqueries', 'Window Functions'],
    resources: [
      { title: 'techTFQ — SQL for Beginners to Advanced', url: 'https://www.youtube.com/playlist?list=PLavw5C92dz9Ef4E-1Zi9KfCTXS_IN8gXZ', type: 'video' },
      { title: 'SQL — Complete Tutorial (4 hours)', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', type: 'video' },
      { title: 'HackerRank — SQL Practice (All Levels)', url: 'https://www.hackerrank.com/domains/sql', type: 'hackerrank' },
      { title: 'SQLZoo — Interactive SQL Exercises', url: 'https://sqlzoo.net/', type: 'link' },
      { title: 'LC Database Problems', url: 'https://leetcode.com/problemset/database/', type: 'leetcode' },
      { title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'article' },
      { title: 'GFG — SQL Tutorial', url: 'https://www.geeksforgeeks.org/sql-tutorial/', type: 'article' },
    ],
    interviewQuestions: [
      'Difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN.',
      'What are window functions? Explain ROW_NUMBER, RANK, DENSE_RANK.',
      'Write a query to find the second highest salary.',
    ],
  },

  dbms: {
    topic: 'DBMS Concepts',
    skills: ['DBMS', 'Normalization', 'Transactions', 'Indexing'],
    resources: [
      { title: 'Knowledge Gate — DBMS Full Course', url: 'https://www.youtube.com/playlist?list=PLmXKhU9FNesR1rSES7oLdJaNFgmujD5dR', type: 'video' },
      { title: 'Gate Smashers — DBMS', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y', type: 'video' },
      { title: 'GFG — DBMS Complete Guide', url: 'https://www.geeksforgeeks.org/dbms/', type: 'article' },
      { title: 'GFG — Normalization (1NF, 2NF, 3NF, BCNF)', url: 'https://www.geeksforgeeks.org/normal-forms-in-dbms/', type: 'article' },
    ],
    interviewQuestions: [
      'What is normalization? Explain 1NF through BCNF.',
      'ACID properties of transactions.',
      'Difference between clustered and non-clustered index.',
    ],
  },

  // ───────────── OS / CN ─────────────
  os: {
    topic: 'Operating Systems',
    skills: ['OS', 'Processes', 'Threads', 'Scheduling', 'Memory Management'],
    resources: [
      { title: 'Gate Smashers — OS Complete Playlist', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p', type: 'video' },
      { title: 'Neso Academy — Operating Systems', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAknUcp2z', type: 'video' },
      { title: 'GFG — OS Interview Questions', url: 'https://www.geeksforgeeks.org/commonly-asked-operating-systems-interview-questions/', type: 'article' },
      { title: 'GFG — OS Tutorial', url: 'https://www.geeksforgeeks.org/operating-systems/', type: 'article' },
    ],
    interviewQuestions: [
      'Process vs Thread — key differences.',
      'What is a deadlock? How to prevent it?',
      'Explain paging and virtual memory.',
    ],
  },

  cn: {
    topic: 'Computer Networks',
    skills: ['Networking', 'OSI Model', 'TCP/IP', 'HTTP', 'DNS'],
    resources: [
      { title: 'Neso Academy — Computer Networks', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAGOsZP4EQIvQFSxA7k', type: 'video' },
      { title: 'Gate Smashers — CN', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_', type: 'video' },
      { title: 'GFG — Computer Networks Tutorial', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/', type: 'article' },
    ],
    interviewQuestions: [
      'Explain the OSI model layers.',
      'TCP vs UDP — when to use which?',
      'What happens when you type a URL in the browser?',
    ],
  },

  // ───────────── OOP / Design ─────────────
  oops: {
    topic: 'Object Oriented Programming',
    skills: ['OOP', 'Classes', 'Inheritance', 'Polymorphism', 'Encapsulation'],
    resources: [
      { title: 'Kunal Kushwaha — OOP in Java (Complete)', url: 'https://www.youtube.com/watch?v=BSVKUk58K6U', type: 'video' },
      { title: 'LC — OOP Design Problems', url: 'https://leetcode.com/tag/design/', type: 'leetcode' },
      { title: 'Refactoring Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns', type: 'article' },
      { title: 'GFG — OOPs Concepts', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/', type: 'article' },
    ],
    interviewQuestions: [
      'Explain the 4 pillars of OOP with examples.',
      'Difference between abstract class and interface.',
      'What are SOLID principles?',
    ],
  },

  systemdesign: {
    topic: 'System Design',
    skills: ['System Design', 'HLD', 'LLD', 'Scalability', 'Load Balancing'],
    resources: [
      { title: 'Gaurav Sen — System Design Playlist', url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', type: 'video' },
      { title: 'System Design Primer (Alex Xu concepts)', url: 'https://github.com/donnemartin/system-design-primer', type: 'article' },
      { title: 'LLD Primer — Low-Level Design', url: 'https://github.com/prasadgujar/low-level-design-primer', type: 'article' },
      { title: 'Hussein Nasser — Backend Engineering', url: 'https://www.youtube.com/c/HusseinNasser-software-engineering', type: 'video' },
      { title: 'GFG — System Design Tutorial', url: 'https://www.geeksforgeeks.org/system-design-tutorial/', type: 'article' },
    ],
    interviewQuestions: [
      'Design a URL shortener like bit.ly.',
      'How would you design Twitter\'s feed?',
      'Explain horizontal vs vertical scaling.',
    ],
  },

  // ───────────── Web Dev / Full Stack ─────────────
  htmlcss: {
    topic: 'HTML, CSS & Responsive Design',
    skills: ['HTML', 'CSS', 'Flexbox', 'Grid', 'Responsive Design'],
    resources: [
      { title: 'FreeCodeCamp — Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'link' },
      { title: 'Kevin Powell — CSS Master', url: 'https://www.youtube.com/kepowob', type: 'video' },
      { title: 'GFG — HTML Tutorial', url: 'https://www.geeksforgeeks.org/html-tutorial/', type: 'article' },
    ],
    interviewQuestions: [
      'Explain the CSS Box Model.',
      'Flexbox vs Grid — when to use which?',
      'What is semantic HTML?',
    ],
  },

  javascript: {
    topic: 'JavaScript Fundamentals & ES6+',
    skills: ['JavaScript', 'ES6+', 'Closures', 'Promises', 'Async/Await'],
    resources: [
      { title: 'Namaste JavaScript — Akshay Saini', url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP', type: 'video' },
      { title: 'JavaScript.info — Modern JS Tutorial', url: 'https://javascript.info/', type: 'article' },
      { title: 'FreeCodeCamp — JS Algorithms', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'link' },
      { title: 'LC — JavaScript 30-Day Challenge', url: 'https://leetcode.com/studyplan/30-days-of-javascript/', type: 'leetcode' },
    ],
    interviewQuestions: [
      'Explain closures with an example.',
      'What is the event loop in JavaScript?',
      'Difference between var, let, and const.',
    ],
  },

  react: {
    topic: 'React.js',
    skills: ['React', 'Hooks', 'State Management', 'JSX', 'Components'],
    resources: [
      { title: 'React Official Tutorial', url: 'https://react.dev/learn', type: 'article' },
      { title: 'Codevolution — React Complete', url: 'https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3', type: 'video' },
      { title: 'React Hooks — Fireship', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q', type: 'video' },
      { title: 'GFG — ReactJS Tutorial', url: 'https://www.geeksforgeeks.org/react-tutorial/', type: 'article' },
    ],
    interviewQuestions: [
      'What are React Hooks? Explain useState and useEffect.',
      'Virtual DOM vs Real DOM.',
      'How does React reconciliation work?',
    ],
  },

  nodejs: {
    topic: 'Node.js & Express Backend',
    skills: ['Node.js', 'Express', 'REST APIs', 'Middleware'],
    resources: [
      { title: 'Traversy Media — Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', type: 'video' },
      { title: 'MDN — Express/Node Tutorial', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs', type: 'article' },
      { title: 'Build REST API — Academind', url: 'https://www.youtube.com/watch?v=pKd0Rpw7O48', type: 'video' },
      { title: 'GFG — Node.js Tutorial', url: 'https://www.geeksforgeeks.org/nodejs/', type: 'article' },
    ],
    interviewQuestions: [
      'What is the event loop in Node.js?',
      'How does middleware work in Express?',
      'REST vs GraphQL — pros and cons.',
    ],
  },

  mongodb: {
    topic: 'MongoDB & NoSQL',
    skills: ['MongoDB', 'NoSQL', 'Mongoose', 'Aggregation'],
    resources: [
      { title: 'MongoDB Official University (Free)', url: 'https://university.mongodb.com/', type: 'link' },
      { title: 'Net Ninja — MongoDB Crash Course', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA', type: 'video' },
      { title: 'MongoDB Basics Documentation', url: 'https://www.mongodb.com/basics', type: 'article' },
    ],
    interviewQuestions: [
      'SQL vs NoSQL — when to use which?',
      'What is sharding in MongoDB?',
      'Explain the aggregation pipeline.',
    ],
  },

  fullstack: {
    topic: 'Full Stack Project Building',
    skills: ['MERN Stack', 'Deployment', 'Git', 'CI/CD'],
    resources: [
      { title: 'Build a MERN App — JavaScript Mastery', url: 'https://www.youtube.com/watch?v=ngc9gnGgUdA', type: 'video' },
      { title: 'GitHub Pages / Vercel Deployment', url: 'https://vercel.com/docs', type: 'article' },
      { title: 'Learn Git Branching — Interactive', url: 'https://learngitbranching.js.org/', type: 'link' },
      { title: 'Docker — Crash Course', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', type: 'video' },
    ],
    interviewQuestions: [
      'Walk me through a full-stack app you built.',
      'How do you handle authentication in a MERN app?',
      'Explain CI/CD pipeline concepts.',
    ],
  },

  // ───────────── Aptitude / Soft Skills ─────────────
  aptitude: {
    topic: 'Quantitative Aptitude',
    skills: ['Aptitude', 'Math', 'Logic', 'Speed & Time', 'Probability'],
    resources: [
      { title: 'CareerRide — Aptitude Playlist', url: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt', type: 'video' },
      { title: 'IndiaBIX — Aptitude Practice', url: 'https://www.indiabix.com/aptitude/questions-and-answers/', type: 'link' },
      { title: 'Prepinsta — TCS/Infosys Aptitude', url: 'https://prepinsta.com/tcs-nqt/aptitude/', type: 'link' },
      { title: 'GFG — Aptitude for Placements', url: 'https://www.geeksforgeeks.org/aptitude-gq/', type: 'article' },
    ],
    interviewQuestions: [
      'A train crosses a 200m platform in 30s at 60 km/h. Find the length of the train.',
      'If 6 workers can complete a job in 12 days, how many days for 9 workers?',
      'Probability of getting at least one head in 3 coin tosses.',
    ],
  },

  reasoning: {
    topic: 'Logical Reasoning & Verbal Ability',
    skills: ['Logical Reasoning', 'Verbal Ability', 'Puzzles'],
    resources: [
      { title: 'IndiaBIX — Logical Reasoning', url: 'https://www.indiabix.com/logical-reasoning/questions-and-answers/', type: 'link' },
      { title: 'GFG — Verbal Ability', url: 'https://www.geeksforgeeks.org/verbal-ability/', type: 'article' },
      { title: 'Placement Preparation — Reasoning', url: 'https://www.youtube.com/results?search_query=logical+reasoning+for+placements', type: 'video' },
    ],
    interviewQuestions: [
      'If all A are B, and all B are C, are all A also C?',
      'Complete the series: 2, 6, 12, 20, 30, ?',
    ],
  },

  communication: {
    topic: 'Communication Skills & HR Prep',
    skills: ['Communication', 'Presentation', 'HR Interview', 'STAR Method'],
    resources: [
      { title: 'Top 50 HR Interview Questions — GFG', url: 'https://www.geeksforgeeks.org/hr-interview-questions/', type: 'article' },
      { title: 'STAR Method for Behavioral Interviews', url: 'https://www.youtube.com/watch?v=8PjwO2b_3oE', type: 'video' },
      { title: 'Resume Building — Harvard Template', url: 'https://www.youtube.com/watch?v=u75hUSShvnc', type: 'video' },
      { title: 'Pramp — Free Mock Interviews', url: 'https://www.pramp.com/', type: 'link' },
    ],
    interviewQuestions: [
      'Tell me about yourself (2-minute structured answer).',
      'Why should we hire you?',
      'Describe a time you faced a challenge and how you solved it.',
    ],
  },

  companyprep: {
    topic: 'Company-Specific Preparation',
    skills: ['Company Research', 'Previous Papers', 'Mock Tests'],
    resources: [
      { title: 'GFG — Company-wise Practice', url: 'https://practice.geeksforgeeks.org/company-tags', type: 'link' },
      { title: 'Striver\'s SDE Sheet', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', type: 'link' },
      { title: 'Blind 75 LeetCode — Must Do', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions', type: 'leetcode' },
      { title: 'InterviewBit — Practice', url: 'https://www.interviewbit.com/practice/', type: 'link' },
    ],
    interviewQuestions: [
      'Research: What products does your target company build?',
      'Mock: Complete 2 timed LeetCode contests.',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════
// Company-type curriculum templates — ordered topic keys
// These define WHICH topics appear and in WHAT ORDER for each type.
// ═══════════════════════════════════════════════════════════════════

const PRODUCT_CURRICULUM = [
  // Phase 1: Foundation (Weeks 1-12)
  'arrays', 'arrays', 'linkedlists', 'stacksqueues',
  'binarysearch', 'recursion', 'trees', 'trees',
  'heaps', 'graphs', 'graphs', 'dp',
  // Phase 2: Advanced (Weeks 13-24)
  'dp', 'dp', 'greedy', 'oops',
  'sql', 'dbms', 'os', 'cn',
  'systemdesign', 'systemdesign', 'companyprep', 'companyprep',
  // Phase 3: Deep Dive (Weeks 25-36)
  'arrays', 'linkedlists', 'trees', 'graphs',
  'dp', 'dp', 'systemdesign', 'systemdesign',
  'os', 'cn', 'dbms', 'oops',
  // Phase 4: Interview Ready (Weeks 37-48)
  'companyprep', 'companyprep', 'systemdesign', 'dp',
  'graphs', 'arrays', 'trees', 'communication',
  'companyprep', 'companyprep', 'companyprep', 'communication',
];

const SERVICE_CURRICULUM = [
  // Phase 1: Aptitude + Basics (Weeks 1-12)
  'aptitude', 'aptitude', 'reasoning', 'arrays',
  'arrays', 'linkedlists', 'stacksqueues', 'sql',
  'sql', 'oops', 'communication', 'communication',
  // Phase 2: Core CS (Weeks 13-24)
  'binarysearch', 'trees', 'dbms', 'dbms',
  'os', 'cn', 'javascript', 'htmlcss',
  'nodejs', 'aptitude', 'reasoning', 'communication',
  // Phase 3: Projects & Practice (Weeks 25-36)
  'react', 'nodejs', 'mongodb', 'fullstack',
  'sql', 'oops', 'dp', 'greedy',
  'aptitude', 'reasoning', 'companyprep', 'companyprep',
  // Phase 4: Final Prep (Weeks 37-48)
  'companyprep', 'companyprep', 'aptitude', 'reasoning',
  'communication', 'communication', 'sql', 'oops',
  'arrays', 'trees', 'companyprep', 'communication',
];

const STARTUP_CURRICULUM = [
  // Phase 1: Full Stack Foundation (Weeks 1-12)
  'htmlcss', 'javascript', 'javascript', 'react',
  'react', 'nodejs', 'nodejs', 'mongodb',
  'fullstack', 'fullstack', 'arrays', 'arrays',
  // Phase 2: Backend + DSA (Weeks 13-24)
  'linkedlists', 'stacksqueues', 'trees', 'graphs',
  'dp', 'sql', 'systemdesign', 'systemdesign',
  'oops', 'fullstack', 'fullstack', 'companyprep',
  // Phase 3: Advanced (Weeks 25-36)
  'binarysearch', 'recursion', 'heaps', 'dp',
  'graphs', 'systemdesign', 'os', 'cn',
  'dbms', 'fullstack', 'companyprep', 'companyprep',
  // Phase 4: Interview Ready (Weeks 37-48)
  'arrays', 'trees', 'dp', 'systemdesign',
  'companyprep', 'companyprep', 'communication', 'communication',
  'fullstack', 'companyprep', 'companyprep', 'communication',
];

module.exports = {
  TOPIC_RESOURCES,
  PRODUCT_CURRICULUM,
  SERVICE_CURRICULUM,
  STARTUP_CURRICULUM,
};
