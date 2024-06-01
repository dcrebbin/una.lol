import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { MessageSchema } from "../../openai/generate-message/route";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(req: Request, res: Response) {
  const json = await req.json();

  const { messages, query, model } = json;
  const apiKey = req.headers.get("x-api-key");

  const genAI = new GoogleGenerativeAI(apiKey as string);

  const generativeModel = genAI.getGenerativeModel({
    model: model,
  });

  const convertedHistory = messages.map((message: MessageSchema) => {
    return {
      role: message.role == "assistant" ? "model" : message.role,
      parts: [{ text: message.content }],
    };
  });

  const chatSession = generativeModel.startChat({
    generationConfig,
    safetySettings,
    history: convertedHistory,
  });
  const result = await chatSession.sendMessage(query).catch((error) => {
    console.error(error);
    return error;
  });

  const generatedMessage: MessageSchema = {
    role: "assistant",
    content: result.response.candidates[0].content.parts[0].text,
  };
  return new Response(JSON.stringify(generatedMessage));
}
