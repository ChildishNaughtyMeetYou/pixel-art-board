// 真实拼豆色号集合（常见品牌拼豆颜色）
const PERLER_BEADS_COLORS = [
    // 白色系列
    { id: '01', name: '白色', hex: '#FFFFFF' },
    { id: '02', name: '奶油白', hex: '#F5F5DC' },
    { id: '03', name: '珍珠白', hex: '#F0EAD6' },
    
    // 黑色系列
    { id: '04', name: '黑色', hex: '#000000' },
    { id: '05', name: '深灰', hex: '#333333' },
    { id: '06', name: '灰色', hex: '#808080' },
    { id: '07', name: '浅灰', hex: '#C0C0C0' },
    
    // 红色系列
    { id: '08', name: '红色', hex: '#FF0000' },
    { id: '09', name: '深红', hex: '#8B0000' },
    { id: '10', name: '酒红', hex: '#722F37' },
    { id: '11', name: '粉红', hex: '#FFC0CB' },
    { id: '12', name: '玫红', hex: '#FF007F' },
    { id: '13', name: '珊瑚红', hex: '#FF7F50' },
    { id: '14', name: '橙红', hex: '#FF4500' },
    
    // 橙色系列
    { id: '15', name: '橙色', hex: '#FFA500' },
    { id: '16', name: '浅橙', hex: '#FFDAB9' },
    { id: '17', name: '深橙', hex: '#FF8C00' },
    
    // 黄色系列
    { id: '18', name: '黄色', hex: '#FFFF00' },
    { id: '19', name: '柠檬黄', hex: '#FFF44F' },
    { id: '20', name: '金黄', hex: '#FFD700' },
    { id: '21', name: '浅黄', hex: '#FFFFE0' },
    { id: '22', name: '深黄', hex: '#F0E68C' },
    
    // 绿色系列
    { id: '23', name: '绿色', hex: '#00FF00' },
    { id: '24', name: '深绿', hex: '#006400' },
    { id: '25', name: '浅绿', hex: '#90EE90' },
    { id: '26', name: '草绿', hex: '#7CFC00' },
    { id: '27', name: '橄榄绿', hex: '#808000' },
    { id: '28', name: '墨绿', hex: '#013220' },
    { id: '29', name: '薄荷绿', hex: '#98FF98' },
    
    // 青色系列
    { id: '30', name: '青色', hex: '#00FFFF' },
    { id: '31', name: '深青', hex: '#008B8B' },
    { id: '32', name: '浅青', hex: '#E0FFFF' },
    
    // 蓝色系列
    { id: '33', name: '蓝色', hex: '#0000FF' },
    { id: '34', name: '深蓝', hex: '#00008B' },
    { id: '35', name: '浅蓝', hex: '#ADD8E6' },
    { id: '36', name: '天蓝', hex: '#87CEEB' },
    { id: '37', name: '藏青', hex: '#000080' },
    { id: '38', name: '宝蓝', hex: '#4169E1' },
    { id: '39', name: '湖蓝', hex: '#00CED1' },
    
    // 紫色系列
    { id: '40', name: '紫色', hex: '#800080' },
    { id: '41', name: '深紫', hex: '#4B0082' },
    { id: '42', name: '浅紫', hex: '#E6E6FA' },
    { id: '43', name: '紫罗兰', hex: '#EE82EE' },
    { id: '44', name: '薰衣草', hex: '#E6E6FA' },
    { id: '45', name: '洋红', hex: '#FF00FF' },
    
    // 粉色系列
    { id: '46', name: '粉色', hex: '#FFB6C1' },
    { id: '47', name: '深粉', hex: '#FF1493' },
    { id: '48', name: '浅粉', hex: '#FFC0CB' },
    { id: '49', name: '桃粉', hex: '#FF6B6B' },
    { id: '50', name: '玫瑰粉', hex: '#FF66CC' },
    
    // 棕色系列
    { id: '51', name: '棕色', hex: '#8B4513' },
    { id: '52', name: '深棕', hex: '#654321' },
    { id: '53', name: '浅棕', hex: '#A0522D' },
    { id: '54', name: '咖啡', hex: '#6F4E37' },
    { id: '55', name: '驼色', hex: '#C19A6B' },
    { id: '56', name: '卡其', hex: '#F0E68C' },
    
    // 肤色系列
    { id: '57', name: '肤色', hex: '#FFDAB9' },
    { id: '58', name: '浅肤色', hex: '#FFE4C4' },
    { id: '59', name: '深肤色', hex: '#DEB887' },
    { id: '60', name: '小麦色', hex: '#D2B48C' },
    
    // 金属色系列
    { id: '61', name: '金色', hex: '#FFD700' },
    { id: '62', name: '银色', hex: '#C0C0C0' },
    { id: '63', name: '铜色', hex: '#B87333' },
    
    // 特殊色
    { id: '64', name: '米色', hex: '#F5DEB3' },
    { id: '65', name: '象牙白', hex: '#FFFFF0' },
    { id: '66', name: '亚麻色', hex: '#FAF0E6' },
    { id: '67', name: '藕色', hex: '#EDD1D8' },
    { id: '68', name: '藕荷色', hex: '#E4C2D1' },
    
    // 更多红色
    { id: '69', name: '砖红', hex: '#B22222' },
    { id: '70', name: '樱桃红', hex: '#DE3163' },
    { id: '71', name: '番茄红', hex: '#FF6347' },
    
    // 更多蓝色
    { id: '72', name: '钴蓝', hex: '#0047AB' },
    { id: '73', name: '孔雀蓝', hex: '#005F69' },
    { id: '74', name: '海军蓝', hex: '#000080' },
    
    // 更多绿色
    { id: '75', name: '森林绿', hex: '#228B22' },
    { id: '76', name: '松绿', hex: '#2E8B57' },
    { id: '77', name: '豆绿', hex: '#9ACD32' },
    
    // 更多紫色
    { id: '78', name: '葡萄紫', hex: '#6F2DA8' },
    { id: '79', name: '丁香紫', hex: '#C8A2C8' },
    { id: '80', name: '紫红', hex: '#C71585' },
];

// 颜色距离计算（使用加权欧几里得距离）
function colorDistance(color1, color2) {
    const rgb1 = hexToRgbObj(color1);
    const rgb2 = hexToRgbObj(color2);
    
    // 使用加权公式，人眼对绿色更敏感
    const rMean = (rgb1.r + rgb2.r) / 2;
    const deltaR = rgb1.r - rgb2.r;
    const deltaG = rgb1.g - rgb2.g;
    const deltaB = rgb1.b - rgb2.b;
    
    return Math.sqrt(
        (2 + rMean / 256) * deltaR * deltaR +
        4 * deltaG * deltaG +
        (2 + (255 - rMean) / 256) * deltaB * deltaB
    );
}

// HEX转RGB对象
function hexToRgbObj(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// 找到最接近的拼豆颜色
function findClosestPerlerColor(hexColor) {
    let closestColor = PERLER_BEADS_COLORS[0];
    let minDistance = Infinity;
    
    for (const perlerColor of PERLER_BEADS_COLORS) {
        const distance = colorDistance(hexColor, perlerColor.hex);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = perlerColor;
        }
    }
    
    return closestColor;
}

// 导出颜色数组
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PERLER_BEADS_COLORS, findClosestPerlerColor };
}