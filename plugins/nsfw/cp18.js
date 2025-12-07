import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat]

    // ❗ Bloqueo si está desactivado
    if (!chat.nsfw) {
        return conn.reply(
            m.chat,
            `✧ El *NSFW está desactivado*.\nPídele a un admin que lo active con:\n\n*.setting enable nsfw*`,
            m
        )
    }

    // 🖼 Selección de imagen NSFW
    let url = cosplay[Math.floor(Math.random() * cosplay.length)]
    let caption = `\`\`\`➩ Listo! \`\`\``

    conn.sendFile(m.chat, url, null, caption, m)
}

handler.help = ['18cosplay']
handler.tags = ['nsfw'] 
handler.nsfw = true
handler.command = /^(18cosplay)$/i

export default handler

// BASE NSFW (Cosplay)
global.cosplay = [
    "https://cdn.nekobot.xyz/e/9/6/ffc914822489a51b2946e5d2f150b.jpg",
    "https://cdn.nekobot.xyz/b/9/a/114079157c091a632f839c93bf546.jpg",
    "https://i0.nekobot.xyz/4/0/0/a26b285804a922d7a155523b23f32.jpg",
    "https://i0.nekobot.xyz/4/9/0/4fb8a1caeac76e0460874b55dd24b.jpg",
    "https://cdn.nekobot.xyz/d/2/4/fc06e03e644b809f8a326915e11e1.jpg",
    "https://cdn.nekobot.xyz/e/3/8/2dd83e6cb351625c91d6be01d4294.jpg",
    "https://i0.nekobot.xyz/6/6/3/f020e750c8b284218f85fdecbb576.jpg",
    "https://cdn.nekobot.xyz/b/6/b/37deea40362f1816bdd212c0b6d59.jpg",
    "https://i0.nekobot.xyz/2/3/d/cc380af646f2e95b68845c9587f9e.jpg",
    "https://i0.nekobot.xyz/3/9/f/6b32934d825333444a46e0109f396.jpg",
    "https://cdn.nekobot.xyz/a/b/1/a83112e57f55180bfc2f5a4549775.jpg",
    "https://cdn.nekobot.xyz/e/2/c/ff576d535e7c87377c24e24d2bdb6.jpg",
    "https://i0.nekobot.xyz/6/d/0/00989a5aab58b3ddd884ff15bdea3.gif",
    "https://i0.nekobot.xyz/7/d/8/df337eb2aee6fb3fef37564ef0e4e.jpg",
    "https://i0.nekobot.xyz/7/f/1/6287d2fbbf89b48f5e86f258d2ac6.jpg",
    "https://i0.nekobot.xyz/7/0/4/a8208770466ba0951f97d61d5c170.jpg",
    "https://i0.nekobot.xyz/7/b/0/f7da7635f3f6c34a664ffdd4cd24b.jpg",
    "https://cdn.nekobot.xyz/a/2/5/1e4efb710f4a7ca22d109ac07e8cc.jpg",
    "https://cdn.nekobot.xyz/b/d/a/87a13044fd418d8ebb869ccbc9477.jpg",
    "https://cdn.nekobot.xyz/f/0/d/44b2d88fc52c9f3f2dfd9c7201f5d.jpg",
    "https://cdn.nekobot.xyz/e/9/2/3e0f3bd320243c20718f6f5f0538b.jpg",
    "https://i0.nekobot.xyz/6/f/1/f8a585487112ba9e23219c4b9c7e4.jpg",
    "https://i0.nekobot.xyz/2/8/5/70b379c84d0391ab4e685afdccd6f.jpg",
    "https://cdn.nekobot.xyz/d/7/6/d459a30cd3c3337522a86d6eaceeb.jpg",
    "https://i0.nekobot.xyz/7/7/9/dd0950bfb9e74f9379a3d5a8abf8e.jpg",
    "https://cdn.nekobot.xyz/a/9/9/c00c7bf15a7e30cc7df22051d77ce.jpg",
    "https://cdn.nekobot.xyz/f/9/d/a3af76465ade7618d158a24bb78cb.jpg",
    "https://i0.nekobot.xyz/7/8/6/22aa2a3f038caf996340b5a7743b1.jpg",
    "https://cdn.nekobot.xyz/e/7/4/086fcdaa0851ebedc005b259093f4.jpg",
    "https://i0.nekobot.xyz/5/8/f/8698738e8418f3b9f69de488b1abf.jpg",
    "https://i0.nekobot.xyz/3/2/1/217008cd5a2a13c559d94cbcb6a8a.jpg",
    "https://i0.nekobot.xyz/6/1/9/a38ee5c9e81b1fbf105e9d072aaee.jpg",
    "https://cdn.nekobot.xyz/e/c/f/06f51474fcafa8f9c23c5462c8b22.jpg",
    "https://i0.nekobot.xyz/6/b/6/f4508098d6268827ca66bf74a1fb4.jpg",
    "https://i0.nekobot.xyz/2/a/1/64dde238e5216b9745fcf5a82aa47.jpg",
    "https://i0.nekobot.xyz/6/0/9/34acdcd0ba1f31eb1bf531ce8271b.jpg",
    "https://cdn.nekobot.xyz/a/a/0/843b46e84d2351633da2f2bf529ca.jpg",
    "https://i0.nekobot.xyz/1/1/6/546fb6b6681de8d29081f2972abaa7061dee1.jpg",
    "https://i0.nekobot.xyz/4/8/a/04a844de6f0af84b1a5e540bd05b1.jpg",
    "https://cdn.nekobot.xyz/d/8/6/5e2770754df2d15ed501a0b9808e4.jpg",
    "https://i0.nekobot.xyz/3/7/0/53bb8a0b03f59fd16fabb123760fa.jpg",
    "https://i0.nekobot.xyz/5/a/2/126c89a323de9ba7e02c45c952261.jpg",
    "https://cdn.nekobot.xyz/d/d/1/fd741e67a592ec02b925c5121855b.jpg",
    "https://i0.nekobot.xyz/1/b/8/222990d810d5fae5dfb8d15d56a51.jpg",
    "https://i0.nekobot.xyz/6/e/9/ba83ab0b45944ee9edf1a1ca1dcef.jpg",
    "https://cdn.nekobot.xyz/f/9/c/83df5bfcfcfb877c23da9140609ac.jpg",
    "https://i0.nekobot.xyz/2/b/a/03d91913fb6395a9ed47452e51ee2.jpg",
    "https://cdn.nekobot.xyz/9/e/3/8b6138a79c91f1c3bc974f3c9999a.jpg",
    "https://cdn.nekobot.xyz/f/3/6/e9ebea57374ed4f5aefd3d30867c0.jpg",
    "https://cdn.nekobot.xyz/b/7/5/070d4c695cf0158292a69f4771fd3.jpg"
]
