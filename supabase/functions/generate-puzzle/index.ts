
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Categories to pick randomly from
const categories = [
  "history", "science", "psychology", "music", "math", "logic", "word", "riddle"
];
const difficulties = ["easy", "medium", "hard"];
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { userLevel } = await req.json();
    const category = categories[Math.floor(Math.random() * categories.length)];
    const levelNum = Math.max(1, Math.min(3, Math.floor((userLevel || 1) / 2) + 1));
    const difficulty = difficulties[levelNum - 1];

    const model = "google/flan-t5-large"; // Question-generation model (change as desired)
    const prompt = 
      `Generate a ${difficulty} ${category} trivia or logic puzzle. Provide:\nQ: (question)\nA: (answer)\nHINT: (hint)\nThe answer must be one word/short phrase if possible.`;

    // Call Hugging Face proxy edge
    const hfResp = await fetch("https://vvpdemhsuufwogokpkzx.functions.supabase.co/hf-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model }),
    });
    const text = await hfResp.text();
    // Expect the model to return "Q: ...\nA: ...\nHINT: ..."
    // Basic parse
    const mQ = /Q:\s*([^\n]+)\n/.exec(text);
    const mA = /A:\s*([^\n]+)\n/.exec(text);
    const mH = /HINT:\s*([^\n]+)/.exec(text);

    const question = mQ ? mQ[1].trim() : "AI generated puzzle";
    const answer = mA ? mA[1].trim() : "unknown";
    const hint = mH ? mH[1].trim() : "Think hard!";
    // Points: scale by difficulty (1: 15, 2: 30, 3: 50)
    const points = levelNum === 1 ? 15 : levelNum === 2 ? 30 : 50;

    return new Response(JSON.stringify({
      question,
      answer,
      hint,
      category,
      points,
      difficulty
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to generate puzzle", detail: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
