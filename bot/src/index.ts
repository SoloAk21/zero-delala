import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { ETHIOPIAN_REGIONS, ADDIS_ABABA_SUBCITIES } from '@zero-delala/shared';
import { checkBackendHealth, syncUserWithBackend } from './services/api.js';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';

if (!BOT_TOKEN || BOT_TOKEN === 'your_telegram_bot_token_here') {
  (async () => {
    console.log('====================================================');
    console.log('[Zero Delala Bot] System Verification & Dry Run');
    console.log(`[Zero Delala Bot] Configured WebApp URL: ${WEBAPP_URL}`);
    console.log(
      `[Zero Delala Bot] Shared Regions: ${ETHIOPIAN_REGIONS.length} | Sub-cities: ${ADDIS_ABABA_SUBCITIES.length}`
    );

    const isBackendReachable = await checkBackendHealth();
    console.log(
      `[Zero Delala Bot] Backend Health Probe: ${isBackendReachable ? 'CONNECTED (http://localhost:5000)' : 'OFFLINE'}`
    );

    if (isBackendReachable) {
      const testSync = await syncUserWithBackend({
        telegramId: 1122334455,
        firstName: 'Teshome',
        lastName: 'Girma',
        username: 'teshome_g'
      });
      console.log(
        `[Zero Delala Bot] User Sync Test: ${testSync?.success ? 'SUCCESS (User Created in PostgreSQL)' : 'FAILED'}`
      );
    }

    console.log(
      '[Zero Delala Bot] Status: READY. Add TELEGRAM_BOT_TOKEN to bot/.env for live Telegram polling.'
    );
    console.log('====================================================');
    process.exit(0);
  })();
} else {
  const bot = new Telegraf(BOT_TOKEN);

  bot.start(async (ctx) => {
    const firstName = ctx.from?.first_name || 'በእኛ መተግበሪያ';

    // Non-blocking user sync to PostgreSQL
    if (ctx.from) {
      await syncUserWithBackend({
        telegramId: ctx.from.id,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username
      });
    }

    const welcomeMessage =
      `እንኳን ደህና መጡ ${firstName}! 🏠\n` +
      `Welcome to Zero Delala (ዜሮ ደላላ)!\n\n` +
      `Ethiopia's premier commission-free real estate platform. Discover residential, commercial, and land listings directly from verified owners.\n\n` +
      `የሚፈልጉትን ቤት ወይም መሬት ያለደላላ ክፍያ ያግኙ!`;

    return ctx.reply(
      welcomeMessage,
      Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Open Zero Delala App (መተግበሪያውን ክፈት)', WEBAPP_URL)],
        [
          Markup.button.callback('ℹ️ Help & Support', 'cmd_help'),
          Markup.button.webApp('⭐ Saved Listings', `${WEBAPP_URL}/saved`)
        ]
      ])
    );
  });

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

  bot.command('myproperties', (ctx) => {
    return ctx.reply(
      `🏢 Manage your real estate listings / የእርስዎን ንብረቶች ያስተዳድሩ:`,
      Markup.inlineKeyboard([
        [Markup.button.webApp('📋 Manage My Properties', `${WEBAPP_URL}/my-properties`)]
      ])
    );
  });

  bot.command('saved', (ctx) => {
    return ctx.reply(
      `❤️ Your bookmarked properties / የተቀመጡ ንብረቶች:`,
      Markup.inlineKeyboard([
        [Markup.button.webApp('⭐ View Saved Listings', `${WEBAPP_URL}/saved`)]
      ])
    );
  });

  bot.action('cmd_help', (ctx) => {
    ctx.answerCbQuery();
    return ctx.reply('Use /start or click "Launch App" to browse listings.');
  });

  bot.launch().then(() => {
    console.log('[Zero Delala Bot] Bot is live and listening on Telegram servers...');
  });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
