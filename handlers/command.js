const fs = require("fs")
const Discord = require('discord.js')

module.exports = (client) => {
    const load = dirs => {
        const commands = fs.readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'))
        for (let file of commands) {
            let pulls = require(`../commands/${dirs}/${file}`)
            client.commands.set(pulls.config.name, pulls)
            if (pulls.config.aliases) pulls.config.aliases.forEach(a => client.aliasess.set(a, pulls.config.name))
        }
    };
    [].forEach(x => load(x))
}