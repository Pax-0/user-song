const bot = require('../index');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return sent.edit('Unable to bot settings.');
	const sent = await msg.channel.createMessage('Searching for user in Managers...');
	let query = args.join(' ');
    
	let user = resolveUser(query, msg.channel.guild);
    if(!user) return msg.channel.createMessage('I cant find that user.');
    
    if(!settings.managers.includes(user.id)) return sent.edit('That user is not in managers list.');
	await removeManager(user.id);
	return sent.edit(`Removed ${user.username} from the managers list!`);
};
function resolveUser(string, guild){
	let user = bot.users.get(string) || bot.users.find(user => user.mention === string) || bot.users.find(user => user.username === string) || guild.members.find(member => member.nick === string);

    return user;
}
async function removeManager(userID){
	return bot.db.settings.update({}, { $pull: { managers: userID } }, {});
}
module.exports.options = {
	name: 'delmanager',
	description: 'removes a user\'s access to the song-link commands.',
	enabled: true,
	fullDescription:'removes a user from bot managers.',
	usage:'user/id/@mention',
	argsRequired: true,
	guildOnly: true,
	requirements: {
        userIDs: ['223086685758554113', '143414786913206272']
	}
};