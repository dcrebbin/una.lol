export interface MessageSchema {
  role: "assistant" | "user" | "system" | "question";
  content: string;
}

export async function POST(req: Request, res: Response) {
  const json = await req.json();
  const apiKey = req.headers.get("x-api-key");
  const messages: MessageSchema[] = json.messages;
  const model = json.model;
  const headers: any = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const body = JSON.stringify({
    model: model,
    messages: [
      {
        role: "system",
        content: "",
      },
      ...messages,
      {
        role: "user",
        content: json.query,
      },
    ],
  });
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: headers,
    body: body,
    method: "POST",
  });
  const data = await response.json();
  if(data.error) {
    return new Response(JSON.stringify({ error: data.error }));
  }
  const generatedMessage: MessageSchema = {
    role: "assistant",
    content: data.choices[0].message.content,
  };
  return new Response(JSON.stringify(generatedMessage));
}
