# UGC NET Smart Preparation Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive, production-ready, AI-powered UGC NET preparation platform that discovers, verifies, organizes, and presents previous-year question papers, official answer keys, syllabus documents, study notes, solved questions, mock tests, and learning analytics with 10 selectable glassmorphism themes and mobile-first UX under the brand "Jane Rose | Asst. Professor | CSE".

**Architecture:** A decoupled full-stack architecture comprising a Python FastAPI backend with SQLite database, robust crawler & PDF verification engine, and a React + TypeScript + Vite frontend powered by Tailwind CSS, Chart.js/Canvas analytics, Three.js 3D concept visualizers, dynamic knowledge graphs, and a 10-preset Liquid Glassmorphism CSS engine.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Python 3.14 (FastAPI, SQLite3, Uvicorn, Requests, BeautifulSoup4, PyPDF/pdfplumber), Chart.js / Canvas, Three.js, Lucide Icons.

**Spec:** UGC NET Smart Preparation Portal — Master Prompt Specification (22 Sections).

## Global Constraints

- **Branding & Footer:** Every view, document export, and generated teaching material must feature the exact footer: `Jane Rose | Asst. Professor | CSE`.
- **Authoritative Data Sources:** Prioritize NTA (`ugcnet.nta.ac.in`), UGC (`ugcnetonline.in`, `ugc.gov.in`). Never fabricate question papers or fake download URLs. Flag unverified/missing items transparently.
- **Official Examination Mapping:** UGC NET Paper 1 (Code 00), Computer Science and Applications (Code 87), and Electronic Science (Code 88) must be strictly distinguished from supplementary domains (AI/ML, Data Science, Computer Vision, NLP). Never label GATE or CSIR-NET as UGC NET.
- **10 Selectable Themes:** Frosted Glass, Liquid Glass-inspired, Crystal Glass, Aurora Glass, Holographic Glass, Layered Translucent Glass, Neumorphic Glass Hybrid, Dark Sci-Fi Laboratory, Light Academic Glass, High-Contrast Accessibility Mode. All support dynamic controls (blur, opacity, accent, border, particles) with local storage persistence.
- **Full Mobile Responsiveness:** Zero horizontal overflow, touch-friendly targets (min 44px), collapsible drawer, bottom navigation on mobile viewports, mobile-friendly PDF reader and quizzes.
- **Clean Architecture:** Strictly conform to the requested folder layout in `ugc-net-preparation/`.

## Review Focus

1. **PDF Preview / Source Link Verification:** If external NTA PDF links are blocked by CORS or unavailable, fallback to verified local/mocked exam replicas with clear verification status badges and original URL citations.
2. **Theme Switching High-Contrast Readability:** Ensure question paper texts, code blocks, and math formulas maintain WCAG 4.5:1 contrast across all 10 glass themes, especially transparent modes.
3. **Mock Test & Quiz Grading Engine:** Accurately calculate UGC NET marking (+2 for correct, 0 negative marking unless specified) with step-by-step explanations, bookmarking, and score breakdown by unit.
4. **Knowledge Graph Usability on Mobile:** Provide intuitive touch pan/zoom and accessible list fallback so small viewports do not experience tangled or unreachable graph nodes.
5. **Crawler Resilience & Rate Limiting:** Crawler must obey robots.txt, use rate limiting, compute SHA-256 hashes, detect broken links, and export audit reports to CSV/JSON without crashing.

---

### Task 1: Project Scaffolding, Backend Database & Official UGC NET Subject Schemas

**Files:**
- Create: `ugc-net-preparation/backend/database/schema.sql`
- Create: `ugc-net-preparation/backend/database/db.py`
- Create: `ugc-net-preparation/backend/database/seed_data.py`
- Test: `ugc-net-preparation/tests/test_database.py`

**Interfaces:**
- Consumes: None (Root Task)
- Produces: `get_db_connection() -> sqlite3.Connection`, `init_db() -> None`, `seed_initial_data() -> dict`

- [ ] **Step 1: Write the failing test for SQLite database initialization and seeding**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement database schema, SQLite connection manager, and verified syllabus seed data**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Verify seed data contains verified Paper 1 (10 units), CS & Applications (10 units), and Electronic Science (10 units)**

