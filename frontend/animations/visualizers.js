/**
 * Educational Interactive Concept Visualizers:
 * 1. 3D/Isometric Neural Network Signal Flow
 * 2. Algorithm Step-by-Step Traversal (Dijkstra / QuickSort)
 * 3. Digital Logic Circuit & Gate Simulator
 * Author: Jane Rose | Asst. Professor | CSE
 */

export class NeuralNetworkVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.layers = [4, 6, 6, 3]; // Input -> 2 Hidden -> Output
    this.neurons = [];
    this.signals = [];
    this.isPaused = false;
    this.animId = null;

    this.initNetwork();
    this.animate();
  }

  initNetwork() {
    this.width = this.canvas.width = this.canvas.parentElement.clientWidth || 600;
    this.height = this.canvas.height = 340;
    this.neurons = [];

    const layerSpacing = (this.width - 120) / (this.layers.length - 1);
    this.layers.forEach((count, lIdx) => {
      const x = 60 + lIdx * layerSpacing;
      const verticalSpacing = (this.height - 80) / (count + 1);
      const layerNeurons = [];
      for (let nIdx = 0; nIdx < count; nIdx++) {
        layerNeurons.push({
          x,
          y: 40 + (nIdx + 1) * verticalSpacing,
          radius: 12,
          activation: Math.random() * 0.8 + 0.2,
          label: lIdx === 0 ? `x${nIdx+1}` : (lIdx === this.layers.length - 1 ? `y${nIdx+1}` : `h${lIdx},${nIdx+1}`)
        });
      }
      this.neurons.push(layerNeurons);
    });
  }

  animate() {
    if (this.isPaused) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Randomly spawn forward propagating signal pulses
    if (Math.random() < 0.08) {
      const startLayer = Math.floor(Math.random() * (this.layers.length - 1));
      const startNeuron = Math.floor(Math.random() * this.layers[startLayer]);
      const endNeuron = Math.floor(Math.random() * this.layers[startLayer + 1]);
      this.signals.push({
        from: this.neurons[startLayer][startNeuron],
        to: this.neurons[startLayer + 1][endNeuron],
        progress: 0.0,
        speed: 0.02 + Math.random() * 0.02
      });
    }

    // 1. Draw Synaptic Weights / Connections
    for (let l = 0; l < this.neurons.length - 1; l++) {
      for (let src of this.neurons[l]) {
        for (let dst of this.neurons[l + 1]) {
          this.ctx.beginPath();
          this.ctx.moveTo(src.x, src.y);
          this.ctx.lineTo(dst.x, dst.y);
          this.ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // 2. Animate Signal Pulses
    for (let i = this.signals.length - 1; i >= 0; i--) {
      const s = this.signals[i];
      s.progress += s.speed;
      if (s.progress >= 1.0) {
        this.signals.splice(i, 1);
        continue;
      }
      const curX = s.from.x + (s.to.x - s.from.x) * s.progress;
      const curY = s.from.y + (s.to.y - s.from.y) * s.progress;

      this.ctx.beginPath();
      this.ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = "#38bdf8";
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = "#38bdf8";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 3. Draw Neurons
    this.neurons.forEach((layer, lIdx) => {
      layer.forEach((n) => {
        // Outer halo
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
        this.ctx.fillStyle = lIdx === 0 ? "rgba(59, 130, 246, 0.2)" : (lIdx === this.layers.length - 1 ? "rgba(16, 185, 129, 0.2)" : "rgba(168, 85, 247, 0.2)");
        this.ctx.fill();

        // Core neuron
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = lIdx === 0 ? "#3b82f6" : (lIdx === this.layers.length - 1 ? "#10b981" : "#a855f7");
        this.ctx.fill();
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        // Label
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "9px JetBrains Mono, monospace";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(n.label, n.x, n.y);
      });
    });

    this.animId = requestAnimationFrame(() => this.animate());
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) this.animate();
  }
}

export class LogicGateSimulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.state = {
      gate: 'XOR',
      inputA: 1,
      inputB: 0
    };
    this.render();
  }

  computeOutput() {
    const { gate, inputA, inputB } = this.state;
    switch (gate) {
      case 'AND': return inputA & inputB;
      case 'OR':  return inputA | inputB;
      case 'XOR': return inputA ^ inputB;
      case 'NAND': return (inputA & inputB) ? 0 : 1;
      case 'NOR': return (inputA | inputB) ? 0 : 1;
      default: return 0;
    }
  }

  render() {
    const out = this.computeOutput();
    this.container.innerHTML = `
      <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-mono tracking-wider text-sky-400">Gate Type:</span>
            <select id="logic-gate-select" class="bg-slate-800 text-white text-xs rounded px-2 py-1 border border-slate-600 focus:outline-none focus:border-sky-400">
              <option value="XOR" ${this.state.gate === 'XOR' ? 'selected' : ''}>XOR (Exclusive OR)</option>
              <option value="AND" ${this.state.gate === 'AND' ? 'selected' : ''}>AND</option>
              <option value="OR" ${this.state.gate === 'OR' ? 'selected' : ''}>OR</option>
              <option value="NAND" ${this.state.gate === 'NAND' ? 'selected' : ''}>NAND (Universal)</option>
              <option value="NOR" ${this.state.gate === 'NOR' ? 'selected' : ''}>NOR (Universal)</option>
            </select>
          </div>
          <span class="text-xs text-slate-400 font-mono">UGC NET CS Unit 2 / Electronic Science</span>
        </div>

        <!-- Interactive Diagram -->
        <div class="flex items-center justify-center gap-6 py-4">
          <div class="flex flex-col gap-4">
            <button id="toggle-input-a" class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${this.state.inputA ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              Input A: [ ${this.state.inputA} ]
            </button>
            <button id="toggle-input-b" class="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${this.state.inputB ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
              Input B: [ ${this.state.inputB} ]
            </button>
          </div>

          <div class="px-6 py-4 rounded-xl bg-sky-950/60 border border-sky-500/40 text-center shadow-inner">
            <div class="text-xl font-bold font-mono text-sky-300">${this.state.gate}</div>
            <div class="text-[10px] text-sky-400/80 mt-1">Logic Operation</div>
          </div>

          <div class="flex flex-col items-center">
            <div class="text-xs font-mono text-slate-400 mb-1">Output Y:</div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-xl transition-all ${out ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
              ${out}
            </div>
          </div>
        </div>

        <!-- Boolean Equation -->
        <div class="mt-3 p-2 bg-slate-950/80 rounded border border-slate-800 text-center font-mono text-xs text-slate-300">
          Boolean Expression: <span class="text-amber-400 font-bold">${this.getExpression()}</span>
        </div>
      </div>
    `;

    // Bind event listeners
    document.getElementById('logic-gate-select')?.addEventListener('change', (e) => {
      this.state.gate = e.target.value;
      this.render();
    });
    document.getElementById('toggle-input-a')?.addEventListener('click', () => {
      this.state.inputA = this.state.inputA ? 0 : 1;
      this.render();
    });
    document.getElementById('toggle-input-b')?.addEventListener('click', () => {
      this.state.inputB = this.state.inputB ? 0 : 1;
      this.render();
    });
  }

  getExpression() {
    const { gate, inputA, inputB } = this.state;
    switch (gate) {
      case 'AND': return `Y = A · B = ${inputA} · ${inputB} = ${inputA & inputB}`;
      case 'OR':  return `Y = A + B = ${inputA} + ${inputB} = ${inputA | inputB}`;
      case 'XOR': return `Y = A ⊕ B = A'B + AB' = ${inputA ^ inputB}`;
      case 'NAND': return `Y = (A · B)' = (${inputA} · ${inputB})' = ${(inputA & inputB) ? 0 : 1}`;
      case 'NOR': return `Y = (A + B)' = (${inputA} + ${inputB})' = ${(inputA | inputB) ? 0 : 1}`;
      default: return '';
    }
  }
}

