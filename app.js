const config = require("./config.js");

const Discord = require("discord.js");
const client = new Discord.Client();

const Twitter = require("twitter");
const twitterClient = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret
});

// Persistent variables.
var tweets = 0;

client.once("ready", () => {
    console.log(`Logged in as ${client.user.username}#${client.user.discriminator}.`);
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const m = await message.channel.send("Ping?");
        await m.edit(`:ping_pong: **Pong!** The response time is ${Math.round(client.ws.ping)}ms. Additionally, the message response time is ${m.createdTimestamp - message.createdTimestamp}ms.`);   
    }

    if (command === "tweet") {
        if (message.author.id !== "YOUR USER ID HERE") return message.channel.send(":x: You're missing the required permissions to execute this command.");

        const dataTweet = args.join(" ");
        if (!dataTweet) return message.channel.send("<:cross:869379635383779329> You're missing one or more of the required arguments for this command to execute properly.");

        twitterClient.post("statuses/update", {
            status: `${dataTweet}`
        }).then((tweet) => {
            message.channel.send(":white_check_mark: **Pog!** Your tweet has been posted successfully.");
            
            const embed = new Discord.MessageEmbed();
                embed.setColor("#1DA1F2");
                embed.setTitle("Tweet Information");
                embed.addField("Tweet Link", `[Click Here](https://twitter.com/${tweet.user.screen_name}/status/${tweet.id})`, true);
                embed.addField("Tweet ID", `${tweet.id}`, true);
                embed.addField("Tweet Content", `${tweet.text}`, true);
                embed.setFooter(`You've posted ${tweets++} times since the last process restart.`);
            message.channel.send({ embed: embed });
        });
    }
});

client.login(config.token);
