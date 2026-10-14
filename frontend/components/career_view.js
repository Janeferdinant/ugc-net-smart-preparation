/**
 * Career & Supplementary Technical Pathways Explorer
 * Brand: Jane Rose | Asst. Professor | CSE
 */

export class CareerView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.careers = [];
    this.init();
  }

  async init() {
    this.container.innerHTML = `
      <div class="glass-panel p-5 sm:p-6">
        <div class="specular-highlight"></div>
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-700/80">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Supplementary Domain
              </span>
              <span class="text-xs text-slate-400 font-mono">Industry & Research Alignment</span>
            </div>
            <h2 class="text-xl font-bold text-white mt-1">Career & Technical Growth Pathways</h2>
            <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore professional trajectories across Artificial Intelligence, Data Science, VLSI Electronics, and Higher Education Academic Professorship. Verified salary benchmarks based on Indian market data.
            </p>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-right font-mono text-xs text-slate-400">
            <div>Pay Benchmark: <span class="text-emerald-400 font-bold">INR (₹ LPA)</span></div>
            <div class="text-[10px] text-slate-500">Source: AmbitionBox / Glassdoor India</div>
          </div>
        </div>

        <div id="career-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-8 text-center text-slate-400 col-span-2">Loading career benchmarks...</div>
        </div>
      </div>
    `;

    await this.fetchCareers();
    this.renderCards();
  }

  async fetchCareers() {
    try {
      const res = await fetch('/api/career');
      if (res.ok) {
        this.careers = await res.json();
      }
    } catch (e) {
      console.warn("API career fetch failed, using seed fallback", e);
    }

    if (this.careers.length === 0) {
      this.careers = [
        {
          domain: "Academic & Research",
          role_title: "Assistant Professor (CSE / IT / Electronics)",
          industry_sector: "Higher Education & Universities",
          experience_level: "Entry Level (Post UGC NET / Ph.D.)",
          salary_range_inr: "₹ 8 - 18 LPA (UGC 7th Pay Commission Level 10)",
          key_skills: ["Curriculum Design", "Research Publications", "Pedagogy", "Grant Writing", "Mentorship"],
          educational_pathway: "Postgraduation (M.Tech/MCA/M.Sc) -> UGC NET / JRF Qualified -> Ph.D. Enrollment / Assistant Professorship",
          verified_sources: "UGC 7th Central Pay Commission Guidelines; National Institutional Ranking Framework (NIRF)"
        },
        {
          domain: "Artificial Intelligence",
          role_title: "AI / Machine Learning Research Scientist",
          industry_sector: "DeepTech, Autonomous Systems, Enterprise AI",
          experience_level: "Mid to Senior (3-7 Years)",
          salary_range_inr: "₹ 18 - 45 LPA",
          key_skills: ["PyTorch / TensorFlow", "Transformer Architectures", "RLHF", "Mathematical Optimization", "CUDA Programming"],
          educational_pathway: "M.Tech / MS in CSE or AI -> Research Fellowships -> Industry R&D Labs",
          verified_sources: "Glassdoor India Tech Benchmark 2024; AmbitionBox Salary Insights"
        },
        {
          domain: "Data Science",
          role_title: "Principal Data Scientist / Analytics Lead",
          industry_sector: "Fintech, Healthcare, E-Commerce",
          experience_level: "Senior (5+ Years)",
          salary_range_inr: "₹ 22 - 50 LPA",
          key_skills: ["Advanced Statistics", "Big Data (Spark/Hadoop)", "Feature Engineering", "MLOps", "Executive Storytelling"],
          educational_pathway: "Quantitative Degree -> Data Analyst -> Senior Data Scientist -> Principal Lead",
          verified_sources: "NASSCOM India Analytics Talent Report 2024"
        },
        {
          domain: "Electronics & Semiconductor",
          role_title: "VLSI Design & Verification Engineer",
          industry_sector: "Semiconductor Fabrication, Embedded Silicon, Chipset Design",
          experience_level: "Mid-Level (2-5 Years)",
          salary_range_inr: "₹ 14 - 35 LPA",
          key_skills: ["Verilog / SystemVerilog", "UVM Methodology", "Static Timing Analysis (STA)", "Cadence / Synopsys EDA Tools", "FPGA"],
          educational_pathway: "B.Tech/M.Tech Electronics / VLSI -> Design Verification Specialist -> Silicon Architecture",
          verified_sources: "India Electronics and Semiconductor Association (IESA) Report"
        }
      ];
    }
  }

  renderCards() {
    const grid = document.getElementById('career-grid');
    if (!grid) return;

    grid.innerHTML = this.careers.map(c => `
      <div class="glass-dense-card p-5 border border-slate-700/80 hover:border-sky-500/50 transition-all rounded-xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              ${c.domain}
            </span>
            <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ${c.salary_range_inr}
            </span>
          </div>

          <h3 class="text-base font-bold text-white mb-1">${c.role_title}</h3>
          <div class="text-xs text-slate-400 mb-3">${c.industry_sector} • ${c.experience_level}</div>

          <div class="mb-4">
            <div class="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">Key Core Skills:</div>
            <div class="flex flex-wrap gap-1.5">
              ${(c.key_skills || []).map(s => `
                <span class="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] border border-slate-700">
                  ${s}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300 mb-3">
            <span class="text-sky-400 font-bold block mb-1">Career Trajectory:</span>
            ${c.educational_pathway}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Source: ${c.verified_sources}</span>
          <span class="text-slate-400">Jane Rose | CSE</span>
        </div>
      </div>
    `).join('');
  }
}
