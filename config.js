const fs = require('fs');

const configPath = './config.json';

global.CONFIG = {};

if (fs.existsSync(configPath)) {
    global.CONFIG = JSON.parse(fs.readFileSync(configPath));
} else {
    global.CONFIG = {
        SESSION_ID: "Your session",
        AUTO_READ_STATUS: "true",
        MODE: "public",
        AUTO_VOICE: "false",
        AUTO_STICKER: "false",
        AUTO_REPLY: "false",
        ALIVE_IMG: "https://files.catbox.moe/sq9tvu.jpg",
        MENU_IMG: "https://files.catbox.moe/sq9tvu.jpg",
        ALIVE_MSG: "*😎 Hey How are you? 👻*\n\n*👊 KAVI-MD Whatsapp Bot Alive Now..!*\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ : )*",
        ANTI_LINK: "false",
        ANTI_BAD: "false",
        PREFIX: ".",
        FAKE_RECORDING: "false",
        FAKE_TYPING: "false",
        ALWAYS_ONLINE: "true",
        CURRENT_STATUS: "true",
        AUTO_REACT: "false",
        HEART_REACT: "false",
        OWNER_REACT: "true",
        OWNER_NUMBER: "94727487353",
        OWNER_EMOJI: "☘️",
        BOT_NAME: "*KAVI-MD*",
        OMDB_API_KEY: "76cb7f39",
        ANTI_DELETE: "false",
        DELETEMSGSENDTO: "",
        INBOX_BLOCK: "false",
        AUTO_STATUS_REACT: "true",
        AUTO_STATUS_REPLY: "true",
        OWNER_NAME: "Kavidu Rasanga",
        FOOTER: "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ  👨‍💻*",
        MOVIE_FOOTER: "*YOUR MOVIE NAME 🥚*"
    };
    fs.writeFileSync(configPath, JSON.stringify(global.CONFIG, null, 2));
}

module.exports = global.CONFIG;
