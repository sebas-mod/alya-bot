import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command }) => {

    m.reply("🎥 *Buscando video random...*");

    try {

        let api = `https://api.soymaycol.icu/girlsvid?apikey=may-dcfcae78`;

        let res = await fetch(api);
        let json = await res.json();

        if (!json.status || !json.url) {
            return m.reply("❌ No se pudo obtener el video.");
        }

        let vid = json.url;

        await conn.sendMessage(
            m.chat,
            {
                video: { url: vid },
                caption: `✨ *Video random de chicas*`
            },
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        return m.reply("❌ Error al obtener el video.");
    }
};

handler.help = ['girlsvid'];
handler.tags = ['nsfw'];
handler.command = /^(girlsvid|girlvid|gvid)$/i;s

export default handler;
