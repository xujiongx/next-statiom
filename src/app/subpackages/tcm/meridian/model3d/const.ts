// 手太阴肺经穴位数据
export interface Acupoint3D {
  name: string;
  pinyin: string;
  code: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  anatomicalLocation: string;
  functions: string[];
  indications: string[];
  needleDepth: string;
  needleAngle: string;
  clinicalNotes?: string;
}

// 手太阴肺经11个穴位的3D坐标数据
// 根据实际人体模型比例调整
export const lungMeridianAcupoints: Acupoint3D[] = [
  {
    name: '中府',
    pinyin: 'Zhongfu',
    code: 'LU1',
    position: { x: -0.35, y: 0.75, z: 0.20 }, // 调整到胸部上方位置
    anatomicalLocation: '胸外侧部，云门下1寸，第1肋间隙，锁骨下窝外侧',
    functions: ['宣肺理气', '止咳平喘', '清热化痰'],
    indications: ['咳嗽', '气喘', '胸痛', '肩背痛'],
    needleDepth: '0.5-1.0寸',
    needleAngle: '斜刺或平刺，针尖向外上方',
    clinicalNotes: '肺之募穴，手太阴、足太阴之会'
  },
  {
    name: '云门',
    pinyin: 'Yunmen',
    code: 'LU2', 
    position: { x: -0.40, y: 0.85, z: 0.15 }, // 调整到锁骨下窝位置
    anatomicalLocation: '胸外侧部，锁骨下窝中央，肩胛骨喙突内侧缘',
    functions: ['宣肺理气', '化痰止咳', '宽胸利膈'],
    indications: ['咳嗽', '气喘', '胸闷', '肩臂痛'],
    needleDepth: '0.5-1.0寸',
    needleAngle: '斜刺或平刺，针尖向外下方'
  },
  {
    name: '天府',
    pinyin: 'Tianfu',
    code: 'LU3',
    position: { x: -0.50, y: 0.55, z: 0.10 }, // 调整到上臂位置
    anatomicalLocation: '臂内侧，腋前纹头下3寸，肱二头肌桡侧缘',
    functions: ['理气止咳', '清肺热', '通经活络'],
    indications: ['咳嗽', '气喘', '鼻衄', '臂痛'],
    needleDepth: '0.5-1.0寸',
    needleAngle: '直刺'
  },
  {
    name: '侠白',
    pinyin: 'Xiabai', 
    code: 'LU4',
    position: { x: -0.55, y: 0.35, z: 0.08 }, // 调整到上臂中段
    anatomicalLocation: '臂内侧，天府下1寸，肱二头肌桡侧缘',
    functions: ['宽胸理气', '止咳平喘'],
    indications: ['咳嗽', '气喘', '胸满', '臂痛'],
    needleDepth: '0.5-1.0寸',
    needleAngle: '直刺'
  },
  {
    name: '尺泽',
    pinyin: 'Chize',
    code: 'LU5',
    position: { x: -0.42, y: 0.15, z: 0.04 }, // 统一使用详细路径的坐标
    anatomicalLocation: '肘横纹上，肱二头肌腱桡侧凹陷处',
    functions: ['清肺泻火', '降逆止咳', '通调水道'],
    indications: ['咳嗽', '气喘', '咯血', '潮热', '肘臂痛'],
    needleDepth: '0.5-0.8寸',
    needleAngle: '直刺或斜刺',
    clinicalNotes: '肺经合穴，属水'
  },
  {
    name: '孔最',
    pinyin: 'Kongzui',
    code: 'LU6', 
    position: { x: -0.65, y: -0.20, z: 0.04 }, // 调整到前臂上段
    anatomicalLocation: '前臂掌面桡侧，尺泽与太渊连线上，腕横纹上7寸',
    functions: ['清热止血', '润肺止咳', '通调水道'],
    indications: ['咳嗽', '气喘', '咯血', '咽喉肿痛', '肘臂痛'],
    needleDepth: '0.5-1.0寸',
    needleAngle: '直刺',
    clinicalNotes: '肺经郄穴'
  },
  {
    name: '列缺',
    pinyin: 'Lieque',
    code: 'LU7',
    position: { x: -0.70, y: -0.40, z: 0.02 }, // 调整到前臂下段
    anatomicalLocation: '前臂桡侧缘，桡骨茎突上方，腕横纹上1.5寸',
    functions: ['宣肺解表', '通调水道', '通经活络'],
    indications: ['头痛', '项强', '咳嗽', '气喘', '咽喉肿痛'],
    needleDepth: '0.2-0.5寸',
    needleAngle: '斜刺',
    clinicalNotes: '肺经络穴，八脉交会穴通任脉'
  },
  {
    name: '经渠',
    pinyin: 'Jingqu',
    code: 'LU8',
    position: { x: -0.75, y: -0.50, z: 0.00 }, // 调整到腕部上方
    anatomicalLocation: '腕掌侧横纹上1寸，桡动脉桡侧凹陷处',
    functions: ['宣肺理气', '止咳平喘', '通调水道'],
    indications: ['咳嗽', '气喘', '胸痛', '咽喉肿痛', '腕痛'],
    needleDepth: '0.2-0.3寸',
    needleAngle: '避开动脉，斜刺',
    clinicalNotes: '肺经经穴，属金'
  },
  {
    name: '太渊',
    pinyin: 'Taiyuan',
    code: 'LU9',
    position: { x: -0.80, y: -0.60, z: -0.02 }, // 调整到腕部
    anatomicalLocation: '腕掌侧横纹桡侧，桡动脉搏动处',
    functions: ['补肺益气', '止咳平喘', '通调血脉'],
    indications: ['咳嗽', '气喘', '胸痛', '无脉症', '腕痛'],
    needleDepth: '0.2-0.3寸',
    needleAngle: '避开动脉，直刺',
    clinicalNotes: '肺经原穴，脉会，八会穴之一'
  },
  {
    name: '鱼际',
    pinyin: 'Yuji',
    code: 'LU10',
    position: { x: -0.85, y: -0.68, z: -0.04 }, // 调整到手掌
    anatomicalLocation: '手掌面第1掌骨中点桡侧，赤白肉际处',
    functions: ['清肺泻火', '止咳平喘', '清热利咽'],
    indications: ['咳嗽', '咯血', '咽喉肿痛', '失音', '发热'],
    needleDepth: '0.5-0.8寸',
    needleAngle: '直刺',
    clinicalNotes: '肺经荥穴，属火'
  },
  {
    name: '少商',
    pinyin: 'Shaoshang',
    code: 'LU11',
    position: { x: -0.90, y: -0.75, z: -0.06 }, // 调整到拇指位置
    anatomicalLocation: '拇指桡侧指甲角旁0.1寸',
    functions: ['清肺泻火', '开窍醒神', '清热利咽'],
    indications: ['咽喉肿痛', '咳嗽', '气喘', '发热', '昏迷'],
    needleDepth: '0.1寸',
    needleAngle: '浅刺或点刺出血',
    clinicalNotes: '肺经井穴，属木'
  }
];


