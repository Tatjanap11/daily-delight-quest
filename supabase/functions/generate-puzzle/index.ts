
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const model = "google/flan-t5-large";

    // **Enhanced prompt for novelty and obscurity**
    const prompt =
      `You are generating a UNIQUE, CHALLENGING, and RARE trivia or logic puzzle in the '${category}' category, at ${difficulty} level. 
Instructions:
- Make the puzzle about an obscure, rare, or recently discovered fact, event, or scientific principle.
- Use knowledge that is surprising, little-known, or unusual, not found in everyday trivia books.
- For science/history/psychology/music: prefer modern breakthroughs, paradoxes, or rare historical events, not typical school facts.
- For riddle/logic/math: Make it non-obvious or require creative, clever reasoning.
- Vary puzzle structure (not just Q:A!).
- Provide:
Q: (question)
A: (short, concise, specific answer)
HINT: (clever hint that nudges, without obviously giving it away)
Answer must be precise and require some research or deep thinking.
Format: "Q: ...\\nA: ...\\nHINT: ...".
`;

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

    const question = mQ ? mQ[1].trim() : "A rare AI generated puzzle";
    const answer = mA ? mA[1].trim() : "unknown";
    const hint = mH ? mH[1].trim() : "Think differently!";
    // Points: scale by difficulty (1: 20, 2: 40, 3: 70)
    const points = levelNum === 1 ? 20 : levelNum === 2 ? 40 : 70;

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
