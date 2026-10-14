# UGC NET Subject 87: Computer Science and Applications
## Core High-Yield Revision Notes & Exam Summaries
**Faculty:** Jane Rose | Asst. Professor | CSE  
**Scheme:** 100 Compulsory Questions • 200 Marks • Duration: 2 Hours

---

### Unit 1: Discrete Structures and Optimization
- **Counting & Surjections:**
  - Total onto functions from $m$ elements to $n$ elements: $N = \sum_{k=0}^{n} (-1)^k \binom{n}{k} (n-k)^m = n! \cdot S(m, n)$.
  - Pigeonhole Principle: If $n$ items put into $k$ pigeonholes, at least one hole has $\lceil n/k \rceil$ items.
- **Graph Theory:**
  - Eulerian Circuit: Connected graph where ALL vertices have even degree.
  - Eulerian Path: Connected graph with exactly 0 or 2 vertices of odd degree.
  - Handshaking Theorem: $\sum \deg(v) = 2 |E|$. Sum of degrees is always even; number of odd degree vertices is always even.
  - Planar Graphs: $V - E + F = 2$. Maximum edges $E \le 3V - 6$ for $V \ge 3$.
- **LPP & Simplex:**
  - Dual of Primal: If primal is Maximize $c^T x$ subject to $Ax \le b, x \ge 0$, dual is Minimize $b^T y$ subject to $A^T y \ge c, y \ge 0$.

---

### Unit 2: Computer System Architecture
- **Instruction Pipelining:**
  - Clock cycle time: $t_{clock} = \max(t_i) + d_r$ (bottleneck stage delay + register latch delay).
  - Pipelined time for $n$ tasks: $T_k = (k + n - 1) \cdot t_{clock}$.
  - Non-pipelined time: $T_1 = n \cdot \sum t_i$.
  - Speedup $S = \frac{T_1}{T_k} \xrightarrow{n \to \infty} \frac{\sum t_i}{t_{clock}}$.
- **Cache Memory Mapping:**
  - *Direct Mapping:* Block $j$ maps to cache line $(j \bmod M)$. Simple, fast, but suffers from conflict misses.
  - *Fully Associative:* Block can go into any line. Eliminates conflict misses, requires associative comparator hardware.
  - *Set-Associative:* Block maps to set $(j \bmod S)$. Balance of cost and hit rate.

---

### Unit 4: Database Management Systems
- **Functional Dependencies & Normalization:**
  - **1NF:** Atomic attribute domains (no repeating groups).
  - **2NF:** 1NF + No partial dependencies (no non-prime attribute dependent on a proper subset of candidate key).
  - **3NF:** 2NF + For every non-trivial $X \to Y$, either $X$ is a superkey OR $Y$ is a prime attribute.
  - **BCNF:** For every non-trivial $X \to Y$, $X$ MUST be a superkey.
- **Decomposition Theorems:**
  - Lossless Join: A decomposition of $R$ into $(R_1, R_2)$ is lossless iff $(R_1 \cap R_2) \to R_1$ or $(R_1 \cap R_2) \to R_2$.
- **Concurrency Control:**
  - Two-Phase Locking (2PL): Growing phase (acquire locks), Shrinking phase (release locks). Guarantees serializability.
  - Strict 2PL: Holds all exclusive locks until transaction commits or aborts. Avoids cascading aborts.

---

### Unit 8: Theory of Computation and Compilers
- **Chomsky Hierarchy:**
  - Type 3 (Regular) $\subset$ Type 2 (Context-Free) $\subset$ Type 1 (Context-Sensitive) $\subset$ Type 0 (Recursively Enumerable).
- **Decidability Summary Table:**
  | Property | Regular | Context-Free (CFL) | CSL | Recursive | Recursively Enumerable |
  |:---|:---:|:---:|:---:|:---:|:---:|
  | **Membership ($w \in L$)** | **D** | **D** (CYK) | **D** | **D** | **U** |
  | **Emptiness ($L = \emptyset$)** | **D** | **D** | **U** | **U** | **U** |
  | **Finiteness** | **D** | **D** | **U** | **U** | **U** |
  | **Equivalence ($L_1 = L_2$)** | **D** | **U** | **U** | **U** | **U** |
  | **Universality ($L = \Sigma^*$)** | **D** | **U** | **U** | **U** | **U** |
  | **Disjointness ($L_1 \cap L_2 = \emptyset$)** | **D** | **U** | **U** | **U** | **U** |
  *(D = Decidable, U = Undecidable)*

---
**Jane Rose | Asst. Professor | CSE**
