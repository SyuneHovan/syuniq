const SERVER_URL = "https://syuniq.vercel.app"; 

async function loadContent() {
    const response = await fetch(`${SERVER_URL}/api/get-content.js`);
    const text = await response.text();
    document.getElementById("editor").innerHTML = text;
}

async function saveContent() {
    const content = document.getElementById("editor").innerHTML;
    await fetch(`${SERVER_URL}/api/save-content.js`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    });
}

// Load content on page load
window.onload = loadContent;

// Save content when user edits
document.getElementById("editor").addEventListener("input", saveContent);

// Function to apply formatting (tag, like <b>, <i>, etc.)
function formatText(tag) {
    document.execCommand('formatBlock', false, tag);
}

function applyItalic() {
    document.execCommand('italic');
}

function applyNote() {
    // Ensure the selection exists and the browser supports execCommand
    var selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    // Get the selected content and wrap it in a 'note' class using execCommand
    document.execCommand('insertHTML', false, '<div class="note">' + selection.toString() + '</div>');
}

function applyCode() {
    // Ensure the selection exists and the browser supports execCommand
    var selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    // Get the selected content as a string
    var selectedText = selection.toString();

    // Remove all HTML tags from the selected content using a regular expression
    selectedText = selectedText.replace(/<\/?[^>]+(>|$)/g, "");

    
    // Check if the selected text is already inside <pre><code> tags
    if (selectedText.includes('<pre><code')) {
        console.log("if");
        
        // Remove the <pre><code> tags and replace them with <p> tags
        selectedText = selectedText.replace(/<\/?pre><\/?code[^>]*>/g, ''); // Remove <pre><code> tags
        selectedText = '<p>' + selectedText + '</p>'; // Wrap with <p> tags
    } else {
        console.log("else");
        // Remove all HTML tags from the selected content using a regular expression
        selectedText = selectedText.replace(/<\/?[^>]+(>|$)/g, "");

        // Wrap the cleaned content in 'pre' and 'code' tags
        selectedText = '<pre><code class="language-csharp">' + selectedText + '</code></pre>';
    }

    // Wrap the cleaned content in 'pre' and 'code' tags
    document.execCommand('insertHTML', false, '<pre><code class="language-csharp">' + selectedText + '</code></pre>');
    triggerPrism(); // Call Prism to apply syntax highlighting
}

function undoAction() {
    document.execCommand('undo');
}

function redoAction() {
    document.execCommand('redo');
}

// Function to trigger Prism's syntax highlighting on the newly inserted code block
function triggerPrism() {
    // Trigger Prism's syntax highlighting on the newly inserted code block
    var codeBlock = document.querySelector('pre code.language-csharp');
    console.log("codeBlock", codeBlock)
    if (codeBlock) {
        Prism.highlightElement(codeBlock);
    }
}