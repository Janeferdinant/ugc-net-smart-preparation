/**
 * High-Yield UGC NET Formula Sheets & Concept Cheatsheets
 * Brand: Jane Rose | Asst. Professor | CSE
 */

export const FORMULA_DOMAINS = [
  {
    id: "discrete-math",
    title: "Unit 1: Discrete Structures & Optimization",
    subject: "Computer Science (Code 87)",
    icon: "📐",
    formulas: [
      {
        name: "Number of Surjections (Onto Functions)",
        formula: "N = \\sum_{k=0}^{n} (-1)^k \\binom{n}{k} (n - k)^m = n! \\cdot S(m, n)",
        plain: "N = sum_{k=0}^{n} (-1)^k * C(n, k) * (n - k)^m",
        explanation: "Counts total onto functions from domain with m elements to codomain with n elements. S(m, n) is the Stirling number of the second kind.",
        example: "For m=5, n=3: C(3,0)*3^5 - C(3,1)*2^5 + C(3,2)*1^5 = 243 - 96 + 3 = 150 functions."
      },
      {
        name: "Euler's Formula for Planar Graphs",
        formula: "V - E + R = 2",
        plain: "V - E + R = 2 (where R = number of regions/faces)",
        explanation: "For any connected planar simple graph. Also implies E <= 3V - 6 for V >= 3 (triangle-free: E <= 2V - 4).",
        example: "If a connected planar graph has 20 vertices and 30 edges, R = 2 - 20 + 30 = 12 faces."
      },
      {
        name: "Eulerian Circuit & Path Conditions",
        formula: "\\text{Circuit: } \\forall v \\in V, \\deg(v) \\equiv 0 \\pmod 2",
        plain: "Circuit: All vertices have EVEN degree. Path: Exactly 0 or 2 vertices have ODD degree.",
        explanation: "Complete bipartite graph K_{m,n} has an Eulerian circuit iff both m and n are even.",
        example: "K_{4,6} is Eulerian (m=4, n=6 both even). K_{3,4} is NOT Eulerian."
      }
    ]
  },
  {
    id: "comp-arch",
    title: "Unit 2: Computer Architecture & Pipelining",
    subject: "Computer Science (Code 87)",
    icon: "💻",
    formulas: [
      {
        name: "Pipelining Speedup Ratio",
        formula: "S_n = \\frac{n \\cdot \\sum t_i}{(k + n - 1) \\cdot (\\max(t_i) + d_r)}",
        plain: "S_n = (n * sum(t_i)) / ((k + n - 1) * (max(t_i) + d_r))",
        explanation: "Where k = number of pipeline stages, n = number of tasks, d_r = interface register delay. For large n, S -> sum(t_i) / max(t_i).",
        example: "4 stages (12, 15, 10, 14 ns) + 1 ns reg: Clock = 15 + 1 = 16 ns. Non-pipelined = 51 ns. For n=1000 tasks, S = (1000*51)/(1003*16) = 3.19."
      },
      {
        name: "Amdahl's Law for Parallel Processing",
        formula: "S = \\frac{1}{(1 - f) + \\frac{f}{p}}",
        plain: "Speedup = 1 / ((1 - f) + (f / p))",
        explanation: "Where f = fraction of program that is parallelizable, p = number of processors.",
        example: "If 80% is parallelized (f=0.8) on 4 cores (p=4): S = 1 / (0.2 + 0.8/4) = 1 / 0.4 = 2.5x speedup."
      },
      {
        name: "Average Memory Access Time (AMAT)",
        formula: "\\text{AMAT} = T_{\\text{hit}} + (\\text{Miss Rate} \\times T_{\\text{penalty}})",
        plain: "AMAT = Cache_Hit_Time + (Miss_Rate * Miss_Penalty)",
        explanation: "Calculates hierarchical memory latency including L1, L2, and main memory penalties.",
        example: "Hit time = 2 ns, Miss rate = 5%, Miss penalty = 100 ns -> AMAT = 2 + (0.05 * 100) = 7 ns."
      }
    ]
  },
  {
    id: "dbms",
    title: "Unit 4: Database Systems & Normalization",
    subject: "Computer Science (Code 87)",
    icon: "🗄️",
    formulas: [
      {
        name: "Lossless Join Decomposition Condition",
        formula: "(R_1 \\cap R_2 \\rightarrow R_1) \\lor (R_1 \\cap R_2 \\rightarrow R_2)",
        plain: "(R1 intersect R2 -> R1) OR (R1 intersect R2 -> R2)",
        explanation: "A binary decomposition of R into R1 and R2 is lossless if and only if their common attributes form a superkey in at least one of the sub-relations.",
        example: "R(A,B,C) with A->B decomposed to R1(A,B), R2(A,C). Common attribute is A. Since A->B, A is superkey of R1 -> Lossless!"
      },
      {
        name: "Normal Forms Hierarchy & Superkey Tests",
        formula: "\\text{BCNF} \\subset \\text{3NF} \\subset \\text{2NF} \\subset \\text{1NF}",
        plain: "1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: Every determinant X in X->Y must be a superkey.",
        explanation: "3NF allows X->Y if X is superkey OR Y is prime attribute. BCNF strictly requires X to be a superkey without exception.",
        example: "R(A,B,C) with AB->C, C->B. Keys: {AB}, {AC}. In 3NF because B is prime. NOT in BCNF because C is not a superkey."
      }
    ]
  },
  {
    id: "toc",
    title: "Unit 8: Theory of Computation Decidability Chart",
    subject: "Computer Science (Code 87)",
    icon: "⚙️",
    formulas: [
      {
        name: "Language Decidability Matrix",
        formula: "\\text{Regular: All Decidable} \\quad | \\quad \\text{CFL: Membership, Emptiness, Finiteness (Decidable)}",
        plain: "Regular: Membership(D), Emptiness(D), Equivalence(D), Disjointness(D). CFL: Membership(D), Emptiness(D), Finiteness(D) | Equivalence(U), Universality(U).",
        explanation: "Key questions on UGC NET test whether properties like Equivalence or Disjointness are decidable for CFLs (Answer: Undecidable).",
        example: "Is L1 = L2 decidable for CFGs? -> NO (Undecidable via Post Correspondence Problem reduction)."
      }
    ]
  },
  {
    id: "electronics",
    title: "Unit 1, 2 & 5: Electronic Science",
    subject: "Electronic Science (Code 88)",
    icon: "⚡",
    formulas: [
      {
        name: "Hall Effect Voltage & Coefficient",
        formula: "V_H = \\frac{I \\cdot B}{n \\cdot q \\cdot w}, \\quad R_H = \\frac{1}{n \\cdot q}",
        plain: "V_H = (I * B) / (n * q * w), R_H = 1 / (n * q)",
        explanation: "Determines carrier type (electrons have negative R_H, holes positive) and carrier concentration in semiconductors.",
        example: "Negative Hall coefficient indicates n-type majority electron conduction."
      },
      {
        name: "Operational Amplifier Noise Gain",
        formula: "A_{\\text{noise}} = 1 + \\frac{R_f}{R_1}",
        plain: "Noise Gain = 1 + (Rf / R1)",
        explanation: "Output offset voltage V_{out,os} = V_{os} * (1 + Rf/R1), applicable to BOTH inverting and non-inverting op-amp configurations.",
        example: "Rf=100k, R1=10k, Vos=2mV -> Vout,os = 2mV * (1 + 10) = 22 mV (NOT 20 mV!)."
      },
      {
        name: "Bandpass Nyquist Sampling",
        formula: "f_s = \\frac{2 \\cdot f_H}{n}, \\quad n = \\left\\lfloor \\frac{f_H}{B} \\right\\rfloor",
        plain: "f_s = 2*f_H / n where n = floor(f_H / Bandwidth)",
        explanation: "Allows sampling a bandpass signal at far below 2*f_H without aliasing (minimum rate = 2*B).",
        example: "Carrier fc=100 MHz, B=20 MHz -> f_H=110 MHz. n=floor(110/20)=5. Minimum fs = 2*20 = 40 MHz."
      }
    ]
  },
  {
    id: "paper1-logic",
    title: "Unit VI: Paper 1 Logical Reasoning & Pramanas",
    subject: "UGC NET Paper 1 (Code 00)",
    icon: "⚖️",
    formulas: [
      {
        name: "Classical Square of Opposition",
        formula: "A (All) \\leftrightarrow O (Some not) \\text{ [Contradictory]} \\quad | \\quad E (No) \\leftrightarrow I (Some) \\text{ [Contradictory]}",
        plain: "Contradictories (A & O, E & I): If one is True, the other MUST be False. Contraries (A & E): Cannot both be True, can both be False. Sub-contraries (I & O): Cannot both be False, can both be True.",
        explanation: "Square of Opposition is one of the most frequently asked concepts on Paper 1. Master the truth-value deductions.",
        example: "If 'All philosophers are fallible' (A) is TRUE, then 'Some philosophers are not fallible' (O) is immediately FALSE."
      },
      {
        name: "Nyaya Indian Logic Pramanas (6 Schools)",
        formula: "\\text{Nyaya accepts 4: Pratyaksha, Anumana, Upamana, Shabda}",
        plain: "Nyaya: 4 Pramanas. Vaisheshika & Buddhist: 2 (Pratyaksha, Anumana). Jain: 3. Samkhya & Yoga: 3. Advaita Vedanta & Mimamsa: 6 (adds Arthapatti & Anupalabddhi).",
        explanation: "Know which philosophical school accepts which means of valid knowledge (Pramanas).",
        example: "Arthapatti (postulation) is accepted by Mimamsa and Vedanta, but rejected as independent by Nyaya (who subsumes it under Anumana)."
      }
    ]
  }
];

