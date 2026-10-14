#!/usr/bin/env python3
"""
Seed Script: Artificial Intelligence & Data Science UGC NET Module
Includes:
1. 10 Comprehensive Syllabus Units (UGC NET Code 87 Units 9 & 10 + Modern Data Science)
2. 30-Day Master Study Plan with daily topics, formulas, demos, and real-time applications
3. 30+ Solved Previous Year Question Papers (PYQs) with Official NTA Answer Keys and step-by-step problem walkthroughs
4. Interactive Knowledge Graph mappings linking nodes to topics, formulas, and industry use cases
Author: Jane Rose NF | Asst. Professor | CSE
"""

import os
import sys
import json
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(BASE_DIR, "backend", "database", "ugc_net.db")

def seed_ai_ds():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    print("Checking database columns and tables...")
    # Add real_time_application column to questions if not exists
    c.execute("PRAGMA table_info(questions)")
    columns = [row["name"] for row in c.fetchall()]
    if "real_time_application" not in columns:
        c.execute("ALTER TABLE questions ADD COLUMN real_time_application TEXT;")
        print("-> Added 'real_time_application' column to questions table.")

    # Create study_plan_30_days table
    c.execute("""
        CREATE TABLE IF NOT EXISTS study_plan_30_days (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            day_number INTEGER NOT NULL UNIQUE,
            phase_week INTEGER NOT NULL,
            phase_title TEXT NOT NULL,
            module_title TEXT NOT NULL,
            core_topics_json TEXT NOT NULL,
            target_hours REAL DEFAULT 3.0,
            key_formula TEXT,
            real_time_application TEXT NOT NULL,
            pyq_year_session TEXT,
            pyq_question_text TEXT,
            pyq_options_json TEXT,
            official_answer_key TEXT,
            problem_demo_walkthrough TEXT
        );
    """)

    # 1. Update or Insert Subject: Artificial Intelligence & Data Science
    c.execute("SELECT id FROM subjects WHERE code = 'AI-DS' OR name LIKE '%Artificial Intelligence%'")
    existing_sub = c.fetchone()
    if existing_sub:
        sub_id = existing_sub["id"]
        c.execute("""
            UPDATE subjects SET 
                name = 'Artificial Intelligence & Data Science (UGC NET)',
                code = 'AI-DS',
                category = 'official_exam',
                is_official = 1,
                icon = 'BrainCircuit',
                description = 'Comprehensive UGC NET Syllabus (Paper 2 Units 9 & 10) covering Search, Knowledge Representation, ML, Deep Learning, Big Data & Cloud Systems.',
                total_units = 10
            WHERE id = ?
        """, (sub_id,))
        print(f"-> Updated existing subject ID {sub_id} to Artificial Intelligence & Data Science.")
    else:
        c.execute("""
            INSERT INTO subjects (code, name, category, description, is_official, icon, total_units)
            VALUES ('AI-DS', 'Artificial Intelligence & Data Science (UGC NET)', 'official_exam', 
                    'Comprehensive UGC NET Syllabus covering Search, Knowledge Representation, ML, Deep Learning, Big Data & Cloud Systems.', 1, 'BrainCircuit', 10)
        """)
        sub_id = c.lastrowid
        print(f"-> Created new subject ID {sub_id} for Artificial Intelligence & Data Science.")

    # 2. Insert 10 Detailed Syllabus Units
    units_data = [
        (1, "Search Algorithms & Heuristic Optimization", 10,
         "State space search, uninformed vs informed search, evaluation functions, admissibility and consistency of heuristics.",
         ["State Space Representation & Problem Formulation", "Uninformed Search: BFS, DFS, Depth-Limited Search, Iterative Deepening (IDDFS), Uniform Cost Search (UCS)",
          "Informed / Heuristic Search: Greedy Best-First Search, A* Algorithm (Proof of Admissibility & Consistency)",
          "Memory-Bounded Heuristic Search: Iterative Deepening A* (IDA*), Recursive Best-First Search (RBFS), Simplified Memory-Bounded A* (SMA*)",
          "Local Search & Global Optimization: Hill Climbing (Local Maxima, Ridges, Plateaux), Simulated Annealing (Metropolis Criterion), Genetic Algorithms (Crossover, Mutation, Fitness)"],
         "Master heuristic tree navigation, calculate effective branching factor, and prove admissibility conditions for A*."),

        (2, "Adversarial Search & Game Playing", 10,
         "Two-player deterministic and stochastic zero-sum games, minimax optimality, and game-tree pruning bounds.",
         ["Optimal Decisions in Zero-Sum Games: Minimax Value, Depth-Bounded Evaluation Functions",
          "Alpha-Beta Pruning: Alpha Cutoff, Beta Cutoff, Best-Case O(b^(d/2)) Time Complexity Proof",
          "Evaluation Function Design: Weighted Linear Functions, Horizon Problem, Quiescence Search",
          "Games with Chance: Expectiminimax, Monte Carlo Tree Search (MCTS), Selection, Expansion, Simulation, Backpropagation"],
         "Compute game tree bounds, execute alpha-beta pruning without traversing redundant subtrees, and design heuristic utility functions."),

        (3, "Knowledge Representation, Predicate Logic & Reasoning", 10,
         "Formal logic systems, theorem proving, resolution refutation, and ontologies.",
         ["Propositional Logic: Syntax, Semantics, Tautology, Satisfiability (CNF, DNF), Horn Clauses",
          "First-Order Logic (FOL): Quantifiers (Universal, Existential), Domain of Discourse, Variable Binding",
          "Inference in FOL: Forward Chaining, Backward Chaining, Generalized Modus Ponens",
          "Unification Algorithm & Most General Unifier (MGU)",
          "Skolemization & Resolution Refutation: Converting to Clause Form, Eliminating Existential Quantifiers with Skolem Functions, Empty Clause Derivation",
          "Structured Knowledge Representations: Semantic Networks, Conceptual Dependency, Frames, Scripts"],
         "Formulate complex real-world logic into FOL, compute Skolem normal forms, and perform resolution theorem refutation."),

        (4, "Probabilistic Reasoning, Bayesian Networks & Fuzzy Systems", 10,
         "Handling uncertainty in AI, conditional independence, belief networks, and fuzzy logic operations.",
         ["Uncertainty & Axioms of Probability: Prior, Conditional, and Joint Probability Distributions",
          "Bayes Rule & Bayesian Networks: Directed Acyclic Graphs (DAG), Conditional Independence, d-separation, Markov Blanket",
          "Exact & Approximate Inference: Variable Elimination, Rejection Sampling, Markov Chain Monte Carlo (MCMC)",
          "Fuzzy Sets & Membership Functions: Triangular, Trapezoidal, Gaussian Memberships, Support, Core, Alpha-Cuts",
          "Fuzzy Logic Operations: T-Norm (Min/Product), S-Norm (Max/Probabilistic Sum), Fuzzy Complement",
          "Fuzzy Inference Systems (FIS): Mamdani vs Sugeno Models, Fuzzification, Rule Base, Defuzzification (Centroid, COG, Mean of Maxima)"],
         "Construct Bayesian belief networks, determine conditional independence via d-separation, and evaluate fuzzy Mamdani systems."),

        (5, "Classical Machine Learning & Statistical Learning", 10,
         "Supervised and semi-supervised algorithms, decision theory, optimization loss functions, and generalization bounds.",
         ["Supervised Learning Foundations: Bias-Variance Tradeoff, Overfitting, L1/L2 Regularization (Lasso & Ridge)",
          "Linear & Logistic Regression: Cost Functions, Gradient Descent, Stochastic Gradient Descent (SGD), Odds Ratio, Sigmoid Activation",
          "Decision Tree Induction: ID3, C4.5, CART, Entropy, Information Gain, Gain Ratio, Gini Impurity, Pruning",
          "Naive Bayes Classifier: Maximum A Posteriori (MAP), Maximum Likelihood Estimation (MLE), Laplace Smoothing",
          "k-Nearest Neighbors (k-NN): Distance Metrics (Euclidean, Manhattan, Minkowski, Cosine), Voronoi Cells, Curse of Dimensionality",
          "Support Vector Machines (SVM): Maximum Margin Hyperplane, Hard Margin vs Soft Margin (Slack Variables), Dual Formulation, Kernel Trick (RBF, Polynomial)"],
         "Calculate Entropy, Information Gain, and Gini Index on tabular datasets, and formulate SVM Lagrange dual problems."),

        (6, "Unsupervised Learning, Clustering & Association Rules", 10,
         "Discovering latent patterns in unlabeled data, clustering metrics, matrix decomposition, and frequent itemset mining.",
         ["Partitioning Clustering: k-Means Algorithm, Convergence Guarantee, k-Means++ Initialization, Elbow Method, Silhouette Score",
          "Hierarchical Clustering: Agglomerative vs Divisive, Linkage Criteria (Single, Complete, Average, Ward Linkage), Dendrograms",
          "Density-Based Clustering: DBSCAN, Core Points, Border Points, Noise, Epsilon Neighborhood, MinPts",
          "Dimensionality Reduction: Principal Component Analysis (PCA), Covariance Matrix, Eigenvalue Decomposition, Explained Variance Ratio, Singular Value Decomposition (SVD)",
          "Association Rule Mining: Market Basket Analysis, Support, Confidence, Lift, Conviction, Apriori Algorithm (Apriori Property / Downward Closure), FP-Growth Tree"],
         "Execute PCA projection matrices, trace Apriori candidate generation, and compute cluster Silhouette coefficients."),

        (7, "Deep Learning & Neural Architectures", 10,
         "Biological vs artificial neurons, backpropagation mathematical derivation, convolutional, recurrent, and transformer networks.",
         ["Artificial Neurons: McCulloch-Pitts Model, Perceptron Learning Rule, Linear Separability, XOR Problem",
          "Multi-Layer Perceptron (MLP): Universal Approximation Theorem, Activation Functions (ReLU, Leaky ReLU, GELU, Softmax)",
          "Backpropagation Calculus: Chain Rule Derivation, Gradient Flow, Vanishing and Exploding Gradient Problem, Optimizers (Momentum, Adam, RMSProp)",
          "Convolutional Neural Networks (CNN): Convolution Operation, Kernel, Stride, Padding, Receptive Field, Pooling Layers (Max, Average)",
          "Recurrent Architectures: Recurrent Neural Networks (RNN), Backpropagation Through Time (BPTT), Long Short-Term Memory (LSTM) Gating Mechanisms, Gated Recurrent Units (GRU)",
          "Transformers: Self-Attention Mechanism, Scaled Dot-Product Attention, Multi-Head Attention, Positional Encoding, Encoder-Decoder Architectures (BERT, GPT)"],
         "Derive backpropagation weight update gradients, compute CNN feature map dimensions, and calculate scaled dot-product attention scores."),

        (8, "Natural Language Processing (NLP) & Computational Linguistics", 10,
         "Text preprocessing, vector semantics, grammatical parsing, and language modeling.",
         ["Text Processing & Normalization: Tokenization, Stemming (Porter, Snowball), Lemmatization, Stop-Word Filtering, Edit Distance (Levenshtein)",
          "Vector Space Models: Bag-of-Words (BoW), Term Frequency-Inverse Document Frequency (TF-IDF), Pointwise Mutual Information (PMI)",
          "Distributed Word Representations: Word2Vec (Continuous Bag-of-Words & Skip-Gram), Hierarchical Softmax, Negative Sampling, GloVe",
          "Formal Grammars & Parsing: Chomsky Hierarchy (Regular, Context-Free, Context-Sensitive, Recursively Enumerable), Context-Free Grammars (CFG)",
          "Parsing Algorithms: Top-Down vs Bottom-Up Parsing, Cocke-Younger-Kasami (CYK) Algorithm, Shift-Reduce Parsing",
          "Modern Sequence Models: Seq2Seq with Attention, BLEU Score, Perplexity, Subword Tokenization (BPE, WordPiece)"],
         "Calculate TF-IDF matrices, run CYK chart parsing on Chomsky Normal Form grammars, and evaluate translation outputs using BLEU score."),

        (9, "Big Data Architectures, Distributed Computing & NoSQL", 10,
         "Data processing at scale, distributed storage, parallel execution models, and non-relational database design.",
         ["Big Data Characteristics: 5 V's (Volume, Velocity, Variety, Veracity, Value), Scaling (Vertical vs Horizontal)",
          "Hadoop Distributed File System (HDFS): NameNode, DataNode, Block Replication, Rack Awareness, Heartbeat Mechanism",
          "MapReduce Programming Paradigm: Map Function, Shuffle & Sort Phase, Reduce Function, Combiner, Partitioner, Fault Tolerance",
          "Apache Spark Architecture: Resilient Distributed Datasets (RDD), Transformations (Narrow vs Wide Dependencies), Actions, Spark DataFrames, Directed Acyclic Graph (DAG) Execution",
          "NoSQL Data Stores: CAP Theorem (Consistency, Availability, Partition Tolerance), BASE Properties (Basically Available, Soft state, Eventual consistency)",
          "NoSQL Categories: Key-Value (Redis), Document-Store (MongoDB), Column-Family (Apache Cassandra, HBase), Graph Databases (Neo4j)"],
         "Trace MapReduce word count and relational joins, apply CAP theorem trade-offs, and construct Spark RDD execution DAGs."),

        (10, "Cloud Computing, Virtualization & MLOps", 10,
         "Cloud service paradigms, containerization, distributed machine learning pipelines, and production model governance.",
         ["Cloud Service Models: Infrastructure as a Service (IaaS), Platform as a Service (PaaS), Software as a Service (SaaS)",
          "Cloud Deployment Models: Public, Private, Hybrid, Multi-Cloud, Community",
          "Virtualization Technology: Hypervisor Architecture (Type 1 Bare-Metal vs Type 2 Hosted), Hardware Virtualization vs OS-Level Containerization",
          "Containers & Orchestration: Docker Images, Layers, Container Runtime, Kubernetes Architecture (Control Plane, Worker Nodes, Pods, Services)",
          "Machine Learning Operations (MLOps): Continuous Training (CT), Continuous Delivery (CD4ML), Feature Stores, Data Drift vs Concept Drift",
          "Model Serving & Scalability: REST/gRPC Model Microservices, Batch vs Real-Time Streaming Inference, Model Monitoring and Latency Benchmarks"],
         "Differentiate hypervisor types from container namespaces, identify concept drift in streaming data, and architect MLOps pipelines.")
    ]

    # Clean old units for this subject to prevent duplicates
    c.execute("DELETE FROM syllabus_units WHERE subject_id = ?", (sub_id,))
    unit_id_map = {}
    for u_num, title, weight, desc, topics, outcomes in units_data:
        c.execute("""
            INSERT INTO syllabus_units (subject_id, unit_number, title, weightage_percent, description, topics_json, learning_outcomes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (sub_id, u_num, title, weight, desc, json.dumps(topics), outcomes))
        unit_id_map[u_num] = c.lastrowid

    print(f"-> Inserted 10 comprehensive Syllabus Units for subject ID {sub_id}.")

    # 3. Insert 30-Day Master Study Plan
    c.execute("DELETE FROM study_plan_30_days")
    plan_data = [
        # WEEK 1: Search, Game Playing & Optimization
        (1, 1, "Week 1: Search & Game Theory", "Day 1: Uninformed Search Mechanics (BFS, DFS, UCS)",
         ["State space graphs", "Tree search vs Graph search", "Queue implementations", "Time and space complexity proofs"],
         3.0, "Time Complexity of BFS = O(b^d), Space = O(b^d)",
         "GPS Navigation routing in sparse road networks; Web crawler link traversal.",
         "UGC NET 2021 Nov", "In Breadth-First Search, if the branching factor is b and depth of shallowest solution is d, what is the space complexity?",
         {"A": "O(d)", "B": "O(b^d)", "C": "O(b * d)", "D": "O(d^b)"}, "B",
         "BFS stores all generated nodes in memory at the current frontier level. At depth d, there are b^d leaf nodes in memory. Hence space complexity is O(b^d)."),

        (2, 1, "Week 1: Search & Game Theory", "Day 2: Informed Search & A* Admissibility",
         ["Heuristic function h(n)", "Evaluation function f(n) = g(n) + h(n)", "Admissible heuristics (h(n) <= h*(n))", "Consistent / Monotonic heuristics"],
         3.5, "f(n) = g(n) + h(n), with h(n) <= h*(n) guaranteeing tree-search optimality.",
         "Warehouse AGV (Automated Guided Vehicle) collision-free shortest path planning.",
         "UGC NET 2023 Dec", "An A* search algorithm is guaranteed to find an optimal path if the heuristic function h(n) is:",
         {"A": "Overestimating the true cost", "B": "Admissible and never overestimates the true cost", "C": "Equal to the path cost g(n)", "D": "Negative"}, "B",
         "For tree search, admissibility (h(n) <= h*(n)) is sufficient for optimality. For graph search, consistency (triangle inequality h(n) <= c(n,a,n') + h(n')) guarantees optimal paths without reopening closed nodes."),

        (3, 1, "Week 1: Search & Game Theory", "Day 3: Memory-Bounded Search (IDA*, SMA*)",
         ["Iterative Deepening A*", "f-cost cutoffs", "Memory vs Time trade-offs", "Recursive Best-First Search (RBFS)"],
         3.0, "Space complexity of IDA* = O(b * d) with f-contour cutoffs.",
         "Embedded robotics pathfinding with strict RAM limits (Microcontroller AI).",
         "UGC NET 2020 Oct", "What is the primary advantage of Iterative Deepening A* (IDA*) over standard A* search?",
         {"A": "It visits fewer nodes", "B": "It reduces memory consumption to linear O(bd)", "C": "It does not require a heuristic", "D": "It works only on directed graphs"}, "B",
         "A* keeps all explored nodes in memory (exponential O(b^d)), which causes out-of-memory errors on hard problems. IDA* uses depth-first contour cutoffs, reducing memory to O(bd) while retaining optimality."),

        (4, 1, "Week 1: Search & Game Theory", "Day 4: Adversarial Search & Minimax Theorem",
         ["Zero-sum game formulation", "Terminal states and Utility values", "Minimax value calculation", "Backed-up values in game trees"],
         3.0, "Minimax(s) = max_a Minimax(Result(s,a)) for MAX node; min_a for MIN node.",
         "Chess and Checkers automated engines (Stockfish position evaluation).",
         "UGC NET 2022 June", "In a two-player zero-sum game with branching factor b and game depth d, the time complexity of the Minimax algorithm is:",
         {"A": "O(b * d)", "B": "O(b^d)", "C": "O(d^b)", "D": "O(b^(d/2))"}, "B",
         "Minimax traverses all states in the complete game tree up to maximum depth d with branching factor b, yielding exact time complexity O(b^d)."),

        (5, 1, "Week 1: Search & Game Theory", "Day 5: Alpha-Beta Pruning Bounds & Node Ordering",
         ["Alpha cutoff condition (v <= alpha)", "Beta cutoff condition (v >= beta)", "Optimal node ordering time complexity", "Horizon effect"],
         3.5, "Best-case time complexity with optimal ordering = O(b^(d/2)), doubling effective search depth.",
         "Automated high-frequency algorithmic bid-ask auction pricing engines.",
         "UGC NET 2023 June", "With optimal move ordering, Alpha-Beta pruning reduces the time complexity of minimax from O(b^d) to:",
         {"A": "O(b * d)", "B": "O(b^(d/2))", "C": "O(d^(b/2))", "D": "O(log(b^d))"}, "B",
         "When child moves are examined in best-first order, Alpha-Beta prunes roughly half the tree branches at alternating depths, achieving O(b^(d/2)) complexity, effectively doubling the search depth."),

        (6, 1, "Week 1: Search & Game Theory", "Day 6: Local Search & Genetic Algorithms",
         ["Hill climbing anomalies", "Simulated Annealing temperature schedules", "Genetic chromosome encoding", "Crossover and mutation operators"],
         3.0, "Probability of accepting worse state: P = exp(-delta_E / T)",
         "VLSI chip layout gate placement optimization and Traveling Salesperson Problem (TSP).",
         "UGC NET 2019 Dec", "In Simulated Annealing, when the temperature T approaches 0, the algorithm behaves exactly like:",
         {"A": "Breadth-First Search", "B": "Pure Random Walk", "C": "Standard Greedy Hill Climbing", "D": "Depth-First Search"}, "C",
         "As T -> 0, the acceptance probability exp(-delta_E / T) for worse moves approaches 0, meaning only strictly improving moves are accepted, reducing to greedy hill climbing."),

        (7, 1, "Week 1: Search & Game Theory", "Day 7: Week 1 Integration & PYQ Diagnostic Sprint",
         ["Comprehensive search problems review", "Admissibility proofs", "Alpha-Beta tree manual trace", "Timed mock sprint"],
         4.0, "Branching factor b* calculation: N = 1 + b* + (b*)^2 + ... + (b*)^d",
         "End-to-end autonomous navigation and routing engines.",
         "UGC NET 2024 June", "Which search algorithm combines the linear space complexity of DFS with the completeness of BFS?",
         {"A": "Uniform Cost Search", "B": "Iterative Deepening Depth-First Search (IDDFS)", "C": "Greedy Best-First Search", "D": "Bidirectional Search"}, "B",
         "IDDFS runs DFS with incrementally increasing depth limits. It is complete, optimal for uniform step costs, and retains linear space complexity O(bd)."),

        # WEEK 2: Knowledge Representation, Logic & Probabilistic Reasoning
        (8, 2, "Week 2: Logic & Probabilistic AI", "Day 8: Propositional Logic & Normal Forms",
         ["Conjunctive Normal Form (CNF)", "Disjunctive Normal Form (DNF)", "Tautology vs Contradiction vs Contingency", "Horn clause resolution"],
         3.0, "Implication elimination: (P -> Q) is logically equivalent to (~P v Q).",
         "Hardware circuit verification and SAT solvers for microchip safety checks.",
         "UGC NET 2020 Oct", "The proposition (P -> Q) -> (~P -> ~Q) is a:",
         {"A": "Tautology", "B": "Contradiction", "C": "Contingency", "D": "Valid argument"}, "C",
         "When P=False and Q=True, (P->Q) is True while (~P->~Q) is (True->False) which is False. True->False evaluates to False. When P=True, Q=True, it evaluates to True. Since it is neither always True nor always False, it is a Contingency."),

        (9, 2, "Week 2: Logic & Probabilistic AI", "Day 9: First-Order Logic & Skolemization",
         ["Universal and Existential quantifiers", "Scope of variables", "Conversion to Clause Form", "Skolem constants and Skolem functions"],
         3.5, "Eliminate existential quantifiers: exists y P(x, y) becomes P(x, f(x)) where f is a Skolem function.",
         "Legal contract verification and regulatory compliance automated rule engines.",
         "UGC NET 2021 Nov", "In Skolemization, an existential quantifier within the scope of universal quantifiers is replaced by:",
         {"A": "A Skolem constant", "B": "A Skolem function of the universally quantified variables", "C": "A free variable", "D": "A negated literal"}, "B",
         "Because the existential variable depends on the universal variable preceding it, it must be mapped to a function of those universal variables (Skolem function)."),

        (10, 2, "Week 2: Logic & Probabilistic AI", "Day 10: Unification & Resolution Refutation",
         ["Most General Unifier (MGU)", "Occur check in unification", "Resolvent generation", "Refutation completeness: deriving the empty clause (box)"],
         3.5, "Resolvent of (A v B) and (~A v C) with substitution theta is (B v C)theta.",
         "Automated medical diagnosis expert systems (MYCIN inference engine).",
         "UGC NET 2023 Dec", "Which substitution represents the Most General Unifier (MGU) for P(x, f(y)) and P(a, f(b))?",
         {"A": "{x/a, y/b}", "B": "{x/f(b), y/a}", "C": "{x/b, y/a}", "D": "{x/a, y/f(b)}"}, "A",
         "Matching terms pairwise: x unifies with a ({x/a}), and f(y) unifies with f(b) which yields y unifies with b ({y/b}). The combined MGU is {x/a, y/b}."),

        (11, 2, "Week 2: Logic & Probabilistic AI", "Day 11: Structured Knowledge (Semantic Nets, Frames)",
         ["IS-A and PART-OF inheritance hierarchies", "Slot-and-filler structures in Frames", "Default values and demons", "Conceptual Dependency theory"],
         3.0, "Multiple inheritance ambiguity resolved via Topological Sort / Inferential Distance.",
         "Enterprise Knowledge Graphs (Google Knowledge Graph, Wikidata entity linking).",
         "UGC NET 2019 June", "In Frame-based knowledge representation, procedures attached to slots that execute when values are accessed or updated are called:",
         {"A": "Inheritors", "B": "Demons (e.g., if-needed, if-added)", "C": "Skolemizers", "D": "Heuristics"}, "B",
         "In Frame systems, procedural attachments triggered automatically upon slot query or modification are known as demons (such as IF-NEEDED, IF-ADDED, IF-REMOVED)."),

        (12, 2, "Week 2: Logic & Probabilistic AI", "Day 12: Bayesian Networks & d-Separation",
         ["Conditional independence DAGs", "Chain rule of probability", "Markov Blanket (parents, children, and spouses)", "d-separation rules"],
         3.5, "P(X1, ..., Xn) = Prod_{i=1}^n P(Xi | Parents(Xi))",
         "Credit card fraud detection and spam filtering engines.",
         "UGC NET 2022 Oct", "In a Bayesian Belief Network, the Markov Blanket of a node X consists of:",
         {"A": "Only its parent nodes", "B": "Its parents, its children, and the other parents of its children (spouses)", "C": "Only its children nodes", "D": "All nodes in the network"}, "B",
         "A node X is conditionally independent of all other nodes in the network given its Markov Blanket, which strictly contains its parents, its children, and its children's co-parents (spouses)."),

        (13, 2, "Week 2: Logic & Probabilistic AI", "Day 13: Fuzzy Sets & Membership Operations",
         ["Crisp vs Fuzzy sets", "Standard fuzzy operations: Intersection (min), Union (max), Complement (1 - mu)", "Alpha-cut sets", "Convex fuzzy sets"],
         3.0, "mu_{A n B}(x) = min(mu_A(x), mu_B(x)); mu_{A u B}(x) = max(mu_A(x), mu_B(x))",
         "Automated anti-lock braking systems (ABS) and washing machine load sensors.",
         "UGC NET 2021 Dec", "If A is a fuzzy set with membership mu_A(x) = 0.7 and B is a fuzzy set with mu_B(x) = 0.4, the membership value in (A n ~B) is:",
         {"A": "0.3", "B": "0.6", "C": "0.4", "D": "0.7"}, "B",
         "Complement mu_{~B}(x) = 1 - 0.4 = 0.6. Intersection is the minimum: min(0.7, 0.6) = 0.6."),

        (14, 2, "Week 2: Logic & Probabilistic AI", "Day 14: Fuzzy Inference & Defuzzification",
         ["Mamdani inference pipeline", "Fuzzification of inputs", "Rule evaluation", "Defuzzification methods (Centroid, Bisector, MOM, SOM, LOM)"],
         3.5, "Centroid Defuzzification z* = Integral(z * mu(z) dz) / Integral(mu(z) dz)",
         "High-speed bullet train speed-control actuators and industrial climate controls.",
         "UGC NET 2023 June", "Which defuzzification method calculates the center of gravity of the combined fuzzy output area?",
         {"A": "Mean of Maxima (MOM)", "B": "Centroid Method (Center of Gravity)", "C": "Smallest of Maxima (SOM)", "D": "Height Defuzzifier"}, "B",
         "The Centroid / Center of Gravity (COG) method calculates the center of area under the aggregated fuzzy membership curve, providing the smoothest physical control signal."),

        # WEEK 3: Machine Learning, Statistical Learning & Deep Learning
        (15, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 15: Supervised Learning & Regularization",
         ["Cost functions (MSE, Cross-Entropy)", "Gradient descent mathematical derivation", "L1 (Lasso) vs L2 (Ridge) regularization", "Bias-Variance tradeoff"],
         3.5, "Lasso Cost = MSE + lambda * Sum(|w_i|); Ridge Cost = MSE + lambda * Sum(w_i^2)",
         "Real estate price prediction and customer churn probability estimation.",
         "UGC NET 2020 Oct", "Which regularization technique promotes feature sparsity by driving irrelevant weights to exactly zero?",
         {"A": "L2 Regularization (Ridge)", "B": "L1 Regularization (Lasso)", "C": "Dropout", "D": "Early Stopping"}, "B",
         "L1 regularization adds the absolute sum of weights to the loss, which has diamond-shaped constraint boundaries that intersect feature axes, forcing uninformative weights to become exactly 0 (sparsity)."),

        (16, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 16: Decision Tree Induction (ID3 & C4.5)",
         ["Entropy H(S) = -Sum(p_i * log2(p_i))", "Information Gain Calculation", "Gini Impurity = 1 - Sum(p_i^2)", "Gain Ratio to prevent high-branch bias"],
         4.0, "Gain(S, A) = Entropy(S) - Sum_{v} (|S_v| / |S|) * Entropy(S_v)",
         "Loan credit approval engines and clinical triage risk classification.",
         "UGC NET 2022 June", "In the ID3 algorithm, if a dataset S has 9 positive and 5 negative examples, the entropy Entropy(S) is calculated using:",
         {"A": "-(9/14)*log2(9/14) - (5/14)*log2(5/14)", "B": "(9/14)*log2(9/14) + (5/14)*log2(5/14)", "C": "1 - (9/14)^2 - (5/14)^2", "D": "log2(14/9)"}, "A",
         "Shannon Entropy is defined as -Sum(p_i * log2(p_i)). With p(+) = 9/14 and p(-) = 5/14, Entropy = -(9/14)*log2(9/14) - (5/14)*log2(5/14) approx 0.940 bits."),

        (17, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 17: Support Vector Machines (SVM) & Kernels",
         ["Maximum margin optimization", "Support vectors geometry", "Slack variables (C parameter)", "Kernel Trick (Linear, Polynomial, RBF/Gaussian)"],
         3.5, "Margin width = 2 / ||w||. Kernel function K(x, z) = exp(-gamma * ||x - z||^2)",
         "Cancer tumor classification from gene expression microarrays.",
         "UGC NET 2023 Dec", "In Support Vector Machines, if the hyperparameter C is set to an extremely large value, the model will:",
         {"A": "Allow large margins and risk underfitting", "B": "Penalize training errors heavily and risk overfitting", "C": "Ignore all support vectors", "D": "Convert to a linear regression model"}, "B",
         "The hyperparameter C balances margin width against misclassification penalties. A huge C forces zero margin violations on the training set (hard margin behavior), which risks severe overfitting."),

        (18, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 18: k-Means & Hierarchical Clustering",
         ["k-Means centroid update math", "Convergence criterion", "Dendrogram interpretation", "Linkage types (Single, Complete, Average)"],
         3.5, "k-Means objective J = Sum_{i=1}^k Sum_{x in C_i} ||x - mu_i||^2",
         "Customer market segmentation for targeted e-commerce marketing.",
         "UGC NET 2021 Nov", "In Agglomerative Hierarchical Clustering, Single Linkage defines the distance between two clusters as:",
         {"A": "The maximum distance between any two points in the clusters", "B": "The minimum distance between any single point in one cluster and any single point in the other", "C": "The distance between cluster centroids", "D": "The average of all pairwise distances"}, "B",
         "Single linkage calculates the minimum distance between points across clusters, which can produce long elongated chaining clusters."),

        (19, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 19: PCA & Dimensionality Reduction",
         ["Covariance matrix construction", "Eigenvalues and Eigenvectors", "Projection matrix transformation", "Scree plot and explained variance"],
         4.0, "Principal components are eigenvectors of covariance matrix Sigma = (1/N) * X^T * X",
         "Facial recognition feature compression (Eigenfaces) and financial risk factor analysis.",
         "UGC NET 2022 Oct", "In Principal Component Analysis (PCA), the first principal component corresponds to:",
         {"A": "The eigenvector associated with the smallest eigenvalue", "B": "The eigenvector associated with the largest eigenvalue", "C": "The mean of the feature vector", "D": "The determinant of the covariance matrix"}, "B",
         "The first principal component captures the maximum variance in the data, which mathematically corresponds to the eigenvector of the sample covariance matrix that has the largest eigenvalue."),

        (20, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 20: Multilayer Perceptron & Backpropagation Calculus",
         ["Feedforward computation", "Activation functions (Sigmoid, Tanh, ReLU)", "Gradient of loss w.r.t weights via Chain Rule", "Vanishing gradient phenomenon"],
         4.0, "delta_j = dE/d(net_j) = (dE/dy_j) * f'(net_j); w_ij = w_ij - eta * delta_j * y_i",
         "Autonomous vehicle computer vision and optical character recognition (OCR).",
         "UGC NET 2020 Oct", "Why is the ReLU activation function f(x) = max(0, x) preferred over the Sigmoid function in deep neural networks?",
         {"A": "ReLU is completely bounded between 0 and 1", "B": "ReLU mitigates the vanishing gradient problem for positive inputs", "C": "ReLU is continuously differentiable everywhere", "D": "ReLU prevents dead neurons"}, "B",
         "The derivative of the sigmoid function saturates at 0 for large positive or negative values, causing gradients to vanish during backpropagation in deep architectures. ReLU has a constant derivative of 1 for x > 0."),

        (21, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 21: Convolutional Neural Networks (CNNs)",
         ["2D Convolution mathematics", "Feature maps, stride, and padding formulas", "Max pooling vs Average pooling", "LeNet, AlexNet, ResNet skip connections"],
         4.0, "Output Dimension O = floor((W - K + 2P) / S) + 1",
         "Radiology chest X-ray pneumonia detection and biometric facial unlocking.",
         "UGC NET 2023 June", "An input image of size 32x32 is convolved with a 5x5 kernel using stride S=1 and zero padding P=2. What is the output feature map size?",
         {"A": "28x28", "B": "32x32", "C": "30x30", "D": "36x36"}, "B",
         "Using formula O = floor((W - K + 2P)/S) + 1: O = floor((32 - 5 + 2*2)/1) + 1 = floor(31/1) + 1 = 32. Output is 32x32 ('Same' padding)."),

        (22, 3, "Week 3: ML, Statistical Learning & Neural Nets", "Day 22: Recurrent Architectures & Transformers",
         ["Sequence modeling with RNNs", "LSTM gates: Forget, Input, Output", "Scaled Dot-Product Self-Attention math", "Multi-Head Attention"],
         4.0, "Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V",
         "Large Language Models (ChatGPT, Claude) and real-time speech translation.",
         "UGC NET 2024 June", "In the Transformer attention mechanism, why is the dot product Q * K^T scaled by 1/sqrt(d_k)?",
         {"A": "To convert vectors to unit length", "B": "To prevent extremely large values that push the Softmax function into regions with near-zero gradients", "C": "To eliminate the need for positional encoding", "D": "To invert the matrix"}, "B",
         "For large key dimensions d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) stabilizes the gradient flow."),

        # WEEK 4: Big Data, Cloud Computing, NLP & Final Comprehensive Mocks
        (23, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 23: Natural Language Processing (TF-IDF & Embeddings)",
         ["Bag-of-Words limitations", "TF-IDF formula and document frequency weighting", "Word2Vec (Skip-gram vs CBOW)", "Cosine similarity between word vectors"],
         3.5, "TF-IDF(t, d, D) = TF(t, d) * log(N / DF(t))",
         "Legal document discovery, sentiment analysis, and search engine ranking.",
         "UGC NET 2022 Oct", "In TF-IDF scoring, if a word appears in all N documents of a corpus, its IDF value will be:",
         {"A": "1.0", "B": "0.0", "C": "N", "D": "Infinity"}, "B",
         "IDF is calculated as log(N / DF). If the term appears in all N documents, DF = N, so IDF = log(N / N) = log(1) = 0. Such ubiquitous words receive zero weight."),

        (24, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 24: Formal Grammars & Parsing (CYK Algorithm)",
         ["Chomsky hierarchy languages and automata", "Context-Free Grammars (CFG)", "Chomsky Normal Form (CNF: A -> BC or A -> a)", "CYK dynamic programming table"],
         3.5, "CYK algorithm time complexity is O(n^3 * |G|), parsing arbitrary CFGs in polynomial time.",
         "Syntax tree analysis in compilers and grammatical structure analysis in Siri/Alexa.",
         "UGC NET 2021 Dec", "To parse a string of length n using the Cocke-Younger-Kasami (CYK) algorithm, the grammar must first be in:",
         {"A": "Greibach Normal Form (GNF)", "B": "Chomsky Normal Form (CNF)", "C": "Backus-Naur Form (BNF)", "D": "Deterministic Finite Automata"}, "B",
         "The CYK dynamic programming algorithm requires the context-free grammar to be strictly in Chomsky Normal Form (CNF) where all productions are of the form A -> BC or A -> a."),

        (25, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 25: Hadoop Architecture & MapReduce Execution",
         ["HDFS NameNode and DataNode roles", "Block size and 3x default replication", "Map, Shuffle, Sort, and Reduce phases", "Combiner function optimization"],
         3.5, "Map: (k1, v1) -> list(k2, v2); Reduce: (k2, list(v2)) -> list(k3, v3)",
         "Large-scale web index creation (Google PageRank computation over billions of URLs).",
         "UGC NET 2020 Oct", "In the Hadoop MapReduce framework, what operation occurs between the Map phase and the Reduce phase?",
         {"A": "Block Replication", "B": "Shuffle and Sort", "C": "Speculative Execution", "D": "Data Serialization"}, "B",
         "The intermediate key-value pairs produced by Mappers undergo Shuffle and Sort, which aggregates all values associated with the same intermediate key before feeding them to the appropriate Reducer."),

        (26, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 26: Apache Spark & Distributed RDDs",
         ["Spark in-memory execution vs Hadoop disk I/O", "Resilient Distributed Datasets (RDDs)", "Transformations (Lazy evaluation) vs Actions", "Narrow vs Wide dependencies (Shuffle)"],
         3.5, "Wide transformation (e.g., groupByKey, reduceByKey) requires network shuffling across partitions.",
         "Real-time streaming fraud prevention in banking transactions.",
         "UGC NET 2023 Dec", "Which of the following Apache Spark operations represents a Wide Dependency that triggers a network shuffle across cluster nodes?",
         {"A": "map()", "B": "filter()", "C": "groupByKey()", "D": "flatMap()"}, "C",
         "map(), filter(), and flatMap() are Narrow dependencies where each parent partition is used by at most one child partition without network shuffling. groupByKey() requires shuffling data across multiple cluster nodes."),

        (27, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 27: NoSQL Database Categories & CAP Theorem",
         ["CAP Theorem (Consistency, Availability, Partition Tolerance)", "ACID vs BASE properties", "Columnar (Cassandra), Document (Mongo), Key-Value (Redis), Graph (Neo4j)", "Consistent hashing"],
         3.5, "CAP theorem: A distributed network can satisfy at most two of {C, A, P} simultaneously.",
         "Social media graph feeds (Instagram/Twitter follow relationships and timeline generation).",
         "UGC NET 2021 Nov", "According to Brewer's CAP theorem, in the presence of a network partition, a distributed system must choose between:",
         {"A": "Latency and Throughput", "B": "Consistency and Availability", "C": "Atomicity and Durability", "D": "Encryption and Compression"}, "B",
         "When network partitions inevitably occur (P is mandatory in distributed systems), the architect must choose whether to maintain strong Consistency (rejecting out-of-sync requests) or high Availability (serving stale responses)."),

        (28, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 28: Cloud Virtualization & Containers (Docker/K8s)",
         ["Type 1 (Bare-Metal) vs Type 2 (Hosted) Hypervisors", "Container cgroups and namespaces vs full OS VMs", "Kubernetes Pod lifecycle and service mesh", "Serverless Functions (Cold starts)"],
         3.5, "Container virtualization isolates processes sharing host kernel, achieving sub-second startup.",
         "Cloud microservices auto-scaling on Amazon AWS ECS / Google Cloud Run during flash sales.",
         "UGC NET 2022 June", "Which of the following is an example of a Type 1 (Bare-Metal) Hypervisor?",
         {"A": "Oracle VirtualBox", "B": "VMware Workstation", "C": "VMware ESXi", "D": "QEMU on Windows"}, "C",
         "Type 1 Hypervisors run directly on the bare physical host hardware without an underlying host operating system (e.g., VMware ESXi, Microsoft Hyper-V, Xen). VirtualBox and VMware Workstation run on top of an existing OS (Type 2)."),

        (29, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 29: Model Evaluation Metrics & MLOps Pipelines",
         ["Confusion Matrix: TP, FP, TN, FN", "Precision, Recall, F1-Score, Specificity", "ROC Curve & AUC metric", "Data drift, concept drift, and model deployment"],
         3.5, "Precision = TP / (TP + FP); Recall = TP / (TP + FN); F1 = 2 * (Prec * Rec) / (Prec + Rec)",
         "Automated medical pathology imaging quality control and fraud classifier monitoring.",
         "UGC NET 2023 June", "In an imbalanced classification problem where false negatives are catastrophically costly (e.g., rare disease screening), which metric should be maximized?",
         {"A": "Accuracy", "B": "Precision", "C": "Recall (Sensitivity)", "D": "Specificity"}, "C",
         "Recall = TP / (TP + FN). When false negatives must be minimized (missing a sick patient is disastrous), maximizing Recall ensures as many true positive cases as possible are detected."),

        (30, 4, "Week 4: Big Data, Cloud & Exam Sprint", "Day 30: Grand Full-Length AI & Data Science Mock Exam",
         ["Timed 100-Question Grand Mock Test", "Paper 1 & Paper 2 combined scoring", "Cutoff benchmarking for JRF / Assistant Professor", "Final formula sheet review"],
         4.5, "Total Marks = 200; UGC NET JRF target = 65%+ aggregate score.",
         "End-to-end examination readiness and professional academic competency.",
         "UGC NET 2024 June", "Which learning paradigm allows an agent to learn optimal behaviors by interacting with an environment through trial-and-error rewards?",
         {"A": "Supervised Learning", "B": "Reinforcement Learning (RL)", "C": "Unsupervised Clustering", "D": "Deductive Reasoning"}, "B",
         "Reinforcement Learning formalizes decision-making via Markov Decision Processes (MDPs), where an agent learns an optimal policy through scalar feedback rewards.")
    ]

    for item in plan_data:
        c.execute("""
            INSERT INTO study_plan_30_days 
            (day_number, phase_week, phase_title, module_title, core_topics_json, target_hours, key_formula, real_time_application, pyq_year_session, pyq_question_text, pyq_options_json, official_answer_key, problem_demo_walkthrough)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item[0], item[1], item[2], item[3],
            json.dumps(item[4]), item[5], item[6], item[7],
            item[8], item[9], json.dumps(item[10]), item[11], item[12]
        ))

    print("-> Inserted 30 Days Master Study Plan.")

    # 4. Insert 30 Solved PYQs into questions table
    # Clear previous questions for this subject to prevent stale state
    c.execute("DELETE FROM questions WHERE subject_id = ?", (sub_id,))

    for item in plan_data:
        day_num = item[0]
        u_num = min(10, ((day_num - 1) // 3) + 1)
        u_id = unit_id_map.get(u_num)
        opts = item[10]
        q_text = item[9]
        ans = item[11]
        expl = item[12]
        app = item[7]
        formula = item[6]
        yr = 2024 if "2024" in item[8] else (2023 if "2023" in item[8] else (2022 if "2022" in item[8] else 2021))
        sess = "June" if "June" in item[8] else "December"

        c.execute("""
            INSERT INTO questions (
                subject_id, unit_id, question_number, question_text,
                option_a, option_b, option_c, option_d, correct_option,
                explanation, numerical_formula, real_time_application,
                difficulty, question_type, year, session, is_official_pyq
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (
            sub_id, u_id, day_num, q_text,
            opts.get("A", ""), opts.get("B", ""), opts.get("C", ""), opts.get("D", ""),
            ans, expl, formula, app,
            "Hard" if day_num % 3 == 0 else "Medium",
            "MCQ", yr, sess
        ))

    print(f"-> Inserted 30 Solved PYQs with official keys and real-time applications into questions table.")

    # 5. Insert dedicated AI & Data Science Mock Test into mock_tests
    c.execute("SELECT id FROM questions WHERE subject_id = ? ORDER BY id ASC", (sub_id,))
    q_ids = [row["id"] for row in c.fetchall()]

    c.execute("DELETE FROM mock_tests WHERE subject_id = ?", (sub_id,))
    c.execute("""
        INSERT INTO mock_tests (
            title, subject_id, duration_minutes, total_questions, total_marks,
            passing_percentage, marking_scheme, questions_json, difficulty, is_active
        ) VALUES (
            'UGC NET Artificial Intelligence & Data Science Specialized Mock Examination',
            ?, 60, ?, ?, 40.0, '+2 for correct, 0 for incorrect/unattempted', ?, 'Mixed', 1
        )
    """, (sub_id, len(q_ids), len(q_ids) * 2, json.dumps(q_ids)))

    print("-> Inserted specialized AI & Data Science mock test.")

    conn.commit()
    conn.close()
    print("Database seeding for AI & Data Science successfully completed!")

if __name__ == "__main__":
    seed_ai_ds()
