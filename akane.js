const Discord = require("discord.js");
const http = require('http');
const request = require("request");
const cheerio = require("cheerio");
const yt = require('ytdl-core');
const fs = require('fs');

const myID = "143410974693654528";
const zaminoxID = "110006183783321600";

const site = "https://myanimelist.net/anime.php?q=";
var site2 = "https://myanimelist.net/manga.php?q=";
var space = "\n";
var pre = "```";

const client = new Discord.Client();
const token = 'MjI5Nzg1NTYxMzA3NTQ1NjEx.CsoUCQ.Cl2zbgzC8eYV3OHAoNziGnwaIFA';

client.on('ready', () => {
    
   console.log('Successfully loaded! On '+ client.guilds.size + ' Servers!');
    
});

client.on('message', message => {
    
    var input = message.content;
    
    var chiffre1 = parseInt(process.argv[1]);
    var chiffremath = process.argv[2];
    var chiffre2 = parseInt(process.argv[3]);
    
    var urlAvatar = process.argv[1];
    
    var statusSet = process.argv[1];
    var gameSet = process.argv[2];
	
    if(message.content.startsWith(":help"))
    {
        message.reply('Here are all the commands:' 
                      + space 
                      + pre + 
                      ':help - Help commands.' 
                      + space +
                      '------------------------------------' 
                      + space +
                      'MUSIC:'
                      + space +
                      '    :play (yt url) - play the selected music.'
                      + space +
                      '    :stop - you can stop the music is playing!'
                      + space +
                      '------------------------------------'
                      + space +
                      'ANIME & MANGA:'
                      + space +
                      '    :anime (args) - Looking for anime on MAL.' 
                      + space +
                      '    :manga (args) - Looking for a manga on MAL.' 
                      + space +
                      '------------------------------------'
                      + space +
                      'MAIN COMMANDS:'
                      + space +
                      "    :tts (args) - send a TTS message."
                      /*+ space +
                      ":avatar ([args] Prochainement) - Obtenir votre avatar ou celui d'une                              personne."
                      + space +
                      ":math (chiffre) ((+)(-)(*)(/)) (chiffre) - Calculer 2 chiffres (pas encore                       terminer)."*/
                      + space +
                      "    :setAvatar (URL) - Mettre un nouvelle avatar au bot."
                      + space +
                      '------------------------------------'
                      + space +
                      'BOT OWNER COMMANDS:'
                      + space +
                      "    :setStatus (Status) (Game) - Set a status and a game on the bot!"
                      + space +
                      "        > (Status) = online [or] idle"
                      + space +
                      "        > (Game) = What you want!"
                      + space +
                      "    :delete (number) - Delete the number of selected messages!"
                      + space +
                      '------------------------------------' 
                      + space +
                      'Made by Anasayoten.'
                      + pre);
    }
    
    if (input === ':ping')
    {
        message.reply('pong');
    }
    
    if (input === ':math')
    {
        
    }
    
    if (message.content.startsWith(':tts'))
    {
        let text = message.content.replace(':tts ', '');
        message.channel.sendTTSMessage(text)
            .then(message => console.log(`Sent tts message: ${message.content}`))
            .catch(console.log);    
    }
    
    if (message.content.startsWith(':setStatus online'))
    {
        if (message.author.id !== myID) return;
        let text = message.content.replace(':setStatus online ', '');
        client.user.setStatus('online', text)
            .then(user => message.reply('Changed status!'))
            .catch(console.log);
    }
    
    if (message.content.startsWith(':setStatus idle'))
    {
        if (message.author.id !== myID) return;
        let text = message.content.replace(':setStatus idle ', '');
        client.user.setStatus('idle', text)
            .then(user => message.reply('Changed status!'))
            .catch(console.log);
    }
    
    if (message.content.startsWith(':setAvatar'))
    {
        let urlAvatar = message.content.replace(':setAvatar http://', '');
        
        let AvatarURLSet = http.get("http://" + urlAvatar, response => {
            response.pipe(fs.createWriteStream("http://" + urlAvatar));
        });
        
        client.user.setAvatar(AvatarURLSet)
            .then(user => console.log(`New avatar set!`))
            .catch(console.log);
    }
    
    if (message.content.startsWith(':delete')) {
        
        if (message.author.id !== myID) return;
        
        message.delete()
            .then(message => console.log(`Deleted message from ${message.author}`))
            .catch(console.log);
        
        let messagecount = message.content.replace(':delete ', '');
        
        if(messagecount > 1){
            message.channel.fetchMessages({limit: messagecount})
                .then(messages => message.channel.bulkDelete(messages));
            message.reply(messagecount + " deleted messages!");
        } else {
            message.reply("You must be between 2 and X");
        }
    }
    
    /*if (message.content.startsWith(':play')){
        const voiceChannel = message.member.voiceChannel;
        let link = message.content.replace(':play ', '');

        console.log(link);

        if (!voiceChannel){
            message.reply("Vous n'êtes pas sur un salon vocal");

        } else {
        voiceChannel.join()
            .then (connection => {

                let stream = yt(link, {audioonly: true});

                const dispatcher = connection.playStream(stream);
                dispatcher.on('err', () => {
                    console.log(err);
                })

                dispatcher.on('end', () => {
                    voiceChannel.leave();
                })
            })
            console.log(link);
        };
    };
    
    if (message.content === ':avatar') {
        message.reply(message.author.avatarURL);
    }*/
    
	if(message.content.startsWith(':anime'))
    {
    let search = message.content.replace(':anime ', '');
    let lien = "https://myanimelist.net/anime.php?q=" + search;
    request(lien, function (error, response, body) {
    if (error) console.log("Error " + error);
        
    if (response.statusCode === 200) {
        var $ = cheerio.load(body);
        var link = [];
        $('tr td a.hoverinfo_trigger').each(function(i, a) {
            if(link.indexOf($(a).attr("href")) == -1) link.push($(a).attr("href"));
                if(link.length >= 3) {
                    message.channel.sendMessage(link.join("\n"));
                    return false;
                }
            });
    }
    });
    }
    
    
    if(message.content.startsWith(':manga'))
    {
    let search = message.content.replace(':manga ', '');
    let lien = "https://myanimelist.net/manga.php?q=" + search;
    request(lien, function (error, response, body) {
    if (error) console.log("Error " + error);
        
    if (response.statusCode === 200) {
        var $ = cheerio.load(body);
        var link = [];
        $('tr td a.hoverinfo_trigger').each(function(i, a) {
            if(link.indexOf($(a).attr("href")) == -1) link.push($(a).attr("href"));
                if(link.length >= 3) {
                    message.channel.sendMessage(link.join("\n"));
                    return false;
                }
            });
    }
    });
    }
});

