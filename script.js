// 全局变量
let canvasSize = 18;
let currentColor = '#000000';
let gridCells = [];
let isDrawing = false;
let currentTheme = 'dark';
let activeColorSwatch = null;
let starTimers = [];

// 拼豆设置相关变量
let perlerIgnoreColor = null; // 需要忽略的背景色

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
    // 初始化主题
    initTheme();
    
    generateColorGrid();
    generateCanvas();
    setupEventListeners();
    
    // 添加窗口大小变化监听（使用节流优化性能）
    window.addEventListener('resize', throttle(scaleCanvas, 200));
}

// 初始化主题
function initTheme() {
    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('pixel-art-theme') || 'dark';
    } catch (e) {
        console.warn('无法访问 localStorage:', e);
    }
    setTheme(savedTheme);
    createStars();
    createClouds();
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const starsContainer = document.getElementById('starsContainer');
    const cloudsContainer = document.getElementById('cloudsContainer');
    
    if (theme === 'light') {
        themeIcon.textContent = '☀️';
        starsContainer.style.display = 'none';
        cloudsContainer.style.display = 'block';
    } else {
        themeIcon.textContent = '🌙';
        starsContainer.style.display = 'block';
        cloudsContainer.style.display = 'none';
    }
    
    try {
        localStorage.setItem('pixel-art-theme', theme);
    } catch (e) {
        console.warn('无法保存主题设置:', e);
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    const starCount = 80;
    const staticCount = 40;
    
    for (let i = 0; i < starCount; i++) {
        createStar(starsContainer);
    }
    
    for (let i = 0; i < staticCount; i++) {
        createStaticStar(starsContainer);
    }
    
    const starTimer = setInterval(() => {
        if (currentTheme === 'dark' && Math.random() > 0.95) {
            createStar(starsContainer, true);
        }
    }, 2000);
    starTimers.push(starTimer);
    
    const meteorTimer = setInterval(() => {
        if (currentTheme === 'dark' && Math.random() > 0.7) {
            createMeteor(starsContainer);
        }
    }, 3000);
    starTimers.push(meteorTimer);
}

function clearStarTimers() {
    starTimers.forEach(timer => clearInterval(timer));
    starTimers = [];
}

