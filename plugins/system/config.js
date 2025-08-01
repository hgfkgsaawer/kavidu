const fs = require('fs');
const configFile = './config.json';
const { cmd } = require('../lib/command');

function saveConfig() {
    fs.writeFileSync(configFile, JSON.stringify(global.CONFIG, null, 2));
}

cmd({
  pattern: "config",
  desc: "Get or update config values",
  category: "owner",
  filename: __filename,
  use: ".config get/set/reset key value"
}, async (conn, m, text, { reply, isOwner }) => {
  if (!isOwner) return reply("⛔ Only owner can use this!");

  if (!text) {
    return reply("📌 Usage:\n.config get <key>\n.config set <key> <value>\n.config reset");
  }

  const [action, key, ...valueArr] = text.trim().split(" ");
  const value = valueArr.join(" ");

  switch (action.toLowerCase()) {
    case "get":
      if (!key) return reply("❗ Usage: .config get <key>");
      const val = global.CONFIG[key];
      reply(val !== undefined ? `🔧 *${key}* = \`${val}\`` : "⚠️ Key not found.");
      break;

    case "set":
      if (!key || !value) return reply("❗ Usage: .config set <key> <value>");
      global.CONFIG[key] = value;
      saveConfig();
      reply(`✅ *${key}* updated to \`${value}\``);
      break;

    case "reset":
      try {
        if (fs.existsSync(configFile)) {
          fs.unlinkSync(configFile);
          global.CONFIG = require('../../config'); // Reload defaults
          reply("♻️ Config reset to defaults. Restart bot recommended.");
        } else {
          reply("⚠️ Config file not found.");
        }
      } catch (e) {
        reply("❌ Error resetting config.");
      }
      break;

    default:
      reply("❌ Invalid action. Use `get`, `set`, or `reset`.");
  }
});
