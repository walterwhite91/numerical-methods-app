# Numerical Methods (MCSC 202) - Complete Reference Document

## Based on Class Notes (1000066477.pdf)

---

# 1. ERROR ANALYSIS

## 1.1 Division Error Formula

**Formula:**

\[
\epsilon_R = \frac{\epsilon_A}{a/b} = \left( \frac{|\epsilon_A|}{a} + \frac{|\epsilon_A^2|}{b} \right)
\]

**Derivation:**

\[
\frac{E_A}{a} = \frac{b \cdot \epsilon_A^1 - a \cdot \epsilon_A^2}{b^2} = \frac{a}{b} \left( \frac{\epsilon_A^1 - \epsilon_A^2}{a} \right)
\]

**Relative Error:**

\[
\epsilon_R = \frac{\epsilon_A}{a/b} = \left( \frac{|\epsilon_A|}{a} + \frac{|\epsilon_A^2|}{b} \right)
\]

---

## 1.2 General Error Formula

**For function \(u = f(n_1, n_2, n_3, \dots, n_n)\):**

Using Taylor Series expansion:

\[
\Delta u = \Delta n_1 \cdot \frac{\partial f}{\partial n_1} + \Delta n_2 \cdot \frac{\partial f}{\partial n_2} + \dots + \Delta n_n \cdot \frac{\partial f}{\partial n_n}
\]

**Maximum Error:**

\[
(\Delta u)_{max} \leq \left| \Delta n_1 \cdot \frac{\partial f}{\partial n_1} \right| + \left| \Delta n_2 \cdot \frac{\partial f}{\partial n_2} \right| + \dots + \left| \Delta n_n \cdot \frac{\partial f}{\partial n_n} \right|
\]

---

## 1.3 Round-off Error

**Definition:** The small difference between the true value of a number and the rounded (approximate) value.

**Example:** If 3.14159265 is rounded to 3 decimal places: 3.142
- Round-off error = \(3.14159265 - 3.142 \approx -0.00040735\)

**Absolute Error (EA):**
\[
EA = X - X_1
\]

**Relative Error (ER):**
\[
ER = \frac{EA}{X}
\]

---

## 1.4 Multiplication/Product Error Rule

**For product uv:**

\[
\frac{\Delta(uv)}{uv} = \frac{\Delta u}{u} + \frac{\Delta v}{v}
\]

**For quotient x/y:**

\[
\frac{\Delta(x/y)}{x/y} = \frac{\Delta x}{x} + \frac{\Delta y}{y}
\]

---

## 1.5 Error of Product of n Numbers

\[
\epsilon_A = (a + \epsilon_A^1)(b + \epsilon_A^2)(c + \epsilon_A^3) - abc
\]

\[
= \epsilon_A^2bc + a\epsilon_A^2\epsilon_A^2 + bc\epsilon_A^1 + c\epsilon_A^1\epsilon_A^2 + abc\epsilon_A^3 + a\epsilon_A^2\epsilon_A^3 + b\epsilon_A^1\epsilon_A^3 + \epsilon_A^1\epsilon_A^2\epsilon_A^3
\]

---

## 1.6 Error Propagation in Summation

**Procedure:**
1. Identify numbers with greatest absolute error
2. Round off other numbers to same decimal places
3. Sum all numbers
4. Total absolute error = sum of individual absolute errors + rounding error

**Example from notes:**
- Numbers: 305-1 and 143-3 have absolute error 0.05
- Round all others to two decimal digits
- Total absolute error = \(2(0.05) + 7(0.005) = 0.135 \approx 0.14\)
- Add rounding error 0.01: Total = 0.15
- Result: \(S = 472.95 \pm 0.15\)

---

# 2. ROOT FINDING METHODS

## 2.1 Bisection Method

**Formula:**

\[
x_1 = \frac{a + b}{2}
\]

**Algorithm:**
1. Choose interval \([a, b]\) such that \(f(a) \cdot f(b) < 0\) (root lies inside)
2. Compute midpoint \(c = \frac{a + b}{2}\)
3. Evaluate \(f(c)\)
4. If \(f(c) = 0\), c is the root
5. If \(f(a) \cdot f(c) < 0\), root lies in \([a, c]\), set \(b = c\)
6. Else root lies in \([c, b]\), set \(a = c\)
7. Repeat until desired accuracy

**Stopping Criteria:**
- \(|b - a| < \text{tolerance}\) OR
- \(|f(c)| < \text{tolerance}\)

**Number of iterations needed:**
\[
n \geq \ln\left(\frac{b-a}{5 \times 10^{-N}}\right) \quad \text{(for N decimal places)}
\]

**Example from notes (pg 17):**
For \(f(x) = x^3 - x - 11 = 0\):

| Iteration | a | b | c | sign of f(c) |
|-----------|---|---|---|--------------|
| 1 | 1 | 2 | 1.5 | +ve |
| 2 | 1 | 1.5 | 1.25 | -ve |
| 3 | 1.25 | 1.5 | 1.375 | +ve |
| 4 | 1.25 | 1.375 | 1.3125 | -ve |
| 5 | 1.3125 | 1.375 | 1.34375 | +ve |
| 6 | 1.3125 | 1.3438 | 1.3281 | +ve |
| 7 | 1.3125 | 1.3281 | 1.3203 | -ve |
| 8 | 1.3203 | 1.3281 | 1.3248 | -ve |
| 9 | 1.3203 | 1.3248 | 1.3225 | -ve |
| 10 | 1.3225 | 1.3248 | 1.3236 | -ve |
| 11 | 1.3236 | 1.3248 | 1.3242 | -ve |

