// 全局变量
let canvasSize = 18;
let currentColor = '#000000';
let gridCells = [];
let isDrawing = false;

// 节流函数
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

// DOM 元素
const gridCanvas = document.getElementById('gridCanvas');
const sizeSlider = document.getElementById('sizeSlider');
const sizeDisplay = document.getElementById('sizeDisplay');
const sizeInput = document.getElementById('sizeInput');
const colorGrid = document.getElementById('colorGrid');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');
const imageInput = document.getElementById('imageInput');

// 初始化应用
function initApp() {
    generateColorGrid();
    generateCanvas();
    setupEventListeners();
    window.addEventListener('resize', throttle(scaleCanvas, 200));
}

// 生成颜色选择网格
function generateColorGrid() {
    colorGrid.innerHTML = '';
    const commonColors = [
        { name: '纯黑', hex: '#000000' },
        { name: '纯白', hex: '#FFFFFF' },
        { name: '红色', hex: '#FF0000' },
        { name: '蓝色', hex: '#0000FF' },
        { name: '绿色', hex: '#00FF00' },
        { name: '黄色', hex: '#FFFF00' },
        { name: '紫色', hex: '#800080' },
        { name: '橙色', hex: '#FFA500' },
        { name: '棕色', hex: '#8B4513' },
        { name: '灰色', hex: '#808080' },
        { name: '粉色', hex: '#FFC0CB' },
        { name: '浅蓝色', hex: '#87CEEB' }
    ];
    const skinHairColors = [
        { name: '肤色', hex: '#FFDAB9' },
        { name: '浅肤色', hex: '#FFE4C4' },
        { name: '深肤色', hex: '#DEB887' },
        { name: '深棕色', hex: '#654321' },
        { name: '中棕色', hex: '#8B4513' },
        { name: '浅棕色', hex: '#A0522D' }
    ];
    
    const createSection = (title, colors) => {
        const section = document.createElement('div');
        section.className = 'color-section';
        const titleEl = document.createElement('h4');
        titleEl.className = 'color-section-title';
        titleEl.textContent = title;
        section.appendChild(titleEl);
        const grid = document.createElement('div');
        grid.className = 'color-subgrid';
        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color.hex;
            swatch.title = color.name;
            if (color.hex === currentColor) swatch.classList.add('active');
            swatch.addEventListener('click', () => {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                currentColor = color.hex;
                swatch.classList.add('active');
            });
            grid.appendChild(swatch);
        });
        section.appendChild(grid);
        return section;
    };
    
    colorGrid.appendChild(createSection('常用颜色', commonColors));
    colorGrid.appendChild(createSection('皮肤和头发', skinHairColors));
    
    const usedColors = [...commonColors, ...skinHairColors].map(c => c.hex);
    const moreColors = PERLER_BEADS_COLORS.filter(c => !usedColors.includes(c.hex)).slice(0, 36);
    colorGrid.appendChild(createSection('更多颜色', moreColors));
}

// 生成画布网格
function generateCanvas() {
    gridCanvas.innerHTML = '';
    gridCells = [];
    gridCanvas.style.gridTemplateColumns = `repeat(${canvasSize}, 1fr)`;
    gridCanvas.style.gridTemplateRows = `repeat(${canvasSize}, 1fr)`;
    const fragment = document.createDocumentFragment();
    for (let y = 0; y < canvasSize; y++) {
        const row = [];
        for (let x = 0; x < canvasSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            fragment.appendChild(cell);
            row.push(cell);
        }
        gridCells.push(row);
    }
    gridCanvas.appendChild(fragment);
    setupCanvasEventListeners();
    scaleCanvas();
}

// 缩放画布
function scaleCanvas() {
    const container = document.querySelector('.canvas-container');
    const containerSize = container.clientWidth;
    let cellSize = canvasSize <= 16 ? 24 : canvasSize <= 32 ? 16 : 10;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && cellSize < 12) cellSize = 12;
    const canvasActualSize = canvasSize * cellSize + canvasSize + 1;
    let scale = Math.min(1, containerSize / canvasActualSize);
    gridCanvas.style.width = canvasActualSize + 'px';
    gridCanvas.style.height = canvasActualSize + 'px';
    gridCanvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
    });
}

