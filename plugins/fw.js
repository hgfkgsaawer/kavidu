const { cmd } = require('..command');
const os = require("os");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, Func, fetchJson } = require('../lib/functions');
const axios = require('axios');
const config = require('../config');
const mimeType = require('mime-types');

cmd({
    pattern: "forward",
    desc: "Forward quoted message to a JID",
    alias: ["fo"],
    category: "owner",
    use: '.forward <jid>',
    filename: __filename
}, async (conn, mek, m, {
    args, q, isOwner, reply
}) => {
    if (!isOwner) return reply("*Owner Only ❌*");
    if (!q || !m.quoted) return reply("*Give me a quoted message and JID address ❌*");

    let message = {};
    message.key = mek.quoted?.fakeObj?.key;

    if (mek.quoted?.documentWithCaptionMessage?.message?.documentMessage) {
        let mime = mek.quoted.documentWithCaptionMessage.message.documentMessage.mimetype;
        let ext = mimeType.extension(mime);
        mek.quoted.documentWithCaptionMessage.message.documentMessage.fileName =
            mek.quoted.documentWithCaptionMessage.message.documentMessage.caption + "." + ext;
    }

    message.message = mek.quoted;

    await conn.forwardMessage(q, message, true);
    return reply(`*✅ Message forwarded to:* ${q}`);
});
