
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// More sophisticated categories with specific focus areas
const categories = [
  "obscure_history", "cutting_edge_science", "complex_psychology", "advanced_music_theory", 
  "higher_mathematics", "philosophical_logic", "linguistic_puzzles", "cryptic_riddles"
];
const difficulties = ["medium", "hard", "expert"];
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
    const levelNum = Math.max(2, Math.min(3, Math.floor((userLevel || 1) / 2) + 1)); // Start from medium
    const difficulty = difficulties[levelNum - 2]; // Adjust index for medium start

    const model = "google/flan-t5-large";
    
    // Enhanced prompts for more sophisticated content
    const categoryPrompts = {
      "obscure_history": "Generate a challenging historical puzzle about a lesser-known but significant event, person, or discovery that most people haven't heard of. Focus on Byzantine Empire secrets, forgotten civilizations, or hidden historical connections.",
      "cutting_edge_science": "Create a puzzle about recent scientific breakthroughs (2020-2024), quantum physics phenomena, or emerging technologies like CRISPR applications, gravitational wave discoveries, or exoplanet research.",
      "complex_psychology": "Design a puzzle about advanced psychological concepts like metacognition, cognitive biases interactions, or recent neuroscience discoveries about consciousness and decision-making.",
      "advanced_music_theory": "Create a challenging music theory puzzle involving complex harmonies, rare musical scales, or the mathematics behind sound frequencies and acoustic phenomena.",
      "higher_mathematics": "Generate a puzzle involving advanced mathematical concepts like topology, number theory, or mathematical proofs that require deep thinking.",
      "philosophical_logic": "Design a logic puzzle involving philosophical paradoxes, ethical dilemmas, or complex reasoning chains that challenge conventional thinking.",
      "linguistic_puzzles": "Create a challenging word puzzle involving etymology, linguistic evolution, or the structure of less common languages.",
      "cryptic_riddles": "Generate a sophisticated riddle that requires multiple layers of thinking, wordplay, and knowledge synthesis to solve."
    };

    const prompt = `${categoryPrompts[category] || categoryPrompts["cryptic_riddles"]} 
    Difficulty: ${difficulty}
    
    Provide:
    Q: (challenging question that requires deep thinking)
    A: (concise answer - preferably 1-3 words)
    HINT: (subtle hint that guides thinking without giving away the answer)
    
    Make it intellectually stimulating but solvable with careful thought.`;

    const hfResp = await fetch("https://vvpdemhsuufwogokpkzx.functions.supabase.co/hf-proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model }),
    });
    const text = await hfResp.text();
    
    const mQ = /Q:\s*([^\n]+)\n/.exec(text);
    const mA = /A:\s*([^\n]+)\n/.exec(text);
    const mH = /HINT:\s*([^\n]+)/.exec(text);

    const question = mQ ? mQ[1].trim() : "What ancient civilization used a base-60 number system that we still use today for time measurement?";
    const answer = mA ? mA[1].trim() : "babylonians";
    const hint = mH ? mH[1].trim() : "Think about the origin of our 60-minute hours and 60-second minutes.";
    
    // Higher points for more challenging content
    const points = levelNum === 2 ? 40 : levelNum === 3 ? 60 : 80;

    return new Response(JSON.stringify({
      question,
      answer,
      hint,
      category: category.replace('_', ' '),
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