---

### Task 2: Python Crawler, Metadata Extractor & Link Verification Engine

**Files:**
- Create: `ugc-net-preparation/backend/crawler/crawler.py`
- Create: `ugc-net-preparation/backend/extractors/pdf_extractor.py`
- Create: `ugc-net-preparation/backend/validators/link_validator.py`
- Test: `ugc-net-preparation/tests/test_crawler.py`

**Interfaces:**
- Consumes: `ugc-net-preparation/backend/database/db.py`
- Produces: `CrawlEngine.crawl_sources() -> dict`, `LinkValidator.audit_links() -> dict`, `PDFExtractor.extract_metadata(file_path) -> dict`

- [ ] **Step 1: Write tests for URL validation, robots.txt compliance, SHA-256 deduplication, and link audit**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement crawler queue, rate limiter, hash calculator, and verification auditor**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Generate initial verification report in `ugc-net-preparation/reports/verification_report.json` and `verification_report.csv`**

---

### Task 3: Python FastAPI REST API Backend

**Files:**
- Create: `ugc-net-preparation/backend/api/main.py`
- Create: `ugc-net-preparation/backend/api/routes_subjects.py`
- Create: `ugc-net-preparation/backend/api/routes_papers.py`
- Create: `ugc-net-preparation/backend/api/routes_quiz.py`
- Create: `ugc-net-preparation/backend/api/routes_analytics.py`
- Test: `ugc-net-preparation/tests/test_api.py`

**Interfaces:**
- Consumes: `ugc-net-preparation/backend/database/db.py`
- Produces: FastAPI application running on port 8000 with CORS and REST routes

- [ ] **Step 1: Write integration tests for API endpoints (`/api/health`, `/api/subjects`, `/api/papers`, `/api/mock-tests`, `/api/analytics`)**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement FastAPI routers with pydantic schemas and database queries**
- [ ] **Step 4: Run test to verify it passes**

---

### Task 4: Frontend Scaffolding, Design Tokens & 10-Preset Glassmorphism System

**Files:**
- Create: `ugc-net-preparation/frontend/package.json`
- Create: `ugc-net-preparation/frontend/vite.config.ts`
- Create: `ugc-net-preparation/frontend/tailwind.config.js`
- Create: `ugc-net-preparation/frontend/src/index.css`
- Create: `ugc-net-preparation/frontend/src/themes/glassThemes.ts`
- Create: `ugc-net-preparation/frontend/src/context/ThemeContext.tsx`
- Create: `ugc-net-preparation/frontend/src/components/ThemeCustomizerModal.tsx`
- Test: `ugc-net-preparation/tests/test_theme_tokens.py`

**Interfaces:**
- Consumes: Tailwind CSS & CSS variables
- Produces: `useTheme()` hook, 10 selectable glass styles with interactive sliders (blur, opacity, border, glow, particle toggle)

- [ ] **Step 1: Configure Vite, TypeScript, Tailwind, Lucide icons, and core CSS variable tokens**
- [ ] **Step 2: Implement the 10 distinct Glassmorphism styles (Frosted, Liquid, Crystal, Aurora, Holographic, Layered, Neumorphic, Dark Sci-Fi, Light Academic, High Contrast)**
- [ ] **Step 3: Build interactive Theme Switcher & Appearance Control panel with LocalStorage sync**
- [ ] **Step 4: Verify contrast ratios and style switches**

---

### Task 5: Mobile Navigation, Brand Header & Jane Rose CSE Universal Footer

**Files:**
- Create: `ugc-net-preparation/frontend/src/components/Navbar.tsx`
- Create: `ugc-net-preparation/frontend/src/components/MobileDrawer.tsx`
- Create: `ugc-net-preparation/frontend/src/components/MobileBottomNav.tsx`
- Create: `ugc-net-preparation/frontend/src/components/Footer.tsx`

**Interfaces:**
- Consumes: `ThemeContext`
- Produces: Responsive navigation header, collapsible drawer, mobile bottom bar, and official footer `Jane Rose | Asst. Professor | CSE`

