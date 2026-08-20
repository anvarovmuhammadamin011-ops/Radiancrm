/**
 * RADIAN CRM — Telegram Mini App Bot (Polling Mode)
 *
 * Kompyuter yoqilgan bo'lsa, bot 24/7 ishlaydi.
 * PM2 bilan avtomatik qayta ishga tushiriladi.
 */

const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');

// ─── Config ───
const BOT_TOKEN = process.env.BOT_TOKEN || '8712751583:AAGMMiZZRS80YAr2x6U4Bl8MWH39ufRjWeI';
const PORT = process.env.PORT || 3000;
const WEBAPP_URL = process.env.WEBAPP_URL || `http://localhost:${PORT}`;
// Telegram Mini App uchun HTTPS URL (GitHub Pages)
const MINIAPP_URL = process.env.MINIAPP_URL || 'https://anvarovmuhammadamin011-ops.github.io/Radiancrm/app/preview.html';

// ─── Telegram API ───
function tg(method, body = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ─── Courses ───
const COURSES = [
  '🧮 Matematika — 500,000 so\'m/oy',
  '🇬🇧 Ingliz tili — 400,000 so\'m/oy',
  '🎓 IELTS — 500,000 so\'m/oy',
  '📜 CEFR — 450,000 so\'m/oy',
  '⚛️ Fizika — 450,000 so\'m/oy',
  '🧪 Kimyo — 400,000 so\'m/oy',
  '🧬 Biologiya — 400,000 so\'m/oy',
  '📖 Ona tili — 350,000 so\'m/oy',
  '🏛 Tarix — 350,000 so\'m/oy',
  '⚖️ Huquqshunoslik — 400,000 so\'m/oy',
  '🇷🇺 Rus tili — 350,000 so\'m/oy',
  '🧠 Prezident maktabi — 600,000 so\'m/oy',
  '♟️ Shaxmat — 200,000 so\'m/oy',
  '💻 IT — 450,000 so\'m/oy',
];

// ─── Bot Logic ───
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = msg.text;
  const name = msg.from?.first_name || 'Foydalanuvchi';

  console.log(`[${new Date().toLocaleTimeString()}] 📩 ${name} (${chatId}): ${text}`);

  if (text === '/start') {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `🏫 *Radian O'quv Markazi*\n\nXush kelibsiz, ${name}! 👋\nKELAJAK BIZ BILAN 🟢\n\nCRM tizimini sinab ko'ring:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 CRM ni ochish', web_app: { url: MINIAPP_URL } }],
          [{ text: '📚 Kurslar', callback_data: 'courses' }, { text: '💰 Narxlar', callback_data: 'prices' }],
          [{ text: '🎓 Sinov darsi', callback_data: 'trial' }, { text: '📞 Operator', callback_data: 'contact' }]
        ]
      }
    });
  } else if (text === '/help') {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `📋 *Buyruqlar:*\n\n/start — Bosh sahifa\n/help — Yordam\n\n📞 +998 91 064 11 44\n📍 Baliqchi, Chinobod`,
      parse_mode: 'Markdown'
    });
  }
}

async function handleCallback(cq) {
  const chatId = cq.message.chat.id;
  await tg('answerCallbackQuery', { callback_query_id: cq.id });

  const responses = {
    courses: `📚 *Radian kurslari:*\n\n${COURSES.join('\n')}\n\n🎓 14 ta fan — tanlang!`,
    prices: `💰 *Narxlar:*\n\nBoshlang'ich: 200K - 350K so'm/oy\nO'rta: 400K - 500K so'm/oy\nPremium: 600K so'm/oy\n\n*To'lov:* 💵 Naqd · 💳 Terminal · 🏦 O'tkazma`,
    trial: `🎓 *Bepul sinov darsi!*\n\nIsmingiz, telefon raqamingiz va qiziqish kursingizni yuboring.\nBiz sizga qo'ng'iroq qilamiz! 📞`,
    contact: `📞 *Radian O'quv Markazi*\n\n+998 91 064 11 44\n+998 95 064 11 44\n\n📍 Baliqchi tumani, Chinobod\n🕐 Dush-Shan: 08:00 - 20:00`
  };

  if (responses[cq.data]) {
    await tg('sendMessage', { chat_id: chatId, text: responses[cq.data], parse_mode: 'Markdown' });
  }
}

// ─── Long Polling ───
let offset = 0;
let running = true;

async function poll() {
  while (running) {
    try {
      const res = await tg('getUpdates', {
        offset: offset,
        timeout: 30,
        allowed_updates: ['message', 'callback_query']
      });

      if (res.ok && res.result.length > 0) {
        for (const update of res.result) {
          offset = update.update_id + 1;
          if (update.message) await handleMessage(update.message);
          if (update.callback_query) await handleCallback(update.callback_query);
        }
      }
    } catch (e) {
      console.error(`[${new Date().toLocaleTimeString()}] ❌ Poll error:`, e.message);
      await new Promise(r => setTimeout(r, 5000)); // 5s retry
    }
  }
}

// ─── Mini App Server ───
const app = express();
app.use(express.json());
app.use('/app', express.static(path.join(__dirname, '..', '.freebuff')));
app.get('/', (req, res) => res.json({ name: 'RadianBot', status: 'ok', mode: 'polling' }));
app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

// ─── Start ───
async function start() {
  console.log('');
  console.log('🏫 ═══════════════════════════════════════');
  console.log('   RADIAN CRM — Telegram Bot');
  console.log('   KELAJAK BIZ BILAN 🟢');
  console.log('═════════════════════════════════════════');

  // Delete webhook (we use polling)
  await tg('deleteWebhook');
  console.log('  ✅ Webhook o\'chirildi (polling rejimi)');

  // Set menu button
  const mb = await tg('setChatMenuButton', {
    menu_button: { type: 'web_app', text: '🚀 Radian CRM', web_app: { url: MINIAPP_URL } }
  });
  console.log(`  ${mb.ok ? '✅' : '❌'} Menu button: ${mb.ok ? 'Radian CRM' : mb.description}`);

  // Set commands
  await tg('setMyCommands', {
    commands: [
      { command: 'start', description: '🚀 CRM ochish' },
      { command: 'help', description: '📋 Yordam' }
    ]
  });
  console.log('  ✅ Commands: /start, /help');

  // Bot info
  const me = await tg('getMe');
  if (me.ok) console.log(`  ✅ Bot: @${me.result.username}`);

  // Start HTTP server for Mini App
  app.listen(PORT, () => {
    console.log(`  ✅ Mini App: ${WEBAPP_URL}/app/preview.html`);
    console.log('');
    console.log('🟢 24/7 ISHLAYAPTI! (Polling rejimi)');
    console.log('   Botni to\'xtatish uchun: Ctrl+C');
    console.log('═════════════════════════════════════════\n');
  });

  // Start polling
  poll();
}

// Graceful shutdown
process.on('SIGINT', () => { running = false; process.exit(0); });
process.on('SIGTERM', () => { running = false; process.exit(0); });

start().catch(console.error);
