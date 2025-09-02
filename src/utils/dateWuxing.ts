// 日期五行属性计算工具

// 天干对应的五行
const TIANGAN_WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火', 
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支对应的五行
const DIZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 天干数组
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支数组
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行属性描述
const WUXING_DESCRIPTIONS = {
  '金': '金主收敛，象征坚毅、果断、理性。金日宜静心思考，做重要决策。',
  '木': '木主生发，象征生机、成长、创新。木日宜开始新项目，培养新习惯。',
  '水': '水主智慧，象征流动、变化、包容。水日宜学习思考，处理人际关系。',
  '火': '火主热情，象征活力、激情、表达。火日宜社交活动，展现个人魅力。',
  '土': '土主稳定，象征踏实、包容、滋养。土日宜整理规划，巩固基础。'
};

// 五行颜色推荐
const WUXING_COLORS = {
  '金': ['白色', '银色', '金色', '米白色', '浅灰色'],
  '木': ['绿色', '青色', '翠绿', '墨绿', '浅绿'],
  '水': ['黑色', '深蓝', '藏青', '深灰', '墨色'],
  '火': ['红色', '橙色', '粉色', '紫色', '玫红'],
  '土': ['黄色', '棕色', '土黄', '卡其色', '米黄']
};

// 五行饮食建议
const WUXING_DIET = {
  '金': ['白萝卜', '梨子', '银耳', '百合', '杏仁', '白菜'],
  '木': ['绿叶蔬菜', '青椒', '芹菜', '韭菜', '菠菜', '西兰花'],
  '水': ['黑豆', '黑芝麻', '海带', '紫菜', '蓝莓', '黑木耳'],
  '火': ['红枣', '胡萝卜', '西红柿', '红豆', '辣椒', '草莓'],
  '土': ['小米', '玉米', '南瓜', '红薯', '土豆', '花生']
};

// 五行行为建议
const WUXING_BEHAVIOR = {
  '金': ['冥想静心', '整理物品', '制定计划', '练习书法', '听古典音乐'],
  '木': ['户外运动', '种植花草', '学习新技能', '创意活动', '早起晨练'],
  '水': ['阅读思考', '泡温泉', '游泳', '听流水声', '与朋友交流'],
  '火': ['社交聚会', '表达观点', '运动健身', '参加活动', '展示才艺'],
  '土': ['居家整理', '烹饪美食', '陪伴家人', '稳步工作', '养护身体']
};

/**
 * 计算指定日期的天干地支
 * @param date 日期对象
 * @returns 天干地支对象
 */
export function getGanZhi(date: Date): { tiangan: string; dizhi: string } {
  // 以1900年1月1日为基准点（庚子年庚子月庚子日）
  const baseDate = new Date(1900, 0, 1);
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 1900年1月1日是庚子日，庚是第7个天干（索引6），子是第1个地支（索引0）
  const tianganIndex = (6 + diffDays) % 10;
  const dizhiIndex = (0 + diffDays) % 12;
  
  return {
    tiangan: TIANGAN[tianganIndex],
    dizhi: DIZHI[dizhiIndex]
  };
}

/**
 * 获取日期的主要五行属性
 * @param date 日期对象
 * @returns 五行属性
 */
export function getDateWuxing(date: Date): string {
  const { tiangan } = getGanZhi(date);
  return TIANGAN_WUXING[tiangan as keyof typeof TIANGAN_WUXING];
}

/**
 * 获取日期的完整五行信息
 * @param date 日期对象
 * @returns 完整的五行信息对象
 */
export function getDateWuxingInfo(date: Date) {
  const { tiangan, dizhi } = getGanZhi(date);
  const tianganWuxing = TIANGAN_WUXING[tiangan as keyof typeof TIANGAN_WUXING];
  const dizhiWuxing = DIZHI_WUXING[dizhi as keyof typeof DIZHI_WUXING];
  
  // 主要五行以天干为准
  const mainWuxing = tianganWuxing;
  
  return {
    date: date.toISOString().split('T')[0],
    tiangan,
    dizhi,
    tianganWuxing,
    dizhiWuxing,
    mainWuxing,
    ganZhi: `${tiangan}${dizhi}`,
    description: WUXING_DESCRIPTIONS[mainWuxing as keyof typeof WUXING_DESCRIPTIONS],
    colors: WUXING_COLORS[mainWuxing as keyof typeof WUXING_COLORS],
    diet: WUXING_DIET[mainWuxing as keyof typeof WUXING_DIET],
    behavior: WUXING_BEHAVIOR[mainWuxing as keyof typeof WUXING_BEHAVIOR]
  };
}

/**
 * 格式化日期为中文显示
 * @param date 日期对象
 * @returns 格式化的日期字符串
 */
export function formatChineseDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[date.getDay()];
  
  return `${year}年${month}月${day}日 星期${weekday}`;
}

/**
 * 获取五行相生相克关系
 * @param element 五行元素
 * @returns 相生相克关系
 */
export function getWuxingRelations(element: string) {
  const relations = {
    '金': { generates: '水', restrains: '木', generatedBy: '土', restrainedBy: '火' },
    '木': { generates: '火', restrains: '土', generatedBy: '水', restrainedBy: '金' },
    '水': { generates: '木', restrains: '火', generatedBy: '金', restrainedBy: '土' },
    '火': { generates: '土', restrains: '金', generatedBy: '木', restrainedBy: '水' },
    '土': { generates: '金', restrains: '水', generatedBy: '火', restrainedBy: '木' }
  };
  
  return relations[element as keyof typeof relations];
}