---

## 2.2 False Position Method (Regula Falsi)

**Formula:**

\[
x_1 = \frac{a f(b) - b f(a)}{f(b) - f(a)}
\]

**Algorithm:**
1. Choose interval \([a, b]\) where \(f(a)\) and \(f(b)\) have opposite signs
2. Compute \(x_1 = \frac{a f(b) - b f(a)}{f(b) - f(a)}\)
3. Evaluate \(f(x_1)\)
4. If \(f(x_1)\) has same sign as \(f(a)\), set \(a = x_1\)
5. Else set \(b = x_1\)
6. Repeat until convergence

**Example from notes (pg 18):**
For \(f(x) = x^3 - x - 11 = 0\):
- \(f(1)\) is negative, \(f(2)\) is positive (implied from context)
- Root lies between 1 and 2
- \(x_1 = \frac{1 + 1.5}{2} = 1.25\)
- \(f(x_1) = -19/64\) (negative)
- Root lies between 1.25 and 1.5
- Successive approximations: 1.3125, 1.34375, 1.328125, etc.

---

## 2.3 Newton-Raphson Method

**Formula:**

\[
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
\]

**Algorithm:**
1. Choose initial guess \(x_0\)
2. Compute \(f(x_n)\) and \(f'(x_n)\)
3. Update: \(x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}\)
4. Repeat until convergence

