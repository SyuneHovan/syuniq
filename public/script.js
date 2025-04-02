const SERVER_URL = window.location.origin;
let filePath = "csharp.html";

async function loadContent() {
    const response = await fetch(`${SERVER_URL}/api/get-content.js?file=${encodeURIComponent(filePath)}`);
    const text = await response.text();
    document.getElementById("editor").innerHTML = text;
    triggerPrism(); // Call Prism to apply syntax highlighting
    headerToggle();
    navBarAdd();
}

async function saveContent() {
    removeAllIcons();
    const content = document.getElementById("editor").innerHTML;
    await fetch(`${SERVER_URL}/api/save-content.js?file=${encodeURIComponent(filePath)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    });
    triggerPrism(); // Call Prism to apply syntax highlighting
    headerToggle();
}

// Load content on page load
window.onload = loadContent;

// Save content when user edits
// document.getElementById("editor").addEventListener("input", saveContent);

// Function to apply formatting (tag, like <b>, <i>, etc.)
function formatText(tag) {
    document.execCommand('formatBlock', false, tag);
}

function changePage(newFilePath) {
    filePath = newFilePath;
    loadContent()
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
    var codeBlocks = document.querySelectorAll('pre code.language-csharp');
    codeBlocks.forEach(codeBlock => {
        if (codeBlock) {
            Prism.highlightElement(codeBlock);
        }
    });
    console.log("codeBlocks", codeBlocks)
}


function createToggleIcon() {
    let toggleIcon = document.createElement("span");
    toggleIcon.innerHTML = "🌻"; // Default icon (closed state)
    toggleIcon.style.cursor = "pointer";
    toggleIcon.style.marginRight = "8px";
    return toggleIcon;
}

function toggleHeaderContent(header, toggleIcon) {
    if (header.classList.contains("closed"))
        header.classList.remove("closed");
    else 
    header.classList.add("closed"); 

    let isHidden = header.classList.contains("closed");    
    
    let nextElement = header.nextElementSibling;
    let headerTag = header.tagName;
    
    while (nextElement && (!nextElement.matches('h1, h2, h3, h4, h5') || nextElement.tagName > headerTag)) {
        // isHidden = nextElement.style.display === "none";
        nextElement.style.display = isHidden ? "none" : "block";
        nextElement.classList.remove("closed");
        if (nextElement.querySelector("span.toggle-icon")) {
            nextElement.querySelector("span.toggle-icon").innerHTML = "🌻";
        }

        nextElement = nextElement.nextElementSibling;
    }
    
    // Toggle icon direction
    toggleIcon.innerHTML = isHidden ? "🌿" : "🌻";
}

function headerToggle() {
    var headers = document.querySelectorAll('h1, h2, h3, h4, h5');
    
    headers.forEach((header) => {
        // Remove existing icons before adding new ones
        let existingIcon = header.querySelector("span.toggle-icon");
        let isHidden = header.classList.contains("closed");   
        if (existingIcon) {
            existingIcon.remove();
        }
        
        let toggleIcon = createToggleIcon();
        toggleIcon.classList.add("toggle-icon");
        toggleIcon.innerHTML = isHidden ? "🌿" : "🌻";
        header.prepend(toggleIcon);
        
        toggleIcon.addEventListener("click", (event) => {
            toggleHeaderContent(header, toggleIcon);
            event.stopPropagation(); // Prevent event from bubbling to header
        });
    });
}

function removeAllIcons() {
    document.querySelectorAll("span.toggle-icon").forEach(icon => icon.remove());
}

function navBarAdd() {
    const navbar = document.querySelector(".navbar");
    const navbarAdd = document.querySelector(".navbar-add");

    navbarAdd.addEventListener("click", function () {
        // Check if an input field already exists
        if (document.querySelector(".navbar-input")) return;

        // Create input field
        let input = document.createElement("input");
        input.type = "text";
        input.classList.add("navbar-input");
        input.placeholder = "Enter new page name";

        // Create submit button
        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Add";
        submitBtn.classList.add("navbar-submit");

        // Append to navbar
        navbar.appendChild(input);
        navbar.appendChild(submitBtn);

        // Handle submission
        submitBtn.addEventListener("click", function () {
            let pageName = input.value.trim();
            if (pageName === "") return; // Prevent empty values

            let fileName = pageName.toLowerCase().replace(/\s+/g, "_") + ".html"; // Format filename

            // Create new nav item
            let newNavItem = document.createElement("div");
            newNavItem.classList.add("navbar-item");
            newNavItem.textContent = pageName;
            newNavItem.setAttribute("onclick", `changePage('${fileName}')`);

            // Append new item to navbar
            navbar.appendChild(newNavItem);

            // Clean up input and button
            input.remove();
            submitBtn.remove();

            // Call server function to create the file (this requires backend support)
            createNewFile(fileName);
        });
    });
}

// Function to send request to backend (Node.js, PHP, etc.) to create a new file
function createNewFile(fileName) {
    fetch("/create-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: fileName }),
    })
    .then(response => response.json())
    .then(data => console.log("File Created:", data))
    .catch(error => console.error("Error creating file:", error));
}