- [ ] **Step 1: Implement sticky glass navbar with subject selector, theme toggle, and search trigger**
- [ ] **Step 2: Implement responsive mobile drawer (<768px) and bottom quick-action bar (<640px)**
- [ ] **Step 3: Implement universal academic footer with brand statement, source verification policy, and attribution**
- [ ] **Step 4: Test mobile viewport responsiveness across 375px, 768px, 1024px, 1440px**

---

### Task 6: Main Academic Dashboard & Real-Time Stats Overview

**Files:**
- Create: `ugc-net-preparation/frontend/src/dashboard/MainDashboard.tsx`
- Create: `ugc-net-preparation/frontend/src/dashboard/ResourceStatsGrid.tsx`
- Create: `ugc-net-preparation/frontend/src/dashboard/VerificationStatusBanner.tsx`
- Create: `ugc-net-preparation/frontend/src/dashboard/StudyOverviewWidget.tsx`
- Create: `ugc-net-preparation/frontend/src/dashboard/QuickWorkspaceCards.tsx`

**Interfaces:**
- Consumes: REST API `/api/analytics/overview`, `/api/subjects`
- Produces: Complete executive dashboard with dynamic database stats, syllabus progress rings, study plan, and verification alerts

- [ ] **Step 1: Implement statistical counters for verified question papers, answer keys, solved problems, mock tests, and video links**
- [ ] **Step 2: Implement today's study plan widget, progress rings, and recent activity feed**
- [ ] **Step 3: Implement Quick Access Workspace grid linking to papers, notes, quizzes, and formulas**
- [ ] **Step 4: Implement Verification Status panel highlighting verified official sources, missing items, and audit flags**

---

### Task 7: Previous-Year Question Paper Explorer & Embedded PDF Previewer

**Files:**
- Create: `ugc-net-preparation/frontend/src/components/PaperExplorer.tsx`
- Create: `ugc-net-preparation/frontend/src/components/PdfViewerModal.tsx`
- Create: `ugc-net-preparation/frontend/src/components/AnswerKeyMatcher.tsx`

**Interfaces:**
- Consumes: REST API `/api/papers`, `/api/papers/{id}/answer-key`
- Produces: Filterable question paper archive (Year 2018-2024, Paper 1, CS, Electronic Science), verified answer key drawer, and modal PDF viewer

- [ ] **Step 1: Build filter bar for Subject, Year, Session (June/Dec), Shift (1/2), Verification Status, and Language**
- [ ] **Step 2: Build Paper Card component displaying NTA source badge, verified answer key status, and quick preview**
- [ ] **Step 3: Implement in-app PDF preview modal with download button, source citation, and full-screen toggle**
- [ ] **Step 4: Implement paired Official Answer Key view showing provisional vs. final keys with question-wise answer matrix**

---

### Task 8: Solved Questions Workspace & Formula Sheets

**Files:**
- Create: `ugc-net-preparation/frontend/src/components/SolvedQuestionsView.tsx`
- Create: `ugc-net-preparation/frontend/src/components/FormulaSheetModal.tsx`

**Interfaces:**
- Consumes: REST API `/api/questions`
- Produces: Topic-wise solved question browser with step-by-step explanations, numerical calculation walkthroughs, bookmarking, and filter by unit

- [ ] **Step 1: Build Unit & Topic accordion browser for Computer Science and Paper 1 questions**
- [ ] **Step 2: Build question solver card with revealed explanation, LaTeX/math notation, formula highlighting, and trap warnings**
- [ ] **Step 3: Build high-yield Formula & Key Concepts quick-sheet modal for quick revision**

---

### Task 9: Mock Test Engine & Gamified Learning Analytics

**Files:**
- Create: `ugc-net-preparation/frontend/src/components/MockTestEngine.tsx`
- Create: `ugc-net-preparation/frontend/src/components/TestResultsModal.tsx`
- Create: `ugc-net-preparation/frontend/src/components/GamificationBadges.tsx`
- Create: `ugc-net-preparation/frontend/src/charts/PerformanceChart.tsx`

**Interfaces:**
- Consumes: REST API `/api/mock-tests`, `/api/mock-tests/submit`
- Produces: Full-screen or modal timed test experience, instant evaluation (+2 / 0 scoring), weak-area radar chart, revision streak, and badges

