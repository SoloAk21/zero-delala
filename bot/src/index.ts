import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';
import { syncUserWithBackend } from './services/api.js';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://zero-delala.vercel.app';

if (!BOT_TOKEN) {
  console.error('[Zero Delala Bot] Error: TELEGRAM_BOT_TOKEN is missing in environment variables.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Main /start Command
bot.start((ctx) => {
  const firstName = ctx.from?.first_name || 'በእኛ መተግበሪያ';

  const welcomeMessage =
    `እንኳን ደህና መጡ ${firstName}! 🏠\n` +
    `Welcome to Zero Delala (ዜሮ ደላላ)!\n\n` +
    `Ethiopia's premier commission-free real estate platform. Discover residential, commercial, and land listings directly from verified owners.\n\n` +
    `መተግበሪያውን ለመጠቀም እና ነፃ የቤት መለጠፊያ ኩፖን ለማግኘት እባክዎ ስልክ ቁጥርዎን ያጋሩ፡`;

  // Request native Telegram phone number contact sharing
  return ctx.reply(
    welcomeMessage,
    Markup.keyboard([
      [Markup.button.contactRequest('📱 Share Phone Number to Register (ስልክ ቁጥር አጋራ)')]
    ])
      .oneTime()
      .resize()
  );
});

// Handle Native Telegram Contact Sharing Event
bot.on('contact', async (ctx) => {
  const contact = ctx.message.contact;
  if (!contact) return;

  const telegramId = contact.user_id || ctx.from?.id;
  const phoneNumber = contact.phone_number.startsWith('+')
    ? contact.phone_number
    : `+${contact.phone_number}`;
  const firstName = contact.first_name || ctx.from?.first_name || 'User';
  const lastName = contact.last_name || ctx.from?.last_name || '';
  const username = ctx.from?.username || '';

  // Sync real user profile to PostgreSQL database
  const syncResult = await syncUserWithBackend({
    telegramId,
    phoneNumber,
    firstName,
    lastName,
    username
  });

  const successMessage =
    `የእርስዎ ስልክ ቁጥር (${phoneNumber}) በተሳካ ሁኔታ ተመዝግቧል! ✅\n` +
    `Your phone number has been verified successfully!\n\n` +
    `You have received 1 Free Listing Credit. Tap below to open Zero Delala:`;

  return ctx.reply(
    successMessage,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Open Zero Delala App (መተግበሪያውን ክፈት)', WEBAPP_URL)],
      [
        Markup.button.callback('ℹ️ Help & Support', 'cmd_help'),
        Markup.button.webApp('⭐ Saved Listings', `${WEBAPP_URL}/saved`)
      ]
    ])
  );
});

// Help Command
bot.help((ctx) => {
  const helpText =
    `📖 Zero Delala Guide | መመሪያ:\n\n` +
    `1. Click "Open Zero Delala App" to search properties across all Ethiopian regions.\n` +
    `2. Post your property directly with zero commission.\n` +
    `3. Filter by Addis Ababa sub-cities, prices, and verified owner tags.\n\n` +
    `For support or inquiries: @zerodelala_support`;

  return ctx.reply(
    helpText,
    Markup.inlineKeyboard([[Markup.button.webApp('🚀 Launch App Now', WEBAPP_URL)]])
  );
});

// /myproperties Command
bot.command('myproperties', (ctx) => {
  return ctx.reply(
    `🏢 Manage your real estate listings / የእርስዎን ንብረቶች ያስተዳድሩ:`,
    Markup.inlineKeyboard([
      [Markup.button.webApp('📋 Manage My Properties', `${WEBAPP_URL}/my-properties`)]
    ])
  );
});

// /saved Command
bot.command('saved', (ctx) => {
  return ctx.reply(
    `❤️ Your bookmarked properties / የተቀመጡ ንብረቶች:`,
    Markup.inlineKeyboard([[Markup.button.webApp('⭐ View Saved Listings', `${WEBAPP_URL}/saved`)]])
  );
});

// Callback Query Handler for Help Button
bot.action('cmd_help', (ctx) => {
  ctx.answerCbQuery();
  return ctx.reply('Use /start or click "Launch App" to browse listings.');
});

// Launch Telegraf Bot Polling
bot.launch().then(() => {
  console.log('[Zero Delala Bot] Live production bot listening on Telegram servers...');
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
