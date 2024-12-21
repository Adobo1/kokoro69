module.exports["config"] = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  aliases: ['info', 'menu'],
  usage: '[command]',
  info: "Beginner's guide",
  credits: 'Developer',
};

module.exports["run"] = async function ({ api, event, Utils, prefix, args, chat, fonts }) {
  const input = args.join(' ').trim().toLowerCase();
  const tin = txt => fonts.thin(txt);
  const allCommands = [...Utils.commands.values(), ...Utils.handleEvent.values()];
  const perPage = 11; // 
  const maxFirstPage = 230;

  try {
    const totalCommands = allCommands.length;

    if (!input) {
      let helpMessage = `📋 | CMDS List: 〔${prefix || 'no prefix'}〕\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      const firstPageCommands = allCommands.slice(0, perPage);
      firstPageCommands.forEach((command, index) => {
        const { name, info, usage } = command;
        helpMessage += `\t${index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      helpMessage += `\nFor all cmds, type '${prefix || ''}help all'\n`;
      chat.reply(tin(helpMessage));
    } 
    else if (/^(all|command|commands?|commandd)$/i.test(input)) {
      let helpMessage = `📋 | CMDS List: 〔${prefix || 'no prefix'}〕\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      const allCommandsSubset = allCommands.slice(0, maxFirstPage); // 250 commands for 'helpv2 all'
      allCommandsSubset.forEach((command, index) => {
        const { name, usage } = command;
        helpMessage += `\t${index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      chat.reply(tin(`${helpMessage}\nMessage too long, To see more commands type "Help allv2"`));
    } 
    else if (/^(allv2|restcommands)$/i.test(input)) {
      let helpMessage = `📋 | CMDS List (231 - ${totalCommands}): 〔${prefix || 'no prefix'}〕\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      const startIndex = 230; // Start from the 251st command (index 250)
      const allCommandsSubset = allCommands.slice(startIndex);

      allCommandsSubset.forEach((command, index) => {
        const { name, usage } = command;
        helpMessage += `\t${startIndex + index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      chat.reply(tin(`${helpMessage}`));
    } /*
    else if (/^(all3)$/i.test(input)) {
      let helpMessage = `📋 | CMDS List (from 451 to 650): 〔${prefix || 'no prefix'}〕\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      const startIndex = 450; // Start from the 451st command (index 450)
      const allCommandsSubset = allCommands.slice(startIndex, 650);

      allCommandsSubset.forEach((command, index) => {
        const { name, usage } = command;
        helpMessage += `\t${startIndex + index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      chat.reply(tin(helpMessage));
    } 
    else if (/^(all4)$/i.test(input)) {
      let helpMessage = `📋 | CMDS List (from 651 to 850): 〔${prefix || 'no prefix'}〕\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      const startIndex = 650; // Start from the 651st command (index 650)
      const allCommandsSubset = allCommands.slice(startIndex, 850);

      allCommandsSubset.forEach((command, index) => {
        const { name, usage } = command;
        helpMessage += `\t${startIndex + index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      chat.reply(tin(helpMessage));
    } 
    else if (/^(all5)$/i.test(input)) {
      let helpMessage = `📋 | CMDS List (from 851 to ${totalCommands}): 〔${prefix || 'no prefix'}〕\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      const startIndex = 850; // Start from the 851st command (index 850)
      const allCommandsSubset = allCommands.slice(startIndex);

      allCommandsSubset.forEach((command, index) => {
        const { name, usage } = command;
        helpMessage += `\t${startIndex + index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      chat.reply(tin(helpMessage));
    } */
    else if (!isNaN(input)) {
      const page = parseInt(input);
      const totalPages = Math.ceil(totalCommands / perPage);

      if (page < 1 || page > totalPages) {
        chat.reply(`Invalid page number. Please specify a page between 1 and ${totalPages}.`);
        return;
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = Math.min(startIndex + perPage, totalCommands);
      const commandsOnPage = allCommands.slice(startIndex, endIndex);

      let helpMessage = `📋 | CMDS List: Page ${page}/${totalPages}\n`;
      helpMessage += `Total Commands: ${totalCommands}🏷️\n\n`;

      commandsOnPage.forEach((command, index) => {
        const { name, usage } = command;
        helpMessage += `\t${startIndex + index + 1}. ${name} ${usage ? `${usage}` : ''}\n`;
      });

      chat.reply(tin(helpMessage));
    } 
    // Handle individual command details
    else {
      const selectedCommand = allCommands.find(command => {
        const aliases = command?.aliases || [];
        return command.name.toLowerCase() === input || aliases.includes(input);
      });

      if (selectedCommand) {
        const { name, version, role, aliases = [], info, usage, credits, cd } = selectedCommand;
        const roleMessage = role !== undefined ? `Role: ${role}` : '';
        const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = info ? `Info: ${info}\n` : '';
        const usageMessage = usage ? `Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `Author: ${credits}\n` : '';
        const versionMessage = version ? `Version: ${version}\n` : '';
        const cooldownMessage = cd ? `Cooldown: ${cd} second(s)\n` : '';
        const message = `COMMAND\n\nName: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        chat.reply(tin(message));
      } else {
        chat.reply(tin(`Command '${input}' not found. Use '${prefix || ''}help' to see available commands.`));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports.handleEvent = async function ({ event, prefix, chat, fonts }) {
  const { body } = event;
  const tin = txt => fonts.thin(txt);
  const message = prefix ? 'This is my prefix: ' + prefix : "Sorry, I don't have a prefix";

  if (body?.toLowerCase().startsWith('prefix')) {
    chat.reply(tin(message));
  }
};
