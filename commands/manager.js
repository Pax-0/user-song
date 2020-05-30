const bot = require('../index');

module.exports.generator = async (msg, args) => {
	const settings = await bot.db.settings.findOne({});
	if(!settings) return msg.channel.createMessage('Unable to bot settings.');
	const sent = await msg.channel.createMessage('Adding user to Managers...');
	let query = args.join(' ');
    
	let user = resolveUser(query, msg.channel.guild);
    
	if(!user) return msg.channel.createMessage('I cant find that user.');
	await addManager(user.id);
	return sent.edit(`Added ${user.username} as a manager!`);
};
function resolveUser(string, guild){
	let user = bot.users.get(string) || bot.users.find(user => user.mention === string) || bot.users.find(user => user.username === string) || guild.members.find(member => member.nick === string);

    return user;
}
async function addManager(userID){
	return bot.db.settings.update({}, { $addToSet: { managers: userID } }, {});
}
module.exports.options = {
	name: 'manager',
	description: 'Gives users access to the song-link commands.',
	enabled: true,
	fullDescription:'Adds a user as a bot manager.',
	usage:'user/id/@mention',
	argsRequired: true,
	guildOnly: true,
	requirements: {
        userIDs: ['223086685758554113', '143414786913206272']
	}
};