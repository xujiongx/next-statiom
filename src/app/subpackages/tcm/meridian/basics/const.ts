export interface BasicConcept {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  details?: string[];
}

export interface RegularMeridian {
  name: string;
  organ: string;
  time: string;
  points: number;
  type: string;
  element: string;
  yinyang: string;
  pathway: string;
  mainFunctions: string[];
  commonPoints: string[];
}

export interface MeridianFeature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

export interface AcupointType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
}

export interface QiBloodType {
  id: string;
  name: string;
  description: string;
  functions: string[];
  characteristics: string[];
}

// 基础概念数据
export const concepts: BasicConcept[] = [
  {
    id: 'meridian',
    title: '经络系统',
    content: '经络是人体内气血运行的通道，包括经脉和络脉。经脉是主干，络脉是分支。经络系统连接脏腑、肢体，调节人体各部分的功能活动。',
    keyPoints: ['十二正经', '奇经八脉', '十五络脉', '十二经别'],
    details: [
      '经络系统是中医理论的重要组成部分',
      '经络具有运行气血、联络脏腑、沟通内外的作用',
      '经络病变可通过相应的症状和体征反映出来',
      '针灸治疗主要通过刺激经络穴位来调节脏腑功能'
    ]
  },
  {
    id: 'acupoint',
    title: '腧穴理论',
    content: '腧穴是经络之气输注于体表的特殊部位，是针灸治疗的刺激点。腧穴具有诊断疾病、治疗疾病和保健强身的作用。',
    keyPoints: ['经穴', '奇穴', '阿是穴', '特定穴'],
    details: [
      '腧穴是气血汇聚的地方，具有特殊的生理功能',
      '不同的腧穴有不同的治疗作用和适应症',
      '腧穴的定位需要准确，才能发挥最佳治疗效果',
      '腧穴可以通过触诊、观察等方法进行诊断'
    ]
  },
  {
    id: 'qi-blood',
    title: '气血理论',
    content: '气血是构成人体和维持人体生命活动的基本物质。气为血之帅，血为气之母。经络是气血运行的通道。',
    keyPoints: ['元气', '宗气', '营气', '卫气'],
    details: [
      '气血充足是健康的基础，气血不足会导致各种疾病',
      '气血的运行有一定的规律，遵循子午流注的时间节律',
      '气血失调可通过调理经络来恢复平衡',
      '饮食、情志、劳逸等因素都会影响气血的生成和运行'
    ]
  },
  {
    id: 'zangfu',
    title: '脏腑经络',
    content: '十二正经分别联系十二脏腑，形成脏腑经络系统。每条经络都有其特定的循行路线和所属脏腑。',
    keyPoints: ['手三阴', '手三阳', '足三阴', '足三阳'],
    details: [
      '脏腑经络系统体现了中医整体观念',
      '脏腑功能失调会在相应经络上反映出来',
      '通过调理经络可以治疗相应的脏腑疾病',
      '脏腑经络的相互关系是中医诊治的重要依据'
    ]
  }
];

// 腧穴分类详细数据
export const acupointTypes: AcupointType[] = [
  {
    id: 'jingxue',
    name: '经穴',
    description: '分布在十四经脉循行路线上的腧穴',
    characteristics: ['位置相对固定', '有明确的经络归属', '主治作用明确'],
    examples: ['合谷', '足三里', '百会', '神门']
  },
  {
    id: 'qixue',
    name: '奇穴',
    description: '具有固定名称、位置和主治作用，但不属于十四经脉系统的腧穴',
    characteristics: ['位置固定', '主治专一', '效果显著'],
    examples: ['印堂', '太阳', '夹脊', '胆囊穴']
  },
  {
    id: 'ashixue',
    name: '阿是穴',
    description: '以压痛点或其他反应点为准的腧穴',
    characteristics: ['位置不固定', '因病而定', '就地取穴'],
    examples: ['压痛点', '结节点', '敏感点', '条索状物']
  },
  {
    id: 'tedingxue',
    name: '特定穴',
    description: '具有特殊治疗作用的一类腧穴',
    characteristics: ['作用特殊', '应用广泛', '效果确切'],
    examples: ['五输穴', '原穴', '络穴', '郄穴']
  }
];

