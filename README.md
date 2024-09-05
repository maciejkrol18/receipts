# Receipts
A discord bot that processes receipts and turns them into an invoice embed. It uses GPT-4o Vision to process the receipts.

## Setup
1. Clone the repository
2. Install the dependencies with `pnpm install`
### Configuration
1. Setup the `.env.` file in the root directory with the following content:
```bash
# Discord bot token
BOT_TOKEN=your-bot-token
# The user ID of the user you want to send the data to
DM_RECIPIENT=your-dm-recipient-user-id
# The mode in which the bot should send the data. Either "channel" or "dm"
# If it's channel it will reply to the message in which the command was used
# If it's dm it will send the data to the user specified in DM_RECIPIENT
SEND_MODE=channel
# OpenAI API key
OPENAI_KEY=your-openai-key
# Debug mode. Set to "true" to enable debug mode, which sends a dummy object to the bot instead of processing the images. Useful for testing whether the embed configuration is valid without using openai credits
DEBUG_MODE=boolean
```
2. In the `config.ts` file, you can change the prompt, locale, and currency. The prompt is the text that the bot will use to process the receipts. The locale is the language of the bot, and the currency is the currency that will be shown alongside the prices. You can modify and add custom locales in the `src/locales/locale.ts` file.
### Running
Run the bot with `pnpm start` which will run a nodemon process. There'll be a Dockerfile soon.

## Usage
The bot uses old-fashioned commands, so you'll have to use the `!` prefix. This is due to the fact
that slash commands do not accept multiple files in the attachment field.

### !new
This command will process the attachments and send you the data in an embed. Simply send a message saying `!new` and attach the receipts you want to process.