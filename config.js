/**


 Copyright (C) 2025.
 Licensed under the  GPL-3.0 License;
 You may not sell this script.
 It is supplied in the hope that it may be useful.
 * @project_name : Free Bot script
 * @author : Malvin King <https://github.com/kingmalvn>
 * @description : A Multi-functional whatsapp bot script.
 * @version 3.0.0
 **/


const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "2J1nQC7S#m_07u0Q0V1hRcyVEiACg7bdp5iBks4H3gNLmSNyfa0Y",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
MODE: process.env.MODE || "public",
AUTO_VOICE: process.env.AUTO_VOICE || "false",
AUTO_STICKER: process.env.AUTO_STICKER || "false",
AUTO_REPLY: process.env.AUTO_REPLY || "false",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/sq9tvu.jpg",
MENU_IMG: process.env.MENU_IMG || "https://files.catbox.moe/sq9tvu.jpg",
ALIVE_MSG: process.env.ALIVE_MSG || "*😎 Hey How are you? 👻*\n\n*👊 KAVI-MD Whatsapp Bot Alive Now..!*\n\n> *ᴘᴏᴡᴇʀᴅ ʙʏ  ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ : )*",
ANTI_LINK: process.env.ANTI_LINK || "false",
ANTI_BAD: process.env.ANTI_BAD || "false",
PREFIX: process.env.PREFIX || ".",
FAKE_RECORDING: process.env.FAKE_RECORDING || "false",
FAKE_TYPING: process.env.FAKE_TYPING || "false",
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "true",
CURRENT_STATUS: process.env.CURRENT_STATUS || "true",
AUTO_REACT: process.env.AUTO_REACT || "false",
HEART_REACT: process.env.HEART_REACT || "false",
OWNER_REACT: process.env.OWNER_REACT || "truee",
BOT_NAME: process.env.BOT_NAME || "KAVI-MD",
OMDB_API_KEY: process.env.OMDB_API_KEY || "76cb7f39", // omdbapi.com
ANTI_DELETE: process.env.ANTI_DELETE || "true",
DELETEMSGSENDTO: process.env.DELETEMSGSENDTO === undefined ? '' : process.env.DELETEMSGSENDTO,
INBOX_BLOCK: process.env.INBOX_BLOCK || "false",
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "true",
LANGUAGE: process.env.LANGUAGE || "sinhala",
OWNER_NAME: process.env.OWNER_NAME || "Kavidu Rasanga",
FOOTER: process.env.FOOTER || "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ  👨‍💻*",
};
