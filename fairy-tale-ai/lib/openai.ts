// src/app/api/openai.ts

import OpenAI from 'openai';

export const open_ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  
});

/* export interface LLMRequest {
  prompt: string;
}

export async function InvokeLLM({ prompt }: LLMRequest): Promise<string> {
  console.log("Calling LLM with prompt:", prompt);
 try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // быстрый и дешёвый вариант
      messages: [
        { role: "system", content: "You are a creative storyteller AI." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300, // ограничим длину ответа
    });

    // Достаём текст
    const text = response.choices[0]?.message?.content || "";
    return text;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("LLM request failed");
  }
} */