
export async function callHuggingFace(prompt: string) {
  const resp = await fetch("https://YOUR-EDGE-FUNC-URL/hf-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  if (!resp.ok) {
    throw new Error("Hugging Face API call failed");
  }
  return await resp.json();
}
