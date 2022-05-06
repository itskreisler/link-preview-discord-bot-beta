const { Client, MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
/* const dbJson = require("./DBSJON");
var pathDB = "./tmp/db/users.json";

var json_db = new dbJson(pathDB);
var users = json_db.select("id, username").where({
    "id": "159985870458322944",
    "username": "MEE6"
  }).get; */
/* json_db.insert({
  name: "Thomas",
  state: "Nigeria",
  id: String(22),
}); */
//console.log(users);


const { clientId, guildId, token } = require("./config.json");
const commands = require("./commands.json");
const puppeteer = require("puppeteer");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
  //client.user.setUsername("");
  client.user.setActivity(`tomar capturas de pantalla`, { type: "PLAYING" });
  console.log("Bot Now connected!");
  console.log("Logged In as", client.user.tag);
  client.user.setStatus("online"); // online, idle, invisible, dnd
  console.log("Bot status: ", client.user.presence.status);
  /*if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if(!fs.existsSync(`${dir}/${path}`)){
    fs.writeFileSync("tmp/users.json", data, "utf-8");
  }*/
  /*fs.writeFile(path, data, { flag: "wx" }, function (err) {
    if (err) throw err;
    console.log("It's saved!");
  });*/
});

client.on("messageCreate", (msg) => {
  var sms = msg.content;
  if (!msg.author.bot) {
    const command = commands.find((command) => sms.includes(command.prefix));
    console.log(sms, { id: msg.author.id });
    //var url = "https://www.google.com/";
    //var r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
    var r = new RegExp(
      /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/,
      "gm"
    );
    console.log(sms.match(r));
    if (r.test(sms)) {
      console.log("Es una url", sms.match(r));
      msg.channel.send(`Creando vista previa de \`${sms}\``);
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.setViewport({ width: 1280, height: 720 });
          await page.goto(sms, {
            waitUntil: "load",
            timeout: 0,
          });
          const fileTemp =`./tmp/img/${msg.author.id}-${Date.now()}.png`;
          await page.screenshot({ path: fileTemp });
          await browser.close();
          const file = new MessageAttachment(fileTemp);
          const exampleEmbed = new MessageEmbed()
          .setTitle(`Aqui tienes un vista previa del enlace :)`)
          .setImage(
            `attachment://${fileTemp}`
          );
          msg.channel.send({ embeds: [exampleEmbed], files: [file] });
          setTimeout(function(){
            try {
              fs.unlinkSync(fileTemp)
              //file removed
            } catch(err) {
              console.error(err)
            }
          },60000);
        } catch (e) {
          msg.channel.send(JSON.stringify(e));
          msg.channel.send(`\`${sms}\`No es una url segura.`);
          console.log(`No es una url segura.`);
        }
      })();
    }
    if (command) {
      msg.channel.send(command.msg);
    }
  }
});

client.login(token);

//msg.content es el contenido del mensaje
