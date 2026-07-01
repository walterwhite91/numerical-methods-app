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

# Define the files in order in this directory
files = [
    "utils.py",
    "absolute_relative_error.py",
    "truncation_error.py",
    "bisection.py",
    "false_position.py",
    "newton_raphson.py",
    "secant.py",
    "lu_decomposition.py",
    "thomas_algorithm.py",
    "finite_difference.py",
    "backward_interpolation.py",
    "central_interpolation.py"
]

current_dir = os.path.dirname(os.path.abspath(__file__)) if __file__ else "."

# Let's read and highlight each file
highlighted_sections = []

for idx, file_name in enumerate(files, 1):
    file_path = os.path.join(current_dir, file_name)
    if not os.path.exists(file_path):
        print(f"Warning: File {file_path} not found.")
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        code_content = f.read()
        
    # Generate HTML with line numbers
    formatter = HtmlFormatter(linenos=True, cssclass="source-code", style="default")
    highlighted_code = highlight(code_content, PythonLexer(), formatter)
    
    # Page break before each file (after the first one) to keep them separate
    page_break_style = "page-break-before: always;" if idx > 1 else ""
    
    section_html = f"""
    <div class="page-container" style="{page_break_style} margin-bottom: 30px;">
        <div class="tab-header">
            <span class="file-name">MCSC-202 (Simplified) - {file_name}</span>
            <span class="tab-type">Python Source File</span>
        </div>
        <div class="code-wrapper">
            {highlighted_code}
        </div>
    </div>
    """
    highlighted_sections.append(section_html)

# Create the final HTML structure with VS Code Light Modern theme styles
html_content = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>MCSC-202 Simplified Numerical Methods Core Codes</title>
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

# Write to temp HTML in current_dir
html_path = os.path.join(current_dir, "code_compilation.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated intermediate HTML file at {html_path}")

# Run headless chrome via CDP WebSocket to print to PDF
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
            
            # Footer layout: dynamic page numbers, static clean date "7/1/26", no time, no URL
            footer_html = """
            <div style="font-size: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 100%; margin: 0 10mm; display: flex; justify-content: space-between; color: #858585; border-top: 1px solid #e4e4e4; padding-top: 4px;">
                <span>7/1/26</span>
                <span style="font-weight: 600;">MCSC-202 Simplified core codes</span>
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
            
            # Save file in current_dir
            pdf_output = os.path.join(current_dir, "simplified_numerical_methods.pdf")
            with open(pdf_output, "wb") as f:
                f.write(base64.b64decode(pdf_data))
                
            print(f"Successfully generated PDF at {pdf_output}")
            
    finally:
        # Stop Chrome
        chrome_proc.terminate()
        chrome_proc.wait()
        # Clean up temporary HTML
        if os.path.exists(html_path):
            os.remove(html_path)

# Run print process
asyncio.run(print_pdf())
