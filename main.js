const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = config.prefix;
var lastPlayer="";
const lastMove = {};
const fJ = {1: "Shut up <@214935314664259584>"};

//Initiate Bot
client.on('ready', () => {
    console.log("civMention online");
    client.user.setActivity('Monitoring Civ 6' + prefix);
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
    if(command ==="!List"){
        var finalMessage = "Here are the current games being played "+JSON.stringify(Object.keys(lastMove));
        message.channel.send(finalMessage);
    }
    else if (command === "!FJ"){
        var size  = Object.keys(fJ).length;
        console.log("FJ size is: " + size +"\n"+JSON.stringify(Object.keys(fJ)));
        if (typeof args[1] !== 'undefined') {
            size++;
            var fJText = "";
            for (var i = 1; i <= args.length-1; i++) {
                fJText += args[i];
                if (i !== args.length-1) {
                    fJText += " ";
                }
            }
            console.log (size +": " + fJText);
            fJ[size] = fJText;
            message.channel.send("Added text");
        } else {
            var finalMessage = "<@214935314664259584> ";
            var keys = Object.keys(fJ);
            finalMessage += fJ[keys[ keys.length * Math.random() << 0]];
            message.channel.send(finalMessage);
        }
    }
    else if (command ==="!Help") {
        var finalMessage = "!List: Lists all current games being played\n!Remind {gameName} will remind the person whose turn it is to make a move";
        message.channel.send(finalMessage);
    }
    else if(command ==="!Remind"){
        var gameName = "";
        for (var i = 1; i <= args.length-1; i++) {
            gameName += args[i];
            if (i !== args.length-1) {
                gameName += " ";
            }
        }
        if( typeof args[1] === 'undefined') {
            var finalMessage = "You need to speicy the name of the game you want me to remind the player";
            message.channel.send(finalMessage);
        }
        else if (typeof lastMove[gameName] !== 'undefined') {
            var finalMessage = "<@" + config.users[lastMove[gameName]] + "> hurry up, it's your move on  " + gameName;
            message.channel.send(finalMessage);
        } else {
            var finalMessage = "I don't have a record of that game.";
            message.channel.send(finalMessage);
        }
    }
    //Check if message is from the webhook
    else if(command === "!Civ") {
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
            if (i !== args.length-1) {
                gameName += " ";
            }
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
            lastPlayer = webHookName;
        } else {
            finalMessage = "The userID for " + webHookName+ " was not found";
            message.channel.send(finalMessage);
            console.log(finalMessage);
            lastPlayer = "N/A";
            return;
        }
        lastMove[gameName] = lastPlayer;
        //Finalize and send message
        finalMessage += "> It's your turn on the Civ6 Cloud Save Game called " + gameName;
        message.channel.send(finalMessage);
        console.log(lastMove);
    } else {
        return;
    }
});
client.login(process.env.BOT_TOKEN);
