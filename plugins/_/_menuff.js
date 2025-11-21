import fs from 'fs'
import os from 'os'

let handler = async (m, { conn, usedPrefix }) => {
  try {

    const vsIcons = {
      fem: "🌸",
      masc: "☠️",
      mixto: "⚡"
    }

    let text = `
╭━━━〔 🌸 Alya Bot 🌸 〕━━━╮
┃ 💫 Submenú: MENUFF
┃ 🧩 Categoría: INFO
┃ 🕒 Activo: ${clockString(process.uptime() * 1000)}
┃ ⚙️ Sistema: ${os.platform().toUpperCase()}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭───〔 LISTA VS 〕───────❐
┃ ${vsIcons.fem} VS Fem → ${usedPrefix}vs <hora> <am/pm> fem
┃ ${vsIcons.masc} VS Masc → ${usedPrefix}vs <hora> <am/pm> masc
┃ ${vsIcons.mixto} VS Mixto → ${usedPrefix}vs <hora> <am/pm> mixto
╰─────────────────────────❐

╭────〔 OTROS COMANDOS 〕────╮
┃ 💬 FFStalk → ${usedPrefix}ffstalk <id>
╰━━━━━━━━━━━━━━━━━━━━━━━⬣
`.trim()

    await conn.sendMessage(m.chat, { text }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error al mostrar el submenú MENUFF')
  }
}

handler.help = ['menuff']
handler.tags = ['info']
handler.command = /^menuff$/i

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}