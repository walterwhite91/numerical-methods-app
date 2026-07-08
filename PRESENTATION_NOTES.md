# Presentation Notes — MCSC 202 Numerical Methods

Speaking notes for walking through each method: what it does, its
convergence behavior, and a line-by-line tour of the matching script in
`/scripts`. Read top to bottom, one section per method, in the order you'd
present them.

---

## Bisection Method

**Script:** `scripts/bisection.py`

### What it does

Bisection finds a root of `f(x) = 0` by starting with an interval `[a, b]`
where the function changes sign — one endpoint positive, one negative — and
repeatedly cutting that interval in half. Every time, keep whichever half
still contains the sign change, and throw away the other half. Because the
interval shrinks by exactly half every step, you're guaranteed to converge,
just slowly.

**Convergence rate:** linear. Every iteration only gains roughly one extra
bit of precision (the interval width is cut in half), not one extra
decimal digit. That's the tradeoff for bisection's biggest strength — it
*always* converges if you set it up correctly, unlike Newton-Raphson which
can fail from a bad starting guess.

### Code walkthrough

```python
def f(x):
    return x ** 3 - x - 1
```
This is the function from the worked example — the one whose root we're
hunting for. Swap this out and everything else in the script still works
unchanged.

```python
def bisection(a, b, tol=1e-4, max_iter=100):
```
The function signature: `a` and `b` are the interval endpoints, `tol` is
how small the interval needs to get before we stop, and `max_iter` is a
safety net so the loop can't run forever if something's set up wrong.

```python
    fa = f(a)
    fb = f(b)
    if fa * fb >= 0:
        raise ValueError("f(a) and f(b) must have opposite signs.")
```
Before doing any work, check the precondition. If `f(a)` and `f(b)` have
the same sign, their product is positive — that means we can't guarantee a
root is trapped inside `[a, b]`, so we stop immediately rather than
grinding out a wrong answer. This is the Intermediate Value Theorem in
code form.

```python
    for i in range(1, max_iter + 1):
        c = (a + b) / 2.0
        fc = f(c)
```
Each loop iteration: compute the midpoint `c`, and evaluate the function
there. `c` is our current best guess at the root for this iteration.

```python
        rows.append((i, a, b, c, fc))
        if abs(b - a) / 2.0 < tol or fc == 0:
            return rows, c
```
Two stopping conditions, either is enough: the interval has shrunk below
our tolerance, or we landed exactly on the root (`fc == 0`, rare in
practice but cheap to check). `abs(b - a) / 2.0` is the current
half-width of the interval — that's our error bound, since the true root
is guaranteed to be somewhere inside `[a, b]`.

```python
        if fa * fc < 0:
            b = c
        else:
            a = c
            fa = fc
```
The core decision: does the root live in the left half `[a, c]` or the
right half `[c, b]`? Check whether `f(a)` and `f(c)` have opposite signs —
if they do, the sign change (and therefore the root) is between `a` and
`c`, so shrink `b` down to `c`. Otherwise the sign change must be between
`c` and `b`, so shrink `a` up to `c` — and since `a` moved, `fa` has to be
refreshed to `fc` so next iteration's sign check stays correct.

```python
def iterations_needed(a, b, decimal_places):
    return math.log((b - a) / (5 * 10 ** -decimal_places))
```
A formula straight from class: given the starting interval width and how
many correct decimal places you want, this estimates how many iterations
you'll need *before you even start*. Useful for showing the class that
bisection's iteration count is predictable up front, unlike Newton-Raphson
where it depends on how close the initial guess is.

### Demo output

Running `python3 bisection.py` prints the iteration table (a, b,
midpoint, f(midpoint) for every step) and finishes with:

```
Root approx 1.324768 after 14 iterations (expected approx 1.3247)
```

which matches the worked example in the notes: `f(x) = x^3 - x - 1` on
`[1, 2]`, converging to the same root Newton-Raphson and Fixed Point
Iteration reach elsewhere in the notes.

---

# Root Finding

## False Position Method (Regula Falsi)

**Script:** `scripts/false-position.py`

### What it does

Like Bisection, this brackets a root inside `[a, b]` where the function
changes sign. But instead of always cutting at the plain midpoint, it draws
a straight chord between `(a, f(a))` and `(b, f(b))` and uses where that
chord crosses zero as the next guess — an estimate that "aims" toward the
root instead of blindly halving the interval.