- [ ] **Step 1: Build exam test-taking interface with timer, question palette, flag for review, and auto-submit**
- [ ] **Step 2: Implement post-test analytical report showing overall score, unit-wise accuracy radar chart, and step-by-step review**
- [ ] **Step 3: Implement gamification tracker: Daily study streaks, mastery badges (e.g., "Algorithms Ace", "Paper 1 Guru"), and milestones**

---

### Task 10: Interactive Topic Knowledge Graph

**Files:**
- Create: `ugc-net-preparation/frontend/src/components/KnowledgeGraph.tsx`
- Create: `ugc-net-preparation/frontend/src/components/GraphNodeDetailModal.tsx`

**Interfaces:**
- Consumes: REST API `/api/knowledge-graph/{subject_id}`
- Produces: Interactive canvas/SVG network graph linking Units -> Topics -> PYQs -> Formulas with touch/zoom, node search, and accessible list view

- [ ] **Step 1: Construct knowledge graph node & link dataset from UGC NET official syllabus units**
- [ ] **Step 2: Implement Canvas/SVG graph renderer with physics-based layout, zoom, pan, and filter controls**
- [ ] **Step 3: Implement node click drawer showing related previous year questions, notes, and direct practice link**
- [ ] **Step 4: Provide accessible hierarchical list alternative for screen readers and small mobile screens**

---

### Task 11: 3D Educational Visualizations & Interactive Motion Graphics

**Files:**
- Create: `ugc-net-preparation/frontend/src/animations/AlgorithmVisualizer.tsx`
- Create: `ugc-net-preparation/frontend/src/animations/NeuralNet3D.tsx`
- Create: `ugc-net-preparation/frontend/src/animations/LogicGateSimulator.tsx`
- Create: `ugc-net-preparation/frontend/src/animations/AmbientParticles.tsx`

**Interfaces:**
- Consumes: Three.js / Canvas 2D
- Produces: Interactive 3D neural net topology visualizer, sorting/graph traversal visualizer, and logic circuit simulator with play/pause and reduced-motion controls

- [ ] **Step 1: Build interactive 3D Neural Network feedforward/backprop visualization with Three.js**
- [ ] **Step 2: Build interactive Algorithm Visualizer (Dijkstra, QuickSort, Tree traversal) with speed controls**
- [ ] **Step 3: Build interactive Digital Logic & Gate Simulator (AND, OR, XOR, Flip-Flops) for UGC NET CS Unit 2 / Electronic Science**
- [ ] **Step 4: Ensure all animations respect `prefers-reduced-motion` and include pause/play toggles**

---

### Task 12: Supplementary Career & Technical Pathways Explorer

**Files:**
- Create: `ugc-net-preparation/frontend/src/components/CareerExplorer.tsx`

**Interfaces:**
- Consumes: REST API `/api/career`
- Produces: Structured career guide for AI, Data Science, Cyber Security, Computer Vision, and Academic Professorship (salary ranges, required skill roadmaps, verified hiring citations)

- [ ] **Step 1: Build career pathway cards with verified salary benchmarks (Glassdoor/AmbitionBox INR data), required certifications, and academic trajectory**
- [ ] **Step 2: Clearly separate academic UGC NET preparation from industry career development**

---

### Task 13: End-to-End Integration, Verification Suite, Documentation & Status Report

**Files:**
- Create: `ugc-net-preparation/README.md`
- Create: `ugc-net-preparation/PROJECT_STATUS.md`
- Create: `ugc-net-preparation/start_server.py`
- Test: Full platform test suite in `ugc-net-preparation/tests/`

**Interfaces:**
- Consumes: All components & API services
- Produces: One-command launcher, comprehensive test suite, verification audit, and complete project documentation

- [ ] **Step 1: Run comprehensive backend and frontend test suite to verify 100% test pass rate**
- [ ] **Step 2: Verify responsive design across desktop, tablet, and mobile with browser subagent or headless verification**
- [ ] **Step 3: Update `PROJECT_STATUS.md` with verified resource counts, completed features, audit report, and test results**
- [ ] **Step 4: Write `README.md` with architecture details, quick start guide, and source policies**
