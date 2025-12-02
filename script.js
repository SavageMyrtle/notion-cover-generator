// Get all DOM elements
const svg = document.getElementById('gradientSvg');
const startColorInput = document.getElementById('startColor');
const endColorInput = document.getElementById('endColor');
const angleSlider = document.getElementById('angleSlider');
const angleValue = document.getElementById('angleValue');
const textInput = document.getElementById('textInput');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const fontWeightSelect = document.getElementById('fontWeight');
const textColorInputs = document.querySelectorAll('input[name="textColor"]');
const alignmentButtons = document.querySelectorAll('.alignment-button');
const safeAreaToggle = document.querySelector('.safe-area-toggle');
const DEFAULT_START_COLOR = '#ffffff';  // or whatever color you prefer
const DEFAULT_END_COLOR = '#000000';    // or whatever color you prefer

if (startColorInput) {
    startColorInput.value = DEFAULT_START_COLOR;
}
if (endColorInput) {
    endColorInput.value = DEFAULT_END_COLOR;
}

// Initialize SVG elements
function initializeSVG() {
    // Create gradient definition
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "grad");
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Create background rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "url(#grad)");
    svg.appendChild(rect);

    // Add safe area guide
    const safeArea = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    safeArea.setAttribute("x", "200");
    safeArea.setAttribute("y", "150");
    safeArea.setAttribute("width", "1100");
    safeArea.setAttribute("height", "300");
    safeArea.setAttribute("fill", "none");
    safeArea.setAttribute("stroke", "#ff00ff80"); // Magenta with 50% opacity
    safeArea.setAttribute("stroke-dasharray", "5,5");
    safeArea.id = "safeArea";
    svg.appendChild(safeArea);

    // Create text element

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "750");
    text.setAttribute("y", "50%");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-family", fontFamilySelect.value);
    text.setAttribute("font-weight", "500");  // Set default to medium (500)
    text.setAttribute("font-size", "100px");  // Set default to 100px
    svg.appendChild(text);

    return { gradient, stop1, stop2, text };
}

const svgElements = initializeSVG();

// Set default font weight
if (fontWeightSelect) {
    fontWeightSelect.value = "500";  // Set dropdown to medium
}

// Set default font size
if (fontSizeSlider) {
    fontSizeSlider.value = "100";
    fontSizeValue.textContent = "100px";
}

// Update gradient
function updateGradient() {
    const angle = angleSlider.value;
    const startColor = startColorInput.value;
    const endColor = endColorInput.value;

    const radians = (angle - 90) * (Math.PI / 180);
    const x1 = 50 + Math.cos(radians) * 50;
    const y1 = 50 + Math.sin(radians) * 50;
    const x2 = 50 - Math.cos(radians) * 50;
    const y2 = 50 - Math.sin(radians) * 50;

    svgElements.gradient.setAttribute("x1", `${x1}%`);
    svgElements.gradient.setAttribute("y1", `${y1}%`);
    svgElements.gradient.setAttribute("x2", `${x2}%`);
    svgElements.gradient.setAttribute("y2", `${y2}%`);

    svgElements.stop1.setAttribute("stop-color", startColor);
    svgElements.stop2.setAttribute("stop-color", endColor);
    
    angleValue.textContent = `${angle}°`;
    document.getElementById('startColorHex').textContent = startColor.toUpperCase();
    document.getElementById('endColorHex').textContent = endColor.toUpperCase();
}

// Replace the current updateText function with this version
function updateText() {
    while (svgElements.text.firstChild) {
        svgElements.text.removeChild(svgElements.text.firstChild);
    }
    
    const lines = textInput.value.split('\n');
    const lineHeight = 1.2;
    const fontSize = parseInt(fontSizeSlider.value);
    
    // Center vertically in safe area (300px height)
    const totalHeight = (lines.length - 1) * lineHeight * fontSize;
    const startY = 300 - (totalHeight / 2);
    
    lines.forEach((line, index) => {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.textContent = line;
        tspan.setAttribute("x", svgElements.text.getAttribute("x"));
        tspan.setAttribute("y", startY);
        tspan.setAttribute("dy", `${lineHeight * index}em`);
        svgElements.text.appendChild(tspan);
    });
}

// Update text styling
function updateTextColor() {
    const selectedColor = document.querySelector('input[name="textColor"]:checked').value;
    svgElements.text.setAttribute("fill", selectedColor);
}

