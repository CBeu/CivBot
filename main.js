const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = config.prefix;

//Initiate Bot
client.on('ready', () => {
    console.log("civMention online");
    client.user.setActivity('Monitoring Civ 6' + prefix);
    var testName = "sdf";
});

//Bot checks whenever a message is sent
client.on("message", async message => {
    //Check if message has balid prefix
    if(!message.content.startsWith(prefix)){
        return;
    }
    //Send Message to array
    const args = message.content.slice(prefix).trim().split(/ +/g);
    //Get command
    const command = args[0];
    //Check if message is from the webhook
    if(command === "!Civ") {
        //Handle 1 word user names or multiple user names
        var webHookName = "";
        if (args.length == 11) {
            webHookName = args[2];
        } else {
            for (var x = 0; x < args.length-11; x++){
                webHookName += args[2+x];
            }
        }
        //Make message a mention
        var finalMessage = "<@";
        //Get the userID from the config file
        if (typeof config.users[webHookName] !== 'undefined'){
            //Log the name from the webhook
            console.log("Name: " + webHookName);
            console.log("UID: " + config.users[webHookName]);
            finalMessage += config.users[webHookName];
        } else {
            finalMessage = "The userID for " + webHookName+ " was not found";
            message.channel.send(finalMessage);
            console.log(finalMessage);
            return;
        }
        //Finalize and send message
        finalMessage += "> It's your turn on the Civ6 Cloud Save Game called " + args[args.length-1];
        message.channel.send(finalMessage);
    } else {
        return;
    }
});
client.login(process.env.BOT_TOKEN);