function createStar(container, removeAfter = false) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    const size = 1 + Math.random() * 2;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.setProperty('--duration', `${duration}s`);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${Math.random() * duration}s`;
    
    container.appendChild(star);
    
    if (removeAfter) {
        setTimeout(() => {
            star.remove();
        }, duration * 1000 + 3000);
    }
}

function createStaticStar(container) {
    const star = document.createElement('div');
    star.className = 'star-static';
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 1 + Math.random() * 1.5;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    container.appendChild(star);
}

function createMeteor(container) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    const x = Math.random() * 60 + 10;
    const y = Math.random() * 40;
    const duration = 1.5 + Math.random() * 1.5;
    const size = 2 + Math.random() * 2;
    
    meteor.style.left = `${x}%`;
    meteor.style.top = `${y}%`;
    meteor.style.width = `${size}px`;
    meteor.style.height = `${size}px`;
    meteor.style.setProperty('--meteor-duration', `${duration}s`);
    
    container.appendChild(meteor);
    
    setTimeout(() => {
        meteor.remove();
    }, duration * 1000 + 500);
}

function createClouds() {
    const cloudsContainer = document.getElementById('cloudsContainer');
    const cloudCount = 10;
    
    for (let i = 0; i < cloudCount; i++) {
        createCloud(cloudsContainer);
    }
}

function createCloud(container, animate = false) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    
    const x = Math.random() * 90;
    const y = Math.random() * 35 + 5;
    const scale = 0.6 + Math.random() * 0.6;
    const floatDuration = 20 + Math.random() * 20;
    
    cloud.style.left = `${x}%`;
    cloud.style.top = `${y}%`;
    cloud.style.setProperty('--float-duration', `${floatDuration}s`);
    
    const pixelSize = 8;
    const patterns = [
        [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
         [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
         [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],
         [2,3],[3,3],[4,3],[5,3],[6,3],[7,3]],
        [[1,0],[2,0],[3,0],[4,0],[5,0],
         [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
         [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
         [2,3],[3,3],[4,3],[5,3],[6,3]],
        [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],
         [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
         [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],
         [1,3],[2,3],[3,3],[4,3],[5,3]]
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    pattern.forEach(([px, py]) => {
        const pixel = document.createElement('div');
        pixel.className = 'cloud-pixel';
        pixel.style.left = `${px * pixelSize}px`;
        pixel.style.top = `${py * pixelSize}px`;
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        cloud.appendChild(pixel);
    });
    
    container.appendChild(cloud);
}

// 生成颜色选择网格
function generateColorGrid() {
    colorGrid.innerHTML = '';
    
    const commonColors = [
        { id: '04', name: '黑色', hex: '#000000' },
        { id: '01', name: '白色', hex: '#FFFFFF' },
        { id: '08', name: '红色', hex: '#FF0000' },
        { id: '33', name: '蓝色', hex: '#0000FF' },
        { id: '23', name: '绿色', hex: '#00FF00' },
        { id: '18', name: '黄色', hex: '#FFFF00' },
        { id: '40', name: '紫色', hex: '#800080' },
        { id: '15', name: '橙色', hex: '#FFA500' },
        { id: '51', name: '棕色', hex: '#8B4513' },
        { id: '06', name: '灰色', hex: '#808080' },
        { id: '46', name: '粉色', hex: '#FFB6C1' },
        { id: '36', name: '天蓝', hex: '#87CEEB' }
    ];
    
    const skinHairColors = [
        { id: '57', name: '肤色', hex: '#FFDAB9' },
        { id: '58', name: '浅肤色', hex: '#FFE4C4' },
        { id: '59', name: '深肤色', hex: '#DEB887' },
        { id: '52', name: '深棕', hex: '#654321' },
        { id: '51', name: '棕色', hex: '#8B4513' },
        { id: '53', name: '浅棕', hex: '#A0522D' }
    ];
    
    const commonColorsSection = document.createElement('div');
    commonColorsSection.className = 'color-section';
    
    const commonColorsTitle = document.createElement('h4');
    commonColorsTitle.className = 'color-section-title';
    commonColorsTitle.textContent = '常用颜色';
    commonColorsSection.appendChild(commonColorsTitle);
    
    const commonColorsGrid = document.createElement('div');
    commonColorsGrid.className = 'color-subgrid';
    
    commonColors.forEach(color => {
        createColorSwatch(commonColorsGrid, color);
    });
    
    commonColorsSection.appendChild(commonColorsGrid);
    colorGrid.appendChild(commonColorsSection);
    
    const skinHairColorsSection = document.createElement('div');
    skinHairColorsSection.className = 'color-section';
    
    const skinHairColorsTitle = document.createElement('h4');
    skinHairColorsTitle.className = 'color-section-title';
    skinHairColorsTitle.textContent = '皮肤和头发';
    skinHairColorsSection.appendChild(skinHairColorsTitle);
    
    const skinHairColorsGrid = document.createElement('div');
    skinHairColorsGrid.className = 'color-subgrid';
    
    skinHairColors.forEach(color => {
        createColorSwatch(skinHairColorsGrid, color);
    });
    
    skinHairColorsSection.appendChild(skinHairColorsGrid);
    colorGrid.appendChild(skinHairColorsSection);
    
    const moreColorsSection = document.createElement('div');
    moreColorsSection.className = 'color-section';
    
    const moreColorsTitle = document.createElement('h4');
    moreColorsTitle.className = 'color-section-title';
    moreColorsTitle.textContent = '更多颜色';
    moreColorsSection.appendChild(moreColorsTitle);
    
    const moreColorsGrid = document.createElement('div');
    moreColorsGrid.className = 'color-subgrid';
    
    const usedColors = [...commonColors, ...skinHairColors].map(c => c.hex);
    const filteredColors = PERLER_BEADS_COLORS.filter(color => !usedColors.includes(color.hex));
    
    const displayColors = filteredColors.slice(0, 36);
    
    displayColors.forEach(color => {
        createColorSwatch(moreColorsGrid, color);
    });
    
    moreColorsSection.appendChild(moreColorsGrid);
    colorGrid.appendChild(moreColorsSection);
}

function createColorSwatch(container, color) {
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = color.hex;
    colorSwatch.dataset.color = color.hex;
    colorSwatch.title = `${color.id}-${color.name}`;
    
    if (color.hex === currentColor) {
        colorSwatch.classList.add('active');
        activeColorSwatch = colorSwatch;
    }
    
    colorSwatch.addEventListener('click', () => {
        if (activeColorSwatch) {
            activeColorSwatch.classList.remove('active');
        }
        currentColor = color.hex;
        colorSwatch.classList.add('active');
        activeColorSwatch = colorSwatch;
    });
    
    container.appendChild(colorSwatch);
}

// 生成画布网格
function generateCanvas() {
    gridCanvas.innerHTML = '';
    gridCells = [];
    
    // 设置网格布局
    gridCanvas.style.gridTemplateColumns = `repeat(${canvasSize}, 1fr)`;
    gridCanvas.style.gridTemplateRows = `repeat(${canvasSize}, 1fr)`;
    
    // 使用DocumentFragment减少DOM重排
    const fragment = document.createDocumentFragment();
    
    // 生成网格细胞
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
    
    // 一次性添加所有细胞
    gridCanvas.appendChild(fragment);
    
    // 批量添加事件监听器
    setupCanvasEventListeners();
    
    // 计算并应用缩放
    scaleCanvas();
}

// 缩放画布以适应容器
function scaleCanvas() {
    const container = document.querySelector('.canvas-container');
    const containerSize = container.clientWidth;
    
    // 防止容器尺寸为0时出现异常缩放
    if (containerSize <= 0) {
        requestAnimationFrame(scaleCanvas);
        return;
    }
    
    const framePadding = 28;
    const availableSize = containerSize - framePadding;
    
    let cellSize;
    if (canvasSize <= 16) {
        cellSize = 24;
    } else if (canvasSize <= 32) {
        cellSize = 16;
    } else {
        cellSize = 10;
    }
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice && cellSize < 12) {
        cellSize = 12;
    }
    
    const gapSize = 1;
    const canvasActualSize = canvasSize * cellSize + (canvasSize + 1) * gapSize;
    
    let scale = availableSize / canvasActualSize;
    // 确保scale在合理范围内
    scale = Math.max(0.1, Math.min(1, scale));
    
    gridCanvas.style.width = `${canvasActualSize}px`;
    gridCanvas.style.height = `${canvasActualSize}px`;
    gridCanvas.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    gridCanvas.style.setProperty('--cell-size', `${cellSize}px`);
}

// 批量设置画布事件监听器
function setupCanvasEventListeners() {
    // 移除旧的事件监听器
    gridCanvas.removeEventListener('mousedown', handleCanvasMouseDown);
    gridCanvas.removeEventListener('mouseover', handleCanvasMouseOver);
    gridCanvas.removeEventListener('mouseup', handleCanvasMouseUp);
    gridCanvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
    gridCanvas.removeEventListener('touchstart', handleCanvasTouchStart);
    gridCanvas.removeEventListener('touchmove', handleCanvasTouchMove);
    gridCanvas.removeEventListener('touchend', handleCanvasTouchEnd);
    
    // 添加新的事件监听器（事件委托）
    gridCanvas.addEventListener('mousedown', handleCanvasMouseDown);
    gridCanvas.addEventListener('mouseover', handleCanvasMouseOver);
    gridCanvas.addEventListener('mouseup', handleCanvasMouseUp);
    gridCanvas.addEventListener('mouseleave', handleCanvasMouseLeave);
    gridCanvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
    gridCanvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    gridCanvas.addEventListener('touchend', handleCanvasTouchEnd);
}

// 开始绘制
function startDrawing(e) {
    isDrawing = true;
    const target = getEventTarget(e);
    if (target && target.classList.contains('grid-cell')) {
        target.style.backgroundColor = currentColor;
    }
}

// 绘制
function draw(e) {
    if (!isDrawing) return;
    
    const target = getEventTarget(e);
    if (target && target.classList.contains('grid-cell')) {
        target.style.backgroundColor = currentColor;
    }
}

// 停止绘制
function stopDrawing() {
    isDrawing = false;
}

// 获取事件目标
function getEventTarget(e) {
    // 处理触摸事件
    if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        return document.elementFromPoint(touch.clientX, touch.clientY);
    }
    // 处理鼠标事件
    return e.target;
}

// 画布鼠标事件处理
function handleCanvasMouseDown(e) {
    startDrawing(e);
}

function handleCanvasMouseOver(e) {
    draw(e);
}

function handleCanvasMouseUp(e) {
    stopDrawing();
}

function handleCanvasMouseLeave(e) {
    stopDrawing();
}

// 画布触摸事件处理
function handleCanvasTouchStart(e) {
    e.preventDefault();
    startDrawing(e);
}

function handleCanvasTouchMove(e) {
    e.preventDefault();
    draw(e);
}

function handleCanvasTouchEnd(e) {
    stopDrawing();
}

// 设置事件监听器
function setupEventListeners() {
    // 画布大小调整 - 滑块（使用节流优化性能）
    sizeSlider.addEventListener('input', throttle(() => {
        canvasSize = parseInt(sizeSlider.value);
        sizeDisplay.textContent = `${canvasSize} x ${canvasSize}`;
        sizeInput.value = canvasSize;
        generateCanvas();
    }, 100)); // 100ms节流
    
    // 画布大小调整 - 输入框（使用节流优化性能）
    sizeInput.addEventListener('input', throttle(() => {
        let value = parseInt(sizeInput.value);
        // 确保值在有效范围内
        if (isNaN(value)) value = 1;
        if (value < 1) value = 1;
        if (value > 64) value = 64;
        
        canvasSize = value;
        sizeDisplay.textContent = `${canvasSize} x ${canvasSize}`;
        sizeSlider.value = canvasSize;
        generateCanvas();
    }, 200)); // 200ms节流
    
    // 输入框失去焦点时验证（不需要节流）
    sizeInput.addEventListener('blur', () => {
        let value = parseInt(sizeInput.value);
        if (isNaN(value)) value = 1;
        if (value < 1) value = 1;
        if (value > 64) value = 64;
        
        sizeInput.value = value;
        if (canvasSize !== value) {
            canvasSize = value;
            sizeDisplay.textContent = `${canvasSize} x ${canvasSize}`;
            sizeSlider.value = canvasSize;
            generateCanvas();
        }
    });
    
    // 导入图片
    importBtn.addEventListener('click', () => {
        imageInput.click();
    });
    
    imageInput.addEventListener('change', handleImageImport);
    
    // 导出图片
    exportBtn.addEventListener('click', exportCanvas);
    
    // 清空画布
    clearBtn.addEventListener('click', clearCanvas);
    
    // 导出选项弹窗事件
    const exportModal = document.getElementById('exportModal');
    const exportCancelBtn = document.getElementById('exportCancelBtn');
    const exportOptions = document.querySelectorAll('.export-option');
    
    // 点击取消按钮关闭弹窗
    exportCancelBtn.addEventListener('click', hideExportModal);
    
    // 点击背景关闭弹窗
    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            hideExportModal();
        }
    });
    
    // 点击导出选项
    exportOptions.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.dataset.type;
            exportByType(type);
        });
    });
    
    // 主题切换按钮
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // 拼豆设置弹窗事件
    const perlerModal = document.getElementById('perlerModal');
    const perlerCancelBtn = document.getElementById('perlerCancelBtn');
    const perlerConfirmBtn = document.getElementById('perlerConfirmBtn');
    const perlerClearIgnore = document.getElementById('perlerClearIgnore');
    
    // 取消按钮
    perlerCancelBtn.addEventListener('click', hidePerlerModal);
    
    // 确认导出按钮
    perlerConfirmBtn.addEventListener('click', confirmPerlerExport);
    
    // 清除忽略颜色按钮
    perlerClearIgnore.addEventListener('click', clearPerlerIgnoreColor);
    
    // 点击背景关闭拼豆弹窗
    perlerModal.addEventListener('click', (e) => {
        if (e.target === perlerModal) {
            hidePerlerModal();
        }
    });
}

// 原来的算法不需要颜色缓存和预计算

// 处理图片导入
function handleImageImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择有效的图片文件');
        e.target.value = '';
        return;
    }
    
    // 显示加载状态
    gridCanvas.classList.add('loading');
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            try {
                // 使用requestAnimationFrame优化性能
                requestAnimationFrame(() => {
                    pixelateImage(img);
                    gridCanvas.classList.remove('loading');
                });
            } catch (err) {
                console.error('图片处理失败:', err);
                gridCanvas.classList.remove('loading');
                alert('图片处理失败，请尝试其他图片');
            }
        };
        img.onerror = () => {
            gridCanvas.classList.remove('loading');
            alert('图片加载失败，请检查文件是否损坏');
        };
        img.src = event.target.result;
    };
    reader.onerror = () => {
        gridCanvas.classList.remove('loading');
        alert('文件读取失败，请重试');
    };
    reader.readAsDataURL(file);
    
    // 重置input value，允许再次选择同一文件
    e.target.value = '';
}

// 像素化图片（使用原来的算法）
function pixelateImage(img) {
    // 创建临时 canvas 进行图像处理
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // 设置临时 canvas 大小
    tempCanvas.width = canvasSize;
    tempCanvas.height = canvasSize;
    
    // 缩放算法
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.msImageSmoothingEnabled = false;
    tempCtx.mozImageSmoothingEnabled = false;
    tempCtx.webkitImageSmoothingEnabled = false;
    
    // 绘制并缩放图片
    tempCtx.drawImage(img, 0, 0, canvasSize, canvasSize);
    
    // 获取像素数据
    let imageData;
    try {
        imageData = tempCtx.getImageData(0, 0, canvasSize, canvasSize);
    } catch (err) {
        console.error('无法获取图片数据（可能是跨域限制）:', err);
        throw new Error('无法处理该图片');
    }
    const data = imageData.data;
    
    // 批量更新DOM
    const updateBatch = [];
    
    // 填充网格
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const index = (y * canvasSize + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            
            // 原来的算法：透明度低于128设为白色
            let color;
            if (a < 128) {
                color = '#FFFFFF'; // 白色
            } else {
                // 转换为十六进制颜色值
                color = rgbToHex(r, g, b);
            }
            
            updateBatch.push({ x, y, color: color });
        }
    }
    
    // 批量应用颜色更新
    applyColorBatch(updateBatch);
}

// RGB转HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// 批量应用颜色更新
function applyColorBatch(batch) {
    // 使用requestAnimationFrame减少重排
    requestAnimationFrame(() => {
        batch.forEach(item => {
            const { x, y, color } = item;
            if (gridCells[y] && gridCells[y][x]) {
                gridCells[y][x].style.backgroundColor = color;
            }
        });
    });
}

// HEX 转 RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// 显示导出选项弹窗
function showExportModal() {
    const modal = document.getElementById('exportModal');
    modal.classList.add('active');
}

// 隐藏导出选项弹窗
function hideExportModal() {
    const modal = document.getElementById('exportModal');
    modal.classList.remove('active');
}

// 导出画布 - 入口函数
function exportCanvas() {
    showExportModal();
}

// 根据类型导出
function exportByType(type) {
    hideExportModal();
    
    switch(type) {
        case 'pixel-grid':
            exportPixelArt(true);
            break;
        case 'pixel-clean':
            exportPixelArt(false);
            break;
        case 'perler':
            showPerlerModal();
            break;
    }
}

// 显示拼豆设置弹窗
function showPerlerModal() {
    const modal = document.getElementById('perlerModal');
    modal.classList.add('active');
    
    // 初始化预览画布
    initPerlerCanvasPreview();
}

// 隐藏拼豆设置弹窗
function hidePerlerModal() {
    const modal = document.getElementById('perlerModal');
    modal.classList.remove('active');
}

// 初始化拼豆预览画布
function initPerlerCanvasPreview() {
    const previewContainer = document.getElementById('perlerCanvasPreview');
    previewContainer.innerHTML = '';
    
    const containerWidth = previewContainer.offsetWidth || 300;
    const maxCellSize = 12;
    const cellSize = Math.min(maxCellSize, Math.max(3, Math.floor((containerWidth - 2) / canvasSize)));
    
    previewContainer.style.gridTemplateColumns = `repeat(${canvasSize}, ${cellSize}px)`;
    
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'perler-canvas-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            const sourceCell = gridCells[y][x];
            const color = sourceCell.style.backgroundColor || '#ffffff';
            cell.style.backgroundColor = color;
            cell.style.width = cellSize + 'px';
            cell.style.height = cellSize + 'px';
            
            cell.addEventListener('click', () => {
                const hexColor = rgbStringToHex(color);
                setPerlerIgnoreColor(hexColor);
            });
            
            previewContainer.appendChild(cell);
        }
    }
}

// 设置忽略的背景色
function setPerlerIgnoreColor(hexColor) {
    perlerIgnoreColor = hexColor;
    
    // 更新显示
    const swatch = document.getElementById('perlerIgnoreSwatch');
    const hexDisplay = document.getElementById('perlerIgnoreHex');
    
    swatch.style.backgroundColor = hexColor;
    hexDisplay.textContent = hexColor;
    
    // 更新预览画布高亮
    const cells = document.querySelectorAll('.perler-canvas-cell');
    cells.forEach(cell => {
        const cellColor = rgbStringToHex(cell.style.backgroundColor);
        if (cellColor === hexColor) {
            cell.style.boxShadow = '0 0 0 2px #FF0000';
        } else {
            cell.style.boxShadow = '';
        }
    });
}

// 清除忽略的背景色
function clearPerlerIgnoreColor() {
    perlerIgnoreColor = null;
    
    const swatch = document.getElementById('perlerIgnoreSwatch');
    const hexDisplay = document.getElementById('perlerIgnoreHex');
    
    swatch.style.backgroundColor = 'transparent';
    hexDisplay.textContent = '无';
    
    // 清除预览画布高亮
    const cells = document.querySelectorAll('.perler-canvas-cell');
    cells.forEach(cell => {
        cell.style.boxShadow = '';
    });
}

// 确认导出拼豆
function confirmPerlerExport() {
    hidePerlerModal();
    exportPerlerBeads();
}

// 导出像素画
function exportPixelArt(withGrid) {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    
    const cellSize = 20;
    let canvasWidth, canvasHeight;
    
    if (withGrid) {
        canvasWidth = canvasSize * cellSize + (canvasSize + 1);
        canvasHeight = canvasSize * cellSize + (canvasSize + 1);
    } else {
        canvasWidth = canvasSize * cellSize;
        canvasHeight = canvasSize * cellSize;
    }
    
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    
    // 绘制白色背景
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制像素
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const cell = gridCells[y][x];
            const cellColor = rgbStringToHex(cell.style.backgroundColor) || '#ffffff';
            
            exportCtx.fillStyle = cellColor;
            
            if (withGrid) {
                exportCtx.fillRect(
                    x * cellSize + x + 1,
                    y * cellSize + y + 1,
                    cellSize,
                    cellSize
                );
            } else {
                exportCtx.fillRect(
                    x * cellSize,
                    y * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }
    
    // 绘制网格线（白色/浅灰色）
    if (withGrid) {
        exportCtx.strokeStyle = '#e0e0e0';
        exportCtx.lineWidth = 1;
        
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
    
    const beadSize = 40;
    const gap = 6;
    
    const canvasWidth = canvasSize * (beadSize + gap) + gap;
    const canvasHeight = canvasSize * (beadSize + gap) + gap + 200;
    
    const maxDimension = 4096;
    let finalBeadSize = beadSize;
    let finalGap = gap;
    if (canvasWidth > maxDimension || canvasHeight > maxDimension) {
        const scale = maxDimension / Math.max(canvasWidth, canvasHeight);
        finalBeadSize = Math.floor(beadSize * scale);
        finalGap = Math.max(1, Math.floor(gap * scale));
    }
    
    const finalWidth = canvasSize * (finalBeadSize + finalGap) + finalGap;
    const finalHeight = canvasSize * (finalBeadSize + finalGap) + finalGap + 200;
    
    exportCanvas.width = finalWidth;
    exportCanvas.height = finalHeight;
    
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, finalWidth, finalHeight);
    
    const colorUsage = new Map();
    const colorCache = new Map();
    const cellColors = [];
    
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const cell = gridCells[y][x];
            const cellColor = cell.style.backgroundColor || '#ffffff';
            const hexColor = rgbStringToHex(cellColor);
            
            if (perlerIgnoreColor && hexColor === perlerIgnoreColor) {
                cellColors.push({ x, y, perlerColor: null, ignored: true });
                continue;
            }
            
            let perlerColor;
            if (colorCache.has(hexColor)) {
                perlerColor = colorCache.get(hexColor);
            } else {
                perlerColor = findClosestPerlerColor(hexColor);
                colorCache.set(hexColor, perlerColor);
            }
            
            cellColors.push({ x, y, perlerColor, ignored: false });
            
            const colorKey = perlerColor.id;
            if (!colorUsage.has(colorKey)) {
                colorUsage.set(colorKey, { ...perlerColor, count: 0 });
            }
            colorUsage.get(colorKey).count++;
        }
    }
    
    const radius = finalBeadSize / 2 - Math.max(1, Math.floor(finalBeadSize / 20));
    const highlightRadius = Math.max(2, finalBeadSize / 7);
    const fontSize = Math.floor(finalBeadSize / 3);
    
    for (const { x, y, perlerColor, ignored } of cellColors) {
        const centerX = finalGap + x * (finalBeadSize + finalGap) + finalBeadSize / 2;
        const centerY = finalGap + y * (finalBeadSize + finalGap) + finalBeadSize / 2;
        
        if (ignored) {
            exportCtx.beginPath();
            exportCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            exportCtx.strokeStyle = '#cccccc';
            exportCtx.lineWidth = 1;
            exportCtx.setLineDash([2, 2]);
            exportCtx.stroke();
            exportCtx.setLineDash([]);
            continue;
        }
        
        exportCtx.beginPath();
        exportCtx.arc(centerX + Math.max(1, finalBeadSize / 20), centerY + Math.max(1, finalBeadSize / 20), radius, 0, Math.PI * 2);
        exportCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        exportCtx.fill();
        
        exportCtx.beginPath();
        exportCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        exportCtx.fillStyle = perlerColor.hex;
        exportCtx.fill();
        exportCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        exportCtx.lineWidth = 1;
        exportCtx.stroke();
        
        const highlightOffset = Math.max(3, finalBeadSize / 7);
        exportCtx.beginPath();
        exportCtx.arc(centerX - highlightOffset, centerY - highlightOffset, highlightRadius, 0, Math.PI * 2);
        exportCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        exportCtx.fill();
        
        exportCtx.fillStyle = getContrastColor(perlerColor.hex);
        exportCtx.font = 'bold 11px Arial';
        exportCtx.textAlign = 'center';
        exportCtx.textBaseline = 'middle';
        exportCtx.fillText(perlerColor.id, centerX, centerY);
    }
    
    const legendY = canvasSize * (finalBeadSize + finalGap) + finalGap + 20;
    
    exportCtx.fillStyle = '#333333';
    exportCtx.font = 'bold 14px Arial';
    exportCtx.textAlign = 'left';
    exportCtx.fillText('拼豆色号清单：', finalGap, legendY);
    
    const sortedColors = Array.from(colorUsage.values()).sort((a, b) => a.id.localeCompare(b.id));
    
    let currentX = finalGap;
    let currentY = legendY + 25;
    const itemHeight = 22;
    const itemPadding = 15;
    
    sortedColors.forEach((color) => {
        const text = `${color.id}-${color.name}(${color.count}颗)`;
        exportCtx.font = '12px Arial';
        const textWidth = exportCtx.measureText(text).width + 50;
        
        if (currentX + textWidth > finalWidth - finalGap) {
            currentX = finalGap;
            currentY += itemHeight;
        }
        
        exportCtx.fillStyle = color.hex;
        exportCtx.fillRect(currentX, currentY - 10, 16, 16);
        exportCtx.strokeStyle = '#999999';
        exportCtx.lineWidth = 1;
        exportCtx.strokeRect(currentX, currentY - 10, 16, 16);
        
        exportCtx.fillStyle = '#333333';
        exportCtx.textAlign = 'left';
        exportCtx.fillText(text, currentX + 22, currentY + 2);
        
        currentX += textWidth + itemPadding;
    });
    
    const totalY = currentY + itemHeight + 10;
    exportCtx.fillStyle = '#666666';
    exportCtx.font = 'bold 12px Arial';
    const totalBeads = Array.from(colorUsage.values()).reduce((sum, c) => sum + c.count, 0);
    exportCtx.fillText(`共需 ${totalBeads} 颗拼豆，${colorUsage.size} 种颜色`, finalGap, totalY);
    
    const dataURL = exportCanvas.toDataURL('image/png');
    saveImage(dataURL, `拼豆画_${canvasSize}x${canvasSize}_带色号`);
}

// RGB字符串转HEX
function rgbStringToHex(rgbString) {
    if (rgbString.startsWith('#')) {
        return rgbString.toUpperCase();
    }
    
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }
    
    return '#FFFFFF';
}

// 获取对比色（用于文字显示）
function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

// 保存图片（统一处理）
function saveImage(dataURL, fileName) {
    if (window.plus) {
        const androidVersion = parseInt(plus.os.version);
        
        if (androidVersion >= 6) {
            plus.android.requestPermissions(['android.permission.WRITE_EXTERNAL_STORAGE'], function(result) {
                if (result.granted.length > 0) {
                    saveImageToGallery(dataURL, fileName);
                } else {
                    plus.nativeUI.alert('需要存储权限才能保存图片，请在系统设置中开启权限', function() {
                        fallbackDownload(dataURL, fileName);
                    }, '权限请求失败', '确定');
                }
            }, function(error) {
                console.log('权限请求错误:', error);
                fallbackDownload(dataURL, fileName);
            });
        } else {
            saveImageToGallery(dataURL, fileName);
        }
    } else {
        fallbackDownload(dataURL, fileName);
    }
}

// 保存图片到相册
function saveImageToGallery(dataURL, customFileName) {
    try {
        plus.nativeUI.showWaiting('正在保存图片...');
        
        const fileName = '_doc/' + (customFileName || '像素画_' + Date.now()) + '.png';
        
        const bitmap = new plus.nativeObj.Bitmap('export');
        bitmap.loadBase64Data(dataURL, function() {
            bitmap.save(fileName, { overwrite: true, quality: 100 }, function(e) {
                plus.gallery.save(e.target, function(path) {
                    plus.nativeUI.closeWaiting();
                    plus.nativeUI.toast('图片已保存到相册');
                    plus.io.resolveLocalFileSystemURL(e.target, function(entry) {
                        entry.remove();
                    });
                }, function(error) {
                    plus.nativeUI.closeWaiting();
                    console.log('保存到相册失败:', error);
                    showImageForScreenshot(dataURL);
                });
            }, function(error) {
                plus.nativeUI.closeWaiting();
                console.log('保存文件失败:', error);
                showImageForScreenshot(dataURL);
            });
        }, function(error) {
            plus.nativeUI.closeWaiting();
            console.log('加载图片失败:', error);
            showImageForScreenshot(dataURL);
        });
    } catch (e) {
        console.log('保存异常:', e);
        plus.nativeUI.closeWaiting();
        showImageForScreenshot(dataURL);
    }
}

// 显示图片让用户截图保存
function showImageForScreenshot(dataURL) {
    plus.nativeUI.alert('自动保存失败，请截图保存图片', function() {
        plus.webview.create('_blank', 'screenshot', {
            top: '0px',
            bottom: '0px',
            background: 'transparent'
        }, {
            content: '<html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"></head><body style="margin:0;padding:20px;background:#1a1a1a;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;"><img src="' + dataURL + '" style="max-width:100%;max-height:80vh;"><p style="color:#fff;margin-top:20px;">请截图保存此图片</p></body></html>'
        }).show();
    }, '提示', '确定');
}

// 回退下载方法
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
            newWindow.document.title = (customFileName || `像素画_${canvasSize}x${canvasSize}`) + '.png';
        } else {
            alert('请截图保存图片');
        }
    }
}

// 清空画布
function clearCanvas() {
    gridCells.forEach(row => {
        row.forEach(cell => {
            cell.style.backgroundColor = '#ffffff';
        });
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initApp);