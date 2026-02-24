// 生成255种拼豆色号集合
function generatePerlerBeadsColors() {
    const colors = [];
    const keyColors = [
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
        { name: '浅蓝色', hex: '#87CEEB' },
        { name: '肤色', hex: '#FFDAB9' },
        { name: '深棕色', hex: '#654321' }
    ];
    colors.push(...keyColors);
    
    const hueSteps = 36;
    for (let h = 0; h < 360; h += 360 / hueSteps) {
        for (let s = 30; s <= 100; s += 20) {
            for (let v = 40; v <= 100; v += 20) {
                if (colors.length >= 255) break;
                const hex = hsvToHex(h, s, v);
                colors.push({ name: '颜色' + colors.length, hex });
            }
        }
    }
    return colors;
}

function hsvToHex(h, s, v) {
    s /= 100; v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

const PERLER_BEADS_COLORS = generatePerlerBeadsColors();