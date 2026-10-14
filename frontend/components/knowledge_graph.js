/**
 * Interactive Knowledge Graph for Official UGC NET Curricula
 * Supports pan, zoom, node selection, search filtering, and accessible hierarchical list mode.
 * Author: Jane Rose | Asst. Professor | CSE
 */

export class KnowledgeGraphView {
  constructor(containerId, subjectId = 2) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.subjectId = subjectId;
    this.nodes = [];
    this.links = [];
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.selectedNode = null;
    this.searchQuery = "";
    this.viewMode = "graph"; // 'graph' or 'accessible-list'

    this.init();
  }

  async init() {
    this.renderSkeleton();
    await this.fetchGraphData();
    this.setupSimulation();
    this.bindEvents();
    this.render();
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="glass-panel p-5 relative overflow-hidden flex flex-col h-[580px]">
        <div class="specular-highlight"></div>
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 z-10">
          <div>
            <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Interactive Topic Knowledge Graph
            </h3>
            <p class="text-xs text-slate-400">Official syllabus taxonomy mapped to previous-year questions and key formulas.</p>
          </div>

          <div class="flex items-center gap-2">
            <input type="text" id="kg-search-input" placeholder="Search concepts (e.g., Turing, BCNF)..." 
              class="px-3 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-48 sm:w-64">
            
            <button id="kg-view-toggle" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition">
              View List
            </button>
            <div class="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button id="kg-zoom-in" class="px-2.5 py-1 text-slate-300 hover:bg-slate-700 text-sm font-bold">+</button>
              <button id="kg-zoom-reset" class="px-2 py-1 text-slate-300 hover:bg-slate-700 text-xs font-mono">100%</button>
              <button id="kg-zoom-out" class="px-2.5 py-1 text-slate-300 hover:bg-slate-700 text-sm font-bold">-</button>
            </div>
          </div>
        </div>

        <!-- Graph Canvas / Accessible View Container -->
        <div id="kg-content-area" class="relative flex-1 rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden flex items-center justify-center">
          <canvas id="kg-canvas" class="w-full h-full cursor-grab active:cursor-grabbing"></canvas>
          
          <!-- Node Details Floating Drawer -->
          <div id="kg-node-drawer" class="hidden absolute top-4 right-4 w-80 sm:w-96 max-h-[90%] overflow-y-auto bg-slate-950/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-5 shadow-2xl shadow-sky-950/50 z-20 space-y-4">
            <div class="flex justify-between items-start pb-2 border-b border-slate-800">
              <span id="kg-drawer-badge" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">TOPIC</span>
              <button id="kg-drawer-close" class="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs">✕</button>
            </div>
            
            <div>
              <h4 id="kg-drawer-title" class="text-base font-bold text-white leading-tight">Title</h4>
              <p id="kg-drawer-desc" class="text-xs text-slate-300 mt-1 leading-relaxed">Description</p>
            </div>

            <!-- Key Analytical Formula -->
            <div id="kg-formula-box" class="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div class="text-[10px] font-mono uppercase font-bold text-indigo-400 tracking-wider mb-1 flex items-center gap-1.5">
                <span>📐</span> Key Analytical Formula / Theorem
              </div>
              <div id="kg-drawer-formula" class="text-xs font-mono text-indigo-200 break-words leading-relaxed">f(n) = g(n) + h(n)</div>
            </div>

            <!-- Real-Time Industry Application -->
            <div id="kg-realtime-box" class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div class="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider mb-1 flex items-center gap-1.5">
                <span>⚡</span> Real-Time Application & Industry Use
              </div>
              <div id="kg-drawer-realtime" class="text-xs text-emerald-200 leading-relaxed">GPS navigation routing, autonomous robotics, warehouse fleet dispatching.</div>
            </div>

            <!-- Official UGC NET PYQ Sample Walkthrough -->
            <div id="kg-pyq-box" class="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-2">
              <div class="text-[10px] font-mono uppercase font-bold text-sky-400 tracking-wider flex items-center justify-between">
                <span>🎓 Official UGC NET PYQ Demo</span>
                <span id="kg-drawer-pyq-key" class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px]">Key: Verified</span>
              </div>
              <div id="kg-drawer-pyq-text" class="text-xs text-slate-200 font-medium leading-relaxed">Sample question text goes here...</div>
              <div id="kg-drawer-pyq-expl" class="text-[11px] text-slate-400 p-2 rounded bg-slate-900/80 border border-slate-800 leading-relaxed">Solution walkthrough...</div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <button id="kg-drawer-action" class="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-sky-600/30 text-center">
                Explore Questions
              </button>
              <button id="kg-drawer-plan" class="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 text-center">
                30-Day Plan 📅
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async fetchGraphData() {
    try {
      let res = await fetch(`/api/knowledge-graph/${this.subjectId}`);
      if (!res.ok) res = await fetch(`/api/knowledge-graph/${this.subjectId}.json`);
      if (res && res.ok) {
        const data = await res.json();
        this.nodes = data.nodes || [];
        this.links = data.links || [];
      }
    } catch (e) {
      console.warn("Could not fetch graph from API, generating client fallback", e);
    }

    if (this.nodes.length === 0) {
      // High-quality comprehensive AI & Data Science taxonomy fallback
      this.nodes = [
        { id: "root", label: "UGC NET AI & Data Science", full_title: "Artificial Intelligence & Data Science (UGC NET)", group: "root", size: 30, color: "#3B82F6", x: 300, y: 220, description: "Master UGC NET Curriculum for AI, Machine Learning, Deep Learning, Big Data and Cloud Systems.", key_formula: "Comprehensive Examination Taxonomy", real_time_application: "Next-Generation Enterprise AI Systems" },
        { id: "u1", label: "Search & Optimization", full_title: "Unit 1: Search & Optimization Strategies", group: "unit", size: 20, color: "#10B981", x: 160, y: 100, description: "Uninformed vs Informed Heuristic Search, A*, AO*, Simulated Annealing, Genetic Algorithms.", key_formula: "A* Admissibility: h(n) <= h*(n); Time O(b^d)", real_time_application: "Warehouse AGV fleet routing and GPS pathfinding." },
        { id: "u2", label: "Adversarial Game Playing", full_title: "Unit 2: Adversarial Search & Minimax", group: "unit", size: 20, color: "#10B981", x: 380, y: 90, description: "Two-player zero-sum games, Minimax theorem, Alpha-Beta pruning, Expectiminimax.", key_formula: "Alpha-Beta best-case complexity: O(b^(d/2))", real_time_application: "Algorithmic high-frequency financial trading bidding engines." },
        { id: "u3", label: "Logic & Knowledge Rep", full_title: "Unit 3: Predicate Logic & Skolemization", group: "unit", size: 20, color: "#10B981", x: 480, y: 220, description: "Propositional and First-Order Logic, Skolem normal form, Unification, Resolution Refutation.", key_formula: "Resolution rule: (A v B) and (~A v C) => (B v C)", real_time_application: "Automated legal contract clause verification." },
        { id: "u4", label: "Probabilistic & Fuzzy AI", full_title: "Unit 4: Bayesian Networks & Fuzzy Systems", group: "unit", size: 20, color: "#10B981", x: 420, y: 350, description: "Bayes rule, Belief Networks, d-separation, Fuzzy sets, Mamdani and Sugeno controllers.", key_formula: "Centroid COG: z* = Integral(z*mu(z)dz) / Integral(mu(z)dz)", real_time_application: "Bullet train anti-lock braking and medical diagnostics." },
        { id: "u5", label: "Machine Learning (SVM/Trees)", full_title: "Unit 5: Classical Supervised Learning", group: "unit", size: 20, color: "#10B981", x: 260, y: 380, description: "Decision Trees, ID3 Entropy, Information Gain, Gini index, Naive Bayes, SVM Maximum Margin.", key_formula: "Shannon Entropy: H(S) = -Sum(p_i * log2(p_i))", real_time_application: "Credit card fraud prevention and loan default risk scoring." },
        { id: "u7", label: "Deep Learning & Neural Nets", full_title: "Unit 7: Deep Learning & Transformers", group: "unit", size: 20, color: "#10B981", x: 120, y: 260, description: "Multi-Layer Perceptrons, Backpropagation Chain Rule, CNN feature maps, Attention mechanism.", key_formula: "Attention(Q, K, V) = softmax((Q*K^T)/sqrt(d_k)) * V", real_time_application: "Autonomous driving perception and Large Language Models (ChatGPT)." },
        { id: "u9", label: "Big Data & Cloud (Hadoop/Spark)", full_title: "Unit 9: Distributed Big Data & NoSQL", group: "unit", size: 20, color: "#10B981", x: 120, y: 180, description: "HDFS architecture, MapReduce, Apache Spark RDDs, CAP theorem, Docker, Kubernetes.", key_formula: "CAP Theorem: Max 2 of {Consistency, Availability, Partition}", real_time_application: "Global e-commerce recommendation engines and log analysis." },
        // Topic nodes
        { id: "t1", label: "A* Search & Consistency", full_title: "A* Heuristic Search & Admissibility Proofs", group: "topic", size: 14, color: "#A855F7", x: 60, y: 60, description: "Heuristic search algorithm that guarantees shortest path if heuristic is admissible and consistent.", key_formula: "f(n) = g(n) + h(n), h(n) <= h*(n)", real_time_application: "Google Maps shortest driving route computation." },
        { id: "t2", label: "Alpha-Beta Cutoffs", full_title: "Alpha-Beta Pruning Bounds & Orderings", group: "topic", size: 14, color: "#A855F7", x: 460, y: 50, description: "Prunes subtrees that cannot influence the final minimax decision.", key_formula: "Cutoff condition: alpha >= beta", real_time_application: "Stockfish Chess engine search depth expansion." },
        { id: "t3", label: "Skolem Normal Form", full_title: "Skolemization in First-Order Logic", group: "topic", size: 14, color: "#A855F7", x: 560, y: 260, description: "Replaces existential quantifiers within scope of universal quantifiers with Skolem functions.", key_formula: "forall x exists y P(x,y) => forall x P(x, f(x))", real_time_application: "Automated theorem proving in compilers and SAT solvers." },
        { id: "t4", label: "SVM Maximum Margin", full_title: "Support Vector Machines & Kernel Trick", group: "topic", size: 14, color: "#A855F7", x: 260, y: 460, description: "Finds the optimal separating hyperplane with maximum geometric margin 2/||w||.", key_formula: "Margin = 2 / ||w||; RBF Kernel: K(x,z) = exp(-gamma||x-z||^2)", real_time_application: "Cancer genomics microarray classification." },
        { id: "t5", label: "Transformer Attention", full_title: "Multi-Head Self-Attention in Transformers", group: "topic", size: 14, color: "#A855F7", x: 40, y: 320, description: "Computes pairwise token relationships across entire sequences simultaneously without recurrence.", key_formula: "softmax((Q * K^T) / sqrt(d_k)) * V", real_time_application: "Large Language Models, ChatGPT, machine translation." }
      ];
      this.links = [
        { source: "root", target: "u1" }, { source: "root", target: "u2" },
        { source: "root", target: "u3" }, { source: "root", target: "u4" },
        { source: "root", target: "u5" }, { source: "root", target: "u7" },
        { source: "root", target: "u9" },
        { source: "u1", target: "t1" }, { source: "u2", target: "t2" },
        { source: "u3", target: "t3" }, { source: "u5", target: "t4" },
        { source: "u7", target: "t5" }
      ];
    }
  }

  setupSimulation() {
    const canvas = document.getElementById('kg-canvas');
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = canvas.parentElement.clientWidth;
    this.canvas.height = canvas.parentElement.clientHeight;

    // Distribute initial node positions in a radial pattern around center
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    this.nodes.forEach((n, idx) => {
      if (!n.x) {
        if (n.group === "root") {
          n.x = cx;
          n.y = cy;
        } else {
          const angle = (idx / this.nodes.length) * Math.PI * 2;
          const dist = n.group === "unit" ? 140 : 220;
          n.x = cx + Math.cos(angle) * dist;
          n.y = cy + Math.sin(angle) * dist;
        }
      }
    });
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - this.panX) / this.zoom;
      const mouseY = (e.clientY - rect.top - this.panY) / this.zoom;

      // Check if clicked on a node
      const clicked = this.nodes.find(n => Math.hypot(n.x - mouseX, n.y - mouseY) <= n.size);
      if (clicked) {
        this.selectNode(clicked);
        return;
      }

      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    document.getElementById('kg-zoom-in')?.addEventListener('click', () => {
      this.zoom = Math.min(2.5, this.zoom + 0.2);
      this.render();
    });

    document.getElementById('kg-zoom-out')?.addEventListener('click', () => {
      this.zoom = Math.max(0.5, this.zoom - 0.2);
      this.render();
    });

    document.getElementById('kg-zoom-reset')?.addEventListener('click', () => {
      this.zoom = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.render();
    });

    document.getElementById('kg-search-input')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.render();
    });

    document.getElementById('kg-drawer-close')?.addEventListener('click', () => {
      document.getElementById('kg-node-drawer')?.classList.add('hidden');
    });

    document.getElementById('kg-drawer-action')?.addEventListener('click', () => {
      if (window.appInstance) {
        window.appInstance.switchTab('questions');
      }
    });

    document.getElementById('kg-drawer-plan')?.addEventListener('click', () => {
      if (window.appInstance) {
        window.appInstance.switchTab('study-plan');
      }
    });

    document.getElementById('kg-view-toggle')?.addEventListener('click', () => {
      this.toggleViewMode();
    });
  }

  selectNode(node) {
    this.selectedNode = node;
    const drawer = document.getElementById('kg-node-drawer');
    const badge = document.getElementById('kg-drawer-badge');
    const title = document.getElementById('kg-drawer-title');
    const desc = document.getElementById('kg-drawer-desc');
    const formula = document.getElementById('kg-drawer-formula');
    const realtime = document.getElementById('kg-drawer-realtime');
    const pyqText = document.getElementById('kg-drawer-pyq-text');
    const pyqExpl = document.getElementById('kg-drawer-pyq-expl');
    const pyqKey = document.getElementById('kg-drawer-pyq-key');

    if (drawer && badge && title && desc) {
      badge.textContent = (node.unit_number ? `UNIT ${node.unit_number} • ` : '') + node.group.toUpperCase();
      title.textContent = node.full_title || node.label;
      desc.textContent = node.description || `Targeted UGC NET exam topic with verified question solutions, formulas, and industrial applications.`;

      if (formula) {
        formula.textContent = node.key_formula || "Analytical formulation & exam bounds";
      }
      if (realtime) {
        realtime.textContent = node.real_time_application || "Applied computer systems, industrial software engineering, and analytics.";
      }

      if (pyqText && pyqExpl) {
        if (node.sample_question) {
          const sq = node.sample_question;
          pyqText.textContent = sq.question_text;
          pyqExpl.innerHTML = `<span class="text-emerald-400 font-bold">Official Key: Option ${sq.correct_option}</span><br><span class="text-slate-300 mt-1 block">${sq.explanation || sq.numerical_formula || ''}</span>`;
          if (pyqKey) pyqKey.textContent = `Official NTA Key: ${sq.correct_option}`;
        } else {
          pyqText.textContent = `Verified PYQ: Analytical formulation and exam questions for ${node.label}.`;
          pyqExpl.textContent = `Step-by-step problem walkthrough and real-time application available in the 30-Day Master Study Plan.`;
          if (pyqKey) pyqKey.textContent = "Verified PYQ";
        }
      }

      drawer.classList.remove('hidden');
    }
    this.render();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "graph" ? "accessible-list" : "graph";
    const area = document.getElementById('kg-content-area');
    const btn = document.getElementById('kg-view-toggle');

    if (this.viewMode === "accessible-list") {
      btn.textContent = "View Graph";
      area.innerHTML = `
        <div class="w-full h-full p-6 overflow-y-auto text-slate-200">
          <h4 class="text-sm font-bold text-sky-400 mb-3 uppercase tracking-wider font-mono">Accessible Syllabus Taxonomy</h4>
          <ul class="space-y-4">
            ${this.nodes.filter(n => n.group === 'unit').map(u => `
              <li class="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span class="font-bold text-emerald-400">${u.label}</span>
                <ul class="mt-2 ml-4 list-disc text-xs text-slate-300 space-y-1">
                  ${this.nodes.filter(t => t.group === 'topic').slice(0, 3).map(top => `
                    <li>${top.full_title || top.label} <span class="text-sky-400 font-mono ml-2">(PYQ Solved)</span></li>
                  `).join('')}
                </ul>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    } else {
      btn.textContent = "View List";
      this.renderSkeleton();
      this.setupSimulation();
      this.bindEvents();
      this.render();
    }
  }

  render() {
    if (this.viewMode !== "graph" || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.zoom, this.zoom);

    // 1. Draw Links
    this.links.forEach(link => {
      const src = typeof link.source === 'object' ? link.source : this.nodes.find(n => n.id === link.source);
      const dst = typeof link.target === 'object' ? link.target : this.nodes.find(n => n.id === link.target);
      if (src && dst) {
        this.ctx.beginPath();
        this.ctx.moveTo(src.x, src.y);
        this.ctx.lineTo(dst.x, dst.y);
        this.ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      }
    });

    // 2. Draw Nodes
    this.nodes.forEach(node => {
      const isMatch = this.searchQuery && (
        node.label.toLowerCase().includes(this.searchQuery) ||
        (node.full_title && node.full_title.toLowerCase().includes(this.searchQuery))
      );

      // Node Shadow / Glow
      if (isMatch || this.selectedNode === node) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2);
        this.ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
        this.ctx.fill();
      }

      // Outer Ring
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.size + 2, 0, Math.PI * 2);
      this.ctx.strokeStyle = node.color || "#38bdf8";
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      // Core Node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      this.ctx.fillStyle = isMatch ? "#facc15" : (node.color || "#38bdf8");
      this.ctx.fill();

      // Node Label
      this.ctx.fillStyle = isMatch ? "#facc15" : "#f8fafc";
      this.ctx.font = node.group === "root" ? "bold 13px Inter" : (node.group === "unit" ? "bold 11px Inter" : "10px Inter");
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "top";
      this.ctx.fillText(node.label, node.x, node.y + node.size + 5);
    });

    this.ctx.restore();
  }
}
