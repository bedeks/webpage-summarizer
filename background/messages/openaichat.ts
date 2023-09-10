import type { PlasmoMessaging } from "@plasmohq/messaging"
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const CHUNK_SIZE = 30000; // 30,000 characters
    const inputContent = req.body.prompt;
  
    const splitIntoChunks = (content, size) => {
        let chunks = [];
        for (let i = 0; i < content.length; i += size) {
          chunks.push(content.slice(i, i + size));
        }
        return chunks;
      };
      
      let contentChunks = splitIntoChunks(inputContent, CHUNK_SIZE);
      console.log(contentChunks.length);
      
      // Create a function to summarize a single chunk
      const summarizeChunk = async (chunk) => {
        const message = await client.chat.completions.create({
          messages: [
            {role: 'system', content: 'You are an assistant and your job is to summarize the content of the html in 2-4 lines. Leave all the html out of the summary and just explain what the webpage does'},
            {role: 'user', content: chunk}
          ],
          model: 'gpt-3.5-turbo-16k',
        });
        return message.choices[0].message.content;
      };
      
    // Use Promise.all to process all chunks in parallel
    const summarizedChunks = await Promise.all(contentChunks.map(chunk => summarizeChunk(chunk)));
    console.log(summarizedChunks)
    // Now, get a conjoined summary of all the chunks
    const combinedMessage = await client.chat.completions.create({
      messages: [
        {role: 'system', content: 'You are an assistant. Provide a unified summary from the following content'},
        {role: 'user', content: summarizedChunks.join(" ")}
      ],
      model: 'gpt-3.5-turbo-16k',
    });
    console.log(combinedMessage)
    res.send({
      message: combinedMessage
    });
  }
 
export default handler