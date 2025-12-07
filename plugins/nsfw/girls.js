import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command }) => {

    m.reply("👩‍🦰 *Buscando una chica random...*");

    try {

        let api = `https://api.soymaycol.icu/girls?apikey=may-dcfcae78`;

        let res = await fetch(api);
        let json = await res.json();

        if (!json.status || !json.url) {
            return m.reply("❌ No se pudo obtener la imagen.");
        }

        let img = json.url;

        await conn.sendMessage(
            m.chat,
            {
                image: { url: img },
                caption: "✨ *Imagen random de una chica*"
            },
            { quoted: m }
        );

    } catch (e) {
        console.error(e);
        return m.reply("❌ Error al obtener la imagen.");
    }
};

handler.help = ['girls'];
handler.tags = ['nsfw'];
handler.nsfw = true
handler.command = /^(girls|girl)$/i;

export default handler;