**Convergence rate:** faster than Bisection in most cases (still guaranteed
to converge, since it's still a bracketing method), but it's not a fixed
rate — sometimes one endpoint gets "stuck" and barely moves for many
iterations, which is why our example takes 17 iterations to hit the same
tolerance Bisection reached in 14.

### Code walkthrough

`false_position(a, b, tol, max_iter)` starts the same way as Bisection: it
checks `f(a) * f(b) >= 0` and refuses to run if the interval doesn't bracket
a sign change.

Inside the loop, the key formula is `c = (a * fb - b * fa) / (fb - fa)` —
that's the x-intercept of the chord connecting the two endpoints. Algebra:
it's a weighted average of `a` and `b`, weighted by how far each endpoint's
function value is from zero.

We evaluate `fc = f(c)` and stop once `abs(fc) < tol` — note this is a
different stopping rule than Bisection's interval-width check, since one
endpoint of `[a, b]` can stay fixed for a long time here, so the interval
width alone isn't a reliable progress signal.

The bracketing update (`if fa * fc < 0: b = c ... else: a = c`) is
identical to Bisection's — same sign-change logic, just a different `c`.

### Demo output

`python3 false-position.py` converges to `1.324718` after 17 iterations —
same root as Bisection, reached along a different path.

---

## Newton-Raphson Method

**Script:** `scripts/newton-raphson.py`

### What it does

Uses the tangent line at the current guess `x_n` to jump straight to where
that tangent crosses zero — `x_{n+1} = x_n - f(x_n)/f'(x_n)`. When you're
close to the root, the tangent line is a very good local approximation of
the curve, so this converges fast. The tradeoff: it needs the derivative
`f'(x)`, and a bad starting guess can send it flying off toward the wrong
root or diverge entirely.

**Convergence rate:** quadratic — roughly doubles the number of correct
decimal digits every iteration. That's why the demo needs only 4 iterations
to reach the same accuracy Bisection needed 14 for.

### Code walkthrough

Two small functions up top, `f(x)` and `df(x)`, are the function and its
hand-derived derivative — `f(x) = x^3 - x - 1` and `df(x) = 3x^2 - 1`. This
is the one method here where you must supply the derivative yourself; there's
no way to derive it automatically without a symbolic math library.

Inside `newton_raphson(x0, tol, max_iter)`, each iteration evaluates `fx`
and `dfx` at the current `x`, checks `dfx == 0` (a horizontal tangent means
the formula would divide by zero — the method fails there), then computes
`x_new = x - fx / dfx`.

Stopping condition: `abs(x_new - x) < tol` — how much the guess moved this
step. Once it barely moves, we're at the root.

### Demo output

Starting at `x0 = 1.5`: `1.5 -> 1.347826 -> 1.325200 -> 1.324718 -> 1.324718`
— matches the notes' worked table exactly (`1.5, 1.3478, 1.3251, 1.3247,
1.3247`).

---

## Secant Method

**Script:** `scripts/secant.py`

### What it does

Same idea as Newton-Raphson — jump to where a line crosses zero — but the
line is a secant through the *last two guesses* instead of a tangent, so no
derivative is needed. Useful when `f'(x)` is hard or expensive to compute.

**Convergence rate:** superlinear (about 1.618, the golden ratio) — slower
than Newton-Raphson's quadratic rate, but faster than Bisection or False
Position, and without needing a derivative.

### Code walkthrough

`secant(x0, x1, tol, max_iter)` takes *two* starting guesses instead of
one, since a secant line needs two points.

Each iteration computes `f0 = f(x0)`, `f1 = f(x1)`, checks they're not equal
(equal values would mean a horizontal secant — undefined slope), then
applies the secant formula: `x2 = x1 - f1 * (x1 - x0) / (f1 - f0)` — the
x-intercept of the line through the two most recent points.

After computing `x2`, the window slides forward: `x0 = x1; x1 = x2` — we
drop the older point and keep the two most recent ones for the next
iteration.

### Demo output

Starting at `x0=1, x1=2`, converges to `1.324718` in 7 iterations — notice
the first jump overshoots (`x_next` briefly goes past the root, `f(x_curr)`
hits `5.0`), then it settles down and converges fast — that overshoot-then-
settle pattern is typical of the secant method with widely spaced starting
guesses.

---

## Generalized Newton-Raphson

**Script:** `scripts/generalized-newton.py`

### What it does

Plain Newton-Raphson slows down to only linear convergence when the root is
*repeated* (a "double root," "triple root," etc.) — the tangent line
becomes nearly flat right where you need it most. If you know the root's
multiplicity `m` ahead of time, multiplying the correction step by `m`
restores full quadratic convergence: `x_{n+1} = x_n - m * f(x_n)/f'(x_n)`.

**Convergence rate:** quadratic again, same as plain Newton-Raphson —
that's the whole point of the `m` factor.

### Code walkthrough

Example function `f(x) = (x-1)^2 * (x+2)` has a double root at `x=1` (the
squared factor) and a simple root at `x=-2`. `df(x)` is worked out by hand
using the product rule.

`generalized_newton(x0, multiplicity, tol, max_iter)` looks almost
identical to plain Newton-Raphson — same derivative check, same stopping
condition — except the update line is `x_new = x - multiplicity * fx / dfx`.
That single multiplication by `m` is the entire difference from the
standard method.

### Demo output

Starting at `x0 = 1.5` with `m=2`, converges to the double root `1.0` in
just 4 iterations — try running plain Newton-Raphson on this same function
and you'll see it crawl toward `1.0` much more slowly, since it doesn't
know the root is doubled.

---

# System of Nonlinear Equations

## Fixed Point Iteration (Systems)

**Script:** `scripts/iteration-system.py`

### What it does

Extends single-variable Fixed Point Iteration to two equations at once.
Given `f(x,y) = 0` and `g(x,y) = 0`, rewrite them as `x = Psi(x,y)` and
`y = Phi(x,y)`, then repeatedly plug the current `(x, y)` into both
formulas to get the next `(x, y)`. Keep going until the values stop moving.

**Convergence rate:** linear, and only guaranteed at all if the rewritten
formulas are "contractive" near the solution — informally, if
`|dPhi/dx| + |dPhi/dy| < 1` and the same for `Psi`. Pick the wrong
rearrangement of the same equations and the iteration can diverge even
though a perfectly good root exists.

### Code walkthrough

`phi(x, y)` and `psi(x, y)` are the two rearranged formulas from the notes'
worked example: `y^2 - 5y + 4 = 0` becomes `y = (y^2+4)/5`, and
`3yx^2 - 10x + 7 = 0` becomes `x = (3yx^2+7)/10`.

Inside the loop, `y_new = phi(x, y)` and `x_new = psi(x, y)` are both
computed from the *same* old `(x, y)` pair before either variable updates —
that's what keeps this a proper simultaneous (Jacobi-style) update rather
than mixing old and new values mid-step.

Stopping condition checks both variables at once: `abs(x_new - x) < tol and
abs(y_new - y) < tol` — we're only done once neither one is still moving.

### Demo output

Starting at `(0, 0)`, the first step already matches the notes exactly:
`x=0.7, y=0.8`. It takes 17 iterations at this script's tighter tolerance
to fully settle at `(1.0, 1.0)` — the notes' table stops earlier since they
were only demonstrating the pattern, not running to full convergence.

---

## Newton-Raphson for Systems

**Script:** `scripts/newton-system.py`

### What it does

The multi-variable version of Newton-Raphson. Near the current guess
`(x0, y0)`, both `f` and `g` are approximated as straight (linear) using
their partial derivatives — that turns the nonlinear problem into a small
2x2 *linear* system for the correction `(h, k)`, solved here with Cramer's
rule, matching the exact notation used in class: `f_0`, `g_0` for
`f(x0,y0)`, `g(x0,y0)`, and determinants `D`, `D1`, `D2`.

**Convergence rate:** quadratic, same as single-variable Newton-Raphson —
same tradeoff too: needs all four partial derivatives, and a bad starting
guess can fail to converge.

### Code walkthrough

`f`, `g` are the notes' example equations. `f_x`, `f_y`, `g_x`, `g_y` are
their partial derivatives, worked out by hand ahead of time (this script
doesn't derive them automatically).

Inside `newton_system`, each iteration computes `f_0 = f(x,y)` and
`g_0 = g(x,y)` — the notes' shorthand notation for the function values at
the current guess.

Then the three determinants: `D = fx*gy - fy*gx` is the Jacobian
determinant of the linearized system. `D1` and `D2` are Cramer's rule
numerators for solving `[fx fy; gx gy] [h;k] = [-f0; -g0]` — the standard
"replace one column with the right-hand side" trick from Cramer's rule.

The corrections are then just `h = D1/D`, `k = D2/D`, and the new guess is
`x + h, y + k`.

### Demo output

Starting at `(0, 0)`, the very first step prints `h = 0.7, k = 0.8` —
matching the notes' worked example number-for-number. It converges fully to
`(1.0, 1.0)` in 5 iterations.

---

# Interpolation

## Newton's Forward Difference

**Script:** `scripts/forward-difference.py`

### What it does

Given equally-spaced `(x, y)` data, builds a triangular table of successive
differences, then uses the top row of that table to estimate `y` at some
target `x` near the *start* of the table.

### Code walkthrough

`forward_difference_table(y)` builds an `n x n` grid. Column 0 is just the
raw `y` values. Every later column `j` is computed from column `j-1`:
`table[i][j] = table[i+1][j-1] - table[i][j-1]` — each entry is "the one
below it minus itself" from the previous column, which is exactly how you'd
build the table by hand with a pencil and a triangle of numbers.

`newton_forward_interpolation` computes `p = (target - x[0]) / h` — how far
the target is from the first x-value, measured in units of the spacing `h`.

The loop then builds up the formula term by term: `p_term` accumulates
`p * (p-1) * (p-2) * ...` one factor at a time, `factorial` accumulates
`i!` the same way, and each term `(p_term / factorial) * table[0][i]` gets
added to the running result — this is Newton's forward formula computed
incrementally instead of writing out every term by hand.

### Demo output

With `x = [1, 2, 3], y = [1, 4, 9]` (i.e. `y = x^2`), interpolating at
`x = 1.5` gives exactly `2.25` — correct, since the underlying data is a
perfect quadratic and this formula reconstructs quadratics exactly.

---

## Newton's Backward Difference

**Script:** `scripts/backward-difference.py`

### What it does

Mirror image of the forward formula: builds a difference table anchored at
the *bottom*, and estimates `y` for a target near the *end* of the table.

### Code walkthrough

`backward_difference_table` fills the same kind of triangular grid, but
built upward from the bottom row: `table[i][j] = table[i][j-1] -
table[i-1][j-1]` — each entry is itself minus the one above it, in the
previous column.

`p` is measured backward from the *last* x-value: `p = (target - x[n-1]) /
h`. The accumulation loop is the same pattern as the forward version, just
using `p + j - 1` instead of `p - (i - 1)` — the backward formula's terms
grow as `p, p(p+1), p(p+1)(p+2), ...` instead of `p, p(p-1), p(p-1)(p-2),
...`.

### Demo output

Same data as the forward example (`y = x^2`), interpolating at `x = 2.5`
(near the end of the table) gives `6.25` — exact again, same reason.

---

# Ordinary Differential Equations (IVP)

## Euler's Method

**Script:** `scripts/euler.py`

### What it does

The simplest ODE solver. Given `y' = f(x,y)` and a starting point, take a
step of size `h` using whatever the slope happens to be *right now*,
pretending it stays constant for the whole step. It doesn't — that's the
source of Euler's error.

**Convergence rate:** first-order — the error per step shrinks
proportionally to `h`, so halving the step size roughly halves the error.

### Code walkthrough

`euler(x0, y0, h, steps)` loops `steps` times. Each iteration: compute
`slope = f(x, y)` at the *current* point, then `y = y + h * slope` — walk
forward assuming that slope holds for the entire step — then `x = x + h`.

That's the whole method in three lines. Every other ODE method in this
course is really a variation on "be smarter about which slope(s) to use."

### Demo output

`dy/dx = x + y`, `y(0)=1`, `h=0.1`: `y(0.1) = 1.1`, `y(0.2) = 1.22` —
matches the notes' worked example exactly.

---

## Modified Euler's Method (Heun's Method)

**Script:** `scripts/modified-euler.py`

### What it does

Fixes Euler's core weakness — using only the *starting* slope for the whole
step — with a predictor-corrector pair. First take a normal Euler step to
*predict* roughly where you'll end up, then average the slope at the start
and the slope at that predicted endpoint, and use that averaged slope to
*correct* the step.

**Convergence rate:** second-order — noticeably more accurate than Euler
for the same step size, at the cost of one extra function evaluation per
step.

### Code walkthrough

Each iteration: `slope_start = f(x, y)`, then `y_predict = y + h *
slope_start` — that's an ordinary Euler step, kept only as a rough guess.

Next, `slope_end = f(x_next, y_predict)` — evaluate the slope *at the
predicted point*, not the true (unknown) endpoint.

Finally, `y_correct = y + (h/2) * (slope_start + slope_end)` — instead of
using either slope alone, average them. That average is a better estimate
of the *typical* slope across the step than either endpoint alone.

### Demo output

Same ODE as Euler's script: predictor for `y(0.1)` is `1.1` (identical to
plain Euler, since the predictor *is* an Euler step), but the corrector
gives `1.11` — matching the notes exactly, and already closer to the true
solution than Euler's uncorrected `1.1`.

---

## Runge-Kutta 4th Order (RK4)

**Script:** `scripts/rk4.py`

### What it does

The most accurate method in this course for a given step size. Instead of
one slope estimate (Euler) or two (Modified Euler), RK4 samples the slope
*four* times per step — at the start, twice near the midpoint, and once at
the end — then combines them with weights `1:2:2:1`, giving far more weight
to the (usually more representative) midpoint estimates.

**Convergence rate:** fourth-order — error shrinks proportionally to `h^4`,
so halving the step size cuts the error by roughly 16x.

### Code walkthrough

Four slope samples per step:
- `k1 = h * f(x, y)` — slope at the start, same as Euler.
- `k2 = h * f(x + h/2, y + k1/2)` — slope at the midpoint, estimated using
  a half-step taken with `k1`.
- `k3 = h * f(x + h/2, y + k2/2)` — slope at the midpoint *again*, this
  time using the better `k2`-based estimate.
- `k4 = h * f(x + h, y + k3)` — slope at the end, using a full step taken
  with `k3`.

Then `y_next = y + (k1 + 2*k2 + 2*k3 + k4) / 6` — the weighted average.
Note the weights sum to `1+2+2+1=6`, matching the `/6` divisor.

### Demo output

Same ODE, `y(0.2)` comes out to `1.242805` — compare to Euler's cruder
`1.22` for the same step size; RK4 is already visibly closer to the true
analytic solution after just two steps.

---

# Numerical Integration

## Trapezoidal Rule

**Script:** `scripts/trapezoidal.py`

### What it does

Approximates a definite integral by slicing `[a, b]` into `n` strips and
treating the top of each strip as a straight line — a trapezoid — instead
of following the true curve.

### Code walkthrough

`h = (b - a) / n` is the width of each strip. `y` is a list comprehension
evaluating `f` at every `x_0, x_1, ..., x_n`.

The formula itself: `integral = (h/2) * (y[0] + y[-1] + 2 * middle_sum)` —
the first and last y-values count once, every interior y-value counts
twice. That `2x` weighting on interior points is because each interior
point is shared by two adjacent trapezoids.

### Demo output

`x^2` from 0 to 1, `n=4`: integral comes out to `0.34375`, versus the exact
value `1/3 ≈ 0.33333` — a visible overestimate, since straight lines sit
slightly above a convex curve like `x^2`. This is the natural setup for
comparing against Simpson's Rule next, which fixes exactly this bias.

---

## Simpson's 1/3 Rule

**Script:** `scripts/simpson-13.py`

### What it does

Also slices `[a, b]` into `n` strips, but fits a parabola through every
group of 3 consecutive points instead of a straight line — which is why
`n` must be even (the strips are processed two at a time).

### Code walkthrough

Same `h` and `y` setup as Trapezoidal. The difference is the weighting:
odd-indexed points (`y[1], y[3], ...`) get weight 4, even-indexed interior
points (`y[2], y[4], ...`) get weight 2, and the two endpoints get weight 1
— giving `integral = (h/3) * (y[0] + y[-1] + 4*sum_odd + 2*sum_even)`.

### Demo output

Same `x^2` integral, `n=4`: comes out to exactly `0.33333` — Simpson's rule
fits parabolas, and `x^2` *is* a parabola, so this formula reproduces the
exact answer with no error at all, unlike Trapezoidal.

---

## Simpson's 3/8 Rule

**Script:** `scripts/simpson-38.py`

### What it does

Same family as Simpson's 1/3 Rule, but fits a *cubic* curve through every
group of 4 consecutive points instead of a parabola through 3 — so `n`
must be a multiple of 3.

### Code walkthrough

Same `h`/`y` setup again. The weighting pattern is different: points at
multiples of 3 get weight 2, every other interior point gets weight 3 —
`integral = (3h/8) * (y[0] + y[-1] + 3*sum_rest + 2*sum_mult3)`.

### Demo output

`x^2` from 0 to 1, `n=3`: also exactly `0.33333` — same reasoning as
Simpson's 1/3: fitting cubics (or better) through a quadratic reproduces it
exactly. Worth telling the class both Simpson variants give near-identical
results in general (see the notes' comparison example), and the 1/3 rule
is usually preferred when `n` can be chosen freely, since it needs fewer
sample points for the same accuracy in most cases.

---

# Matrix Operations

## LU Decomposition

**Script:** `scripts/lu-decomposition.py`

### What it does

Solves `Ax = b` by first factoring `A` into a lower-triangular `L` and an
upper-triangular `U` so that `A = LU`. Once you have those, solving the
system becomes two easy triangular solves — `Ly = b` (forward substitution)
then `Ux = y` (backward substitution) — instead of one hard general solve.

### Code walkthrough

`lu_decompose(A)` builds `L` starting as the identity matrix and `U`
starting as all zeros. For each row `i`: the `U` entries in that row
subtract off whatever's already been accounted for by earlier rows
(`sum(L[i][j] * U[j][k] for j in range(i))`), and the `L` entries in that
column do the same thing, then divide by the pivot `U[i][i]`. This is
Doolittle's method — one of a few equivalent ways to do the factorization.

`forward_substitution(L, b)` solves `Ly = b` top-down: each `y[i]`
subtracts off the contributions of the `y`-values already solved for.

`backward_substitution(U, y)` solves `Ux = y` bottom-up: each `x[i]`
subtracts off the contributions of the `x`-values already solved for, then
divides by the diagonal pivot.

### Demo output

Using the notes' exact 3x3 system, the `L` and `U` matrices printed match
the notes' worked example number-for-number, and the solution comes out to
`x ≈ 1.9444, y ≈ 1.6111, z ≈ 0.2778`.

---

## Thomas Algorithm

**Script:** `scripts/thomas-algorithm.py`

### What it does

A specialized, much faster version of Gaussian elimination for tridiagonal
systems — ones where every equation only involves its own variable plus its
immediate left and right neighbors. This shape shows up constantly when
discretizing 1D problems (e.g. the Finite Difference Method for boundary
value problems). Runs in `O(n)` time instead of the `O(n^3)` a general
solver needs.

*(Not covered explicitly in your class notes — included here as a standard
technique for the tridiagonal systems that show up in finite-difference
discretizations.)*

### Code walkthrough

Inputs `a`, `b`, `c`, `d` are the sub-diagonal, main diagonal,
super-diagonal, and right-hand side.

Forward sweep: starting from `cp[0] = c[0]/b[0]`, `dp[0] = d[0]/b[0]`, each
later row eliminates its sub-diagonal entry using `denom = b[i] - a[i] *
cp[i-1]`, then updates `cp[i]` and `dp[i]` — this is Gaussian elimination,
just simplified because every row only ever touches its immediate neighbor.

Back substitution: `x[-1] = dp[-1]` directly (the last row has nothing left
to eliminate), then each earlier `x[i] = dp[i] - cp[i] * x[i+1]` — same
pattern as the general LU back-substitution, just with only one term to
subtract instead of a whole sum.

### Demo output

A small 3-equation tridiagonal system solves to `x = [1.0, 1.0, 1.0]`.

---

## Gauss-Jacobi Iteration

**Script:** `scripts/gauss-jacobi.py`

### What it does

Solves `Ax = b` iteratively instead of directly: rearrange each equation to
solve for its own variable, then repeatedly plug in the *entire previous*
set of values to compute the *entire next* set, all at once. Needs the
matrix to be diagonally dominant (each diagonal entry larger in magnitude
than the rest of its row) to be guaranteed to converge.

**Convergence rate:** linear, and generally slower than Gauss-Seidel on the
same system, since it never uses a freshly updated value until the *next*
full round.

### Code walkthrough

The three update formulas — `x = (1+y)/2`, `y = (8+x+z)/3`, `z = (-5+y)/2`
— come from solving each of the notes' three equations for its own
variable.

The key line is the comment-worthy part: all three `_new` values are
computed from the *same* old `(x, y, z)` before any of them get
reassigned. That's what makes this Jacobi rather than Gauss-Seidel — no
update sees another update from the same round.

### Demo output

Starting at `(0,0,0)`, takes 20 iterations at this script's tolerance to
settle at `(2, 3, -1)` — the exact solution from the notes.

---

## Gauss-Seidel Iteration

**Script:** `scripts/gauss-seidel.py`

### What it does

Nearly identical to Gauss-Jacobi, with one change that usually matters a
lot: as soon as a new value is computed, it's used immediately for the rest
of that same round, instead of waiting for the next one.

**Convergence rate:** still linear, but with a smaller error-reduction
factor per iteration than Jacobi on most systems — in this demo it takes 9
iterations instead of Jacobi's 20 to reach the same tolerance.

### Code walkthrough

Same three formulas as Gauss-Jacobi. The difference is entirely about
*when* the reassignment happens: here, `x = (1+y)/2` reassigns `x`
immediately, so the very next line, `y = (8+x+z)/3`, already sees the fresh
`x` — not the old one. That's the "use it as soon as you have it" trick
that speeds up convergence.

### Demo output

Same system, same starting point, converges to `(2, 3, -1)` in 9
iterations — less than half of Jacobi's 20 on this system.

---

# Detection of Error

## Absolute & Relative Error

**Script:** `scripts/absolute-relative-error.py`

### What it does

The basic way to measure how far an approximation is from the truth.
Absolute error is the raw difference; relative error scales that
difference by the size of the true value, so the *same* 0.001 error means
something very different for `X = 1000` versus `X = 0.001`.

### Code walkthrough

`E_A = X - X1` — kept signed here, not wrapped in `abs()`, matching the
definition used in class: a positive error means the approximation `X1`
undershot the true value `X`, negative means it overshot.

`E_R = E_A / X` — the absolute error scaled by the true value. Divides by
`X`, not `X1`, since relative error is always measured against the *true*
value.

### Demo output

`X = 3.141592`, `X1 = 3.14`: `E_A = 0.001592`, `E_R ≈ 0.0005067` — matches
the notes' formula exactly.

---

## General Error Formula (Error Propagation)

**Script:** `scripts/general-error-formula.py`

### What it does

If a computed quantity `u` depends on several approximate inputs
`n1, n2, ..., nn`, each with its own small error, how much error does that
push into `u`? A first-order Taylor expansion gives the answer: multiply
each input's error by how sensitive `u` is to that input (its partial
derivative), then add those contributions up.

### Code walkthrough

`u(n1, n2, n3) = (n1 * n2) / n3` is the example function — a product
divided by a third variable, so the demo touches both the product rule and
the quotient rule's error behavior in one shot.

`partial_derivative(func, values, index, h)` estimates `d(func)/d(n_i)`
*numerically*, without deriving it by hand: it nudges the chosen input up
by `h` and down by `h`, and divides the difference in output by `2h` — the
central difference formula (a small bonus tie-in to numerical
differentiation).

`propagated_error` loops over every input, computes its partial derivative,
and accumulates two totals: `delta_u` (the signed sum — could partially
cancel out) and `max_delta_u` (every contribution's absolute value added
up — the worst-case bound the notes call `(Delta_u)_max`).

### Demo output

At `n1=10, n2=4, n3=2` with input errors `0.1, 0.05, 0.02`: each variable's
contribution prints separately, then the signed total `Delta_u ≈ 0.25` and
the worst-case bound `(Delta_u)_max ≈ 0.65` — showing concretely how the
signed and worst-case totals can differ when contributions have mixed
signs (notice `n3`'s contribution is negative while the others are
positive).

---

*(Pass B methods — Gauss/Stirling/Bessel/Everett/Lagrange interpolation,
Numerical Differentiation, RK2, Taylor Series, Picard's, BVP Finite
Difference, Matrix Norms, Double Integration, Curve Fitting, and the
remaining error-propagation formulas — will get their own sections here
once their `methodData.ts` entries are finalized.)*