function updateFontSize() {
    const size = fontSizeSlider.value;
    svgElements.text.setAttribute("font-size", `${size}px`);
    fontSizeValue.textContent = `${size}px`;
}

function updateFontWeight() {
    svgElements.text.setAttribute("font-weight", fontWeightSelect.value);
}

function updateFontFamily() {
    svgElements.text.setAttribute("font-family", fontFamilySelect.value);
}

// Handle text alignment
// Replace the current alignment buttons event listener code with this simpler version
alignmentButtons.forEach(button => {
    button.addEventListener('click', () => {
        alignmentButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const align = button.dataset.align;
        
        // Safe area boundaries
        const safeAreaLeft = 200;  // Original safe area x position
        const safeAreaRight = 1300;  // x + width (200 + 1100)
        const safeAreaCenter = 750;  // Center point (200 + 1100/2)
        
        // Set text anchor and x position based on alignment
        const textAnchor = align === 'left' ? 'start' : 
                          align === 'right' ? 'end' : 'middle';
        const x = align === 'left' ? `${safeAreaLeft + 50}` :  // Add 50px padding from safe area edge
                 align === 'right' ? `${safeAreaRight - 50}` : // Subtract 50px padding from safe area edge
                 `${safeAreaCenter}`;  // Center alignment uses middle of safe area
        
        svgElements.text.setAttribute('text-anchor', textAnchor);
        svgElements.text.setAttribute('x', x);
        
        // Update all tspans
        const tspans = svgElements.text.getElementsByTagName('tspan');
        Array.from(tspans).forEach(tspan => {
            tspan.setAttribute('x', x);
        });
    });
});

// Handle download
const downloadButton = document.querySelector('.download-button');

// Replace the current download button event listener with this updated version
downloadButton.addEventListener('click', () => {
    const safeArea = document.getElementById('safeArea');
    const wasVisible = safeArea.classList.contains('visible');
    safeArea.style.display = 'none';
    
    const svgClone = svg.cloneNode(true);
    svgClone.setAttribute('width', '1500');
    svgClone.setAttribute('height', '600');
    
    // Add complete font definitions for all weights
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
        
        text {
            font-family: '${svgElements.text.getAttribute('font-family')}', sans-serif;
            font-weight: ${svgElements.text.getAttribute('font-weight')};
        }
        
        tspan {
            font-family: inherit;
            font-weight: inherit;
        }
    `;
    svgClone.insertBefore(styleElement, svgClone.firstChild);
    
    // Ensure text alignment is preserved
    const textElement = svgClone.querySelector('text');
    const tspans = textElement.querySelectorAll('tspan');
    const currentX = textElement.getAttribute('x');
    const currentAnchor = textElement.getAttribute('text-anchor');
    
    tspans.forEach(tspan => {
        tspan.setAttribute('x', currentX);
        tspan.setAttribute('text-anchor', currentAnchor);
    });
    
    // Generate filename from text and colors
    const textContent = textInput.value.split('\n')[0].slice(0, 20).toLowerCase().replace(/\s+/g, '_');
    const color1 = startColorInput.value.slice(1);
    const color2 = endColorInput.value.slice(1);
    const filename = `${textContent}-${color1}-${color2}.svg`;
    
    // Add XML declaration and SVG namespace
    const svgContent = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
                      new XMLSerializer().serializeToString(svgClone);
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // NEW: Try to download, but if in iframe, open in new tab instead
    link.target = '_blank'; // This makes it work in iframes
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (wasVisible) {
        safeArea.style.display = 'block';
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
});


// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    startColorInput.addEventListener('input', updateGradient);
    endColorInput.addEventListener('input', updateGradient);
    angleSlider.addEventListener('input', updateGradient);

    textInput.addEventListener('input', updateText);
    fontFamilySelect.addEventListener('change', updateFontFamily);
    fontSizeSlider.addEventListener('input', updateFontSize);
    fontWeightSelect.addEventListener('change', updateFontWeight);
    textColorInputs.forEach(input => {
        input.addEventListener('change', updateTextColor);
    });

    // Safe Area Toggle Implementation
    const safeArea = document.getElementById('safeArea');
    const safeAreaToggle = document.getElementById('safeAreaToggle');

    if (safeAreaToggle && safeArea) {
        safeAreaToggle.addEventListener('click', () => {
            console.log('Safe area toggle clicked');
            safeArea.classList.toggle('visible');
            safeAreaToggle.classList.toggle('active');
        });
    }

    // Initial render
    updateGradient();
    updateTextColor();
    updateFontSize();
});