**Convergence Criteria:**
- Rate of convergence is quadratic (p = 2)
- Requires \(f'(x) \neq 0\)
- Initial guess must be sufficiently close to root

**Example from notes (pg 28):**
For \(f(x) = x^3 - x - 1 = 0\):

| n | x_n | x_{n+1} |
|---|-----|---------|
| 1 | 1 | 1.5 |
| 2 | 1.5 | 1.3478 |
| 3 | 1.3478 | 1.3251 |
| 4 | 1.3251 | 1.3247 |
| 5 | 1.3247 | 1.3247 |

---

## 2.4 Fixed Point Iteration Method

**Formula:**

\[
x_{n+1} = \Phi(x_n)
\]

Where \(x = \Phi(x)\) is derived from \(f(x) = 0\)

**Algorithm:**
1. Rewrite \(f(x) = 0\) as \(x = \Phi(x)\)
2. Choose initial guess \(x_0\)
3. Compute \(x_{n+1} = \Phi(x_n)\)
4. Repeat until convergence

**Convergence Criteria:**

\[
|\Phi'(x)| < 1
\]

**Example from notes (pg 28):**
For \(f(x) = x^3 - x - 1 = 0\), rewrite as \(x = \sqrt[3]{x+1}\):
- \(\Phi'(x) = \frac{1}{3}(x+1)^{-\frac{2}{3}}\)
- \(|\Phi'(1)| < 1\) (converges)

| n | x_{n+1} | \Phi(x_n) |
|---|---------|-----------|
| 1 | 1 | 1.2599 |
| 2 | 1.2599 | 1.3123 |
| 3 | 1.32023 | 1.3224 |
| 4 | 1.324 | 1.3243 |
| 5 | 1.32403 | 1.3246 |
| 6 | 1.32406 | 1.3247 |
| 7 | 1.3247 | 1.3247 |

---

# 3. INTERPOLATION

## 3.1 Newton's Forward Interpolation Formula

**Formula:**

\[
y_p = y_0 + p\Delta y_0 + \frac{p(p-1)}{2!}\Delta^2 y_0 + \frac{p(p-1)(p-2)}{3!}\Delta^3 y_0 + \cdots + \frac{p(p-1)\cdots(p-n+1)}{n!}\Delta^n y_0
\]

**Where:**
\[
p = \frac{x - x_0}{h}
\]

**Algorithm:**
1. Construct difference table (Δ, Δ², Δ³, ...)
2. Identify \(x_0\) (first data point)
3. Compute \(p = \frac{x - x_0}{h}\)
4. Apply the formula using forward differences

**Note:** Use when interpolating near the beginning of the table.

---

## 3.2 Newton's Backward Interpolation Formula

**Formula:**

\[
y_p = y_n + \frac{\nabla y_n}{1!}p + \frac{\nabla^2 y_n}{2!}p(p+1) + \frac{\nabla^3 y_n}{3!}p(p+1)(p+2) + \cdots + \frac{\nabla^n y_n}{n!}p(p+1)\cdots(p+n-1)
\]

**Where:**
\[
p = \frac{x - x_n}{h}
\]

**Algorithm:**
1. Construct backward difference table (∇y, ∇²y, ∇³y, ...)
2. Identify \(x_n\) (last data point)
3. Compute \(p = \frac{x - x_n}{h}\)
4. Apply the formula using backward differences

**Note:** Use when interpolating near the end of the table.

---

## 3.3 Gauss Forward Interpolation Formula

**Formula:**

\[
y_p = y_0 + p\Delta y_0 + \frac{p(p-1)}{2!}\Delta^2 y_{-1} + \frac{p(p+1)(p-1)}{3!}\Delta^3 y_{-1} + \frac{p(p+1)(p-1)(p-2)}{4!}\Delta^4 y_{-2} + \cdots
\]

**Where:**
\[
p = \frac{x - x_0}{h}
\]

**Note:** Uses differences centered around \(y_0\).

---

## 3.4 Gauss Backward Interpolation Formula

**Formula:**

\[
y_p = y_0 + p\Delta y_0 + \frac{p(p+1)}{2!}\Delta^2 y_{-1} + \frac{p(p+1)(p-1)}{3!}\Delta^3 y_{-2} + \frac{p(p+1)(p+2)(p-1)}{4!}\Delta^4 y_{-2} + \cdots
\]

---

## 3.5 Stirling's Interpolation Formula

**Formula:**

\[
y_p = y_0 + p\left(\frac{\Delta y_0 + \Delta y_{-1}}{2}\right) + \frac{p^2}{2!}\Delta^2 y_{-1} + \frac{p(p^2-1)}{3!}\left(\frac{\Delta^3 y_{-1} + \Delta^3 y_{-2}}{2}\right) + \frac{p^2(p^2-1)}{4!}\Delta^4 y_{-2} + \cdots
\]

---

## 3.6 Bessel's Interpolation Formula

**Formula:**

\[
y_p = \frac{y_0 + y_1}{2} + \left(p - \frac{1}{2}\right)\Delta y_0 + \frac{p(p-1)}{2!}\left(\frac{\Delta^2 y_{-1} + \Delta^2 y_0}{2}\right) + \frac{p(p-1)\left(p-\frac{1}{2}\right)}{3!}\Delta^3 y_{-1} + \cdots
\]

---

## 3.7 Everett's Interpolation Formula

**Formula:**

\[
y_p = q y_0 + \frac{q(q^2-1^2)}{3!}\Delta^2 y_{-1} + \frac{q(q^2-1^2)(q^2-2^2)}{5!}\Delta^4 y_{-2} + \cdots + p y_1 + \frac{p(p^2-1^2)}{3!}\Delta^2 y_0 + \frac{p(p^2-1^2)(p^2-2^2)}{5!}\Delta^4 y_{-1} + \cdots
\]

**Where:**
\[
q = 1 - p
\]

**Note:** Uses only even-order differences. This is extensively used and is considered a very good interpolation formula.

---

## 3.8 Lagrange's Interpolation Formula

**Formula:**

\[
y = \sum_{i=0}^{n} y_i L_i(x)
\]

**Where:**

\[
L_i(x) = \prod_{\substack{j=0 \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j} = \frac{(x-x_0)(x-x_1)\cdots(x-x_{i-1})(x-x_{i+1})\cdots(x-x_n)}{(x_i-x_0)(x_i-x_1)\cdots(x_i-x_{i-1})(x_i-x_{i+1})\cdots(x_i-x_n)}
\]

**For n = 1 (Linear Interpolation):**

\[
y = y_0 \frac{x-x_1}{x_0-x_1} + y_1 \frac{x-x_0}{x_1-x_0}
\]

**Properties of Lagrange Basis Polynomials:**
- \(L_i(x_i) = 1\)
- \(L_i(x_j) = 0\) for \(i \neq j\)

**Algorithm:**
1. Identify all data points \((x_i, y_i)\)
2. For each i, compute \(L_i(x)\)
3. Sum \(y_i L_i(x)\)

**Use:** When data points are not equally spaced.

---

## 3.9 Newton's General Interpolation Formula (Divided Differences)

**For unequally spaced data points \((x_0, y_0), (x_1, y_1), \dots, (x_n, y_n)\):**

**Formula:**

\[
y = y_0 + (x-x_0)[x_0, x_1] + (x-x_0)(x-x_1)[x_0, x_1, x_2] + \cdots + (x-x_0)(x-x_1)\cdots(x-x_{n-1})[x_0, x_1, \dots, x_n]
\]

**Divided Differences:**

**First order:**
\[
[x_0, x_1] = \frac{y_1 - y_0}{x_1 - x_0}
\]

**Second order:**
\[
[x_0, x_1, x_2] = \frac{[x_1, x_2] - [x_0, x_1]}{x_2 - x_0}
\]

**Third order:**
\[
[x_0, x_1, x_2, x_3] = \frac{[x_1, x_2, x_3] - [x_0, x_1, x_2]}{x_3 - x_0}
\]

**Algorithm:**
1. Construct divided difference table
2. Apply Newton's general interpolation formula

**Example from notes (pg 71):**
Find f(301) from data: (300, 2.4771), (304, 2.4829), (305, 2.4833), (307, 2.4871)

Divided difference table:

| x | y | 1st DD | 2nd DD | 3rd DD |
|---|---|--------|--------|--------|
| 300 | 2.4771 | 1.45×10⁻³ | | |
| 304 | 2.4829 | 1.4×10⁻³ | 0 | |
| 305 | 2.4873 | 1.4×10⁻³ | 0 | 0 |
| 307 | 2.4871 | | | |

Using Newton's general formula:
\[
y = 2.4771 + (301-300)(0.00145) = 2.4796
\]

---

# 4. NUMERICAL DIFFERENTIATION

## 4.1 Differentiation using Newton's Forward Formula

**Given Newton's forward interpolation:**

\[
y_p = y_0 + p\Delta y_0 + \frac{p(p-1)}{2!}\Delta^2 y_0 + \frac{p(p-1)(p-2)}{3!}\Delta^3 y_0 + \frac{p(p-1)(p-2)(p-3)}{4!}\Delta^4 y_0 + \cdots
\]

**Where \(p = \frac{x-x_0}{h}\) and \(\frac{dy}{dx} = \frac{dy}{dp} \cdot \frac{dp}{dx} = \frac{1}{h}\frac{dy}{dp}\)**

**First Derivative:**

\[
\frac{dy}{dx} = \frac{1}{h}\left[\Delta y_0 + \frac{2p-1}{2!}\Delta^2 y_0 + \frac{3p^2 - 6p + 2}{3!}\Delta^3 y_0 + \frac{4p^3 - 18p^2 + 22p - 6}{4!}\Delta^4 y_0 + \cdots\right]
\]

**At \(x = x_0\) (p = 0):**

\[
\left(\frac{dy}{dx}\right)_{x=x_0} = \frac{1}{h}\left[\Delta y_0 - \frac{1}{2}\Delta^2 y_0 + \frac{1}{3}\Delta^3 y_0 - \frac{1}{4}\Delta^4 y_0 + \cdots\right]
\]

**Second Derivative:**

\[
\frac{d^2y}{dx^2} = \frac{1}{h^2}\left[\Delta^2 y_0 + \frac{6p-6}{3!}\Delta^3 y_0 + \frac{12p^2 - 36p + 22}{4!}\Delta^4 y_0 + \cdots\right]
\]

**At \(x = x_0\) (p = 0):**

\[
\left(\frac{d^2y}{dx^2}\right)_{x=x_0} = \frac{1}{h^2}\left[\Delta^2 y_0 - \frac{6}{3!}\Delta^3 y_0 + \frac{22}{4!}\Delta^4 y_0 + \cdots\right]
\]

---

## 4.2 Central Difference Formulas

**First Derivative (Central Difference):**

\[
y'(x) = \frac{y(x+h) - y(x-h)}{2h}
\]

**Or with discrete notation:**

\[
y_i' = \frac{y_{i+1} - y_{i-1}}{2h}
\]

**Second Derivative (Central Difference):**

\[
y''(x) = \frac{y(x+h) - 2y(x) + y(x-h)}{h^2}
\]

**Or:**

\[
y_i'' = \frac{y_{i+1} - 2y_i + y_{i-1}}{h^2}
\]

---

# 5. NUMERICAL INTEGRATION

## 5.1 General Integration Formula

**Starting from Newton's Forward Interpolation:**

\[
I = \int_{x_0}^{x_n} y \, dx = nh\left[y_0 + \frac{\Delta y_0 \cdot n}{2} + \frac{\Delta^2 y_0}{12}(2n^2-3n) + \frac{\Delta^3 y_0}{24}(n^3-4n^2+2n) + \cdots\right]
\]

---

## 5.2 Trapezoidal Rule

**Formula (n = 1):**

\[
\int_{x_0}^{x_1} y \, dx = \frac{h}{2}(y_0 + y_1)
\]

**Composite Trapezoidal Rule:**

\[
\int_{x_0}^{x_n} y \, dx = \frac{h}{2}\left[y_0 + y_n + 2(y_1 + y_2 + \cdots + y_{n-1})\right]
\]

**Algorithm:**
1. Divide interval [a,b] into n equal subintervals with step h
2. Compute y-values at each point
3. Apply: \(I = \frac{h}{2}[y_0 + y_n + 2(y_1 + y_2 + \cdots + y_{n-1})]\)

---

## 5.3 Simpson's 1/3 Rule

**Formula (n = 2):**

\[
\int_{x_0}^{x_2} y \, dx = \frac{h}{3}(y_0 + 4y_1 + y_2)
\]

**Composite Simpson's 1/3 Rule (n even):**

\[
\int_{x_0}^{x_n} y \, dx = \frac{h}{3}\left[y_0 + y_n + 4(y_1 + y_3 + \cdots + y_{n-1}) + 2(y_2 + y_4 + \cdots + y_{n-2})\right]
\]

**Example from notes (pg 100):**
\[
I = \int_0^2 \frac{dx}{x^3 + x + 1}, \quad h = 0.25, \quad n = 8
\]

| x | y |
|---|-----|
| 0 | 1 |
| 0.25 | 0.79 |
| 0.50 | 0.6154 |
| 0.75 | 0.4604 |
| 1 | 0.3334 |
| 1.25 | 0.2379 |
| 1.50 | 0.1702 |
| 1.75 | 0.1233 |
| 2.00 | 0.0909 |

\[
I = \frac{0.25}{3}[1 + 4(0.79 + 0.4604 + 0.2379 + 0.1233) + 2(0.6154 + 0.3334) + 0.1702 + 0.0909] = 0.8146
\]

---

## 5.4 Simpson's 3/8 Rule

**Formula (n = 3):**

\[
\int_{x_0}^{x_3} y \, dx = \frac{3h}{8}(y_0 + 3y_1 + 3y_2 + y_3)
\]

**Composite Simpson's 3/8 Rule (n multiple of 3):**

\[
\int_{x_0}^{x_n} y \, dx = \frac{3h}{8}\left[y_0 + y_n + 3(y_1 + y_2 + y_4 + y_5 + \cdots) + 2(y_3 + y_6 + \cdots)\right]
\]

**Comparison Example (pg 98):**
For \(I = \int_0^1 \frac{1}{1+x}dx\):

| Method | Result |
|--------|--------|
| Simpson's 1/3 Rule | 0.693177 |
| Simpson's 3/8 Rule | 0.6931909 |
| Exact | 0.693147 |

Both give close results, but Simpson's 1/3 Rule is slightly more accurate than 3/8 Rule (based on notes).

---

## 5.5 Double Integration (Trapezoidal Rule)

**For double integral \(\int_a^b \int_c^d f(x,y) \, dx \, dy\):**

**Algorithm:**
1. Divide rectangle [a,b] × [c,d] into meshgrid with step sizes h and k
2. Compute f(x,y) at each grid point
3. Apply Trapezoidal rule in both directions

**Example from notes (pg 92):**
\[
I = \int_0^1 \int_0^1 e^{x^2+y^2} dx \, dy, \quad h = 0.5, \quad k = 0.25
\]

---

# 6. LINEAR ALGEBRA / SYSTEM SOLVING

## 6.1 LU Decomposition Method

**Procedure:**
1. Write system \(Ax = B\)
2. Decompose \(A = LU\) where L is lower triangular and U is upper triangular
3. Solve \(Ly = B\) (forward substitution)
4. Solve \(Ux = y\) (backward substitution)

**Example from notes (pg 36):**
\[
\begin{bmatrix} 2 & 3 & 1 \\ 1 & 2 & 3 \\ 3 & 1 & 2 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 9 \\ 6 \\ 8 \end{bmatrix}
\]

**Decomposition:**
\[
U = \begin{bmatrix} 2 & 3 & 1 \\ 0 & \frac{1}{2} & \frac{5}{2} \\ 0 & 0 & 18 \end{bmatrix}, \quad L = \begin{bmatrix} 1 & 0 & 0 \\ \frac{1}{2} & 1 & 0 \\ \frac{3}{2} & -7 & 1 \end{bmatrix}
\]

**Step 1: Solve Ly = B**
\[
\begin{bmatrix} 1 & 0 & 0 \\ \frac{1}{2} & 1 & 0 \\ \frac{3}{2} & -7 & 1 \end{bmatrix} \begin{bmatrix} y_1 \\ y_2 \\ y_3 \end{bmatrix} = \begin{bmatrix} 9 \\ 6 \\ 8 \end{bmatrix}
\]

**Step 2: Solve Ux = y**
\[
\begin{bmatrix} 2 & 3 & 1 \\ 0 & \frac{1}{2} & \frac{5}{2} \\ 0 & 0 & 18 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} 9 \\ y_2 \\ y_3 \end{bmatrix}
\]

---

## 6.2 Jacobi Iteration Method

**For system \(Ax = b\):**

**Algorithm:**
1. Check diagonal dominance: \(|a_{ii}| > \sum_{j \neq i} |a_{ij}|\)
2. Rewrite each equation solving for x_i:
   \[
   x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j \neq i} a_{ij}x_j^{(k)}\right)
   \]
3. Start with initial guess \(x^{(0)}\)
4. Iterate until convergence

**Example from notes (pg 49):**
\[
\begin{cases}
2x - y = 1 \\
-x + 3y - z = 8 \\
-y + 2z = -5
\end{cases}
\]

**Check diagonal dominance:**
- |2| > |1| ✓
- |3| > |1| + |1| ✓
- |2| > |1| ✓

**Iteration scheme:**
\[
x = \frac{1+y}{2}, \quad y = \frac{8+x+z}{3}, \quad z = \frac{-5+y}{2}
\]

Starting with (0,0,0):

| n | x | y | z |
|---|-------|---------|---------|
| 1 | 0.5 | 2.667 | -2.5 |
| 2 | 1.834 | 2.667 | -1.167 |
| 3 | 1.834 | 2.889 | -1.167 |
| 4 | 1.945 | 2.889 | -1.056 |
| 5 | 1.945 | 2.963 | -1.056 |
| 6 | 1.982 | 2.963 | -1.019 |
| 7 | 1.982 | 2.988 | -1.019 |
| ... | ... | ... | ... |
| 15 | 2 | 3 | -1 |

---

## 6.3 Gauss-Seidel Method

**Algorithm:**
1. Check diagonal dominance
2. Rewrite each equation solving for x_i
3. Use most recent values:
   \[
   x_i^{(k+1)} = \frac{1}{a_{ii}}\left(b_i - \sum_{j < i} a_{ij}x_j^{(k+1)} - \sum_{j > i} a_{ij}x_j^{(k)}\right)
   \]
4. Iterate until convergence

**Note:** Gauss-Seidel generally converges faster than Jacobi.

**Example from notes (pg 50):**
Same system as above:

| n | x | y | z |
|---|-------|---------|---------|
| 1 | 0.5 | 2.833 | -1.084 |
| 2 | 1.917 | 2.944 | -0.685 |
| 3 | 1.972 | 3.095 | -1.009 |
| 4 | 1.991 | 2.994 | -1.003 |
| 5 | 1.997 | 2.998 | -1.001 |
| 6 | 1.999 | 2.999 | -1.001 |
| 7 | 2 | 3 | -1 |

---

## 6.4 System of Non-Linear Equations - Fixed Point Method

**For system:**
\[
\begin{cases}
f(x,y) = 0 \\
g(x,y) = 0
\end{cases}
\]

**Rewrite as:**
\[
\begin{cases}
x = \Phi(x,y) \\
y = \Psi(x,y)
\end{cases}
\]

**Convergence Criteria:**
\[
\left|\frac{\partial \Phi}{\partial x}\right| + \left|\frac{\partial \Phi}{\partial y}\right| < 1
\]
\[
\left|\frac{\partial \Psi}{\partial x}\right| + \left|\frac{\partial \Psi}{\partial y}\right| < 1
\]

**Iteration:**
\[
x_{n+1} = \Phi(x_n, y_n), \quad y_{n+1} = \Psi(x_n, y_n)
\]

**Example from notes (pg 31):**
\[
\begin{cases}
y^2 - 5y + 4 = 0 \\
3yx^2 - 10x + 7 = 0
\end{cases}
\]

Rewrite:
\[
y = \frac{y^2 + 4}{5} = \Phi(x,y), \quad x = \frac{3yx^2 + 7}{10} = \Psi(x,y)
\]

Starting with (0,0):

| n | x | y |
|---|-------|---------|
| 1 | 0.7 | 0.8 |
| 2 | 0.8176 | 0.928 |
| 3 | 0.886 | 0.972 |
| 4 | 0.929 | 0.989 |
| 5 | 0.956 | 0.996 |
| 6 | 0.973 | 0.999 |

---

## 6.5 Newton-Raphson Method for Non-Linear Systems

**For system:**
\[
\begin{cases}
f(x,y) = 0 \\
g(x,y) = 0
\end{cases}
\]

**Algorithm:**
1. Choose initial guess \((x_0, y_0)\)
2. Let \(x_1 = x_0 + h\), \(y_1 = y_0 + k\)
3. Linearize:
   \[
   f(x_0, y_0) + h f_x(x_0, y_0) + k f_y(x_0, y_0) = 0
   \]
   \[
   g(x_0, y_0) + h g_x(x_0, y_0) + k g_y(x_0, y_0) = 0
   \]
4. Solve for h and k using Cramer's rule:
   \[
   D = \begin{vmatrix} f_x & f_y \\ g_x & g_y \end{vmatrix}, \quad
   D_1 = \begin{vmatrix} -f & f_y \\ -g & g_y \end{vmatrix}, \quad
   D_2 = \begin{vmatrix} f_x & -f \\ g_x & -g \end{vmatrix}
   \]
   \[
   h = \frac{D_1}{D}, \quad k = \frac{D_2}{D}
   \]
5. Update: \(x_1 = x_0 + h\), \(y_1 = y_0 + k\)
6. Repeat until convergence

**Example from notes (pg 33):**
\[
\begin{cases}
y^2 - 5y + 4 = 0 \\
3x^2y - 10x + 7 = 0
\end{cases}
\]

Starting with (0,0):
\[
h = 0.7, \quad k = 0.8
\]
\[
x_1 = 0.7, \quad y_1 = 0.8
\]

**Convergence Rates:**
- p = 1: Linear convergence
- p = 2: Quadratic convergence
- 1 < p < 2: Super-linear convergence

---

## 6.6 Matrix Norms

**Column Norm (||A||₁):**
\[
||A||_1 = \max_j \sum_i |a_{ij}|
\]

**Euclidean Norm (||A||ₑ):**
\[
||A||_e = \left[\sum_{i,j} |a_{ij}|^2\right]^{\frac{1}{2}}
\]

**Row Norm (||A||∞):**
\[
||A||_\infty = \max_i \sum_j |a_{ij}|
\]

**Example from notes (pg 52):**
For \(A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}\):
- \(||A||_1 = \max[12, 15, 18] = 18\)
- \(||A||_e = (1^2+2^2+3^2+4^2+5^2+6^2+7^2+8^2+9^2)^{\frac{1}{2}} = 16.88\)
- \(||A||_\infty = \max[6, 15, 24] = 24\)