// 气血分类详细数据
export const qiBloodTypes: QiBloodType[] = [
  {
    id: 'yuanqi',
    name: '元气',
    description: '人体最根本的气，是生命活动的原动力',
    functions: ['推动生长发育', '温煦脏腑组织', '防御外邪', '固摄精血'],
    characteristics: ['先天之本', '藏于肾中', '需后天滋养', '决定体质强弱']
  },
  {
    id: 'zongqi',
    name: '宗气',
    description: '积聚在胸中的气，主要功能是推动呼吸和血液循环',
    functions: ['司呼吸', '助心行血', '濡养心肺', '出入息'],
    characteristics: ['聚于胸中', '贯心脉', '司呼吸', '助发声']
  },
  {
    id: 'yingqi',
    name: '营气',
    description: '运行于脉中的气，具有营养全身的作用',
    functions: ['化生血液', '营养全身', '濡养脏腑', '生成津液'],
    characteristics: ['行于脉中', '营养作用', '化生血液', '昼夜循环']
  },
  {
    id: 'weiqi',
    name: '卫气',
    description: '运行于脉外的气，具有防御和调节体温的作用',
    functions: ['护卫肌表', '防御外邪', '调节体温', '控制汗孔'],
    characteristics: ['行于脉外', '防御功能', '温养肌肤', '昼行于阳']
  }
];

