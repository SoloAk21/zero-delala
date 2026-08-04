import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import { ETHIOPIAN_REGIONS } from "@zero-delala/shared";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || "http://localhost:3000";

if (!BOT_TOKEN || BOT_TOKEN === "your_telegram_bot_token_here") {
  console.log("[Zero Delala Bot] Configured in Verification Mode.");
  console.log(
    `[Zero Delala Bot] Monorepo Shared Package linked successfully. Regions count: ${ETHIOPIAN_REGIONS.length}`,
  );
  console.log(
    "[Zero Delala Bot] Set TELEGRAM_BOT_TOKEN in bot/.env when ready to connect to Telegram live servers.",
  );
  process.exit(0);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const firstName = ctx.from?.first_name || "User";
  ctx.reply(
    `Welcome ${firstName} to Zero Delala (ዜሮ ደላላ)! 🏠\n\n` +
      `Discover verified Ethiopian real estate listings without commissions.`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("🚀 Open Zero Delala App", WEBAPP_URL)],
    ]),
  );
});

bot.help((ctx) => {
  ctx.reply("Use /start to open the Zero Delala Telegram Mini App.");
});

bot.launch().then(() => {
  console.log("[Zero Delala Bot] Bot is live and polling Telegram servers...");
});

// Enable graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
