import { Image, GamepadIcon, FileText, Bookmark } from 'lucide-react';

// 分类常量
export const CATEGORIES = [
  { value: '文本', label: '文本', icon: FileText },
  { value: '图片', label: '图片', icon: Image },
  { value: '游戏', label: '游戏', icon: GamepadIcon },
  { value: '其他', label: '其他', icon: Bookmark },
];

// 链接选项 - 从各个模块中获取的真实数据
export const LINK_OPTIONS = {
  '文本': [
    { value: '/subpackages/text/translate', label: '智能翻译' },
    { value: '/subpackages/text/title', label: '标题生成' },
    { value: '/subpackages/text/summary', label: '文本摘要' },
    { value: '/subpackages/text/rewrite', label: '文本改写' },
    { value: '/subpackages/text/converter', label: '单位换算' },
  ],
  '图片': [
    { value: '/subpackages/image/generate', label: 'AI 图片生成' },
    { value: '/subpackages/image/avatar', label: 'AI 头像生成' },
    { value: '/subpackages/image/background-removal', label: 'AI 智能抠图' },
    { value: '/subpackages/image/resize', label: '图片尺寸调整' },
    { value: '/subpackages/image/crop', label: '图片裁剪' },
    { value: '/subpackages/image/cat', label: '我爱看猫猫' },
    { value: '/subpackages/image/poster', label: 'AI 海报生成' },
  ],
  '游戏': [
    { value: '/subpackages/games/snake', label: '贪吃蛇' },
    { value: '/subpackages/games/sokoban', label: '推箱子' },
    { value: '/subpackages/games/number-puzzle', label: '数字华容道' },
    { value: '/subpackages/games/coupahoo', label: 'CoupAhoo' },
    { value: '/subpackages/games/bubble-burst', label: 'Bubble Burst' },
    { value: '/subpackages/games/the-way-of-the-dodo', label: 'The Way of the Dodo' },
    { value: '/subpackages/games/path-to-glory', label: 'Path to Glory' },
  ],
  '其他': [
    { value: '/subpackages/tools/openrouter-chat', label: 'OpenRouter 聊天' },
    { value: '/subpackages/tools/effects', label: '特效样式展示' },
    { value: '/subpackages/tcm/constitution', label: '体质测试' },
    { value: '/subpackages/tcm/meridian', label: '经络穴位' },
    { value: '/subpackages/tcm/herbs', label: '中药百科' },
    { value: '/subpackages/tcm/wellness', label: '养生建议' },
    { value: '/subpackages/tcm/knowledge', label: '中医知识' },
    { value: '/subpackages/music/generate', label: 'AI 音乐生成' },
  ],
};