// 十二正经详细数据
export const twelveRegularMeridians: RegularMeridian[] = [
  {
    name: '手太阴肺经',
    organ: '肺',
    time: '3-5时',
    points: 11,
    type: '手三阴',
    element: '金',
    yinyang: '阴',
    pathway: '起于中焦，下络大肠，还循胃口，上膈属肺',
    mainFunctions: ['主气司呼吸', '通调水道', '朝百脉', '主治肺系疾病'],
    commonPoints: ['中府', '云门', '天府', '侠白', '尺泽', '孔最', '列缺', '经渠', '太渊', '鱼际', '少商']
  },
  {
    name: '手阳明大肠经',
    organ: '大肠',
    time: '5-7时',
    points: 20,
    type: '手三阳',
    element: '金',
    yinyang: '阳',
    pathway: '起于商阳，循指上廉，出合谷两骨之间',
    mainFunctions: ['传化糟粕', '主津液', '主治头面五官疾病'],
    commonPoints: ['商阳', '二间', '三间', '合谷', '阳溪', '偏历', '温溜', '下廉', '上廉', '手三里', '曲池', '肘髎', '手五里', '臂臑', '肩髃', '巨骨', '天鼎', '扶突', '口禾髎', '迎香']
  },
  {
    name: '足阳明胃经',
    organ: '胃',
    time: '7-9时',
    points: 45,
    type: '足三阳',
    element: '土',
    yinyang: '阳',
    pathway: '起于鼻翼旁，上行至额颅，下行至缺盆',
    mainFunctions: ['受纳腐熟水谷', '主降浊', '主治胃肠疾病'],
    commonPoints: ['承泣', '四白', '巨髎', '地仓', '大迎', '颊车', '下关', '头维', '人迎', '水突', '气舍', '缺盆', '气户', '库房', '屋翳', '膺窗', '乳中', '乳根', '不容', '承满', '梁门', '关门', '太乙', '滑肉门', '天枢', '外陵', '大巨', '水道', '归来', '气冲', '髀关', '伏兔', '阴市', '梁丘', '犊鼻', '足三里', '上巨虚', '条口', '下巨虚', '丰隆', '解溪', '冲阳', '陷谷', '内庭', '厉兑']
  },
  {
    name: '足太阴脾经',
    organ: '脾',
    time: '9-11时',
    points: 21,
    type: '足三阴',
    element: '土',
    yinyang: '阴',
    pathway: '起于大趾内侧端，上行内踝前廉，循胫骨内侧缘',
    mainFunctions: ['运化水谷', '统血', '主肌肉四肢'],
    commonPoints: ['隐白', '大都', '太白', '公孙', '商丘', '三阴交', '漏谷', '地机', '阴陵泉', '血海', '箕门', '冲门', '府舍', '腹结', '大横', '腹哀', '食窦', '天溪', '胸乡', '周荣', '大包']
  },
  {
    name: '手少阴心经',
    organ: '心',
    time: '11-13时',
    points: 9,
    type: '手三阴',
    element: '火',
    yinyang: '阴',
    pathway: '起于心中，出属心系，下膈络小肠',
    mainFunctions: ['主血脉', '主神明', '主治心神疾病'],
    commonPoints: ['极泉', '青灵', '少海', '灵道', '通里', '阴郄', '神门', '少府', '少冲']
  },
  {
    name: '手太阳小肠经',
    organ: '小肠',
    time: '13-15时',
    points: 19,
    type: '手三阳',
    element: '火',
    yinyang: '阳',
    pathway: '起于小指外侧端，循手外侧上行',
    mainFunctions: ['受盛化物', '泌别清浊', '主治头项耳目疾病'],
    commonPoints: ['少泽', '前谷', '后溪', '腕骨', '阳谷', '养老', '支正', '小海', '肩贞', '臑俞', '天宗', '秉风', '曲垣', '肩外俞', '肩中俞', '天窗', '天容', '颧髎', '听宫']
  },
  {
    name: '足太阳膀胱经',
    organ: '膀胱',
    time: '15-17时',
    points: 67,
    type: '足三阳',
    element: '水',
    yinyang: '阳',
    pathway: '起于内眦，上额交巅，入络脑，还出别下项',
    mainFunctions: ['贮尿排尿', '主治泌尿生殖疾病'],
    commonPoints: ['睛明', '攒竹', '眉冲', '曲差', '五处', '承光', '通天', '络却', '玉枕', '天柱', '大杼', '风门', '肺俞', '厥阴俞', '心俞', '督俞', '膈俞', '肝俞', '胆俞', '脾俞', '胃俞', '三焦俞', '肾俞', '气海俞', '大肠俞', '关元俞', '小肠俞', '膀胱俞', '中膂俞', '白环俞', '上髎', '次髎', '中髎', '下髎', '会阳', '承扶', '殷门', '浮郄', '委阳', '委中', '附分', '魄户', '膏肓', '神堂', '譩譆', '膈关', '魂门', '阳纲', '意舍', '胃仓', '肓门', '志室', '胞肓', '秩边', '合阳', '承筋', '承山', '飞扬', '跗阳', '昆仑', '仆参', '申脉', '金门', '京骨', '束骨', '足通谷', '至阴']
  },
  {
    name: '足少阴肾经',
    organ: '肾',
    time: '17-19时',
    points: 27,
    type: '足三阴',
    element: '水',
    yinyang: '阴',
    pathway: '起于小趾下，斜走足心，出于然谷之下',
    mainFunctions: ['藏精主生殖', '主水液', '主骨生髓'],
    commonPoints: ['涌泉', '然谷', '太溪', '大钟', '水泉', '照海', '复溜', '交信', '筑宾', '阴谷', '横骨', '大赫', '气穴', '四满', '中注', '肓俞', '商曲', '石关', '阴都', '腹通谷', '幽门', '步廊', '神封', '灵墟', '神藏', '彧中', '俞府']
  },
  {
    name: '手厥阴心包经',
    organ: '心包',
    time: '19-21时',
    points: 9,
    type: '手三阴',
    element: '火',
    yinyang: '阴',
    pathway: '起于胸中，出属心包络，下膈历络三焦',
    mainFunctions: ['代心受邪', '主治心胸疾病'],
    commonPoints: ['天池', '天泉', '曲泽', '郄门', '间使', '内关', '大陵', '劳宫', '中冲']
  },
  {
    name: '手少阳三焦经',
    organ: '三焦',
    time: '21-23时',
    points: 23,
    type: '手三阳',
    element: '火',
    yinyang: '阳',
    pathway: '起于关冲，循手表腕，出臂外两骨之间',
    mainFunctions: ['通调水道', '主气化', '主治侧头耳目疾病'],
    commonPoints: ['关冲', '液门', '中渚', '阳池', '外关', '支沟', '会宗', '三阳络', '四渎', '天井', '清冷渊', '消泺', '臑会', '肩髎', '天髎', '天牖', '翳风', '瘈脉', '颅息', '角孙', '耳门', '和髎', '丝竹空']
  },
  {
    name: '足少阳胆经',
    organ: '胆',
    time: '23-1时',
    points: 44,
    type: '足三阳',
    element: '木',
    yinyang: '阳',
    pathway: '起于目外眦，上抵头角，下耳后',
    mainFunctions: ['贮藏排泄胆汁', '主决断', '主治侧头胁肋疾病'],
    commonPoints: ['瞳子髎', '听会', '上关', '颔厌', '悬颅', '悬厘', '曲鬓', '率谷', '天冲', '浮白', '头窍阴', '完骨', '本神', '阳白', '头临泣', '目窗', '正营', '承灵', '脑空', '风池', '肩井', '渊腋', '辄筋', '日月', '京门', '带脉', '五枢', '维道', '居髎', '环跳', '风市', '中渎', '膝阳关', '阳陵泉', '阳交', '外丘', '光明', '阳辅', '悬钟', '丘墟', '足临泣', '地五会', '侠溪', '足窍阴']
  },
  {
    name: '足厥阴肝经',
    organ: '肝',
    time: '1-3时',
    points: 14,
    type: '足三阴',
    element: '木',
    yinyang: '阴',
    pathway: '起于大趾丛毛之际，上循足跗上廉',
    mainFunctions: ['疏泄调达', '藏血', '主筋'],
    commonPoints: ['大敦', '行间', '太冲', '中封', '蠡沟', '中都', '膝关', '曲泉', '阴包', '足五里', '阴廉', '急脉', '章门', '期门']
  }
];

