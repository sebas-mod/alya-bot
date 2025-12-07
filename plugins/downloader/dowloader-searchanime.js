import axios from "axios";
import https from "https";

const agent = new https.Agent({
    rejectUnauthorized: false, // Ignorar SSL solo en esta petición
});

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(
            `🔎 *Busca un anime por nombre.*\n\n` +
            `👉 *Ejemplo:* ${usedPrefix + command} one piece`
        );
    }

    await global.loading(m, conn); // Animación de cargando

    try {
        let apiUrl = `https://gawrgura-api.onrender.com/nontonanime/search?q=${encodeURIComponent(text)}`;

        // Llamada a la API
        let { data: json } = await axios.get(apiUrl, { httpsAgent: agent });

        if (!json.status || !json.results) {
            throw new Error("Respuesta inválida de la API.");
        }

        if (json.results.length === 0) {
            return m.reply(`❌ *No encontré resultados para:* _${text}_`);
        }

        let resultado = `✨ *Resultados de búsqueda para:* _${text}_\n\n`;

        json.results.slice(0, 10).forEach((anime, i) => {
            resultado += `(${i + 1}) *${anime.title || "Sin título"}*\n`;
            resultado += `🎬 Tipo: ${anime.type || "Desconocido"}\n`;
            resultado += `📺 Episodios: ${anime.episodes || "-"}\n`;
            resultado += `🔗 URL: ${anime.url || "N/A"}\n\n`;
        });

        await m.reply(resultado);
    } catch (e) {
        console.error(e);
        await m.reply(`❌ *Error al buscar anime.*\n📄 ${e.message}`);
    } finally {
        await global.loading(m, conn, true); // Finalizar animación
    }
};

handler.help = ["anime <nombre>"];
handler.tags = ["anime"];
handler.command = /^(anime|animesearch)$/i;

export default handler;
