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
    saveToLocalStorage(); // Save content after applying formatting
}

function applyItalic() {
    document.execCommand('italic');
    saveToLocalStorage(); // Save content after applying italic
}

function applyNote() {
    // Ensure the selection exists and the browser supports execCommand
    var selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    // Get the selected content and wrap it in a 'note' class using execCommand
    document.execCommand('insertHTML', false, '<div class="note">' + selection.toString() + '</div>');
    saveToLocalStorage(); // Save content after applying the note
}

function applyCode() {
    // Ensure the selection exists and the browser supports execCommand
    var selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    // Get the selected content as a string
    var selectedText = selection.toString();

    // Remove all HTML tags from the selected content using a regular expression
    selectedText = selectedText.replace(/<\/?[^>]+(>|$)/g, "");

    // Wrap the cleaned content in 'pre' and 'code' tags
    document.execCommand('insertHTML', false, '<pre><code class="language-csharp">' + selectedText + '</code></pre>');
    triggerPrism(); // Call Prism to apply syntax highlighting
    saveToLocalStorage(); // Save content after applying the code block
}

// Function to trigger Prism's syntax highlighting on the newly inserted code block
function triggerPrism() {
    // Trigger Prism's syntax highlighting on the newly inserted code block
    var codeBlock = document.querySelector('pre code.language-csharp');
    if (codeBlock) {
        Prism.highlightElement(codeBlock);
    }
}