import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command }) => {

    m.reply("🔞 *Buscando video hentai...*");

    try {

        // API que pasaste
        let api = `https://api.soymaycol.icu/hentaivid?apikey=may-dcfcae78`;

        let res = await fetch(api);
        let json = await res.json();

        // Validar respuesta
        if (!json.status || !json.video?.link) {
            return m.reply("❌ No se pudo obtener el video.");
        }

        let title = json.video.title || "Hentai Video";
        let video = json.video.link;

        // Enviar video
        await conn.sendMessage(
            m.chat,
            {
                video: { url: video },
                caption: `🔞 *${title}*`
            },
            { quoted: m }
        );

    } catch (e) {
        console.log(e);
        return m.reply("❌ Error al obtener el video.");
    }
};

handler.help = ['hentaivid'];
handler.tags = ['nsfw'];
handler.command = /^(hentaivid|hvideo|hentai)$/i;

export default handler;
