import axios from "axios"

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `✧ *Uso correcto:* ${usedPrefix + command} nombre|paterno|materno\n\n*Ejemplo:*\n${usedPrefix + command} jaimito|gonzales|rojas`, m)

    await m.react('🕓')

    try {
        let [nombre, paterno, materno] = text.split('|')
        if (!nombre || !paterno || !materno)
            return conn.reply(m.chat, `✧ Debes colocar: nombre|paterno|materno`, m)

        let url = `https://api.soymaycol.icu/search-peru-person?nombre=${encodeURIComponent(nombre)}&paterno=${encodeURIComponent(paterno)}&materno=${encodeURIComponent(materno)}&apikey=may-dcfcae78`

        let { data } = await axios.get(url)

        if (!data.status)
            return conn.reply(m.chat, `❌ *No se obtuvo respuesta correcta del servidor.*`, m)

        if (!data.result?.success)
            return conn.reply(m.chat, `❌ *No hubo coincidencias o el servidor no devolvió datos.*`, m)

        let resultados = data.result.data

        if (!resultados || resultados.length === 0)
            return conn.reply(m.chat, `🔍 *Búsqueda realizada*.\nNo se encontraron datos para:\n• Nombre: ${nombre}\n• Paterno: ${paterno}\n• Materno: ${materno}`, m)

        // FORMATO DE RESULTADO
        let msg = `✧ *Resultado de la búsqueda Perú*\n\n`
        msg += `• *Nombre buscado:* ${nombre}\n`
        msg += `• *Ap. Paterno:* ${paterno}\n`
        msg += `• *Ap. Materno:* ${materno}\n\n`
        msg += `*Coincidencias encontradas:* ${resultados.length}\n\n`

        for (let i of resultados) {
            msg += `─ ─ ─ ─ ─ ─ ─ ─\n`
            msg += `👤 *Nombre:* ${i.nombre || "No disponible"}\n`
            msg += `🆔 *DNI:* ${i.dni || "No disponible"}\n`
            msg += `📅 *Nacimiento:* ${i.fecha_nacimiento || "No disponible"}\n`
            msg += `🏠 *Dirección:* ${i.direccion || "No disponible"}\n`
        }

        await m.react('✅')
        conn.reply(m.chat, msg, m)

    } catch (e) {
        console.error(e)
        await m.react('❌')
        conn.reply(m.chat, `❌ *Error en el servidor o API caída.*`, m)
    }
}

handler.help = ['peru', 'buscarperu']
handler.tags = ['info']
handler.command = /^(peru|buscarperu|searchperu)$/i

export default handler
