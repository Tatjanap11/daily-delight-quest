
export async function hfApiRequest({
  prompt,
  model,
  apiKey,
}: {
  prompt: string;
  model: string;
  apiKey: string;
}) {
  const hfUrl = `https://api-inference.huggingface.co/models/${model}`;
  const response = await fetch(hfUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  const data = await response.json();
  return { status: response.status, data };
}
