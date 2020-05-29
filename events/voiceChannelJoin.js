const bot = require('../index');
const Path = require('path');

async function handler(member, channel){
    // ignore bots, we dont need those loopy loops.
    if(member.user.bot) return;

    // load up the saved linked songs.
    let settings = await bot.db.settings.findOne({});
    if(!settings) return console.log('Cant locate settings file!');
    // find the song linked to this user.
    let linkedSong = await settings.users.find(songConfig => songConfig.linkedTo === member.id);

    // if there isnt one, then there is nothing for us to do.
    if(!linkedSong) return;

    // load up that song we found.
    const path = Path.resolve(__dirname, '../songs', `${member.id}.mp3`);
    let connection;
    let currentConnection = bot.voiceConnections.find( connection => connection.channelID === channel.id);
    // if the bot is playing something, stop it first, then move on
    if( currentConnection && currentConnection.playing){
        currentConnection.stopPlaying();
    }
    // join the VC
    connection = await channel.join();
    // start playing the linked song/audio!
    connection.play(path);    
    
    connection.on('end', async () => { // our job here is done, bye!
        member.guild.channels.get(connection.channelID).leave();
    });
    
    connection.on('error', async (error) => {
        // handling errors, if a mod was to disconnect the bot from VC this would crash the bot, thank fully its handelled. 
        return console.log(error);
    });
}


module.exports = {
	event: 'voiceChannelJoin',
	enabled: true,
	handler: handler,
};