**Properties:**
1. \(||A|| \geq 0\) and \(||A|| = 0\) iff \(A = 0\)
2. \(||cA|| = |c| \cdot ||A||\)
3. \(||A + B|| \leq ||A|| + ||B||\)
4. \(||AB|| \leq ||A|| \cdot ||B||\)
5. \(||A^p|| \leq ||A||^p\)

---

# 7. ORDINARY DIFFERENTIAL EQUATIONS (ODE)

## 7.1 Taylor's Series Method

**Formula:**
\[
y(x) = y(x_0) + (x-x_0)y'(x_0) + \frac{(x-x_0)^2}{2!}y''(x_0) + \frac{(x-x_0)^3}{3!}y'''(x_0) + \cdots + \frac{(x-x_0)^n}{n!}y^{(n)}(x_0)
\]

**Algorithm:**
1. Given \(y' = f(x,y)\) and \(y(x_0) = y_0\)
2. Differentiate \(y'\) successively to get \(y'', y''', \dots\)
3. Evaluate at \(x_0\)
4. Substitute into Taylor series
5. Compute y at desired x

**Stopping Criterion for N decimal places:**
\[
\frac{(x-x_0)^n y_0^n}{n!} \leq \frac{1}{2} \times 10^{-N}
\]

**Example from notes (pg 101):**
For \(y'' - 2y' - y = 0\), \(y(0) = 1\), \(y'(0) = 0\):
\[
y = y_0 + x y_0' + \frac{x^2}{2!} y_0'' + \frac{x^3}{3!} y_0''' + \cdots
\]

---

## 7.2 Picard's Method

**Given:**
\[
y' = f(x,y), \quad y(x_0) = y_0
\]

**Formula:**
\[
y = y_0 + \int_{x_0}^x f(x,y) \, dx
\]

**Iteration Scheme:**
\[
y_1 = y_0 + \int_{x_0}^x f(x, y_0) \, dx
\]
\[
y_2 = y_0 + \int_{x_0}^x f(x, y_1) \, dx
\]
\[
\vdots
\]
\[
y_n = y_0 + \int_{x_0}^x f(x, y_{n-1}) \, dx
\]

**Stopping Criterion for N decimal places:**
Last term in series \(\leq \frac{1}{2} \times 10^{-N}\)

**Example from notes (pg 104):**
For \(y' = \frac{x^2 + y^2}{2}\), \(y(0) = 1\), find y(0.21):

\[
y_1 = 1 + \int_0^x \frac{x^2 + 1}{2} dx = 1 + \frac{x^3}{6} + \frac{x}{2}
\]
\[
y_2 = 1 + x + x^2 + \frac{2}{3}x^3 + \frac{x^4}{4} + \frac{x^5}{20}
\]

Check: \(\frac{x^5}{20} = \frac{1}{2} \times 10^{-4} \Rightarrow x = 0.2512 > 0.21\)
So y₂ is sufficient for 4 decimal places.

\[
y(0.21) \approx 1 + 0.21 + 0.0441 + 0.006174 + 0.000486 + 0.0000102 \approx 1.2608
\]

---

## 7.3 Euler's Method

**Formula:**
\[
y_{n+1} = y_n + h f(x_n, y_n)
\]

**Algorithm:**
1. Choose step size h
2. Starting from \((x_0, y_0)\)
3. Compute \(y_{n+1} = y_n + h f(x_n, y_n)\)
4. Repeat until reaching desired x

**Example from notes (pg 107):**
For \(y' = \frac{y^2 - x^2}{y^2 + x^2}\), \(y(0) = 1\), h = 0.2:

| Interval | x | y |
|----------|---|-----|
| [0, 0.2] | 0.2 | 1.2 |
| [0.2, 0.4] | 0.4 | 1.3892 |
| [0.4, 0.6] | 0.6 | 1.5586 |
| [0.6, 0.8] | 0.8 | 1.7067 |
| [0.8, 1.0] | 1.0 | 1.8349 |

---

## 7.4 Modified Euler's Method (Heun's Method)

**Formula:**
\[
y_{n+1} = y_n + \frac{h}{2}\left[f(x_n, y_n) + f(x_{n+1}, y_{n+1}^{(0)})\right]
\]

**Where:**
\[
y_{n+1}^{(0)} = y_n + h f(x_n, y_n)
\]

**Algorithm:**
1. Choose step size h
2. Starting from \((x_0, y_0)\)
3. Predict: \(y_{n+1}^{(0)} = y_n + h f(x_n, y_n)\)
4. Correct: \(y_{n+1} = y_n + \frac{h}{2}[f(x_n, y_n) + f(x_{n+1}, y_{n+1}^{(0)})]\)
5. Repeat until convergence (or use once as predictor-corrector)

**Example from notes (pg 108-109):**
For \(y' = \frac{y^2 - x^2}{y^2 + x^2}\), \(y(0) = 1\), h = 0.2:

| Interval | y_predictor | y_corrector |
|----------|-------------|-------------|
| [0, 0.2] | 1.2 | 1.1946 |
| [0.2, 0.4] | 1.3892 | 1.385 |
| [0.4, 0.6] | 1.5698 | 1.55 |
| [0.6, 0.8] | 1.907 | 1.8086 |
| [0.8, 1.0] | 1.83976 | 1.82805 |

---

## 7.5 Runge-Kutta Methods

### 7.5.1 Second-Order Runge-Kutta (RK2)

**Formula:**
\[
k_1 = h f(x_n, y_n)
\]
\[
k_2 = h f(x_n + h, y_n + k_1)
\]
\[
y_{n+1} = y_n + \frac{1}{2}(k_1 + k_2)
\]

### 7.5.2 Fourth-Order Runge-Kutta (RK4)

**Formula:**
\[
k_1 = h f(x_n, y_n)
\]
\[
k_2 = h f(x_n + \frac{h}{2}, y_n + \frac{k_1}{2})
\]
\[
k_3 = h f(x_n + \frac{h}{2}, y_n + \frac{k_2}{2})
\]
\[
k_4 = h f(x_n + h, y_n + k_3)
\]
\[
y_{n+1} = y_n + \frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)
\]

---

## 7.6 Boundary Value Problems - Finite Difference Method

**Given:**
\[
y'' + p(x)y' + q(x)y = r(x), \quad y(x_0) = a, \quad y(x_n) = b
\]

**Central Difference Approximations:**

\[
y_i' = \frac{y_{i+1} - y_{i-1}}{2h}
\]
\[
y_i'' = \frac{y_{i+1} - 2y_i + y_{i-1}}{h^2}
\]

**Algorithm:**
1. Divide interval [a,b] into n equal parts with step h
2. At each interior point \(i = 1, 2, \dots, n-1\), substitute central differences
3. Form system of (n-1) equations
4. Solve the linear system

**Example from notes (pg 116):**
\[
y'' - 2y' - e^y = \frac{1}{x+1}, \quad y(0) = 0, \quad y(1) = 1, \quad n = 4
\]

Substitute central differences:
\[
\frac{y_{i+1} - 2y_i + y_{i-1}}{h^2} - 2\left(\frac{y_{i+1} - y_{i-1}}{2h}\right) - e^{y_i} = \frac{1}{x_i+1}
\]

For i = 1:
\[
(16 - 2x_i^2)y_{i+1} + y_i(-32 - e^{2x_i}) + y_{i-1}(16 + 2x_i^2) = \frac{1}{x_i+1}
\]

**Note:** The notes show a non-standard formulation where \(e^{y_i}\) is written as \(e^{2x_i}\). This appears to be a specific variant used by the professor for this particular problem.

---

# 8. CURVE FITTING

## 8.1 Linear Fit: y = ax + b

**Normal Equations:**
\[
\sum y = a\sum x + nb
\]
\[
\sum xy = a\sum x^2 + b\sum x
\]

---

## 8.2 Parabolic Fit: y = a₀ + a₁x + a₂x²

**Normal Equations:**
\[
\sum y = a_0 n + a_1\sum x + a_2\sum x^2
\]
\[
\sum xy = a_0\sum x + a_1\sum x^2 + a_2\sum x^3
\]
\[
\sum x^2 y = a_0\sum x^2 + a_1\sum x^3 + a_2\sum x^4
\]

**Example from notes (pg 58):**
Fit \(y = a_0 + a_1x + a_2x^2\) to data: (1,0.63), (3,2.05), (4,4.08), (6,10.78)

| x | y | xy | x² | x³ | x²y | x⁴ |
|---|-----|-----|----|----|-----|----|
| 1 | 0.63 | 0.63 | 1 | 1 | 0.63 | 1 |
| 3 | 2.05 | 6.15 | 9 | 27 | 18.45 | 81 |
| 4 | 4.08 | 16.32 | 16 | 64 | 65.28 | 256 |
| 6 | 10.78 | 64.68 | 36 | 216 | 388.08 | 1296 |
| Σ=14 | Σ=13.54 | Σ=86.78 | Σ=62 | Σ=308 | Σ=472.44 | Σ=1634 |

Normal equations:
\[
13.54 = 4a_0 + 14a_1 + 62a_2
\]
\[
86.78 = 14a_0 + 62a_1 + 308a_2
\]
\[
472.44 = 62a_0 + 308a_1 + 1634a_2
\]

---

## 8.3 Exponential Fit: y = ax^b

**Taking log on both sides:**
\[
\ln y = \ln a + b \ln x
\]

**Let Y = \ln y, A = \ln a, X = \ln x**

**Normal Equations:**
\[
\sum Y = nA + b\sum X
\]
\[
\sum XY = A\sum X + b\sum X^2
\]

---

# SUMMARY TABLE - METHODS BY CATEGORY

## Root Finding
1. **Bisection Method** - Interval halving
2. **False Position Method (Regula Falsi)** - Secant-like with sign preservation
3. **Newton-Raphson Method** - Derivative-based, quadratic convergence
4. **Fixed Point Iteration Method** - x = φ(x), requires |φ'(x)| < 1

## Interpolation
1. **Newton's Forward Formula** - Equal spacing, start of table
2. **Newton's Backward Formula** - Equal spacing, end of table
3. **Gauss Forward Formula** - Equal spacing, centered
4. **Gauss Backward Formula** - Equal spacing, centered
5. **Stirling's Formula** - Equal spacing
6. **Bessel's Formula** - Equal spacing
7. **Everett's Formula** - Equal spacing, even differences only
8. **Lagrange's Formula** - Unequal spacing
9. **Newton's Divided Difference** - Unequal spacing

## Numerical Integration
1. **Trapezoidal Rule** - Linear approximation
2. **Simpson's 1/3 Rule** - Quadratic approximation (n even)
3. **Simpson's 3/8 Rule** - Cubic approximation (n multiple of 3)

## Numerical Differentiation
1. **Forward Difference Formula** - At start of table
2. **Backward Difference Formula** - At end of table
3. **Central Difference Formula** - Higher accuracy

## Linear Systems
1. **LU Decomposition** - Direct method
2. **Jacobi Method** - Iterative, uses old values
3. **Gauss-Seidel Method** - Iterative, uses newest values
4. **Newton-Raphson for Non-linear Systems** - Derivative-based

## ODE Solvers
1. **Taylor's Series Method** - Series expansion
2. **Picard's Method** - Integral equation iteration
3. **Euler's Method** - First-order explicit
4. **Modified Euler Method** - Predictor-corrector
5. **Runge-Kutta Methods** - Higher-order explicit

## Curve Fitting
1. **Linear Fit (y = ax + b)** - Two normal equations
2. **Parabolic Fit (y = a₀ + a₁x + a₂x²)** - Three normal equations
3. **Exponential Fit (y = ax^b)** - Log transformation

---

# NON-STANDARD VARIATIONS FLAGGED

1. **Modified Euler's Method (pg 108)** - The notes show the correction step using the same variable name \(y_1\) for both predictor and corrector, which is non-standard. Standard practice uses \(y_{n+1}^{(0)}\) for predictor and \(y_{n+1}\) for corrector.

2. **Newton-Raphson for Non-Linear Systems (pg 29)** - The notes show a slightly different Cramer's rule setup with the Jacobian matrix. The notation is: \(f_0\) and \(g_0\) instead of \(f(x_0,y_0)\) and \(g(x_0,y_0)\).

3. **BVP Finite Difference (pg 116)** - The notes show \(e^{2x_i}\) instead of \(e^{y_i}\) in the coefficient of \(y_i\). This appears to be a problem-specific simplification or a transcription error in the notes.

4. **Everett's Formula (pg 83)** - The notes present this as "extensively used" and use only even-order differences, which is standard but worth noting as the professor emphasizes this specific formula.

5. **Gauss-Seidel Example (pg 50)** - The iteration shows \(x = 7.998, y = 9.999\) in some iterations, which appears to be a transcription error (should be \(x \approx 2, y \approx 3\) for that system).

---

# EDGE CASES & WORKED EXAMPLES

1. **Tie/Sign Change Handling (pg 12)** - Example comparing approximations of 1/3: 0.30, 0.33, 0.34. The error analysis shows:
   - |1/3 - 0.30| = 1/30
   - |1/3 - 0.33| = 1/300 (best approximation)
   - |1/3 - 0.34| = 1/3

2. **Matrix Pivoting (pg 36-37)** - LU decomposition shows row operations: \(R_2 \to R_2 - \frac{1}{2}R_1\), \(R_3 \to R_3 - \frac{3}{2}R_1\), then \(R_3 \to R_3 + 7R_2\). The notes explicitly show the pivot element as the first non-zero element in each column.

3. **Round-off Error in Summation (pg 14)** - The notes demonstrate that when numbers have different absolute errors, we must:
   - Identify numbers with greatest absolute error
   - Round others to same precision
   - Add rounding error to total

4. **Significant Figures in Multiplication (pg 15)** - Example: \(48.3 \times 2.5 = 1.2 \times 10^2\), retaining only two significant digits because one factor (2.5) had only two significant digits.
