import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    //Fixieada por ZzawX
    
    let tempStickerPath;
    
    try {
        await m.react('🕒');

        if (!text) {
            await m.react('❔');
            return conn.reply(m.chat, 
                '> `❌ TEXTO FALTANTE`\n\n' +
                '> `📝 Debes escribir texto después del comando`\n\n' +
                '> `💡 Ejemplo:` *' + usedPrefix + command + ' texto aquí*', 
                m
            );
        }

        const tempDir = './temp';
        
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        tempStickerPath = path.join(tempDir, `brat_sticker_${Date.now()}.webp`);

        const mayApiUrl = `https://mayapi.ooguy.com/brat`;
        
        const fallbackApiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`;

        let imageData;
        let apiUsed = "MayAPI";

        try {
            const apiResponse = await axios({
                method: 'GET',
                url: mayApiUrl,
                params: {
                    apikey: 'may-f53d1d49',
                    text: text
                },
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, */*'
                }
            });

            if (!apiResponse.data || typeof apiResponse.data !== 'object') {
                throw new Error('Respuesta de API no es JSON válido');
            }

            if (!apiResponse.data.status) {
                throw new Error(`Error en API: ${apiResponse.data.message || 'Estado falso'}`);
            }

            if (!apiResponse.data.result || !apiResponse.data.result.url) {
                throw new Error('No se encontró URL de imagen en la respuesta');
            }

            const imageUrl = apiResponse.data.result.url;

            const imageResponse = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/webp,image/png,image/jpeg,*/*'
                }
            });

            imageData = Buffer.from(imageResponse.data);

            const buffer = imageData;
            const isWebP = buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP';
            
            if (!isWebP) {
                const ffmpegCommand = `ffmpeg -i pipe:0 -vcodec libwebp -lossless 0 -compression_level 3 -qscale 70 -loop 0 -preset ultrafast -an -vsync 0 -s 512:512 "${tempStickerPath}" -y`;
                await execAsync(`echo "${buffer.toString('base64')}" | base64 -d | ${ffmpegCommand}`, { 
                    timeout: 15000,
                    shell: '/bin/bash'
                });
            } else {
                fs.writeFileSync(tempStickerPath, buffer);
            }

        } catch (primaryError) {
            try {
                const fallbackResponse = await axios({
                    method: 'GET',
                    url: fallbackApiUrl,
                    responseType: 'arraybuffer',
                    timeout: 10000,
                    maxRedirects: 5,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/webp,image/*,*/*'
                    }
                });

                const fallbackBuffer = Buffer.from(fallbackResponse.data);
                const isFallbackWebP = fallbackBuffer.slice(0, 4).toString() === 'RIFF' && fallbackBuffer.slice(8, 12).toString() === 'WEBP';
                
                if (isFallbackWebP) {
                    fs.writeFileSync(tempStickerPath, fallbackBuffer);
                } else {
                    const ffmpegCommand = `ffmpeg -i pipe:0 -vcodec libwebp -lossless 0 -compression_level 3 -qscale 70 -loop 0 -preset ultrafast -an -vsync 0 -s 512:512 "${tempStickerPath}" -y`;
                    await execAsync(`echo "${fallbackBuffer.toString('base64')}" | base64 -d | ${ffmpegCommand}`, { 
                        timeout: 15000,
                        shell: '/bin/bash'
                    });
                }

                apiUsed = "API Secundaria";

            } catch (fallbackError) {
                throw new Error(`Ambas APIs fallaron`);
            }
        }

        if (!fs.existsSync(tempStickerPath)) {
            throw new Error('No se pudo crear el sticker');
        }

        await m.react('✅️');

        const username = m.pushName || m.sender.split('@')[0] || "Usuario";
        
        const stickerBuffer = fs.readFileSync(tempStickerPath);
        
        const stickerMetadata = {
            pack: `𝐈𝐭𝐬𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃`,
            author: `𝗦𝗼𝗹𝗶𝗰𝗶𝘁𝗮𝗱𝗼 𝗽𝗼𝗿: ${username}\n𝗖𝗿𝗲𝗮𝗱𝗼𝗿: 𝗟𝗲𝗼𝗗𝗲𝘃`,
            categories: ['🤣', '🎉'],
            type: StickerTypes.FULL
        };

        const sticker = new Sticker(stickerBuffer, stickerMetadata);
        const stickerWebp = await sticker.toMessage();

        await conn.sendMessage(m.chat, stickerWebp, { quoted: m });

        setTimeout(() => {
            try {
                if (tempStickerPath && fs.existsSync(tempStickerPath)) fs.unlinkSync(tempStickerPath);
            } catch (e) {}
        }, 10000);

    } catch (error) {
        console.error('Error en comando brat:', error);
        
        try {
            if (tempStickerPath && fs.existsSync(tempStickerPath)) fs.unlinkSync(tempStickerPath);
        } catch (cleanError) {}
        
        await m.react('❌');
        
        let errorMessage = '> `❌ ERROR ENCONTRADO`\n\n';
        
        if (error.message.includes('Ambas APIs fallaron')) {
            errorMessage += '> `📝 Todos los servicios están temporalmente no disponibles. Intenta más tarde.`';
        } else if (error.message.includes('insuficientes') || error.message.includes('vacío')) {
            errorMessage += '> `📝 El servicio devolvió un archivo vacío o corrupto.`';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage += '> `⏰ Tiempo de espera agotado. Intenta de nuevo.`';
        } else if (error.response) {
            errorMessage += '> `📝 Error en la API: ' + error.response.status + '`';
        } else if (error.request) {
            errorMessage += '> `📝 No se pudo conectar con el servicio.`';
        } else if (error.message.includes('ffmpeg')) {
            errorMessage += '> `📝 Error al procesar la imagen.`';
        } else {
            errorMessage += '> `📝 ' + error.message + '`';
        }

        await conn.reply(m.chat, errorMessage, m);
    }
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = ['brat'];
handler.group = true;

export default handler;
