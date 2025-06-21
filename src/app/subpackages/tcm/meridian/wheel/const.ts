// 流注八法盘数据结构

// 天干地支基础数据
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二时辰
export const TWELVE_HOURS = [
  { name: '子时', time: '23:00-01:00', index: 0 },
  { name: '丑时', time: '01:00-03:00', index: 1 },
  { name: '寅时', time: '03:00-05:00', index: 2 },
  { name: '卯时', time: '05:00-07:00', index: 3 },
  { name: '辰时', time: '07:00-09:00', index: 4 },
  { name: '巳时', time: '09:00-11:00', index: 5 },
  { name: '午时', time: '11:00-13:00', index: 6 },
  { name: '未时', time: '13:00-15:00', index: 7 },
  { name: '申时', time: '15:00-17:00', index: 8 },
  { name: '酉时', time: '17:00-19:00', index: 9 },
  { name: '戌时', time: '19:00-21:00', index: 10 },
  { name: '亥时', time: '21:00-23:00', index: 11 }
];

// 灵龟八法 - 日干支基数
export const DAY_STEM_VALUES: Record<string, number> = {
  '甲': 10, '己': 10,
  '乙': 9, '庚': 9,
  '丙': 7, '辛': 7,
  '丁': 8, '壬': 8,
  '戊': 7, '癸': 7
};

export const DAY_BRANCH_VALUES: Record<string, number> = {
  '子': 7, '丑': 10, '寅': 8, '卯': 8,
  '辰': 10, '巳': 7, '午': 7, '未': 10,
  '申': 9, '酉': 9, '戌': 10, '亥': 7
};

// 灵龟八法 - 时干支基数
export const TIME_STEM_VALUES: Record<string, number> = {
  '甲': 9, '己': 9,
  '乙': 8, '庚': 8,
  '丙': 7, '辛': 7,
  '丁': 6, '壬': 6,
  '戊': 5, '癸': 5
};

export const TIME_BRANCH_VALUES: Record<string, number> = {
  '子': 9, '丑': 8, '寅': 7, '卯': 6,
  '辰': 5, '巳': 4, '午': 9, '未': 8,
  '申': 7, '酉': 6, '戌': 5, '亥': 4
};

// 阴阳日判断
export const YANG_STEMS = ['甲', '丙', '戊', '庚', '壬'];
export const YIN_STEMS = ['乙', '丁', '己', '辛', '癸'];

// 八卦九宫数据
export const BAGUA_DATA = [
  { name: '坎', number: 1, position: 'north', point: '申脉', color: '#1e40af' },
  { name: '坤', number: 2, position: 'southwest', point: '照海', color: '#7c2d12' },
  { name: '震', number: 3, position: 'east', point: '外关', color: '#15803d' },
  { name: '巽', number: 4, position: 'southeast', point: '临泣', color: '#059669' },
  { name: '中', number: 5, position: 'center', point: '照海/内关', color: '#eab308' },
  { name: '乾', number: 6, position: 'northwest', point: '公孙', color: '#dc2626' },
  { name: '兑', number: 7, position: 'west', point: '后溪', color: '#9333ea' },
  { name: '艮', number: 8, position: 'northeast', point: '内关', color: '#ea580c' },
  { name: '离', number: 9, position: 'south', point: '列缺', color: '#dc2626' }
];

// 八脉八穴详细信息
export const EIGHT_POINTS = {
  '公孙': {
    name: '公孙',
    meridian: '足太阴脾经',
    location: '足内侧缘，第一跖骨基底部的前下方',
    pairedPoint: '内关',
    vessel: '冲脉',
    indications: ['胃脘痛', '呕吐', '腹胀', '泄泻', '痢疾', '月经不调'],
    color: '#dc2626'
  },
  '内关': {
    name: '内关',
    meridian: '手厥阴心包经',
    location: '前臂掌侧，腕横纹上2寸',
    pairedPoint: '公孙',
    vessel: '阴维脉',
    indications: ['心痛', '胸闷', '心悸', '失眠', '癫狂', '胃痛'],
    color: '#ea580c'
  },
  '外关': {
    name: '外关',
    meridian: '手少阳三焦经',
    location: '前臂背侧，腕背横纹上2寸',
    pairedPoint: '临泣',
    vessel: '阳维脉',
    indications: ['头痛', '耳鸣', '胁痛', '手臂痛', '感冒发热'],
    color: '#15803d'
  },
  '临泣': {
    name: '临泣',
    meridian: '足少阳胆经',
    location: '足背侧，第四、五跖骨结合部的前方',
    pairedPoint: '外关',
    vessel: '带脉',
    indications: ['偏头痛', '目疾', '耳聋', '胁痛', '月经不调'],
    color: '#059669'
  },
  '列缺': {
    name: '列缺',
    meridian: '手太阴肺经',
    location: '前臂桡侧缘，桡骨茎突上方',
    pairedPoint: '照海',
    vessel: '任脉',
    indications: ['咳嗽', '气喘', '咽喉痛', '头项痛', '感冒'],
    color: '#dc2626'
  },
  '照海': {
    name: '照海',
    meridian: '足少阴肾经',
    location: '足内侧，内踝尖下方凹陷处',
    pairedPoint: '列缺',
    vessel: '阴跷脉',
    indications: ['咽喉痛', '失眠', '癫痫', '月经不调', '小便不利'],
    color: '#7c2d12'
  },
  '后溪': {
    name: '后溪',
    meridian: '手太阳小肠经',
    location: '手掌尺侧，第五掌指关节后方',
    pairedPoint: '申脉',
    vessel: '督脉',
    indications: ['头项强痛', '腰背痛', '癫痫', '疟疾', '耳聋'],
    color: '#9333ea'
  },
  '申脉': {
    name: '申脉',
    meridian: '足太阳膀胱经',
    location: '足外侧，外踝尖下方凹陷处',
    pairedPoint: '后溪',
    vessel: '阳跷脉',
    indications: ['头痛', '眩晕', '腰腿痛', '癫痫', '失眠'],
    color: '#1e40af'
  }
};

// 子午流注十二经络时辰对应
export const MERIDIAN_TIMING = [
  { time: '子时', meridian: '足少阳胆经', peak: true },
  { time: '丑时', meridian: '足厥阴肝经', peak: true },
  { time: '寅时', meridian: '手太阴肺经', peak: true },
  { time: '卯时', meridian: '手阳明大肠经', peak: true },
  { time: '辰时', meridian: '足阳明胃经', peak: true },
  { time: '巳时', meridian: '足太阴脾经', peak: true },
  { time: '午时', meridian: '手少阴心经', peak: true },
  { time: '未时', meridian: '手太阳小肠经', peak: true },
  { time: '申时', meridian: '足太阳膀胱经', peak: true },
  { time: '酉时', meridian: '足少阴肾经', peak: true },
  { time: '戌时', meridian: '手厥阴心包经', peak: true },
  { time: '亥时', meridian: '手少阳三焦经', peak: true }
];

// 时干支对照表
export const TIME_GANZHI_TABLE: Record<string, string[]> = {
  '甲己': ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉', '甲戌', '乙亥'],
  '乙庚': ['丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未', '甲申', '乙酉', '丙戌', '丁亥'],
  '丙辛': ['戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥'],
  '丁壬': ['庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥'],
  '戊癸': ['壬子', '癸丑', '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥']
};