const moment = require ("moment-timezone");

module.exports.config = {
    name: "callad",
    version: "1.0.0",
    role: 0,
    credits: "Kenneth Aceberos", //modify by Mark Hitsuraan
    aliases: ["feedback"],
    info: "Sends a feedback to the bot admin and developer.",
    usages: "Reply a text. then type {p}feedback",
    cd: 0
};

module.exports.run = async function ({ api, event, admin, chat, args}) {
const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");
  /*if (event.type !== "message_reply"){
    return api.sendMessage("❌ No text detected. Reply the chat that you want to send to feedback.", event.threadID, event.messageID);
  }

  const txt = event.messageReply.body;*/
const txt = args.join(" ");
  if (!txt)
      return api.sendMessage("Please provide a problem to report.\n\nexample: callad <ask>", event.threadID, event.messageID);

     try {
       api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const info1 = await new Promise(resolve => {
        api.sendMessage("⏳ Please wait...", event.threadID, (err, info) => {
        resolve(info);
       }, event.messageID);
      });
  const mark = await api.getUserInfo(event.senderID);
       const tawo = mark[event.senderID].name;
       const txt11 = `Feedback from: ${tawo}\n━━━━━━━━━━━━━━━━━━\nMessage: ${txt}\n━━━━━━━━━━━━━━━━━━\nTime sent: ${time}`
       const adminNeth = "61566984747506";
      api.sendMessage(txt11, admin[0], (err, data) => {

        if (event.senderID !== adminNeth){
        api.sendMessage(txt11, adminNeth);
        }
           if (err){    api.setMessageReaction("", event.messageID, () => {}, true);
             return api.editMessage(`Failed to send callad.`, info.messageID, (err, data) => {});
           }
         api.setMessageReaction("✅", event.messageID, () => {}, true);
           chat.edit(`Successfully sent to the admin.`, info1.messageID, (err, data) => {});
         });

    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
