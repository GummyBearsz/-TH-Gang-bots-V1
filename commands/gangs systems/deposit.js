const Discord = require('discord.js')
const fs = require("fs")
const formatter = new Intl.NumberFormat('en')

module.exports = {
    config: {
        name: "deposit",
        aliases: ["dep"]
    },
    run: async (client, message, args, economy) => {

        ///if (message.channel.id !== '855334670585692191' || message.channel.id !== '846371079492599808') return;

        let guild_file = `./db`
        let guild_config = JSON.parse(fs.readFileSync(`${guild_file}/gangs.json`, "utf8"))
        let guild_c = JSON.parse(fs.readFileSync(`${guild_file}/config.json`, "utf8"))

        let gangs = guild_config.gangs

        ///let currency = client.emojis.cache.get(guild_c.currency)
        let check = client.emojis.cache.get('827064266858954792')
        let wrong = client.emojis.cache.get('827064267198300170')
        
        economy.getUserBalance(message.guild.id, message.member.id).then(p => {

            async function deposit(name, bank) {

                let money = 0
                if (!Number(args[0])) return message.channel.send('พิมพ์คำสั่งผิดพลาด')
                money = Number(args[0])

                name.economy_money = name.economy_money + money

                if (name.economy_money > name.economy_limit) {
                    let dep_limit = new Discord.MessageEmbed()
                        .setColor('ef5350')
                        .setDescription(`${wrong} ธนาคารแก๊งของคุณเต็มแล้ว`)
                        .setTimestamp()
                        .setAuthor(message.guild.roles.cache.get(name.id).name, name.png)
                    return message.channel.send(dep_limit)
                }
    
                if (bank < money) {
                    let dep_nomoney = new Discord.MessageEmbed()
                        .setColor('ef5350')
                        .setTimestamp()
                        .setAuthor(message.guild.roles.cache.get(name.id).name, name.png)
                        .addField(`**${message.author.tag}**`,`❌ ไม่มีเงินมากพอที่จะฝาก ขณะนี้คุณมี ${formatter.format(bank)} บาท อยู่ในธนาคารหลัก `, true)
                    return message.channel.send(dep_nomoney)
                }
    
                await economy.editUserBalance(message.guild.id, message.member.id, { bank: -money }, 'gangs Economy')
                await fs.writeFile(`${guild_file}/gangs.json`, JSON.stringify(guild_config), err => { if (err) { console.log(err) } })
    
                let dep_money = new Discord.MessageEmbed()
                    .setColor('66bb6a')
                    .setTimestamp()
                    .setAuthor(message.guild.roles.cache.get(name.id).name, name.png)
                    .addField(`**${message.author.tag}**`,`✅ ฝาก ${formatter.format(money)} บาท ไปที่ธนาคารของแก๊งคุณ`, true)
                return message.channel.send(dep_money)
            }

            if (message.member.roles.cache.has(gangs.g1.id)) {
                deposit(gangs.g1, p.bank)
            }

            else if (message.member.roles.cache.has(gangs.g2.id)) {
                deposit(gangs.g2, p.bank)
            }

            else if (message.member.roles.cache.has(gangs.g3.id)) {
                deposit(gangs.g3, p.bank)
            }

            else return message.channel.send(`<@${message.member.id}> ⛔ คุณไม่มีสิทธิในการใช้คำสั่งนี้`)
        })
    }
}