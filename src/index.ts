require('dotenv').config()
import { Client, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js'
import processImages from './process-images'
import logger from './utils/logger'
import { locales } from './locales/locale'
import config from '../config'
const token = process.env.BOT_TOKEN
const SEND_MODE = process.env.SEND_MODE

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
})

client.once(Events.ClientReady, (readyClient) => {
  logger(`Ready! Logged in as ${readyClient.user.tag}`, 'info')
  logger(
    `Debug mode is ${process.env.DEBUG_MODE === 'true' ? 'enabled' : 'disabled'}`,
    'info',
  )
  logger(`Send mode is ${SEND_MODE}`, 'info')
  logger(`DM recipient is ${process.env.DM_RECIPIENT_ID}`, 'info')
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return
  if (message.content.charAt(0) !== '!') return

  if (message.content === '!new') {
    logger(`Received command "!new" from ${message.author.tag}`, 'info')
    message.reply(locales[config.locale].STARTED_PROCESSING)

    const attachments = message.attachments
    if (attachments.size === 0) {
      message.reply(locales[config.locale].NO_ATTACHMENTS)
      return
    }

    const data = await processImages(attachments.map((attachment) => attachment.url))
    let total = 0

    const replyEmbed = new EmbedBuilder()
      .setColor(0x90e38a)
      .setTitle(`${locales[config.locale].EMBED_TITLE} ${message.author.globalName}`)
      .setDescription(
        `${locales[config.locale].CREATED_AT} ${new Date().toLocaleDateString()}`,
      )
      .addFields(
        data.map((receipt) => {
          total += receipt.total
          return {
            name: receipt.shop,
            value: receipt.products
              .map((product) => `${product.name} - ${product.price}${config.currency}`)
              .join('\n'),
          }
        }),
      )
      .addFields({
        name: locales[config.locale].TOTAL_AMOUNT_DUE,
        value: `${total.toFixed(2).toString()}${config.currency}`,
      })

    if (SEND_MODE === 'channel') {
      try {
        logger(`Sending data to ${message.author.tag}`, 'info')
        message.reply({ embeds: [replyEmbed] })
      } catch (err) {
        logger(
          `Command "!new" failed in ${SEND_MODE} mode: ${err.rawError.message}`,
          'error',
        )
        console.log(err)
        message.reply(`${locales[config.locale].COMMAND_ERROR}: ${err.rawError.message}`)
      }
    } else if (SEND_MODE === 'dm') {
      try {
        logger(
          `Sending data to an user with ID of ${process.env.DM_RECIPIENT_ID}`,
          'info',
        )
        await client.users.send(process.env.DM_RECIPIENT_ID, {
          embeds: [replyEmbed],
        })
        message.reply({
          content: `${locales[config.locale].DM_SUCCESS} <@${process.env.DM_RECIPIENT_ID}>`,
          embeds: [replyEmbed],
        })
      } catch (err) {
        logger(
          `Command "!new" failed in ${SEND_MODE} mode: ${err.rawError.message}`,
          'error',
        )
        console.log(err)
        message.reply(`${locales[config.locale].COMMAND_ERROR}: ${err.rawError.message}`)
      }
    } else {
      logger(`Command "!new" failed: Invalid SEND_MODE value`, 'error')
    }
  }
})

client.login(token)
