const bot = require('../index');
const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');


module.exports.generator = async (msg, args) => {
    const user = resolveUser(args.join(' '), msg.channel.guild);
    if(!user) return msg.channel.createMessage('Couldnt find that user.');

    let settings = await bot.db.settings.findOne({});
    let linkedSong = settings.users.find(element => element.linkedTo === user.id);
    if(linkedSong){
      // if there is already a song linked to a user, remove it so this command acts like a toggle.
      await bot.db.settings.update({}, { $pull: { users: linkedSong } }, {});
    }
    if(!msg.attachments.length || !msg.attachments[0].filename.endsWith('.mp3')) return msg.channel.createMessage('Please attach an mp3 song to your message.');
    let sent = await msg.channel.createMessage('Saving song....');
    try {
        await downloadSong(msg.attachments[0].url, `${user.id}.mp3`);
        const song = {
            uploadName: msg.attachments[0].filename,
            uploadedBy: msg.author.id,
            linkedTo : user.id,
            date: Date.now()
        }
        await savetoDB(song, bot);
    } catch (error) {
        console.log(error);
        return msg.channel.createMessage('There was an error during proccesssing.. try again later.');
    }
    return sent.edit('Saved!')
};

function resolveUser(string, guild){
	let user = bot.users.get(string) || bot.users.find(user => user.mention === string) || bot.users.find(user => user.username === string) || guild.members.find(member => member.nick === string);

    return user;
}

async function downloadSong(url, name) {  
  const path = Path.resolve(__dirname, '../songs', name)
  const writer = Fs.createWriteStream(path)

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function savetoDB(song, bot){
    await bot.db.settings.update({}, { $push: { users: song } }, {});
}
module.exports.options = {
	name: 'song',
	description: 'Saves a song for a user, whenever they join a VC.',
	enabled: true,
	fullDescription:'Saves a song to be played when a user joins a voice channel.',
	usage:'',
};