// 绘制相关函数
function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function draw(e) {
    if (!isDrawing) return;
    const target = e.touches ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
    if (target && target.classList.contains('grid-cell')) {
        target.style.backgroundColor = currentColor;
    }
}

function stopDrawing() { isDrawing = false; }

function setupCanvasEventListeners() {
    gridCanvas.addEventListener('mousedown', startDrawing);
    gridCanvas.addEventListener('mousemove', draw);
    gridCanvas.addEventListener('mouseup', stopDrawing);
    gridCanvas.addEventListener('mouseleave', stopDrawing);
    gridCanvas.addEventListener('touchstart', e => { e.preventDefault(); startDrawing(e); }, { passive: false });
    gridCanvas.addEventListener('touchmove', e => { e.preventDefault(); draw(e); }, { passive: false });
    gridCanvas.addEventListener('touchend', stopDrawing);
}

function setupEventListeners() {
    sizeSlider.addEventListener('input', throttle(() => {
        canvasSize = parseInt(sizeSlider.value);
        sizeDisplay.textContent = `${canvasSize} x ${canvasSize}`;
        sizeInput.value = canvasSize;
        generateCanvas();
    }, 100));
    
    sizeInput.addEventListener('input', throttle(() => {
        let value = parseInt(sizeInput.value) || 1;
        value = Math.max(1, Math.min(64, value));
        canvasSize = value;
        sizeDisplay.textContent = `${canvasSize} x ${canvasSize}`;
        sizeSlider.value = canvasSize;
        generateCanvas();
    }, 200));
    
    importBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageImport);
    exportBtn.addEventListener('click', exportCanvas);
    clearBtn.addEventListener('click', clearCanvas);
}

function handleImageImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => pixelateImage(img);
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function pixelateImage(img) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(img, 0, 0, canvasSize, canvasSize);
    const imageData = tempCtx.getImageData(0, 0, canvasSize, canvasSize);
    const data = imageData.data;
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const i = (y * canvasSize + x) * 4;
            const color = data[i + 3] < 128 ? '#FFFFFF' : 
                '#' + [data[i], data[i+1], data[i+2]].map(v => v.toString(16).padStart(2, '0')).join('');
            if (gridCells[y] && gridCells[y][x]) {
                gridCells[y][x].style.backgroundColor = color;
            }
        }
    }
}

function exportCanvas() {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    const cellSize = 20;
    const width = canvasSize * cellSize + canvasSize + 1;
    exportCanvas.width = width;
    exportCanvas.height = width;
    exportCtx.fillStyle = '#2a2a2a';
    exportCtx.fillRect(0, 0, width, width);
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const color = gridCells[y][x]?.style.backgroundColor || '#ffffff';
            exportCtx.fillStyle = color;
            exportCtx.fillRect(x * cellSize + x + 1, y * cellSize + y + 1, cellSize, cellSize);
        }
    }
    exportCtx.strokeStyle = '#444444';
    for (let i = 0; i <= canvasSize; i++) {
        exportCtx.beginPath();
        exportCtx.moveTo(i * cellSize + i, 0);
        exportCtx.lineTo(i * cellSize + i, width);
        exportCtx.stroke();
        exportCtx.beginPath();
        exportCtx.moveTo(0, i * cellSize + i);
        exportCtx.lineTo(width, i * cellSize + i);
        exportCtx.stroke();
    }
    const link = document.createElement('a');
    link.href = exportCanvas.toDataURL('image/png');
    link.download = `像素画_${canvasSize}x${canvasSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearCanvas() {
    gridCells.forEach(row => row.forEach(cell => cell.style.backgroundColor = '#ffffff'));
}

window.addEventListener('DOMContentLoaded', initApp);