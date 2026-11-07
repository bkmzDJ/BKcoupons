const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log('Переходим по ссылке API...');
  try {
    const response = await page.goto('https://orderapp.burgerkingrus.ru/api/v1/menu/coupons', { waitUntil: 'networkidle' });
    
    if (!response || !response.ok()) {
      throw new Error(`Сервер вернул статус ${response ? response.status() : 'нет ответа'}`);
    }
    
    const text = await response.text();
    if (!text.includes('"status"')) {
      throw new Error('Получен не JSON! WAF заблокировал запрос.');
    }
    const dir = path.join(__dirname, 'assets', 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, 'data.json'), text);
    console.log('✅ Данные успешно скачаны и сохранены в assets/data/data.json!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();