const bot = require('../index');
const EmbedPaginator = require('eris-pagination');



module.exports.generator = async (msg) => {
    let sent = await msg.channel.createMessage('Loading linked songs....');
    let settings = await bot.db.settings.findOne({});
    
    let embeds = [
        {fields: []}
    ];
    if(!settings) return sent.edit('Cant load settings!');
    if(!settings.users.length) return sent.edit('There are no linked songs!');
    
    for (const element of settings.users){
        let resolvedUser = resolveUser(element.linkedTo, msg.channel.guild);
        let uploader = resolveUser(element.uploadedBy, msg.channel.guild);
        if(resolvedUser){
            // create infinite embeds to account for a high user count.
            if(embeds[embeds.length-1].fields.length > 20){
                let embed = {
                    fields: [{name: `User: ${resolvedUser.username}#${resolvedUser.discriminator}`, value: `\`\`\`ini\n[ Uploaded By ]: ${uploader.username}#${uploader.discriminator}\n[ Upload Name ] : ${element.uploadName}\n[ Date ]: ${new Date(element.date) }\n\`\`\``}]
                }
                embeds.push(embed);
            }
            else {
                embeds[embeds.length-1].fields.push({name: `User: ${resolvedUser.username}#${resolvedUser.discriminator}`, value: `\`\`\`ini\n[ Uploaded By ]: ${uploader.username}#${uploader.discriminator} \n[ Upload Name ] : ${element.uploadName}\n[ Date ]: ${new Date(element.date) }\n\`\`\``})
            }
        }
    }
    await embeds.forEach(async embed => await msg.channel.createMessage({embed}));
    return sent.edit('Loaded!')
};

function resolveUser(string, guild){
	let user = bot.users.get(string) || bot.users.find(user => user.mention === string) || bot.users.find(user => user.username === string) || guild.members.find(member => member.nick === string);

    return user;
}

module.exports.options = {
	name: 'songs',
	description: 'Lists the current users who have a song linked to them.',
	enabled: true,
	fullDescription:'Shows a list of users with songs linked to them.',
	usage:'',
};