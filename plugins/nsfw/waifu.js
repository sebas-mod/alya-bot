import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command }) => {

    m.reply("👾 *Generando waifu...*");

    try {

        let api = `https://api.soymaycol.icu/waifu?apikey=may-dcfcae78`;

        let res = await fetch(api);
        let json = await res.json();

        if (!json.status || !json.url) {
            return m.reply("❌ No se pudo obtener la waifu.");
        }

        let img = json.url;

        await conn.sendMessage(
            m.chat,
            {
                image: { url: img },
                caption: "✨ *Tu waifu random está aquí*"
            },
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        return m.reply("❌ Error al generar la waifu.");
    }
};

handler.help = ['waifu'];
handler.tags = ['nsfw'];
handler.command = /^(waifu|wifu)$/i;

export default handler;
