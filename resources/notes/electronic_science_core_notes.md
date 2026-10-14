# UGC NET Subject 88: Electronic Science
## Core High-Yield Revision Notes & Formulas
**Faculty:** Jane Rose | Asst. Professor | CSE  
**Scheme:** 100 Compulsory Questions • 200 Marks • Duration: 2 Hours

---

### Unit 1: Semiconductor Devices & Fabrication
- **Carrier Transport & Current Densities:**
  - Total Current: $J_{total} = J_{drift} + J_{diffusion} = (q n \mu_n + q p \mu_p) E + q D_n \frac{dn}{dx} - q D_p \frac{dp}{dx}$.
  - Einstein Relation: $\frac{D_n}{\mu_n} = \frac{D_p}{\mu_p} = V_T = \frac{k_B T}{q} \approx 26\text{ mV at } 300\text{ K}$.
  - Hall Effect: $V_H = \frac{I B}{n q w}$, $R_H = \frac{1}{n q}$ (negative for electrons, positive for holes).
- **IC Fabrication Steps:**
  - Substrate -> Oxidation ($SiO_2$) -> Photolithography -> Etching -> Diffusion / Ion Implantation -> Metallization.

---

### Unit 2: Operational Amplifiers & Analog Circuits
- **Ideal Op-Amp Properties:**
  - $A_{OL} = \infty$, $R_{in} = \infty$, $R_{out} = 0$, $\text{Bandwidth} = \infty$, $\text{CMRR} = \infty$, Offset voltage $= 0$.
- **Noise Gain vs Signal Gain:**
  - Inverting Amplifier: Signal Gain $A_v = -\frac{R_f}{R_1}$. Noise Gain $A_{noise} = 1 + \frac{R_f}{R_1}$.
  - Non-inverting Amplifier: Signal Gain $A_v = 1 + \frac{R_f}{R_1}$. Noise Gain $A_{noise} = 1 + \frac{R_f}{R_1}$.
  - Output Offset: $V_{out,os} = V_{os} \cdot \left(1 + \frac{R_f}{R_1}\right)$.

---

### Unit 5: Signals, Systems & Digital Signal Processing
- **Sampling Theorems:**
  - Lowpass Nyquist Rate: $f_s \ge 2 f_{max}$.
  - Bandpass Sampling: For band between $f_L$ and $f_H$ with bandwidth $B = f_H - f_L$:
    $$f_s = \frac{2 f_H}{n}, \quad \text{where } n = \left\lfloor \frac{f_H}{B} \right\rfloor$$
- **Z-Transform ROC Properties:**
  - Causal LTI system is stable if and only if all poles lie strictly inside the unit circle ($|z| < 1$).

---
**Jane Rose | Asst. Professor | CSE**
