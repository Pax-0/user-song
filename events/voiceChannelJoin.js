const bot = require('../index');
const fs = require('fs');

async function handler(member, channel){
    console.log('you joined!')
    let settings = await bot.db.settings.findOne({});
    if(!settings) return console.log('Cant locate settings file!');
    
    console.log(settings);
    
    let linkedSong = await settings.users.find(songConfig => songConfig.linkedTo === member.id);

    if(linkedSong){
        console.log('Found the song!')
        let currentConnection = bot.voiceConnections.find( connection => connection.channelID === channel.id);
        if( currentConnection && currentConnection.playing){
            currentConnection.stopPlaying();
            connection.play(`../songs/${user.id}.mp3`);
        }else{
            let connection = await channel.join();
            connection.play(`../songs/${member.id}.mp3`);
        }
    }
	return;
}


module.exports = {
	event: 'voiceChannelJoin',
	enabled: true,
	handler: handler,
};