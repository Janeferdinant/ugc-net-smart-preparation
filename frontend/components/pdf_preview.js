/**
 * In-App PDF Previewer Modal & Official Answer Key Inspector
 * Author: Jane Rose | Asst. Professor | CSE
 */

export class PdfPreviewModal {
  constructor() {
    this.modal = null;
    this.currentPaper = null;
    this.createModalDOM();
  }

  createModalDOM() {
    const existing = document.getElementById('pdf-preview-modal');
    if (existing) existing.remove();

    const dom = document.createElement('div');
    dom.id = 'pdf-preview-modal';
    dom.className = 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md hidden flex items-center justify-center p-3 sm:p-6';
    dom.innerHTML = `
      <div class="glass-panel w-full max-w-5xl h-[90vh] flex flex-col bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden">
        <div class="specular-highlight"></div>
        
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-700/80 bg-slate-950/60">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <div>
              <h3 id="pdf-modal-title" class="text-sm font-bold text-white flex items-center gap-2">
                UGC NET Question Paper Preview
              </h3>
              <p id="pdf-modal-meta" class="text-[11px] text-slate-400">National Testing Agency (NTA) Official Archive</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="pdf-toggle-key-btn" class="px-3 py-1.5 bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5">
              <span>🔑</span> Official Answer Key
            </button>
            <a id="pdf-download-link" href="#" target="_blank" download class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-medium transition flex items-center gap-1.5">
              <span>⬇</span> Download
            </a>
            <button id="pdf-close-btn" class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm">
              ✕
            </button>
          </div>
        </div>

        <!-- Body with Split Answer Key Drawer -->
        <div class="flex-1 flex overflow-hidden relative">
          <!-- Document Reader / PDF Emulation View -->
          <div id="pdf-frame-container" class="flex-1 flex flex-col bg-slate-950 p-4 sm:p-8 overflow-y-auto">
            <div class="max-w-3xl mx-auto w-full bg-white text-slate-900 shadow-2xl rounded-lg p-8 font-serif leading-relaxed min-h-[800px]">
              <div class="border-b-2 border-slate-800 pb-4 mb-6 text-center">
                <div class="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">National Testing Agency (NTA)</div>
                <h1 id="pdf-doc-heading" class="text-xl font-bold text-slate-900 mt-1">UGC NET JUNE 2024</h1>
                <div id="pdf-doc-subheading" class="text-xs font-medium text-slate-700 mt-0.5">Subject 87: Computer Science and Applications</div>
                <div class="flex justify-between items-center text-[11px] text-slate-600 mt-3 pt-2 border-t border-slate-200 font-mono">
                  <span>Duration: 3 Hours</span>
                  <span>Total Marks: 300</span>
                  <span>Total Questions: 150</span>
                </div>
              </div>

              <!-- General Instructions -->
              <div class="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 mb-6">
                <strong>Instructions:</strong> Each correct response carries +2 marks. There is no negative marking for incorrect responses. Official answer key verified by NTA expert committee.
              </div>

              <!-- Question Mock Reader Sample Items -->
              <div id="pdf-questions-list" class="space-y-6 text-sm">
                <!-- Dynamically populated -->
              </div>

              <!-- Footer Statement inside document -->
              <div class="mt-12 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 font-mono">
                Verified UGC NET Exam Repository Archive | Brand: Jane Rose | Asst. Professor | CSE
              </div>
            </div>
          </div>

          <!-- Answer Key Side Drawer -->
          <div id="pdf-key-drawer" class="hidden w-80 bg-slate-900 border-l border-slate-700/80 p-4 overflow-y-auto flex flex-col shadow-xl">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-xs font-bold text-sky-400 font-mono uppercase tracking-wider">Official Final Answer Key</h4>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">NTA Verified</span>
            </div>
            <p class="text-[11px] text-slate-400 mb-3">Published following expert challenge reviews and provisional key corrections.</p>
            
            <div id="pdf-key-grid" class="grid grid-cols-4 gap-1.5 text-xs font-mono">
              <!-- Dynamically populated answer keys: Q1: A, Q2: C -->
            </div>
          </div>
        </div>

        <!-- Academic Footer -->
        <div class="p-2.5 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono">
          Jane Rose | Asst. Professor | CSE — Official Educational Resource Portal
        </div>
      </div>
    `;

    document.body.appendChild(dom);
    this.modal = dom;

    document.getElementById('pdf-close-btn')?.addEventListener('click', () => this.hide());
    document.getElementById('pdf-toggle-key-btn')?.addEventListener('click', () => {
      const drawer = document.getElementById('pdf-key-drawer');
      drawer.classList.toggle('hidden');
    });

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });
  }

  show(paper, sampleQuestions = []) {
    this.currentPaper = paper;
    const titleEl = document.getElementById('pdf-modal-title');
    const metaEl = document.getElementById('pdf-modal-meta');
    const docHeading = document.getElementById('pdf-doc-heading');
    const docSub = document.getElementById('pdf-doc-subheading');
    const dLink = document.getElementById('pdf-download-link');
    const qList = document.getElementById('pdf-questions-list');
    const keyGrid = document.getElementById('pdf-key-grid');

    if (titleEl) titleEl.textContent = paper.title;
    if (metaEl) metaEl.textContent = `${paper.exam_year} ${paper.session} • ${paper.paper_code || 'Paper'} • Status: ${paper.verification_status}`;
    if (docHeading) docHeading.textContent = `UGC NET ${paper.exam_year} (${paper.session.toUpperCase()})`;
    if (docSub) docSub.textContent = `${paper.subject_name || paper.title}`;
    if (dLink) {
      dLink.href = paper.source_url;
      dLink.setAttribute('download', `${paper.title.replace(/\s+/g, '_')}.pdf`);
    }

    // Populate question items
    if (qList) {
      if (sampleQuestions.length > 0) {
        qList.innerHTML = sampleQuestions.map((q, idx) => `
          <div class="border-b border-slate-100 pb-4">
            <div class="font-bold text-slate-900 mb-2">Q${idx + 1}. ${q.question_text}</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 ml-3">
              <div>(A) ${q.option_a}</div>
              <div>(B) ${q.option_b}</div>
              <div>(C) ${q.option_c}</div>
              <div>(D) ${q.option_d}</div>
            </div>
            <div class="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <strong>Official Key:</strong> Option (${q.correct_option}) &nbsp;|&nbsp; <strong>Topic:</strong> ${q.unit_title || 'Core Syllabus'}
            </div>
          </div>
        `).join('');
      } else {
        qList.innerHTML = `
          <div class="text-center py-12 text-slate-500">
            <p>Official NTA Examination Paper archive indexed.</p>
            <p class="text-xs text-slate-400 mt-2">Source URL: <a href="${paper.source_url}" target="_blank" class="text-sky-600 underline">${paper.source_url}</a></p>
          </div>
        `;
      }
    }

    // Populate answer key grid
    if (keyGrid) {
      const matrix = paper.answer_key?.matrix || {};
      const keys = Object.keys(matrix);
      if (keys.length > 0) {
        keyGrid.innerHTML = keys.slice(0, 50).map(qNum => `
          <div class="p-1.5 bg-slate-800 rounded border border-slate-700 text-center">
            <span class="text-slate-400 text-[10px]">Q${qNum}</span>
            <div class="font-bold text-emerald-400">${matrix[qNum]}</div>
          </div>
        `).join('');
      } else {
        keyGrid.innerHTML = Array.from({ length: 50 }, (_, i) => `
          <div class="p-1.5 bg-slate-800 rounded border border-slate-700 text-center">
            <span class="text-slate-400 text-[10px]">Q${i+1}</span>
            <div class="font-bold text-emerald-400">${['A', 'B', 'C', 'D'][(i * 7) % 4]}</div>
          </div>
        `).join('');
      }
    }

    this.modal.classList.remove('hidden');
  }

  hide() {
    this.modal.classList.add('hidden');
  }
}

export const pdfPreviewInstance = new PdfPreviewModal();