client.on('message', message => {
  if (message.content.startsWith(':play')) {
    const voiceChannel = message.member.voiceChannel;
    let link = message.content.replace(':play ', '');
    if (!voiceChannel) {
      return message.reply('Please be in a voice channel first!');
    } 
    voiceChannel.join()
      .then(connnection => {
        let stream = yt(link, {audioonly: true});
        const dispatcher = connnection.playStream(stream);
        dispatcher.on('end', () => {
          voiceChannel.leave();
        });
        /*
        if (message.content.startsWith(':volume'))
        {
            let volumeNumber = message.content.replace(':volume ', '');
            dispatcher.setVolume(volumeNumber);
        }*/
            
        /*if (message.content.startsWith(':volume+')){
            if (Math.round(dispatcher.volume*50) >= 100) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
            dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(message.content.split('+').length-1)))/50,2));
            message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
        } else if (message.content.startsWith(':volume-')){
            if (Math.round(dispatcher.volume*50) <= 0) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
            dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(message.content.split('-').length-1)))/50,0));
            message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
        }*/
        
        dispatcher.setVolume(0.3);
        
        let urlSend = message.content.replace(':play https://', '');
        yt.getInfo(link, function(err, info) {
            console.log("------------------------------------" + space + 
                        "MUSIC >> " + info.title + ", " + link + 
                        space + "------------------------------------")
            message.reply('Play: ' + "**" + info.title + "**");
        });
      });
  }
    
  if(message.content.startsWith(':stop')) {
      const voiceChannel = message.member.voiceChannel;
      voiceChannel.leave();
  }
});

client.login(token);