export class AlgorithmVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.array = [45, 12, 89, 34, 67, 23, 91, 56, 78, 19, 52, 38];
    this.activeIndices = [];
    this.sortedIndices = new Set();
    this.isRunning = false;
    this.speedMs = 300;
    this.render();
  }

  shuffle() {
    this.array = Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 10);
    this.activeIndices = [];
    this.sortedIndices.clear();
    this.isRunning = false;
    this.render();
  }

  async runBubbleSort() {
    if (this.isRunning) return;
    this.isRunning = true;
    const n = this.array.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!this.isRunning) return;
        this.activeIndices = [j, j + 1];
        this.renderBars();
        await new Promise(r => setTimeout(r, this.speedMs));

        if (this.array[j] > this.array[j + 1]) {
          const temp = this.array[j];
          this.array[j] = this.array[j + 1];
          this.array[j + 1] = temp;
          this.renderBars();
          await new Promise(r => setTimeout(r, this.speedMs));
        }
      }
      this.sortedIndices.add(n - i - 1);
    }
    this.sortedIndices.add(0);
    this.activeIndices = [];
    this.isRunning = false;
    this.renderBars();
  }

  render() {
    this.container.innerHTML = `
      <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xs uppercase font-mono tracking-wider text-sky-400">Sorting & Complexity:</span>
            <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              O(n²) Comparisons • UGC NET CS Unit 1
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button id="algo-shuffle-btn" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700">
              🔀 Shuffle
            </button>
            <button id="algo-run-btn" class="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded">
              ▶ Run Sort
            </button>
          </div>
        </div>

        <!-- Bars Visualization Area -->
        <div id="algo-bars-area" class="h-44 bg-slate-950/80 rounded-lg p-3 flex items-end justify-center gap-2 border border-slate-800">
          <!-- Bars dynamically injected -->
        </div>

        <div class="mt-3 flex justify-between items-center text-[11px] font-mono text-slate-400">
          <div><span class="inline-block w-2.5 h-2.5 rounded bg-sky-400 mr-1"></span> Comparing</div>
          <div><span class="inline-block w-2.5 h-2.5 rounded bg-emerald-400 mr-1"></span> Sorted</div>
          <div>Inversions: <span class="text-amber-400 font-bold">Stable In-Place</span></div>
        </div>
      </div>
    `;

    this.renderBars();

    document.getElementById('algo-shuffle-btn')?.addEventListener('click', () => this.shuffle());
    document.getElementById('algo-run-btn')?.addEventListener('click', () => this.runBubbleSort());
  }

  renderBars() {
    const area = document.getElementById('algo-bars-area');
    if (!area) return;

    area.innerHTML = this.array.map((val, idx) => {
      const isComparing = this.activeIndices.includes(idx);
      const isSorted = this.sortedIndices.has(idx);

      let color = "bg-slate-700";
      if (isComparing) color = "bg-sky-400 shadow-lg shadow-sky-400/50";
      else if (isSorted) color = "bg-emerald-400";

      return `
        <div class="flex-1 flex flex-col items-center">
          <span class="text-[9px] font-mono text-slate-400 mb-1">${val}</span>
          <div style="height: ${val * 1.4}px" class="w-full rounded-t transition-all duration-150 ${color}"></div>
        </div>
      `;
    }).join('');
  }
}

