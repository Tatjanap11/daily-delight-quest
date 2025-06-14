
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { hfApiRequest } from "./hfApiRequest.ts";

// This edge function expects JSON: { prompt: string, model?: string }
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let prompt: string | undefined = undefined;
  let model = "gpt2";
  try {
    const body = await req.json();
    prompt = body.prompt;
    if (!prompt) throw new Error("Missing prompt");
    if (body.model) model = body.model;
  } catch {
    return new Response("Invalid JSON or missing prompt", { status: 400 });
  }

  const apiKey = Deno.env.get("HUGGINGFACE_API_KEY");
  if (!apiKey) {
    return new Response("Hugging Face API key not configured", { status: 500 });
  }

  const hfResponse = await hfApiRequest({ prompt, model, apiKey });

  return new Response(JSON.stringify(hfResponse.data), {
    status: hfResponse.status,
    headers: { "Content-Type": "application/json" },
  });
});