// 经络特点详细数据
export const meridianFeatures: MeridianFeature[] = [
  {
    icon: '🔄',
    title: '循环性',
    description: '气血在经络中周而复始地循环流动',
    details: [
      '经络中的气血按照一定的方向和规律循环流动',
      '十二经脉的流注顺序：肺→大肠→胃→脾→心→小肠→膀胱→肾→心包→三焦→胆→肝',
      '气血的循环与时间节律密切相关，形成子午流注理论',
      '循环的畅通与否直接影响人体的健康状态'
    ]
  },
  {
    icon: '🌐',
    title: '整体性',
    description: '经络连接全身，形成统一的整体',
    details: [
      '经络系统将人体各个部分有机地联系在一起',
      '局部的病变可以通过经络影响到远处的脏腑组织',
      '治疗时可以通过远端取穴来治疗局部疾病',
      '体现了中医"治病必求于本"的整体观念'
    ]
  },
  {
    icon: '⚖️',
    title: '调节性',
    description: '调节脏腑功能，维持阴阳平衡',
    details: [
      '经络具有双向调节作用，既能兴奋也能抑制',
      '通过经络的调节作用维持人体的阴阳平衡',
      '当脏腑功能失调时，可通过刺激相应经络来调节',
      '经络调节是针灸治疗发挥作用的重要机制'
    ]
  },
  {
    icon: '🛡️',
    title: '防御性',
    description: '抵御外邪，保护机体健康',
    details: [
      '经络系统是人体的第一道防线',
      '卫气通过经络在体表循行，防御外邪入侵',
      '经络的防御功能与人体免疫力密切相关',
      '经络畅通有助于提高机体的抗病能力'
    ]
  },
  {
    icon: '📡',
    title: '传导性',
    description: '传导刺激信息，产生治疗效应',
    details: [
      '经络具有传导针刺等刺激的作用',
      '刺激穴位的信息可以沿经络传导到相应脏腑',
      '经络传导是针灸治疗的物质基础',
      '传导的速度和强度影响治疗效果'
    ]
  },
  {
    icon: '🔍',
    title: '诊断性',
    description: '反映脏腑病变，辅助疾病诊断',
    details: [
      '脏腑的病变可以在相应经络上反映出来',
      '通过观察经络的变化可以诊断疾病',
      '经络诊断包括望、闻、问、切四个方面',
      '经络诊断是中医诊断学的重要组成部分'
    ]
  }
];

// 经络分类数据
export const meridianCategories = {
  zhengJing: {
    name: '正经',
    description: '人体主要的经络系统',
    subcategories: [
      {
        name: '十二正经',
        description: '十二条主要经脉',
        meridians: ['手太阴肺经', '手阳明大肠经', '足阳明胃经', '足太阴脾经', '手少阴心经', '手太阳小肠经', '足太阳膀胱经', '足少阴肾经', '手厥阴心包经', '手少阳三焦经', '足少阳胆经', '足厥阴肝经']
      }
    ]
  },
  qiJing: {
    name: '奇经',
    description: '奇经八脉，调节十二正经',
    subcategories: [
      {
        name: '奇经八脉',
        description: '督脉、任脉、冲脉、带脉、阴跷脉、阳跷脉、阴维脉、阳维脉',
        meridians: ['督脉', '任脉', '冲脉', '带脉', '阴跷脉', '阳跷脉', '阴维脉', '阳维脉']
      }
    ]
  }
};