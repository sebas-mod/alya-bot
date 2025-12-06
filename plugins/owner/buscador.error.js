import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { conn }) => {
    const pluginFolder = path.resolve('./plugins')
    let errorList = []

    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ *Carpeta de plugins no encontrada.*')
    }

    const files = fs.readdirSync(pluginFolder).filter(f => f.endsWith('.js'))

    for (const file of files) {
        try {
            const moduleUrl = pathToFileURL(path.join(pluginFolder, file)).href
            const plugin = await import(moduleUrl + '?update=' + Date.now()) // evita cache

            if (typeof plugin.default !== 'function' && typeof plugin !== 'function') {
                throw new Error('La exportación predeterminada no es una función')
            }
        } catch (err) {
            errorList.push(`❌ ${file}: ${err.message}`)
        }
    }

    if (errorList.length === 0) {
        m.reply('✅ *Todas las funciones fueron verificadas y no se encontraron errores.*')
    } else {
        m.reply(`🚨 *Se encontraron ${errorList.length} errores:*\n\n${errorList.join('\n')}`)
    }
}

handler.help = ['viewerror']
handler.tags = ['owner']
handler.command = /^viewerror$/i
handler.rowner = true

export default handler