export class FormulaSheetView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.activeDomainId = FORMULA_DOMAINS[0].id;
    this.render();
  }

  render() {
    const curDomain = FORMULA_DOMAINS.find(d => d.id === this.activeDomainId) || FORMULA_DOMAINS[0];

    this.container.innerHTML = `
      <div class="glass-panel p-5 sm:p-7 space-y-6">
        <div class="specular-highlight"></div>
        
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                High-Yield Revision Sheet
              </span>
              <span class="text-xs text-slate-400 font-mono">Exam Quick Formulas & Trap Rules</span>
            </div>
            <h2 class="text-xl font-bold text-white mt-1">Key Formulas, Equations & Axioms</h2>
            <p class="text-xs text-slate-300 mt-1">Concise mathematical summaries for rapid last-mile revision.</p>
          </div>
          <button onclick="window.print()" class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-mono transition flex items-center gap-1.5">
            <span>🖨️</span> Print / Export PDF
          </button>
        </div>

        <!-- Domain Tabs -->
        <div class="flex flex-wrap gap-2 pb-2 overflow-x-auto">
          ${FORMULA_DOMAINS.map(d => `
            <button data-domain-id="${d.id}" class="formula-tab-btn px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 ${
              d.id === this.activeDomainId
                ? 'bg-sky-500/20 border-sky-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }">
              <span>${d.icon}</span>
              <span>${d.title.split(':')[1]?.trim() || d.title}</span>
            </button>
          `).join('')}
        </div>

        <!-- Active Domain Formulas Grid -->
        <div class="space-y-4">
          <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <span class="text-xs font-mono font-bold text-sky-400">${curDomain.title}</span>
            <span class="text-[11px] text-slate-400 font-mono">${curDomain.subject}</span>
          </div>

          <div class="grid grid-cols-1 gap-4">
            ${curDomain.formulas.map((f, idx) => `
              <div class="glass-dense-card p-5 border border-slate-700/80 rounded-xl">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-xs font-mono flex items-center justify-center font-bold">
                      ${idx + 1}
                    </span>
                    ${f.name}
                  </h3>
                  <span class="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    High Yield
                  </span>
                </div>

                <!-- Formula Highlight Box -->
                <div class="p-3.5 my-2.5 rounded-lg bg-slate-950/90 border border-sky-500/30 text-center font-mono text-xs sm:text-sm text-sky-300 font-bold tracking-wide overflow-x-auto shadow-inner">
                  ${f.plain}
                </div>

                <p class="text-xs text-slate-300 leading-relaxed mb-2">${f.explanation}</p>

                <div class="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono">
                  <strong class="text-amber-400">Exam Application:</strong> ${f.example}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-mono">
          Jane Rose | Asst. Professor | CSE — Official Revision Notes Repository
        </div>
      </div>
    `;

    // Bind tab clicks
    this.container.querySelectorAll('.formula-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeDomainId = e.currentTarget.getAttribute('data-domain-id');
        this.render();
      });
    });
  }
}
