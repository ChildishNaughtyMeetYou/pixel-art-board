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
    
    sizeInput.addEventListener('blur', () => {
        let value = parseInt(sizeInput.value) || 1;
        value = Math.max(1, Math.min(64, value));
        sizeInput.value = value;
        if (canvasSize !== value) {
            canvasSize = value;
            sizeDisplay.textContent = `${canvasSize} x ${canvasSize}`;
            sizeSlider.value = canvasSize;
            generateCanvas();
        }
    });
    
    importBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageImport);
    exportBtn.addEventListener('click', exportCanvas);
    clearBtn.addEventListener('click', clearCanvas);
    
    const exportModal = document.getElementById('exportModal');
    const exportCancelBtn = document.getElementById('exportCancelBtn');
    const exportOptions = document.querySelectorAll('.export-option');
    
    exportCancelBtn.addEventListener('click', hideExportModal);
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) hideExportModal();
    });
    exportOptions.forEach(option => {
        option.addEventListener('click', () => {
            exportByType(option.dataset.type);
        });
    });
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

// 显示/隐藏导出选项弹窗
function showExportModal() {
    document.getElementById('exportModal').classList.add('active');
}

function hideExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

// 导出入口函数
function exportCanvas() {
    showExportModal();
}

// 根据类型导出
function exportByType(type) {
    hideExportModal();
    if (type === 'pixel-grid') exportPixelArt(true);
    else if (type === 'pixel-clean') exportPixelArt(false);
    else if (type === 'perler') exportPerlerBeads();
}

// 导出像素画
function exportPixelArt(withGrid) {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    const cellSize = 20;
    const canvasWidth = withGrid ? canvasSize * cellSize + canvasSize + 1 : canvasSize * cellSize;
    const canvasHeight = withGrid ? canvasSize * cellSize + canvasSize + 1 : canvasSize * cellSize;
    
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    
    if (withGrid) {
        exportCtx.fillStyle = '#2a2a2a';
        exportCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const color = gridCells[y][x]?.style.backgroundColor || '#ffffff';
            exportCtx.fillStyle = color;
            if (withGrid) {
                exportCtx.fillRect(x * cellSize + x + 1, y * cellSize + y + 1, cellSize, cellSize);
            } else {
                exportCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    
    if (withGrid) {
        exportCtx.strokeStyle = '#444444';
        for (let x = 0; x <= canvasSize; x++) {
            exportCtx.beginPath();
            exportCtx.moveTo(x * cellSize + x, 0);
            exportCtx.lineTo(x * cellSize + x, canvasHeight);
            exportCtx.stroke();
        }
        for (let y = 0; y <= canvasSize; y++) {
            exportCtx.beginPath();
            exportCtx.moveTo(0, y * cellSize + y);
            exportCtx.lineTo(canvasWidth, y * cellSize + y);
            exportCtx.stroke();
        }
    }
    
    const dataURL = exportCanvas.toDataURL('image/png');
    const suffix = withGrid ? '带格子' : '无格子';
    saveImage(dataURL, `像素画_${canvasSize}x${canvasSize}_${suffix}`);
}

// 导出拼豆格式
function exportPerlerBeads() {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    const beadSize = 24;
    const gap = 4;
    const canvasWidth = canvasSize * (beadSize + gap) + gap;
    const canvasHeight = canvasSize * (beadSize + gap) + gap;
    
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    
    exportCtx.fillStyle = '#1a1a1a';
    exportCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const color = gridCells[y][x]?.style.backgroundColor || '#ffffff';
            const centerX = gap + x * (beadSize + gap) + beadSize / 2;
            const centerY = gap + y * (beadSize + gap) + beadSize / 2;
            
            // 阴影
            exportCtx.beginPath();
            exportCtx.arc(centerX + 2, centerY + 2, beadSize / 2 - 2, 0, Math.PI * 2);
            exportCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            exportCtx.fill();
            
            // 主体
            exportCtx.beginPath();
            exportCtx.arc(centerX, centerY, beadSize / 2 - 2, 0, Math.PI * 2);
            exportCtx.fillStyle = color;
            exportCtx.fill();
            
            // 高光
            exportCtx.beginPath();
            exportCtx.arc(centerX - 4, centerY - 4, beadSize / 6, 0, Math.PI * 2);
            exportCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            exportCtx.fill();
        }
    }
    
    const dataURL = exportCanvas.toDataURL('image/png');
    saveImage(dataURL, `拼豆画_${canvasSize}x${canvasSize}`);
}

// 保存图片
function saveImage(dataURL, fileName) {
    if (window.plus) {
        const androidVersion = parseInt(plus.os.version);
        if (androidVersion >= 6) {
            plus.android.requestPermissions(['android.permission.WRITE_EXTERNAL_STORAGE'], function(result) {
                if (result.granted.length > 0) {
                    saveImageToGallery(dataURL, fileName);
                } else {
                    plus.nativeUI.alert('需要存储权限才能保存图片', function() {
                        fallbackDownload(dataURL, fileName);
                    }, '权限请求失败', '确定');
                }
            }, function() {
                fallbackDownload(dataURL, fileName);
            });
        } else {
            saveImageToGallery(dataURL, fileName);
        }
    } else {
        fallbackDownload(dataURL, fileName);
    }
}

function saveImageToGallery(dataURL, customFileName) {
    try {
        plus.nativeUI.showWaiting('正在保存图片...');
        const fileName = '_doc/' + (customFileName || '像素画_' + Date.now()) + '.png';
        const bitmap = new plus.nativeObj.Bitmap('export');
        bitmap.loadBase64Data(dataURL, function() {
            bitmap.save(fileName, { overwrite: true, quality: 100 }, function(e) {
                plus.gallery.save(e.target, function() {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.toast('图片已保存到相册');
                    plus.io.resolveLocalFileSystemURL(e.target, function(entry) { entry.remove(); });
                }, function() {
                    plus.nativeUI.closeWaiting();
                    showImageForScreenshot(dataURL);
                });
            }, function() {
                plus.nativeUI.closeWaiting();
                showImageForScreenshot(dataURL);
            });
        }, function() {
            plus.nativeUI.closeWaiting();
            showImageForScreenshot(dataURL);
        });
    } catch (e) {
        plus.nativeUI.closeWaiting();
        showImageForScreenshot(dataURL);
    }
}

function showImageForScreenshot(dataURL) {
    plus.nativeUI.alert('自动保存失败，请截图保存图片', function() {
        plus.webview.create('_blank', 'screenshot', {
            top: '0px', bottom: '0px', background: 'transparent'
        }, {
            content: '<html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"></head><body style="margin:0;padding:20px;background:#1a1a1a;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;"><img src="' + dataURL + '" style="max-width:100%;max-height:80vh;"><p style="color:#fff;margin-top:20px;">请截图保存此图片</p></body></html>'
        }).show();
    }, '提示', '确定');
}

function fallbackDownload(dataURL, customFileName) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = (customFileName || `像素画_${canvasSize}x${canvasSize}`) + '.png';
    try {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`<img src="${dataURL}" style="max-width:100%;height:auto;" /><p>长按图片保存到相册</p>`);
        } else {
            alert('请截图保存图片');
        }
    }
}

function clearCanvas() {
    gridCells.forEach(row => row.forEach(cell => cell.style.backgroundColor = '#ffffff'));
}

window.addEventListener('DOMContentLoaded', initApp);