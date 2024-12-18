module.exports["config"] = {
  name: "autobot",
  aliases: ["fbbot"],
  info: "This command make your account bot",
  type: "autobot create [appstate] [your_uid]",
  version: "1.0.0",
  role: 2,
  cd: 0
};

module.exports["run"] = async ({ api, chat, event, args, fonts }) => {

  const tin = txt => fonts.thin(txt);
  const input = args[0];
  const input_prefix = args[1];
  const input_admin = args[2];
  const input_state = args.slice(3).join(" ");
  
  if (!input) {
    chat.reply(tin(`Autobot usage:\n\nTo create bot use "Autobot create [prefix] [uid-admin] [appstate]\n\nTo see active list "Autobot [online]"`, event.threadID, event.messageID));
    return;
  } else if (input == "online") {
    try {
      //const answering = await chat.reply(tin("⏳ Checking active session, please wait...", event.threadID));

      const urlsz = "http://linda.hidencloud.com:25554/info";   
      const response = await fetch(urlsz); 
      const aiList = await response.json();
      let message = "";
      if (Array.isArray(aiList)) {
        aiList.forEach((result, index) => {
          const { name, profileUrl, time } = result;
          const days = Math.floor(time / (3600 * 24));
          const hours = Math.floor((time % (3600 * 24)) / 3600);
          const minutes = Math.floor((time % 3600) / 60);
          const seconds = Math.floor(time % 60);
          message += `[ ${index + 1} ]\n𝗡𝗔𝗠𝗘: ${name}\n𝗨𝗣𝗧𝗜𝗠𝗘: ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds\n\n`;
        });
        const mark = (`𝗟𝗶𝘀𝘁 𝗼𝗳 𝗔𝗰𝘁𝗶𝘃𝗲 𝗔𝗜:`) + tin(`\n\n${message}`);
        chat.reply(mark, event.threadID, event.messageID);
      } else {
        chat.reply(tin("Handle error: aiList is not an array", event.threadID, event.messageID));
        console.error("Error: aiList is not a valid array");
      }
    } catch (err) {
      chat.reply(err.message, event.threadID, event.messageID);
      console.log(err);
    }
  } else if (input == "create") {
    // Check if any of the required fields are empty
    if (!input_prefix || !input_admin || !input_state) {
      chat.reply(tin("Please provide all the requirements: prefix, admin UID, and appstate.", event.threadID, event.messageID));
      return;
    }

    try {
      const states = JSON.parse(input_state);

      if (states && typeof states === 'object') {
        const info1 = await new Promise(resolve => {
          api.sendMessage("⏳ Making your account as a bot, please wait...", event.threadID, (err, info1) => {
            resolve(info1);
          }, event.messageID);
        });

        const response = await fetch('http://linda.hidencloud.com:25554/login', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prefix: input_prefix,
            admin: input_admin,
            state: states
          })
        });
        const data = await response.json();
        if (data.success === 200) {
          chat.edit(`${data.message}`, info1.messageID);
          console.log(data.message);
        } else {
          chat.edit(`${data.message}`, info1.messageID);
        }
      } else {
        chat.reply('Under development not fully stable, I hope you understand. :>', event.threadID, event.messageID);
      }
    } catch (parseErr) {
      chat.reply(`${parseErr.message}`, event.threadID, event.messageID);
      console.error(parseErr);
    }
  }
};