// 更精确的手太阴肺经路径（包含中间过渡点）
export const lungMeridianDetailedPath = [
    // 胸部段
    { x: -0.40, y: 0.85, z: 0.15 },   // 云门 (LU2)
    { x: -0.37, y: 0.80, z: 0.17 },   // 过渡点
    { x: -0.35, y: 0.75, z: 0.20 },   // 中府 (LU1)
    
    // 上臂段
    { x: -0.42, y: 0.65, z: 0.15 },   // 过渡点（肩部）
    { x: -0.50, y: 0.55, z: 0.10 },   // 天府 (LU3)
    { x: -0.52, y: 0.45, z: 0.09 },   // 过渡点
    { x: -0.55, y: 0.35, z: 0.08 },   // 侠白 (LU4)
    { x: -0.57, y: 0.20, z: 0.07 },   // 过渡点（肘上）
    
    // 肘部段
    { x: -0.60, y: 0.05, z: 0.06 },   // 尺泽 (LU5)
    
    // 前臂段
    { x: -0.62, y: -0.10, z: 0.05 },  // 过渡点
    { x: -0.65, y: -0.20, z: 0.04 },  // 孔最 (LU6)
    { x: -0.67, y: -0.30, z: 0.03 },  // 过渡点
    { x: -0.70, y: -0.40, z: 0.02 },  // 列缺 (LU7)
    
    // 腕部段
    { x: -0.72, y: -0.45, z: 0.01 },  // 过渡点
    { x: -0.75, y: -0.50, z: 0.00 },  // 经渠 (LU8)
    { x: -0.77, y: -0.55, z: -0.01 }, // 过渡点
    { x: -0.80, y: -0.60, z: -0.02 }, // 太渊 (LU9)
    
    // 手部段
    { x: -0.82, y: -0.64, z: -0.03 }, // 过渡点
    { x: -0.85, y: -0.68, z: -0.04 }, // 鱼际 (LU10)
    { x: -0.87, y: -0.71, z: -0.05 }, // 过渡点
    { x: -0.90, y: -0.75, z: -0.06 }  // 少商 (LU11)
];


// 更新匹配模型的经络路径
export const lungMeridianPath = lungMeridianDetailedPath.filter((_, index) => 
  [0, 2, 4, 7, 9, 11, 14, 17, 20, 23, 26].includes(index)
);

// 3D模型配置
export const modelConfig = {
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75,
    near: 0.1,
    far: 1000
  },
  lighting: {
    ambient: { color: 0x404040, intensity: 0.4 },
    directional: {
      color: 0xffffff,
      intensity: 0.8,
      position: { x: 1, y: 1, z: 1 }
    },
    point: {
      color: 0xffffff,
      intensity: 0.6,
      position: { x: -1, y: 1, z: 1 }
    }
  },
  materials: {
    body: {
      color: 0xfdbcb4,
      transparent: true,
      opacity: 0.8,
      roughness: 0.4,
      metalness: 0.1
    },
    acupoint: {
      color: 0xff4444,
      emissive: 0x442222,
      transparent: true,
      opacity: 0.9
    },
    meridian: {
      color: 0x4444ff,
      transparent: true,
      opacity: 0.7
    }
  }
};


