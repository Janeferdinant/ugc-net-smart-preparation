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
          <div id="kg-node-drawer" class="hidden absolute top-4 right-4 w-72 max-w-[90%] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl z-20">
            <div class="flex justify-between items-start mb-2">
              <span id="kg-drawer-badge" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">Unit</span>
              <button id="kg-drawer-close" class="text-slate-400 hover:text-white text-sm">✕</button>
            </div>
            <h4 id="kg-drawer-title" class="text-sm font-bold text-white mb-2 leading-tight">Title</h4>
            <p id="kg-drawer-desc" class="text-xs text-slate-300 mb-3 leading-relaxed">Description</p>
            <div class="flex gap-2">
              <button id="kg-drawer-action" class="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition">
                Explore Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async fetchGraphData() {
    try {
      const res = await fetch(`/api/knowledge-graph/${this.subjectId}`);
      if (res.ok) {
        const data = await res.json();
        this.nodes = data.nodes || [];
        this.links = data.links || [];
      }
    } catch (e) {
      console.warn("Could not fetch graph from API, generating client fallback", e);
    }

    if (this.nodes.length === 0) {
      // High-quality client fallback
      this.nodes = [
        { id: "root", label: "UGC NET Computer Science", group: "root", size: 28, color: "#3B82F6", x: 300, y: 220 },
        { id: "u1", label: "Discrete Structures & Opt", group: "unit", size: 20, color: "#10B981", x: 180, y: 120 },
        { id: "u2", label: "Computer Architecture", group: "unit", size: 20, color: "#10B981", x: 420, y: 120 },
        { id: "u4", label: "Database Systems (DBMS)", group: "unit", size: 20, color: "#10B981", x: 160, y: 320 },
        { id: "u8", label: "Theory of Computation", group: "unit", size: 20, color: "#10B981", x: 440, y: 320 },
        { id: "u10", label: "Artificial Intelligence", group: "unit", size: 20, color: "#10B981", x: 300, y: 400 },
        { id: "t1", label: "Graph Theory & Euler Paths", group: "topic", size: 13, color: "#A855F7", x: 80, y: 80 },
        { id: "t2", label: "BCNF Normalization", group: "topic", size: 13, color: "#A855F7", x: 80, y: 360 },
        { id: "t3", label: "Turing Decidability", group: "topic", size: 13, color: "#A855F7", x: 520, y: 360 },
        { id: "t4", label: "A* Search & Admissibility", group: "topic", size: 13, color: "#A855F7", x: 300, y: 470 }
      ];
      this.links = [
        { source: "root", target: "u1" }, { source: "root", target: "u2" },
        { source: "root", target: "u4" }, { source: "root", target: "u8" },
        { source: "root", target: "u10" },
        { source: "u1", target: "t1" }, { source: "u4", target: "t2" },
        { source: "u8", target: "t3" }, { source: "u10", target: "t4" }
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

    if (drawer && badge && title && desc) {
      badge.textContent = node.group.toUpperCase();
      title.textContent = node.full_title || node.label;
      desc.textContent = `Official syllabus topic linked with verified UGC NET previous year questions, solutions, and conceptual formulas.`;
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
