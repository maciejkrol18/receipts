require('dotenv').config()
import OpenAI from 'openai'
import logger from './utils/logger'
import config from '../config'

// Return dummy object to check if Discord can even reply with the embed
const DEBUG_MODE = process.env.DEBUG_MODE === 'true'

const dummyObject: ReceiptData = {
  shop: 'Shop',
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
}

interface ReceiptData {
  shop: string
  products: {
    name: string
    price: number
  }[]
}

interface ImageProcessingResponse {
  failures: number
  data: ReceiptData[]
}

// Remember to adjust this function's return statement as you change the ReceiptData interface
function isValidReceiptData(data: unknown): data is ReceiptData {
  const parsedData = JSON.parse(data as string)
  return (
    typeof parsedData === 'object' &&
    parsedData !== null &&
    'shop' in parsedData &&
    'products' in parsedData
  )
}

export default async function processImages(
  attachmentUrls: string[],
): Promise<ImageProcessingResponse> {
  logger('Processing images...', 'info')

  if (DEBUG_MODE) {
    logger('Running processImages() in debug mode', 'warn')
    return {
      failures: 1,
      data: [dummyObject],
    }
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const data: ReceiptData[] = []
  let processingFailures = 0
  await Promise.all(
    attachmentUrls.map(async (url, index) => {
      logger(`Started processing image ${index + 1} of ${attachmentUrls.length}`, 'info')
      try {
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
        logger(
          `Finished processing image ${index + 1} of ${attachmentUrls.length}`,
          'info',
        )
        if (isValidReceiptData(completion.choices[0].message.content)) {
          data.push(JSON.parse(completion.choices[0].message.content))
        } else {
          logger(`Image ${index + 1} is not a receipt`, 'error')
          processingFailures += 1
        }
      } catch (err) {
        logger(`Image ${index + 1} failed to process: ${err}`, 'error')
        processingFailures += 1
      }
    }),
  )
  logger('Finished processing all images', 'info')
  return {
    failures: processingFailures,
    data,
  }
}
