import fetch from 'node-fetch'

var handler = async (m, { conn, args, usedPrefix, command }) => {

    // Obtener imagen desde mensaje citado o texto
    let img;

    // Si envía o cita una imagen
    if (m.quoted && m.quoted.mime?.startsWith('image/')) {
        img = await m.quoted.download();
    } else if (m.mime?.startsWith('image/')) {
        img = await m.download();
    }

    // Si no hay imagen, intentar URL desde args
    let url = args[0] ? args[0] : null;

    if (!img && !url) {
        return m.reply(`*• Debe enviar o citar una imagen, o poner un link*\n\n*Ejemplo:* ${usedPrefix + command} https://files.catbox.moe/kppli7.png`);
    }

    // Si la imagen fue enviada, la subimos a un hosting temporal
    if (img) {
        try {
            let upl = await conn.uploadFile(img);
            url = upl;
        } catch (e) {
            return m.reply("❌ Error al subir la imagen.");
        }
    }

    try {
        m.reply("🎨 *Procesando imagen... espere un momento*");

        const api = `https://gawrgura-api.onrender.com/imagecreator/colorize?url=${encodeURIComponent(url)}`;

        let res = await fetch(api);
        let json = await res.json();

        if (!json.status || !json.result) {
            return m.reply("❌ Error procesando la imagen.");
        }

        // Enviar imagen coloreada
        await conn.sendMessage(
            m.chat,
            { image: { url: json.result }, caption: `✨ Imagen coloreada` },
            { quoted: m }
        );

    } catch (e) {
        console.log(e)
        m.reply("❌ Error al obtener el resultado de la API.");
    }
};

handler.help = ['colorize *<imagen|url>*'];
handler.tags = ['tools', 'image'];
handler.command = /^colorize|coloriceimage|colorice$/i;

export default handler;
