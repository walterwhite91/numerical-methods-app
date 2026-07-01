import os
import subprocess
import asyncio
import json
import base64
import urllib.request
import websockets
from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter

# Define the files in order
files = [
    "utils.py",
    "absolute_relative_error.py",
    "truncation_error.py",
    "bisection.py",
    "secant.py",
    "false_position.py",
    "newton_raphson.py",
    "generalized_newton.py",
    "lu_decomposition.py",
    "thomas_algorithm.py",
    "gauss_jacobi.py",
    "gauss_seidel.py",
    "forward_difference.py",
    "backward_difference.py",
    "euler.py",
    "modified_euler.py",
    "rk4.py",
    "trapezoidal.py",
    "simpson_13.py",
    "simpson_38.py",
    "iteration_system.py",
    "newton_system.py"
]

methods_dir = "backend/methods"

# Let's read and highlight each file
highlighted_sections = []

for idx, file_name in enumerate(files, 1):
    file_path = os.path.join(methods_dir, file_name)
    if not os.path.exists(file_path):
        print(f"Warning: File {file_path} not found.")
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        code_content = f.read()
        
    # Generate HTML with line numbers
    formatter = HtmlFormatter(linenos=True, cssclass="source-code", style="default")
    highlighted_code = highlight(code_content, PythonLexer(), formatter)
    
    section_html = f"""
    <div class="page-container">
        <div class="tab-header">
            <span class="file-name">MCSC-202 - {file_name}</span>
            <span class="tab-type">Python Source File</span>
        </div>
        <div class="code-wrapper">
            {highlighted_code}
        </div>
    </div>
    """
    highlighted_sections.append(section_html)

