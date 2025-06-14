
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// This edge function expects JSON: { prompt: string }
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { prompt, model = "gpt2" } = await req.json();

  const apiKey = Deno.env.get("HUGGINGFACE_API_KEY");
  if (!apiKey) {
    return new Response("Hugging Face API key not configured", { status: 500 });
  }

  const hfUrl = `https://api-inference.huggingface.co/models/${model}`;

  const hfRes = await fetch(hfUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });

  const result = await hfRes.json();
  return new Response(JSON.stringify(result), {
    status: hfRes.status,
    headers: { "Content-Type": "application/json" }
  });
});
