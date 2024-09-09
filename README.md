> [!IMPORTANT]
> Dockerfile isn't functional yet, i'm figuring it out

# 🧾 Receipts
A discord bot that processes receipts with GPT-4o Vision and turns them into an invoice embed. Made for my own private usecase

## ⚒ Setup
1. Create a new Discord application on the ![Discord Developer Portal](https://discord.com/developers/applications)
2. Make sure it has "Administator" set in the Guild Install permissions field over at `Installation > Default Install Settings`
3. Invite the bot to your server/guild with the Install Link at `Installation > Install Link`
4. Fork and clone the repository
5. Install the dependencies with `pnpm install`
### ⚙ Configuration
1. Setup the `.env` file in the root directory with the following content:
```bash
# Discord bot token
BOT_TOKEN=your-bot-token
# The user ID of the user you want to send the data to
DM_RECIPIENT=your-dm-recipient-user-id
# The mode in which the bot should send the data. Either "channel" or "dm"
# CHANNEL MODE
# The bot will only reply with the embed to the message which initiated a command
# DM MODE
# The bot will send the embed both on the channel and to the user specified with DM_RECIPIENT_ID
SEND_MODE=channel
# OpenAI API key
# Assuming that you take a photo of your receipt and its resolution is 3000x4000 it'll cost you $0.003825
OPENAI_KEY=your-openai-key
# Debug mode.
# Set to "true" to enable debug mode, which sends a dummy object to the bot instead of processing the images.
# Useful for testing whether the embed configuration is valid without using openai credits
DEBUG_MODE=boolean
```
2. Setup the `config.ts` file in the root directory with the following example content:
```ts
import type { Locale } from './src/locales/locale'

interface Config {
  prompt: string
  locale: Locale
  currency: string
}

export default {
  prompt: `
    Read the contents of the image. It should be a receipt. If it isn't a receipt just return "Not a receipt." Otherwise, extract the following information:
    shop - name of the shop
    products - an array of objects that have a name and price key, corresponding to the names and prices of bought products on the receipt. Prefix each product with an emoji you deem to be most appropiate for the product type
    Return the data in JSON format. Reply only with the JSON data. Do not use markdown in your response.
  `,
  locale: 'pl_PL',
  currency: 'zł',
} satisfies Config
```
The above is an example of what I use - choose a valid locale code from `src/locales/locale.ts`. The currency is any kind of string you want appended to prices and the total amount due. If you decide to make changes to the prompt, rembember to adjust the `isValidReceiptData` function in `src/process-images.ts` and the `ReceiptData` interface to match the new prompt.

### ✨ Running
Run the bot with `pnpm start` which will run a nodemon process. There'll be a Dockerfile soon.
### 🐞 Troubleshooting
If you want to use the DM mode, the target user needs to be in the same server as you and the bot. Otherwise, you'll get an error saying that you're unable to send messages to that user.
If your embed is setup incorrectly, you're most likely to get a "Invalid Form Body" error. Check how the embed is being created, tweak it and try again. The full error message should contain very clear explanation of what's causing the error


## 💻 Usage
The bot uses old-fashioned commands, so you'll have to use the `!` prefix. This is due to the fact
that slash commands do not accept multiple files in the attachment field.

### !new
This command will process the attachments in the message and send the data accordingly to your `SEND_MODE`. Simply send a message saying `!new` and attach images of the receipts you want to process. Make sure they're as readable as possible for the best results.
