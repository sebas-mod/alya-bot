import WSF from "wa-sticker-formatter";

var handler = async (m, { conn, args, text, usedPrefix, command }) => {

    // Obtener texto desde args o mensaje citado
    let ps = text 
        ? text 
        : m.quoted?.text 
        || m.quoted?.caption 
        || m.quoted?.description 
        || '';

    if (!ps) {
        return m.reply(`*• Ejemplo :* ${usedPrefix + command} stickerbrat`);
    }

    // Tu API KEY
    let apikey = "may-dcfcae78";

    // API con api key incluida
    let apiUrl = `https://gawrgura-api.onrender.com/imagecreator/brat?apikey=${apikey}&text=${encodeURIComponent(ps)}`;

    try {

        const sticker = new WSF.Sticker(apiUrl, {
            pack: "Alya Bot",
            author: "LuisSebas",
            type: "full"
        });

        const build = await sticker.build();

        await conn.sendFile(m.chat, build, "brat.webp", "", m);

    } catch (e) {
        console.log(e);
        return m.reply("❌ *Error al generar el sticker.*");
    }
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^(brat)$/i;

export default handler;
