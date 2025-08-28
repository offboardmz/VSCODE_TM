// src/app/api/openai.ts

import OpenAI from 'openai';

export const open_ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  
});
