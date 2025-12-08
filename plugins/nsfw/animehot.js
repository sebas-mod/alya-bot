import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  
  m.reply('✦ Buscando anime +18 aleatorio, espere un momento...')

  try {
    let res = await fetch(`https://gawrgura-api.onrender.com/anime/animedao/hot`)
    let json = await res.json()

    if (!json.status || !json.result) throw m.reply("✦ Error API")

    let lista = json.result

    // FILTRAR SOLO +18 (NSFW) USANDO TITULO
    let nsfw = lista.filter(x => {
      let t = (x.title || "").toLowerCase()

      return (
        // por título
        t.includes("18") ||
        t.includes("+18") ||
        t.includes("hentai") ||
        t.includes("uncensored") ||
        t.includes("adult") ||
        t.includes("ero")
      )
    })

    if (nsfw.length === 0) return m.reply(`✦ No encontré contenido +18 disponible ahora mismo.`)

    // SELECCIONAR 1 RANDOM
    let anime = nsfw[Math.floor(Math.random() * nsfw.length)]

    let txt = `🔥 *ANIME +18 ALEATORIO ENCONTRADO*\n\n`
    txt += `✦ *Título:* ${anime.title || "Desconocido"}\n`
    txt += `✦ *Episodio:* ${anime.episode || "N/A"}\n`
    txt += `✦ *Subtítulo:* ${anime.subtitle || "N/A"}\n`
    txt += `✦ *URL:* ${anime.link || "N/A"}\n`

    await conn.sendMessage(
      m.chat,
      {
        image: { url: anime.image },
        caption: txt
      },
      { quoted: m }
    )

  } catch (e) {
    console.log(e)
    m.reply(`✦ Se produjo un error al obtener contenido +18.`)
  }
}

handler.help = ['animehot']
handler.tags = ['nsfw']
handler.nsfw = true
handler.command = /^animehot|hotanime$/i

export default handler
