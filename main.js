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
//Messages come in this format from the webhook
// !Civ Hey {username} it's time to take your turn #{turnNumber} in {gameName}!
// {username} and {gameName} can both be a single word or multiple words
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
        var gameName = "";
        var gameLength = 0;
        var nameStart = 0;
        var nameEnd = 0;
        var gameStart = 0;
        for (i in args){
            if (args[i] === "Hey") {
                nameStart = gameLength + 1;
            }
            if (args[i] === "it's") {
                nameEnd = gameLength-1;
            }
            if (args[i] === "in") {
                gameStart = gameLength+1;
            }
            gameLength++;
        }
        for (var i = nameStart; i <= nameEnd; i++) {
            webHookName += args[i];
        }
        for (var i = gameStart; i <= args.length-1; i++) {
            gameName += args[i];
        }
        console.log("The game is called " + gameName);
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
        finalMessage += "> It's your turn on the Civ6 Cloud Save Game called " + gameName;
        message.channel.send(finalMessage);
    } else {
        return;
    }
});
client.login(process.env.BOT_TOKEN);