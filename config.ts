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
    products - an array of objects that have a name (string) and price (number) properties, corresponding to the names and prices of bought products on the receipt. Prefix each product with an emoji you deem to be most appropiate for the product type. 
    Return the data in JSON format. Reply only with the JSON data. Do not use markdown in your response.
  `,
  locale: 'pl_PL',
  currency: 'zł',
} satisfies Config
