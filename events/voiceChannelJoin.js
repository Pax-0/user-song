const bot = require('../index');
const Path = require('path');

async function handler(member, channel){
    if(member.user.bot) return;
    let settings = await bot.db.settings.findOne({});
    if(!settings) return console.log('Cant locate settings file!');
    
    let linkedSong = await settings.users.find(songConfig => songConfig.linkedTo === member.id);

    if(!linkedSong) return;

    const path = Path.resolve(__dirname, '../songs', `${member.id}.mp3`);
    let connection;
    let currentConnection = bot.voiceConnections.find( connection => connection.channelID === channel.id);
    if( currentConnection && currentConnection.playing){
        currentConnection.stopPlaying();
    }
    connection = await channel.join();
    connection.play(path);    
    
    connection.on('end', async () => {
        member.guild.channels.get(connection.channelID).leave();
    });
    
}


module.exports = {
	event: 'voiceChannelJoin',
	enabled: true,
	handler: handler,
};