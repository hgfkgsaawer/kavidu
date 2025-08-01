const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const baseUrl = "https://api.sahas.tech"; // ✅ Replace with your working API endpoint
const MAX_DOWNLOAD_SIZE = 500 * 1024 * 1024; // 500MB

// File size formatter
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
    pattern: "gdrive2",
    alias: ["g"],
    react: '🎗️',
    desc: "Download Google Drive files",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname, reply }) => {
    if (!q || !q.startsWith("https://")) {
        return conn.sendMessage(from, {
            text: "❗ Please provide a valid Google Drive URL."
        }, { quoted: mek });
    }

    try {
        const data = await fetchJson(`${baseUrl}/api/gdrivedl?url=${encodeURIComponent(q)}`);
        const fileInfo = data.data || data;

        // File size
        const fileSize = parseInt(fileInfo.fileSizeBytes || fileInfo.fileSize || 0);
        const sizeText = formatFileSize(fileSize);

        // Too large?
        if (fileSize > MAX_DOWNLOAD_SIZE) {
            await conn.sendMessage(from, {
                text: `⚠️ File is too large.\n\n🔸 Max: ${formatFileSize(MAX_DOWNLOAD_SIZE)}\n🔹 This: ${sizeText}`
            }, { quoted: mek });

            return await conn.sendMessage(from, {
                react: { text: "⚠️", key: mek.key }
            });
        }

        // Document download
        const fileUrl = fileInfo.download || fileInfo.link || fileInfo.url;

        await conn.sendMessage(from, {
            document: { url: fileUrl },
            fileName: fileInfo.fileName || fileInfo.title || 'gdrive_file',
            mimetype: fileInfo.mimeType || fileInfo.file_type || 'application/octet-stream',
            caption: `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ Your Name ᴛᴇᴄʜ*`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (error) {
        console.error('❌ GDrive Downloader Error:', error);

        const errorMessage = (error.response && error.response.status === 404)
            ? '❌ File not found. Please check the URL.'
            : `❌ Error: ${error.message}`;

        await conn.sendMessage(from, { text: errorMessage }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});
