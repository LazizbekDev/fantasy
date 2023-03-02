import { Router } from "express";
import { Configuration, OpenAIApi } from "openai";
import { Telegraf } from "telegraf";
import { config } from "dotenv";

config()
const bot = new Telegraf(process.env.TOKEN)
const route = Router();
const configuration = new Configuration({
    apiKey: process.env.OPENAI
})
const openAI = new OpenAIApi(configuration);

bot.start((ctx) => {
    ctx.reply("Hey, write your interesting fantasy")
})


route.get('/', (req, res) => {
    res.send('DALL-E API')
})

bot.on('text', async (ctx) => {
    const prompt = ctx.message.text
    try {
        ctx.reply('It may take a few minutes, pls wait!')
        const generatedImage = await openAI.createImage({
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "url"
        })

        const {data} = await openAI.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            n: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        let caption;
        data.choices.map(choice => {
            caption = choice.text
        })

        const photo = generatedImage.data.data[0].url;

        ctx.replyWithPhoto(photo, {
            caption: caption
        })
    } catch (err) {
        const msg = err.response && err.response.data && err.response.data.message
        console.log(err.response)
        ctx.reply(msg)
    }
})

bot.launch();

export default route;