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
    "x-api-key": apiKey as string,
    "anthropic-version": "2023-06-01",
  };
  const body = JSON.stringify({
    model: model,
    max_tokens: 1024,
    messages: [...messages, { role: "user", content: json.query }],
  });
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    headers: headers,
    body: body,
    method: "POST",
  }).catch((error) => {
    console.error(error);
    return error;
  });
  const data = await response.json();
  if (data.error) {
    return new Response(JSON.stringify({ error: data.error }));
  }
  const generatedMessage: MessageSchema = {
    role: "assistant",
    content: data.content[0].text,
  };
  return new Response(JSON.stringify(generatedMessage));
}
