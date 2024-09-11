# 🧾 Receipts
A discord bot that processes receipts with GPT-4o Vision and turns them into an invoice embed. Made for my own private usecase

## ⚒ Setup
### 🤖 Creating a new Discord app
1. Head over to ![Discord Developer Portal](https://discord.com/developers/applications) and create a new app
2. Make sure it has "Administator" set in the Guild Install permissions field over at `Installation > Default Install Settings`
3. Invite the bot to your server/guild with the installation link at `Installation > Install Link`. Go to that URL and follow the instructions on screen.
### 📁 Setting up the code
1. Clone the repo
```bash
git clone maciejkrol18/receipts-bot
```
2. `cd` into it
```bash
cd receipts-bot
```
3. Install the dependencies. We're using the `pnpm` package manager in this project. If it's not installed on your system, given you have npm installed already, you can install it with `npm install -g pnpm`.
```bash
pnpm install
```
4. Instructions regarding running the bot are located in the [Running](#-running) section
## ⚙ Configuration
### 1. Environment variables
Setup the `.env` file in the root directory with the following content:
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
### 2. The config file
Modify the `config.ts` file in the root directory according to your needs. Change the language by choosing a valid locale code from `src/locales/locale.ts`. The currency is any kind of string you want appended to prices and the total amount due. If you decide to make changes to the prompt, rembember to adjust the `isValidReceiptData` function in `src/process-images.ts` and the `ReceiptData` interface to match the new prompt.

## ✨ Running
### 👤 Locally
#### Development
Run the bot with `pnpm dev` which will run a nodemon process, triggering bot restarts on file changes.
#### Production
1. Build the bot with `pnpm build`
2. Run the bot with `pnpm start`
### 🐳 Docker
1. Build the docker image with `docker build -t receipts-bot-image .`
2. Create and run a new container with the image with `docker run -d --name receipts-bot-container receipts-bot-image`

## 💻 Usage
The bot uses old-fashioned commands, so you'll have to use the `!` prefix. This is due to the fact
that slash commands do not accept multiple files in the attachment field, which is not ideal since you'll probably want to analyze more than 1 receipt at a time.

### !new
This command will process the attachments in the message and send the data accordingly to your `SEND_MODE`. Simply send a message saying `!new` and attach images of the receipts you want to process. Make sure they're as readable as possible for the best results.

## 🐞 Troubleshooting
If you want to use the DM mode, the target user needs to be in the same server as you and the bot. Otherwise, you'll get an error saying that you're unable to send messages to that user.
If your embed is setup incorrectly, you're most likely to get a "Invalid Form Body" error. Check how the embed is being created, tweak it and try again. The full error message should contain very clear explanation of what's causing the error
