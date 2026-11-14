import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const consoleErrors: string[] = [];
const missingResponses: string[] = [];

test.beforeEach(async ({ page }, testInfo) => {
  consoleErrors.length = 0;
  missingResponses.length = 0;
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('response', (response) => { if (response.status() === 404) missingResponses.push(response.url()); });
  await mkdir('artifacts', { recursive: true });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /好点子/ })).toBeVisible();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-home.png`, fullPage: true });
});

test.afterEach(async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow, '页面不应出现横向溢出').toBe(false);
  expect(consoleErrors, '浏览器控制台不应有错误').toEqual([]);
  expect(missingResponses, '不应有 404 请求').toEqual([]);
});

test('搜索、购买解锁、发布和个人中心完整流程', async ({ page }, testInfo) => {
  await page.getByRole('button', { name: '发现', exact: true }).click();
  await page.getByRole('textbox', { name: '筛选点子' }).fill('AI');
  await expect(page.locator('.idea-card')).toHaveCount(2);
  await page.getByRole('textbox', { name: '筛选点子' }).fill('不存在的点子');
  await expect(page.getByRole('heading', { name: '这颗火花还没被找到' })).toBeVisible();
  await page.getByRole('button', { name: '查看全部点子' }).click();
  await expect(page.locator('.idea-card')).toHaveCount(6);

  await page.getByRole('button', { name: '首页', exact: true }).click();
  await page.getByRole('button', { name: '查看点子：让旧物重获新生的社区交换计划' }).click();
  await expect(page.getByRole('heading', { name: '先读一点，再决定' })).toBeVisible();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-detail-locked.png`, fullPage: true });
  await page.getByRole('button', { name: '收藏', exact: true }).click();
  await expect(page.getByRole('button', { name: '已收藏', exact: true })).toBeVisible();

  const unlockButton = page.getByRole('button', { name: '¥ 29.9 解锁完整方案' });
  await unlockButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await unlockButton.click();
  await expect(page.locator('.purchase-fee-details')).toContainText('点子创作者');
  await expect(page.locator('.purchase-fee-details')).toContainText('¥ 20.93');
  await expect(page.locator('.purchase-fee-details')).toContainText('¥ 2.99');
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-purchase.png`, animations: 'disabled' });
  await page.getByRole('button', { name: '确认支付 ¥ 29.9' }).click();
  await expect(page.getByRole('heading', { name: '灵感已解锁。' })).toBeVisible();
  await page.getByRole('button', { name: '开始阅读完整方案' }).click();
  await expect(page.getByRole('heading', { name: '完整点子说明书' })).toBeVisible();
  await expect(page.getByText('第一天先访谈 8 位居民', { exact: false })).toBeVisible();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-detail-unlocked.png`, fullPage: true });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /社区交换海报.pdf/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('示例.txt');

  await page.getByRole('button', { name: '发布', exact: true }).click();
  await page.getByRole('button', { name: '继续', exact: true }).click();
  await expect(page.getByText('标题至少需要 6 个字')).toBeVisible();
  await page.getByPlaceholder('例如：把小票变成家庭账本的 AI 收纳员').fill('给老街做一张声音散步地图');
  await page.getByPlaceholder('它帮助谁，解决什么问题？为什么值得花一次下午去尝试？').fill('帮助第一次来到老街的游客，用二十分钟听见店铺、居民和城市变化的故事。');
  await page.getByRole('button', { name: '继续', exact: true }).click();
  await page.locator('.details-textarea').fill('先选择一条五百米以内的路线，采访三家老店和两位常住居民，把声音按地点标记。第一版只需一张纸质地图和六段音频，预算控制在三百元以内。邀请五位游客实际走一次，记录他们是否愿意停留、分享和再次推荐，并根据反馈调整路线与讲解长度。');
  await page.getByRole('button', { name: '继续', exact: true }).click();
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-publish.png`, fullPage: true });
  await page.getByRole('button', { name: '确认模拟发布' }).click();
  await expect(page.getByRole('heading', { name: /你的点子/ })).toBeVisible();

  await page.getByRole('button', { name: '我的', exact: true }).click();
  await page.getByRole('tab', { name: /我的发布/ }).click();
  await expect(page.getByText('模拟发布成功', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: /已购点子/ }).click();
  await expect(page.locator('.idea-card')).toHaveCount(2);
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-profile.png`, fullPage: true });
});


test('企业悬赏、投标和发布计算器完整流程', async ({ page }, testInfo) => {
  await page.getByRole('button', { name: '悬赏', exact: true }).click();
  await expect(page.getByRole('heading', { name: /把真实难题/ })).toBeVisible();
  await expect(page.locator('.bounty-card')).toHaveCount(4);
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-bounty-hall.png`, fullPage: true, animations: 'disabled' });

  await page.getByRole('button', { name: '查看悬赏并投标' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.bid-reward-heading')).toContainText('¥ 50,000');
  await expect(page.locator('.bid-sheet .revenue-breakdown')).toContainText('¥ 35,000');
  await expect(page.locator('.bid-sheet .revenue-breakdown')).toContainText('¥ 5,000');
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-bounty-detail.png`, animations: 'disabled' });
  await page.getByRole('button', { name: '提交我的方案' }).click();
  await page.getByRole('button', { name: '确认模拟投标' }).click();
  await expect(page.getByText('请用至少 30 个字说明你的解决思路')).toBeVisible();
  await page.getByPlaceholder('先说最关键的判断，再写第一步如何做。正式投标可继续补充完整方案与附件。').fill('先在两家门店开展为期一周的跨专业主题桌测试，通过课程时间表匹配不同专业的学生，再用真实到店和二次参与数据决定是否扩大。');
  await page.getByRole('button', { name: '确认模拟投标' }).click();
  await expect(page.getByRole('heading', { name: '方案已投递。' })).toBeVisible();
  await page.getByRole('button', { name: '返回悬赏大厅' }).click();
  await expect(page.getByText('已投标', { exact: true })).toBeVisible();

  await page.getByRole('tab', { name: '发布悬赏' }).click();
  await page.getByPlaceholder('例如：让社区食堂吸引更多年轻人').fill('让社区食堂成为年轻人愿意常来的地方');
  await page.getByPlaceholder('你的企业名称').fill('邻里餐桌');
  await page.getByPlaceholder('目前遇到了什么问题？谁受到影响？已经尝试过什么？希望投标者交付哪些具体结果？').fill('社区食堂目前主要服务老年居民，晚间时段大量空位闲置。希望获得不改变厨房和菜单的低成本运营方案，吸引附近年轻上班族，并给出两周试点步骤、预算和验证指标。');
  await page.getByLabel('悬赏总额（元）').fill('100000');
  await page.getByLabel('预计有效投标人数').fill('20');
  const calculator = page.locator('.bounty-calculator');
  await expect(calculator).toContainText('¥ 70,000');
  await expect(calculator).toContainText('¥ 10,000');
  await expect(calculator).toContainText('约 ¥500/人');
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-bounty-publish.png`, fullPage: true, animations: 'disabled' });
  await page.getByRole('button', { name: '确认模拟发布' }).click();
  await expect(page.getByRole('heading', { name: '让社区食堂成为年轻人愿意常来的地方' })).toBeVisible();
  await expect(page.locator('.bounty-card')).toHaveCount(5);
});
