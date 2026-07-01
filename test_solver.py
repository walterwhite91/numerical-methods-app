import urllib.request
import urllib.parse
import json
import sys

API_BASE = "http://127.0.0.1:8000/api"

def run_test(name, endpoint, payload):
    url = f"{API_BASE}/{endpoint}"
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            if result.get("success"):
                val = result.get('root') or result.get('integral') or result.get('final_y')
                print(f"✅ PASS | {name.ljust(15)} | Result: {val}")
                return True
            else:
                print(f"❌ FAIL | {name.ljust(15)} | Message: {result.get('message')}")
                return False
    except Exception as e:
        print(f"❌ ERROR| {name.ljust(15)} | {str(e)}")
        return False

tests = [
    # Root Finding
    ("Log 1 (Bisect)", "root-finding/bisection", {"func_str": "log(x) - cos(x)", "a": 0.1, "b": 2}),
    ("Log 2 (NR)", "root-finding/newton-raphson", {"func_str": "log(x) + x - 3.5", "deriv_str": "1/x + 1", "x0": 2}),
    ("Log 3 (Secant)", "root-finding/secant", {"func_str": "x*log(x) - 1", "x0": 1, "x1": 3}),
    ("Trig 1 (Bisect)", "root-finding/bisection", {"func_str": "sin(x) - x/2", "a": 1, "b": 2}),
    ("Trig 2 (NR)", "root-finding/newton-raphson", {"func_str": "cos(x) - x", "deriv_str": "-sin(x) - 1", "x0": 1}),
    ("Trig 3 (FalseP)", "root-finding/false-position", {"func_str": "tan(x) - x", "a": 4, "b": 4.5}),
    ("Complex 1(Sec)", "root-finding/secant", {"func_str": "exp(x) - 3*sin(x)", "x0": 0, "x1": 1}),
    ("Complex 2(NR)", "root-finding/newton-raphson", {"func_str": "log(sin(x)) + 1", "deriv_str": "cos(x)/sin(x)", "x0": 0.5}),
    
    # Generalized Newton for repeated roots
    ("Gen-Newton", "root-finding/generalized-newton", {"func_str": "(x-1)**2 * (x+2)", "deriv_str": "2*(x-1)*(x+2) + (x-1)**2", "multiplicity": 2, "x0": 1.5}),
    
    # Integration
    ("Int 1 (Trap)", "integration", {"func_str": "log(x)", "a": 1, "b": 2.71828, "n": 4, "method": "trapezoidal"}),
    ("Int 2 (Simp13)", "integration", {"func_str": "sin(x)", "a": 0, "b": 3.14159, "n": 4, "method": "simpson_13"}),
    ("Int 3 (Trap)", "integration", {"func_str": "1/log(x)", "a": 2, "b": 4, "n": 6, "method": "trapezoidal"}),
    ("Int 4 (Simp38)", "integration", {"func_str": "x*sin(x)", "a": 0, "b": 3.14159, "n": 3, "method": "simpson_38"}),
    
    # ODEs
    ("ODE 1 (Euler)", "ode/euler", {"func_str": "x + y", "x0": 0, "y0": 1, "h": 0.1, "steps_count": 5}),
    ("ODE 2 (RK4)", "ode/rk4", {"func_str": "sin(x) + y", "x0": 0, "y0": 0, "h": 0.2, "steps_count": 5}),
    ("ODE 3 (Mod-Eul)", "ode/modified-euler", {"func_str": "log(x) + y", "x0": 1, "y0": 0, "h": 0.1, "steps_count": 5})
]

print("=== Running Numerical Methods API Tests ===")
passed = 0
for name, endpoint, payload in tests:
    if run_test(name, endpoint, payload):
        passed += 1

print(f"\nCompleted: {passed}/{len(tests)} tests passed.")
if passed != len(tests):
    sys.exit(1)
