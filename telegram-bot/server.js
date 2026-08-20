/**
 * RADIAN CRM — Telegram Mini App Bot
 * 
 * Bu server:
 * 1. CRM preview.html faylini web app sifatida xizmat qiladi
 * 2. Telegram bot orqali /start buyrug'ini qabul qiladi
 * 3. Mini App tugmasini ko'rsatadi
 */

const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── Config ───
const BOT_TOKEN = process.env.BOT_TOKEN || '8712751583:AAGMMiZZRS80YAr2x6U4Bl8MWH39ufRjWeI';
const PORT = process.env.PORT || 3000;
const WEBAPP_URL = process.env.WEBAPP_URL || `http://localhost:${PORT}`;

// ─── Express Server ───
const app = express();
app.use(express.json());

// Serve CRM preview
app.use('/app', express.static(path.join(__dirname, '..', '.freebuff')));

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Radian CRM Bot',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      miniApp: `${WEBAPP_URL}/app/preview.html`,
      health: `${WEBAPP_URL}/health`
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Telegram Bot API Helper ───
function telegramAPI(method, body = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ─── Webhook Endpoint ───
app.post('/webhook', async (req, res) => {
  const update = req.body;

  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.from?.first_name || 'Foydalanuvchi';

    console.log(`📩 ${firstName}: ${text}`);

    if (text === '/start') {
      // Mini App tugmasi bilan start xabar
      await telegramAPI('sendMessage', {
        chat_id: chatId,
        text: `🏫 *Radian O'quv Markazi*\n\nXush kelibsiz, ${firstName}! 👋\n\nBizning CRM tizimini sinab ko'ring:`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 CRM ni ochish', web_app: { url: `${WEBAPP_URL}/app/preview.html` } }],
            [
              { text: '📚 Kurslar', callback_data: 'courses' },
              { text: '💰 Narxlar', callback_data: 'prices' }
            ],
            [
              { text: '🎓 Sinov darsi', callback_data: 'trial' },
              { text: '📞 Operator', callback_data: 'operator' }
            ]
          ]
        }
      });
    } else if (text === '/help') {
      await telegramAPI('sendMessage', {
        chat_id: chatId,
        text: `📋 *Radian CRM — Yordam*\n\n/start — Boshlash\n/app — CRM ochish\n/help — Yordam\n\n📞 Tel: +998 91 064 11 44`,
        parse_mode: 'Markdown'
      });
    }
  }

  // Callback query (inline tugmalar)
  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message.chat.id;
    const data = cq.data;

    await telegramAPI('answerCallbackQuery', { callback_query_id: cq.id });

    if (data === 'courses') {
      await telegramAPI('sendMessage', {
        chat_id: chatId,
        text: `📚 *Radian kurslari:*\n\n🧮 Matematika — 500K/oy\n🇬🇧 Ingliz tili — 400K/oy\n🎓 IELTS — 500K/oy\n📜 CEFR — 450K/oy\n⚛️ Fizika — 450K/oy\n🧪 Kimyo — 400K/oy\n🧬 Biologiya — 400K/oy\n📖 Ona tili — 350K/oy\n🏛 Tarix — 350K/oy\n⚖️ Huquqshunoslik — 400K/oy\n🇷🇺 Rus tili — 350K/oy\n🧠 Prezident maktabi — 600K/oy\n♟️ Shaxmat — 200K/oy\n💻 IT — 450K/oy`,
        parse_mode: 'Markdown'
      });
    } else if (data === 'prices') {
      await telegramAPI('sendMessage', {
        chat_id: chatId,
        text: `💰 *Narxlar:*\n\nBoshlang'ich: 200,000 - 350,000 so'm/oy\nO'rta: 400,000 - 500,000 so'm/oy\nPremium: 600,000 so'm/oy\n\n*To'lov usullari:*\n💵 Naqd\n💳 Terminal\n🏦 Bank o'tkazmasi`,
        parse_mode: 'Markdown'
      });
    } else if (data === 'trial') {
      await telegramAPI('sendMessage', {
        chat_id: chatId,
        text: `🎓 *Sinov darsi*\n\nBepul sinov darsi uchun:\n\n1. Ismingiz\n2. Telefon raqamingiz\n3. Qiziqish kursingiz\n\nYuboring, biz sizga qo'ng'iroq qilamiz! 📞`,
        parse_mode: 'Markdown'
      });
    } else if (data === 'operator') {
      await telegramAPI('sendMessage', {
        chat_id: chatId,
        text: `👨‍💼 *Operator*\n\n📞 +998 91 064 11 44\n📞 +998 95 064 11 44\n\n📍 Baliqchi tumani, Chinobod\n🕐 Dush-Shan: 08:00 - 20:00`,
        parse_mode: 'Markdown'
      });
    }
  }

  res.json({ ok: true });
});

// ─── Setup Bot Menu Button ───
async function setupBot() {
  console.log('🔧 Bot sozlanmoqda...');

  // Delete webhook first
  await telegramAPI('deleteWebhook');
  console.log('  ✅ Webhook o\'chirildi');

  // Get bot info
  const me = await telegramAPI('getMe');
  if (me.ok) {
    console.log(`  ✅ Bot: @${me.result.username}`);
    console.log(`  ✅ Nomi: ${me.result.first_name}`);
  }

  // Set menu button (Mini App) — try setChatMenuButton
  try {
    const menuResult = await telegramAPI('setChatMenuButton', {
      menu_button: JSON.stringify({ type: 'web_app', text: '🚀 Radian CRM' })
    });
    console.log(`  ${menuResult.ok ? '✅' : '❌'} Menu button: ${menuResult.ok ? 'Radian CRM' : menuResult.description}`);
  } catch(e) {
    console.log('  ⚠️ Menu button skipped (deploy first)');
  }

  // Set commands
  const cmdResult = await telegramAPI('setMyCommands', {
    commands: [
      { command: 'start', description: '🚀 Boshlash — CRM ochish' },
      { command: 'help', description: '📋 Yordam' }
    ]
  });
  console.log(`  ${cmdResult.ok ? '✅' : '❌'} Commands: start, help`);

  console.log('\n🎉 Bot tayyor!');
  console.log(`   Mini App: ${WEBAPP_URL}/app/preview.html`);
  console.log(`   Webhook: ${WEBAPP_URL}/webhook`);
}

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`\n🏫 Radian CRM Bot — Port ${PORT}`);
  console.log(`   Preview: ${WEBAPP_URL}/app/preview.html`);
  console.log(`   Webhook: ${WEBAPP_URL}/webhook\n`);

  setupBot().catch(console.error);
});
