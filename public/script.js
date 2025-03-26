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
