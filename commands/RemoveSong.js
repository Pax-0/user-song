const bot = require('../index');
const fs = require('fs');
const Path = require('path');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return sent.edit('Unable to bot settings.');
	const sent = await msg.channel.createMessage('Searching...');
	let query = args.join(' ');
    
	let user = resolveUser(query, msg.channel.guild);
    if(!user) return msg.channel.createMessage('I cant find that user.');

    let song = settings.users.find(songConfig => songConfig.linkedTo === user.id);
    if(!song) return sent.edit(`${user.username} dosnt have a saved song.`);
    
    const path = Path.resolve(__dirname, '../songs', `${user.id}.mp3`)
    await removeSong(song, bot, path);
	return sent.edit(`Removed ${user.username}\'s saved song!`);
};
function resolveUser(string, guild){
	let user = bot.users.get(string) || bot.users.find(user => user.mention === string) || bot.users.find(user => user.username === string) || guild.members.find(member => member.nick === string);

    return user;
}
async function removeSong(song, bot, path){
    // removed it from db.
    await bot.db.settings.update({}, { $pull: { users: song } }, {});

    // delete hard copy of it.
    fs.access(path, fs.constants.W_OK, (err) => {
        if (err) return console.log(err)
        fs.unlink(path, (err) => {
            if (err) return console.log(err);
        });
    });
    return;
}
module.exports.options = {
	name: 'delsong',
	description: 'Clears a user\'s saved song-link.',
	enabled: true,
	fullDescription:'Removes a user a saved song for a user.',
	usage:'user/id/@mention',
	argsRequired: true,
	guildOnly: true,
	requirements: {
        userIDs: ['223086685758554113', '143414786913206272']
	}
};