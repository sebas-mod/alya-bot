import fs from 'fs'
import WSF from "wa-sticker-formatter";

var handler = async (m, {
    conn, 
    args, 
    text, 
    usedPrefix, 
    command
}) => {

    // Obtener texto desde args o mensaje citado
    let ps = text 
        ? text 
        : m.quoted?.text 
        || m.quoted?.caption 
        || m.quoted?.description 
        || '';

    if (!ps) {
        return m.reply(`*• Ejemplo :* ${usedPrefix + command} *[texto]*\n\n*• Ejemplo:* ${usedPrefix + command} stickerbrat`);
    }

    // API nueva que pasaste
    let url = `https://gawrgura-api.onrender.com/imagecreator/brat?text=${encodeURIComponent(ps)}`

    try {

        async function sticker(img, url, packname, author, categories = [""]) {
            const stickerMetadata = {
                type: "full",
                pack: packname,
                author,
                categories,
            };
            return await new WSF.Sticker(img ? img : url, stickerMetadata).build();
        }

        // Crear sticker desde la URL
        let stik = await sticker(null, url, "Alya Bot", "LuisSebas");

        await conn.sendFile(m.chat, stik, 'brat.webp', '', m);

    } catch (e) {
        console.log(e)
        return m.reply(`❌ Error al generar el sticker`)
    }
}

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^(brat)$/i;

export default handler;
