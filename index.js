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

const { token, token_dev } = require("./config.json");
const commands = require("./commands.json");
const puppeteer = require("puppeteer");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
let i = 0;
client.on("ready", () => {
  //client.user.setUsername("");
  //client.user.setActivity(`tomar capturas de pantalla`, { type: "PLAYING" });
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
    //console.log(sms, { id: msg.author.id });
    //var r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
    var exprecionDiscord = new RegExp(
      /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discord.com|discordapp.com)\/+?(?=\b)/g,
      "g"
    );
    var exprecionImg = new RegExp(
      /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/,
      "g"
    );
    var r = new RegExp(
      /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/,
      "gm"
    );
    if (exprecionImg.test(sms)) {
      console.log("-------------------------------------");
      console.log(`El enlace es una imagen, no se hace nada.`);
      console.log("-------------------------------------");
      return;
    }
    if (exprecionDiscord.test(sms)) {
      console.log("-------------------------------------");
      console.log(`El enlace pertenece a Discord, no se hace nada.`);
      console.log("-------------------------------------");
      return;
    }
    console.log("-------------------------------------");
    console.log(sms.match(r));
    console.log("-------------------------------------");
    if (r.test(sms)) {
      console.log("Es una url", sms.match(r));
      msg.channel.send(`Creando vista previa de \`${sms.match(r)[0]}\``);
      (async () => {
        try {
          const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: true,
            devtools: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          });
          const page = await browser.newPage();
          await page.setViewport({ width: 1280, height: 720 });
          console.log(sms);
          await page.goto(sms.match(r)[0], {
            waitUntil: "networkidle2",
            timeout: 0,
          });
          const fileTemp = `./tmp/img/${msg.author.id}-${Date.now()}.png`;
          await page.screenshot({ path: fileTemp });
          await browser.close();
          const file = new MessageAttachment(fileTemp);
          const exampleEmbed = new MessageEmbed()
            .setTitle(`Aqui tienes un vista previa del enlace :)`)
            .setImage(`attachment://${fileTemp}`);
          msg.reply({ embeds: [exampleEmbed], files: [file] });
          client.user.setActivity(`${i++} enlaces previsualizados | link!help`, {
            type: "WATCHING",
          });
          setTimeout(function () {
            try {
              fs.unlinkSync(fileTemp);
              //file removed
            } catch (err) {
              console.error(err);
            }
          }, 60000);
        } catch (e) {
          msg.channel.send(JSON.stringify(e));
          msg.reply(
            `No pude crear una previsualización de \`${sms}\`\nNo es una url segura.`
          );
          console.log(`No es una url segura.`);
        }
      })();
    }
    if (command) {
      msg.reply(command.msg);
    }
  }
});

client.login(token);

//msg.content es el contenido del mensaje
