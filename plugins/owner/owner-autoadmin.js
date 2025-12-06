let handler = async (m, { conn }) => {

  const groupMetadata = await conn.groupMetadata(m.chat)
  const participants = groupMetadata.participants || []

  // Buscar al owner en la lista de participantes
  const target = participants.find(p => p.jid === m.sender || p.id === m.sender || p.lid === m.sender)
  if (!target) return m.reply('✧ No se pudo encontrar al owner en este grupo.')

  // Promover al owner a admin
  await conn.groupParticipantsUpdate(m.chat, [target.id || target.jid || target.lid], 'promote')

  const mention = `@${m.sender.split('@')[0]}`
  await conn.sendMessage(m.chat, {
    text: `ya te di ${mention} adm mi creador.`,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: ' Auto Admin Activado',
        body: '✧ Solo el Owner puede usar este comando.',
        thumbnailUrl: 'https://files.catbox.moe/vxvobj.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com/channel/0029VarbyoN2ZjCkcPW7q33F'
      }
    }
  }, { quoted: m })
}

handler.help = ['autoadmin']
handler.tags = ['owner', 'group']
handler.command = /^autoadmin$/i

handler.group = true
handler.botAdmin = true
handler.owner = true