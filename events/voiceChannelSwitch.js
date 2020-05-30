const bot = require('../index');

async function handler(member, newChannel, _oldChannel){
	if(member.user.bot) return;
	// console.log(member.username, newChannel.name);
	let currentConnection = bot.voiceConnections.find( connection => {
		let channel = bot.getChannel(connection.channelID);
		return channel.guild.id === member.guild.id
	});
    // if the bot is playing something, stop it first, then move on
    if( currentConnection && currentConnection.playing){
        currentConnection.stopPlaying();
    }
    bot.emit('voiceChannelJoin', member, newChannel);
    return;
}
module.exports = {
	event: 'voiceChannelSwitch',
	enabled: true,
	handler: handler,
};