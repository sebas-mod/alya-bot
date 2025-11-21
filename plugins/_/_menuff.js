import fs from 'fs'
import os from 'os'

let handler = async (m, { conn, usedPrefix }) => {
  try {

    // Íconos para VS
    const vsIcons = {
      fem: "🌸",
      masc: "☠️",
      mixto: "⚡"
    }

    // Modalidades permitidas
    const modalidades = [
      { name: "scrim", icon: "🎮" },
      { name: "cuadrilatero", icon: "🥊" },
      { name: "guerra", icon: "⚔️" },
      { name: "guerra-de-clanes", icon: "🛡️" }
    ]

    // Países permitidos
    const paises = [
      { code: "ar", icon: "🇦🇷" },
      { code: "pe", icon: "🇵🇪" },
      { code: "co", icon: "🇨🇴" },
      { code: "mx", icon: "🇲🇽" }
    ]

    // Comando Stalk
    const ffstalk = "💬 FFStalk → " + usedPrefix + "ffstalk <id>"

    // Construcción del menú
    let text = `
╭━━━〔 🌸 Alya Bot 🌸 〕━━━╮
┃ 💫 Submenú: MENUFF
┃ 🧩 Categoría: INFO
┃ 🕒 Activo: ${clockString(process.uptime() * 1000)}
┃ ⚙️ Sistema: ${os.platform().toUpperCase()}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭───〔 LISTA VS 〕───────❐
┃ ${vsIcons.fem} VS Fem → ${usedPrefix}vs <hora> <am/pm> <país> <modalidad> fem
┃ ${vsIcons.masc} VS Masc → ${usedPrefix}vs <hora> <am/pm> <país> <modalidad> masc
┃ ${vsIcons.mixto} VS Mixto → ${usedPrefix}vs <hora> <am/pm> <país> <modalidad> mixto
╰─────────────────────────❐

╭──〔 MODALIDADES DISP. 〕──╮
${modalidades.map(m => `┃ ${m.icon} ${m.name}`).join('\n')}
╰────────────────────────────╯

╭────〔 PAÍSES DISP. 〕──────╮
${paises.map(p => `┃ ${p.icon} ${p.code}`).join('\n')}
╰────────────────────────────╯

╭────〔 OTROS COMANDOS 〕────╮
┃ ${ffstalk}
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