# Create the final HTML structure with VS Code Light Modern theme styles
# We decrease the font-size to 11px and line-height to 1.35 to prevent small overflows
html_content = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>MCSC-202 Numerical Methods Code Compilation</title>
<style>
@page {{
    size: A4 portrait;
    margin: 10mm;
}}
@media print {{
    body {{
        -webkit-print-color-adjust: exact;
        background-color: #ffffff !important;
    }}
    .page-container {{
        background-color: #ffffff !important;
        margin-bottom: 25px;
    }}
}}
body {{
    background-color: #ffffff;
    color: #000000;
    font-family: "Consolas", "Courier New", monospace;
    margin: 0;
    padding: 0;
}}
.page-container {{
    background-color: #ffffff;
    margin-bottom: 25px;
}}
.tab-header {{
    background-color: #f3f3f3;
    color: #6b6b6b;
    padding: 8px 15px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12px;
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    break-after: avoid;
    page-break-after: avoid;
}}
.file-name {{
    color: #000000;
    font-weight: 600;
}}
.tab-type {{
    color: #0052cc;
}}
.code-wrapper {{
    padding: 10px 0;
    background-color: #ffffff;
}}
/* VS Code syntax highlighting adjustments */
.source-code {{
    background-color: #ffffff;
}}
.source-code pre {{
    margin: 0;
    font-size: 11px;
    line-height: 1.35;
    white-space: pre-wrap;       /* Support wrapping of long lines to prevent clipping */
    word-break: break-all;
}}
.source-code td.linenos {{
    color: #a0a0a0 !important;
    background-color: #ffffff !important;
    padding-right: 15px;
    border-right: 1px solid #e4e4e4;
    text-align: right;
    user-select: none;
    vertical-align: top;
    white-space: nowrap !important;
}}
.source-code td.linenos pre {{
    white-space: pre !important;
    word-break: normal !important;
}}
.source-code td.code {{
    padding-left: 15px;
    background-color: #ffffff !important;
    vertical-align: top;
}}
/* Token styles matching VS Code light theme */
.source-code .k {{ color: #0000ff !important; font-weight: normal; }} /* def, if, return, for, in, etc. */
.source-code .kn {{ color: #af00db !important; font-weight: normal; }} /* from, import */
.source-code .nn {{ color: #000000 !important; }} /* module name */
.source-code .nf {{ color: #795e26 !important; }} /* function name */
.source-code .s1, .source-code .s2, .source-code .s {{ color: #a31515 !important; }} /* strings */
.source-code .sd {{ color: #008000 !important; font-style: italic; }} /* docstring */
.source-code .c1, .source-code .c {{ color: #008000 !important; font-style: italic; }} /* comments */
.source-code .mi, .source-code .mf, .source-code .m {{ color: #098658 !important; }} /* numbers */
.source-code .nb {{ color: #0000ff !important; }} /* builtins (range, abs, etc.) */
.source-code .o {{ color: #000000 !important; }} /* operators */
.source-code .n {{ color: #001080 !important; }} /* variables / identifiers */
.source-code .p {{ color: #000000 !important; }} /* punctuation */
.source-code .ow {{ color: #0000ff !important; }} /* operator word (and, or) */


</style>
</head>
<body>
    {"".join(highlighted_sections)}
</body>
</html>
"""

# Write to temp HTML
html_path = "backend/code_compilation.html"
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated intermediate HTML file at {html_path}")

# Run headless chrome via CDP WebSocket to print to PDF with custom header/footer
async def print_pdf():
    chrome_port = 9222
    chrome_cmd = [
        "google-chrome",
        "--headless=new",
        f"--remote-debugging-port={chrome_port}",
        "--disable-gpu",
        "--no-sandbox"
    ]
    # Start chrome in background
    chrome_proc = subprocess.Popen(chrome_cmd)
    
    # Wait for Chrome to spin up
    await asyncio.sleep(2)
    
    try:
        # Get WS debugger URL
        url = f"http://127.0.0.1:{chrome_port}/json/list"
        with urllib.request.urlopen(url) as response:
            targets = json.loads(response.read().decode())
            
        ws_url = None
        for target in targets:
            if target.get("type") == "page":
                ws_url = target.get("webSocketDebuggerUrl")
                break
                
        if not ws_url:
            raise Exception("Could not find browser page WS URL.")
            
        # Connect to browser WS
        async with websockets.connect(ws_url, max_size=None) as websocket:
            # Navigate to the HTML file
            html_abs_path = os.path.abspath(html_path)
            nav_payload = {
                "id": 1,
                "method": "Page.navigate",
                "params": {
                    "url": f"file://{html_abs_path}"
                }
            }
            await websocket.send(json.dumps(nav_payload))
            await asyncio.sleep(3) # Wait for page load
            
            # Footer layout: dynamic page numbers, static clean date "6/29/26", no time, no URL
            footer_html = """
            <div style="font-size: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 100%; margin: 0 10mm; display: flex; justify-content: space-between; color: #858585; border-top: 1px solid #e4e4e4; padding-top: 4px;">
                <span>6/29/26</span>
                <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
            </div>
            """
            header_html = '<div style="visibility: hidden;"></div>'
            
            print_payload = {
                "id": 2,
                "method": "Page.printToPDF",
                "params": {
                    "displayHeaderFooter": True,
                    "headerTemplate": header_html,
                    "footerTemplate": footer_html,
                    "printBackground": True,
                    "paperWidth": 8.27, # A4 width in inches
                    "paperHeight": 11.69, # A4 height in inches
                    "marginTop": 0.45, # Reduced top margin (in inches)
                    "marginBottom": 0.55, # Bottom margin for footer
                    "marginLeft": 0.39, # 10mm left margin
                    "marginRight": 0.39 # 10mm right margin
                }
            }
            
            await websocket.send(json.dumps(print_payload))
            
            # Read print data
            pdf_data = None
            while True:
                resp = json.loads(await websocket.recv())
                if resp.get("id") == 2:
                    pdf_data = resp["result"]["data"]
                    break
            
            # Save file
            pdf_output = "numerical_methods_compilation.pdf"
            with open(pdf_output, "wb") as f:
                f.write(base64.b64decode(pdf_data))
                
            print(f"Successfully generated PDF at {pdf_output}")
            
    finally:
        # Stop Chrome
        chrome_proc.terminate()
        chrome_proc.wait()

# Run print process
asyncio.run(print_pdf())
