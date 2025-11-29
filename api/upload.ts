import { readFile } from "fs/promises";

export async function sendAudioToApi(filePath: string) {
  const audioBuffer = await readFile(filePath);

  const response = await fetch("https://example.com/upload", {
    method: "POST",
    headers: {
      "Content-Type": "audio/mpeg"
    },
    body: audioBuffer
  });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  return response.json();
}
