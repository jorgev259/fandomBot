const Discord = require('discord.js');
const SpoilerBot = require('discord-spoiler-bot');
var numbers = ["1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣","9⃣", "🔟"];

var util = require('../akira/utilities.js')
let client = new Discord.Client();

client.on('ready',()=>{
    util.log(client,'I am ready!');
    let config = {
        client: client,
    };
    let bot = new SpoilerBot(config);
    bot.connect();
})

client.on('raw', async event => {
    if (event.t !== 'MESSAGE_REACTION_ADD') return;

	const { d: data } = event;
	const channel = client.channels.get(data.channel_id);

	if (channel.messages.has(data.message_id)) return;

	const user = client.users.get(data.user_id);
	const message = await channel.messages.fetch(data.message_id);
	const reaction = message.reactions.get(data.emoji.id || data.emoji.name);
});

client.on('messageReactionAdd', (receivedReaction, user) => {
	if(user.id != client.user.id && receivedReaction.message.channel.name == "art"){
        var count = 0;
		receivedReaction.message.reactions.forEach(function(reaction){
			if(reaction.users.has(user.id)){
				count++;
			}
        });
        
		if(count>=2){
			receivedReaction.remove(user);
		}
    }
});

client.on('message',message=>{
    switch(message.channel.name){
        case "creative":
            if(message.attachments.size > 0 || message.embeds.length>0) reactNumber(0,5,message);
            break;

        case "fandom":
            util.talk(client,message);
            break;
    }
})

function reactNumber(number,limit,poll){
    if(number<limit){
        poll.react(numbers[number]).then(function(){
            reactNumber(number+1,limit,poll);
        })
    };
}

client.login(require("../data/tokens.json").fandom);