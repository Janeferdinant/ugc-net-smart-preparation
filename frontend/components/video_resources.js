/**
 * Curated Video Lectures & Open Educational Resources (NPTEL, Swayam, CEC-UGC)
 * Brand: Jane Rose | Asst. Professor | CSE
 */

export const VIDEO_RESOURCES = [
  {
    id: 1,
    title: "Design and Analysis of Algorithms (Complete Course)",
    instructor: "Prof. Madhavan Mukund",
    institution: "Chennai Mathematical Institute / NPTEL",
    subject: "Computer Science (Code 87)",
    unit: "Unit 1: Discrete Structures & Optimization",
    duration: "40 Lectures (Approx 30 Hours)",
    url: "https://nptel.ac.in/courses/106106131",
    topics: ["Asymptotic Notation", "Divide & Conquer", "Dynamic Programming", "Graph Algorithms", "NP-Completeness"],
    platform: "NPTEL / Swayam"
  },
  {
    id: 2,
    title: "Computer Architecture and Organization",
    instructor: "Prof. Indranil Sengupta",
    institution: "IIT Kharagpur / NPTEL",
    subject: "Computer Science (Code 87)",
    unit: "Unit 2: Computer System Architecture",
    duration: "60 Lectures (Approx 45 Hours)",
    url: "https://nptel.ac.in/courses/106105163",
    topics: ["Instruction Set Architecture", "Arithmetic Units", "Pipelining & Hazards", "Cache Memory Mapping", "Virtual Memory"],
    platform: "NPTEL / Swayam"
  },
  {
    id: 3,
    title: "Database Management System (DBMS)",
    instructor: "Prof. Partha Pratim Das",
    institution: "IIT Kharagpur / NPTEL",
    subject: "Computer Science (Code 87)",
    unit: "Unit 4: Database Management Systems",
    duration: "45 Lectures (Approx 35 Hours)",
    url: "https://nptel.ac.in/courses/106105175",
    topics: ["Relational Model", "SQL", "Functional Dependencies & Normalization (1NF-BCNF)", "Transactions & Concurrency 2PL"],
    platform: "NPTEL / Swayam"
  },
  {
    id: 4,
    title: "Theory of Computation and Automata",
    instructor: "Prof. Raghunath Tewari",
    institution: "IIT Kanpur / NPTEL",
    subject: "Computer Science (Code 87)",
    unit: "Unit 8: Theory of Computation & Compilers",
    duration: "40 Lectures (Approx 30 Hours)",
    url: "https://nptel.ac.in/courses/106104148",
    topics: ["DFA/NFA Minimization", "Regular Expressions", "Pumping Lemma for CFLs", "Turing Machines & Decidability"],
    platform: "NPTEL / Swayam"
  },
  {
    id: 5,
    title: "Teaching & Research Aptitude in Higher Education (Paper 1)",
    instructor: "CEC Academic Panel",
    institution: "Consortium for Educational Communication (CEC) / UGC",
    subject: "UGC NET Paper 1 (Code 00)",
    unit: "Unit I & II: Teaching & Research Aptitude",
    duration: "25 Modules",
    url: "https://swayam.gov.in/explorer?category=Higher_Education",
    topics: ["Levels of Teaching (Herbart, Morrison, Hunt)", "Research Methodology & Referencing", "ICT in Higher Education"],
    platform: "Swayam / CEC-UGC"
  },
  {
    id: 6,
    title: "Analog Electronic Circuits & Operational Amplifiers",
    instructor: "Prof. Pradip Mandal",
    institution: "IIT Kharagpur / NPTEL",
    subject: "Electronic Science (Code 88)",
    unit: "Unit 2: Linear and Digital Circuit Analysis",
    duration: "40 Lectures",
    url: "https://nptel.ac.in/courses/108105158",
    topics: ["Op-Amp Feedback Configurations", "Noise Gain vs Signal Gain", "Active Filters", "Oscillators"],
    platform: "NPTEL / Swayam"
  }
];

export class VideoResourcesView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="glass-panel p-5 sm:p-7 space-y-6">
        <div class="specular-highlight"></div>

        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Open Educational Resources
              </span>
              <span class="text-xs text-slate-400 font-mono">NPTEL • Swayam • CEC-UGC</span>
            </div>
            <h2 class="text-xl font-bold text-white mt-1">Curated Video Lecture Archives</h2>
            <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Official video lecture playlists from top Indian Institutes of Technology (IITs) and the Consortium for Educational Communication (CEC) aligned directly to UGC NET syllabus units.
            </p>
          </div>
          <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            ${VIDEO_RESOURCES.length} Master Courses
          </span>
        </div>

        <!-- Video Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${VIDEO_RESOURCES.map(v => `
            <div class="glass-dense-card p-5 border border-slate-700/80 rounded-xl flex flex-col justify-between hover:border-sky-500/40 transition">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    ${v.platform}
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">⏱️ ${v.duration}</span>
                </div>

                <h3 class="text-base font-bold text-white mb-1.5 leading-snug">${v.title}</h3>
                <div class="text-xs text-slate-300 font-medium mb-1">Instructor: ${v.instructor}</div>
                <div class="text-[11px] text-slate-400 mb-3">${v.institution}</div>

                <div class="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs mb-4">
                  <span class="text-sky-400 font-bold block mb-1">Aligned UGC NET Unit:</span>
                  <div class="text-slate-300">${v.unit}</div>
                  <div class="mt-2 flex flex-wrap gap-1">
                    ${v.topics.map(t => `
                      <span class="px-1.5 py-0.5 bg-slate-900 text-slate-400 rounded text-[10px] border border-slate-800">
                        ${t}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <a href="${v.url}" target="_blank" class="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition text-center flex items-center justify-center gap-2">
                  <span>▶</span> Watch Official Course on ${v.platform.split('/')[0].trim()}
                </a>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-mono">
          Jane Rose | Asst. Professor | CSE — Open Educational Repository
        </div>
      </div>
    `;
  }
}
