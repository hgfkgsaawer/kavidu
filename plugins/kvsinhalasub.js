const l = console.log;
const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');
const NodeCache = require('node-cache');

const searchCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// WhatsApp document-card එකේ දිස්වන brand watermark එක
const BRAND = `${config.MOVIE_FOOTER}`;

cmd(
  {
    pattern: 'sinhalasub',
    react: '🎬',
    desc: 'Search and download Movies/TV Series',
    category: 'download',
    filename: __filename,
  },
  async (conn, mek, m, { from, q }) => {
    // User කියලා search term එකක් දුන්නෙ නැත්නම් usage info එක show කරනවා
    if (!q) {
      await conn.sendMessage(
        from,
        {
          text:
            '*🎬 Movie / TV Series Search*\n\n' +
            '📋 Usage: .sinhalasub <search term>\n' +
            '📝 Example: .sinhalasub Breaking Bad\n\n' +
            "*💡 Type Your Movie ㋡*",
        },
        { quoted: mek }
      );
      return;
    }

    try {
      // ────── 1. Search with cache ──────
      const cacheKey = `film_${q.toLowerCase()}`;
      let data = searchCache.get(cacheKey);

      if (!data) {
        const url = `https://apis.davidcyriltech.my.id/movies/search?query=${encodeURIComponent(q)}`;
        let retries = 3;

        while (retries--) {
          try {
            const r = await axios.get(url, { timeout: 10000 });
            data = r.data;
            break;
          } catch (e) {
            if (!retries) throw new Error('Failed to retrieve data');
            await new Promise((r) => setTimeout(r, 1000));
          }
        }

        if (!data?.status || !data.results?.length)
          throw new Error('No results found.');

        searchCache.set(cacheKey, data);
      }

      // results array එක process කරනවා
      const films = data.results.map((f, i) => ({
        n: i + 1,
        title: f.title,
        imdb: f.imdb,
        year: f.year,
        link: f.link,
        image: f.image,
      }));

      // results text එක build කරනවා
      let txt = '*🎬 SEARCH RESULTS*\n\n';
      for (const f of films) {
        txt += `🎥 ${f.n}. *${f.title}*\n  ⭐ IMDB: ${f.imdb}\n  📅 Year: ${f.year}\n\n`;
      }
      txt += '🔢 Select number 🪀';

      
      const listMsg = await conn.sendMessage(
        from,
        { image: { url: films[0].image }, caption: txt },
        { quoted: mek }
      );

      const waiting = new Map();

      
      const handler = async ({ messages }) => {
        const msg = messages?.[0];
        if (!msg?.message?.extendedTextMessage) return;
        const body = msg.message.extendedTextMessage.text.trim();
        const replyTo = msg.message.extendedTextMessage.contextInfo?.stanzaId;

        
        if (body.toLowerCase() === 'done') {
          conn.ev.off('messages.upsert', handler);
          waiting.clear();
          await conn.sendMessage(from, { text: 'OK.' }, { quoted: msg });
          return;
        }

      
        if (replyTo === listMsg.key.id) {
          const film = films.find((f) => f.n === parseInt(body));
          if (!film) {
            await conn.sendMessage(from, { text: '❌ Invalid number.' }, { quoted: msg });
            return;
          }

          
          const lUrl = `https://apis.davidcyriltech.my.id/movies/download?url=${encodeURIComponent(film.link)}`;
          let dl;
          let r = 3;
          while (r--) {
            try {
              dl = (await axios.get(lUrl, { timeout: 10000 })).data;
              if (!dl.status) throw new Error();
              break;
            } catch {
              if (!r) {
                await conn.sendMessage(from, { text: '❌ Fetch failed.' }, { quoted: msg });
                return;
              }
              await new Promise((d) => setTimeout(d, 1000));
            }
          }

          const links = dl.movie.download_links;

          
          const picks = [];
          const sd = links.find((x) => x.quality === 'SD 480p' && x.direct_download);
          const hd =
            links.find((x) => x.quality === 'HD 720p' && x.direct_download) ||
            links.find((x) => x.quality === 'FHD 1080p' && x.direct_download);

          if (sd) picks.push({ n: 1, q: 'SD', ...sd });
          if (hd) picks.push({ n: 2, q: 'HD', ...hd });

          if (!picks.length) {
            await conn.sendMessage(from, { text: '❌ No links.' }, { quoted: msg });
            return;
          }

          
          let qTxt = `*🎬 ${film.title}*\n\n📥 Choose Quality:\n\n`;
          for (const p of picks) qTxt += `${p.n}. *${p.q}* (${p.size})\n`;
          qTxt += '\n*~https://whatsapp.com/channel/0029Vb5xFPHGE56jTnm4ZD2k~*';

          const qMsg = await conn.sendMessage(
            from,
            { image: { url: dl.movie.thumbnail || film.image }, caption: qTxt },
            { quoted: msg }
          );

          waiting.set(qMsg.key.id, { film, picks });
          return;
        }

        
        if (waiting.has(replyTo)) {
          const { film, picks } = waiting.get(replyTo);
          const pick = picks.find((p) => p.n === parseInt(body));
          if (!pick) {
            await conn.sendMessage(from, { text: '❌ Wrong quality.' }, { quoted: msg });
            return;
          }

          
          const sz = pick.size.toLowerCase();
          const gb = sz.includes('gb') ? parseFloat(sz) : parseFloat(sz) / 1024;
          if (gb > 2) {
            await conn.sendMessage(
              from,
              { text: `⚠️ Too large. Direct link:\n${pick.direct_download}` },
              { quoted: msg }
            );
            return;
          }

          
          const safe = film.title.replace(/[\\/:*?"<>|]/g, '');
          const fname = `KAVI ツ • ${safe} • ${pick.q}.mp4`;

          try {
            await conn.sendMessage(
              from,
              {
                document: { url: pick.direct_download },
                mimetype: 'video/mp4',
                fileName: fname,
                caption: `🎬 *${film.title}*\n📊 Size: ${pick.size}\n\n${config.MOVIE_FOOTER}`,
              },
              { quoted: msg }
            );
            await conn.sendMessage(from, { react: { text: '✅', key: msg.key } });
          } catch {
            await conn.sendMessage(
              from,
              { text: `❌ Failed. Direct link:\n${pick.direct_download}` },
              { quoted: msg }
            );
          }
        }
      };

      // WhatsApp messages.upsert event එකට handler එක register කරනවා
      conn.ev.on('messages.upsert', handler);
    } catch (e) {
      console.error(e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
  }
);
