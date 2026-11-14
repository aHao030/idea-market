import type { Bounty } from '../types/bounty';

export const bounties: Bounty[] = [
  {
    id: 'bounty-campus-coffee', title: '让大学校园咖啡店成为跨专业相遇的地方', company: '屿光咖啡', companyInitials: '屿', industry: '连锁餐饮', category: '空间与体验',
    summary: '寻找一套低成本、可复制的门店活动方案，让学生愿意跨出同温层，而不是只来带走一杯咖啡。', budget: 50000, deadline: '2026-11-28', daysLeft: 17, proposals: 24, participantCount: 20, featured: true,
    deliverables: ['一份 14 天门店试运营方案', '现场物料与预算清单', '效果验证指标与复盘模板'], skills: ['活动策划', '校园社群', '空间运营'],
  },
  {
    id: 'bounty-senior-device', title: '帮助长辈独立完成第一次线上挂号', company: '和暖健康', companyInitials: '和', industry: '健康服务', category: '产品与服务',
    summary: '不改变医院现有系统，通过线下指引和家庭协作设计，降低 60 岁以上用户首次线上挂号的挫败感。', budget: 80000, deadline: '2026-12-03', daysLeft: 22, proposals: 18, participantCount: 15,
    deliverables: ['真实用户痛点观察记录', '适老化挂号指引原型', '不少于 10 人的试用报告'], skills: ['适老化设计', '用户研究', '服务设计'],
  },
  {
    id: 'bounty-factory-energy', title: '让小型工厂看得懂自己的电费单', company: '衡造工业', companyInitials: '衡', industry: '智能制造', category: 'AI 与数据',
    summary: '用现有电费数据发现可执行的节能机会，不需要接入复杂传感器，也不接受只讲趋势的宏大报告。', budget: 120000, deadline: '2026-12-10', daysLeft: 29, proposals: 11, participantCount: 10,
    deliverables: ['电费异常识别逻辑', '一页式工厂节能建议原型', '三家工厂的验证计划'], skills: ['数据分析', '能源管理', 'B 端产品'],
  },
  {
    id: 'bounty-bookstore-night', title: '独立书店打烊后的两小时还能做什么', company: '岛上书店', companyInitials: '岛', industry: '文化零售', category: '内容与社群',
    summary: '围绕书籍和附近居民设计夜间活动，兼顾收入、内容与社区关系，不办普通读书会。', budget: 30000, deadline: '2026-11-24', daysLeft: 13, proposals: 32, participantCount: 25,
    deliverables: ['三场夜间活动策划', '收支测算与人员分工', '可重复使用的招生素材'], skills: ['内容策划', '社群运营', '小型商业'],
  },
];
