import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'school',
    title: '孩子不想上学',
    category: '校园生活',
    icon: 'school',
    description: '练习当孩子说“讨厌学校”并且早晨拒绝出门时的应对方式。',
    initialMessage: '我今天不想去学校了，烦死了！',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'door',
    title: '孩子关门不沟通',
    category: '隐私与界限',
    icon: 'door_front',
    description: '孩子在争吵后锁上房门拒绝交谈。你该如何重建联系？',
    initialMessage: '（门紧锁着，里面传来声音）你别管我！我不想和你说话！',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'phone',
    title: '孩子玩手机很晚',
    category: '屏幕时间',
    icon: 'smartphone',
    description: '凌晨两点，你发现明天有考试的孩子还在玩手机。',
    initialMessage: '哎呀我知道了，打完这局就睡！你别烦我了！',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop'
  }
];
