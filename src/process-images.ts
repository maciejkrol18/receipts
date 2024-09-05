require('dotenv').config()
import OpenAI from 'openai'
import logger from './utils/logger'
import config from '../config'

// Return dummy object to check if Discord can even reply with the embed
const DEBUG_MODE = process.env.DEBUG_MODE === 'true'

const dummyObject = {
  shop: 'Shop',
  date: '2023-01-01',
  products: [
    {
      name: 'Product 1',
      price: 10,
    },
    {
      name: 'Product 2',
      price: 20,
    },
  ],
  total: 30,
}

interface ReceiptData {
  shop: string
  date: string
  products: {
    name: string
    price: number
  }[]
  total: number
}

function isValidReceiptData(data: unknown): data is ReceiptData {
  const parsedData = JSON.parse(data as string)
  return (
    typeof parsedData === 'object' &&
    parsedData !== null &&
    'shop' in parsedData &&
    'date' in parsedData &&
    'products' in parsedData &&
    'total' in parsedData
  )
}

export default async function processImages(
  attachmentUrls: string[],
): Promise<ReceiptData[]> {
  logger('Processing images...', 'info')

  if (DEBUG_MODE) {
    logger('Running processImages() in debug mode', 'warn')
    return [dummyObject]
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response: ReceiptData[] = []
  await Promise.all(
    attachmentUrls.map(async (url, index) => {
      logger(`Started processing image ${index + 1} of ${attachmentUrls.length}`, 'info')
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: config.prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: url,
                },
              },
            ],
          },
        ],
        model: 'gpt-4o-mini',
      })
      logger(`Finished processing image ${index + 1} of ${attachmentUrls.length}`, 'info')
      if (isValidReceiptData(completion.choices[0].message.content)) {
        response.push(JSON.parse(completion.choices[0].message.content))
      } else {
        logger(`Image ${index + 1} is not a receipt`, 'error')
      }
    }),
  )
  logger('Finished processing all images', 'info')
  return response
}
