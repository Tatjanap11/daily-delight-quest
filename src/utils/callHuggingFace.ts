
import { HfRequest, HfResponse } from "./hfTypes";

/**
 * Calls the Hugging Face proxy edge function.
 * @param prompt - The prompt/question to send.
 * @param model - The Hugging Face model, e.g., 'gpt2'. Optional, defaults to 'gpt2'.
 */
export async function callHuggingFace({
  prompt,
  model = "gpt2",
}: HfRequest): Promise<HfResponse> {
  const resp = await fetch("https://YOUR-EDGE-FUNC-URL/hf-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, model }),
  });

  if (!resp.ok) {
    throw new Error("Hugging Face API call failed");
  }
  return await resp.json();
}
