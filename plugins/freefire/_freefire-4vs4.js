const partidas = {};

const handler = async (m, { conn, args, command }) => {

  if (args.length < 4) {
    return conn.reply(
      m.chat,
      `
📢 *USO CORRECTO DEL COMANDO VS*

Formato:
.${command} <hora> <país> <modalidad libre> <cantidad>

Ejemplos:
.${command} 20:00 ar vs de clan 4
.${command} 21:30 mx scrim mixto 5
.${command} 18:00 pe guerra 4

Países: ar, pe, co, mx
Cantidad = jugadores titulares.
El bot sumará 2 suplentes automáticamente.
`.trim(),
      m
    );
  }

  const hora = args[0];
  const pais = args[1].toLowerCase();
  const cantidad = parseInt(args[args.length - 1]);
  const modalidad = args.slice(2, -1).join(" "); // Modalidad libre

  if (!hora.match(/^\d{1,2}:\d{2}$/))
    return m.reply("⏰ *Formato de hora inválido.* Ej: 20:00");

  if (!["ar", "pe", "co", "mx"].includes(pais))
    return m.reply("🇨🇱 *País inválido.* Usa ar, pe, co o mx.");

  if (isNaN(cantidad) || cantidad < 2 || cantidad > 10)
    return m.reply("👥 *Cantidad inválida.* Min: 2, Max: 10");

  const partidaId = `${m.chat}-${Date.now()}`;

  const horarios = {
    AR: pais === "ar" ? `${hora}` : "--:--",
    PE: pais === "pe" ? `${hora}` : "--:--",
    CO: pais === "co" ? `${hora}` : "--:--",
    MX: pais === "mx" ? `${hora}` : "--:--",
  };

  partidas[partidaId] = {
    id: partidaId,
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    cantidad,
    modalidad,
    pais,
    horarios,
    msgId: null,
  };

  const mensaje = generarMensaje(partidas[partidaId]);
  const sent = await conn.sendMessage(
    m.chat,
    {
      text: mensaje,
      footer: `Reacciona con un emoji para anotarte. Quitar la reacción te elimina.`,
    },
    { quoted: m }
  );

  partidas[partidaId].msgId = sent.key.id;
};

// GENERADOR DE MENSAJE
function generarMensaje(p) {
  const horariosTxt = Object.entries(p.horarios)
    .map(([pais, h]) => {
      const flag = { AR: "🇦🇷", PE: "🇵🇪", CO: "🇨🇴", MX: "🇲🇽" }[pais];
      return `*${flag} ${pais}:* ${h}`;
    })
    .join("\n");

  const escuadra = p.jugadores
    .map((x) => `🥷 ${x}`)
    .join("\n") || "—";

  const suplentes = p.suplentes
    .map((x) => `🥷 ${x}`)
    .join("\n") || "—";

  return `
🔥 *LISTA VS* 🔥

🕓 *Hora:* ${horariosTxt}
🌍 *País:* ${p.pais.toUpperCase()}
🎮 *Modalidad:* ${p.modalidad}
👥 *Jugadores:* ${p.cantidad} titulares + 2 suplentes

👤 *TITULARES*
${escuadra}

👥 *SUPLENTES*
${suplentes}

🔥━━━━━━━━━━━━━━━━━━🔥
`.trim();
}

// SISTEMA DE REACCIONES
handler.before = async (m, { conn }) => {
  const reaction = m?.message?.reactionMessage;
  if (!reaction) return;

  const msgReacted = reaction.key.id;
  const emoji = reaction.text;

  const sender = m.sender;
  const name = global.db.data.users[sender]?.name || (await conn.getName(sender));

  const partida = Object.values(partidas).find((p) => p.msgId === msgReacted);
  if (!partida) return;

  if (emoji) {
    if (!partida.jugadores.includes(name) && !partida.suplentes.includes(name)) {
      if (partida.jugadores.length < partida.cantidad) {
        partida.jugadores.push(name);
      } else if (partida.suplentes.length < 2) {
        partida.suplentes.push(name);
      } else {
        return conn.sendMessage(partida.chat, { text: "⚠️ Lista llena!" });
      }
    }
  } else {
    partida.jugadores = partida.jugadores.filter(x => x !== name);
    partida.suplentes = partida.suplentes.filter(x => x !== name);
  }

  const newMsg = generarMensaje(partida);

  await conn.sendMessage(partida.chat, {
    text: newMsg,
    edit: partida.msgId
  });
};

handler.help = ["vs <hora> <pais> <modalidad> <cantidad>"];
handler.tags = ["ff"];
handler.command = /^vs$/i;
handler.group = true;

export default handler;