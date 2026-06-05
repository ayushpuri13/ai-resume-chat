import fs from "fs/promises";
import pdf from "pdf-parse-new";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("resume") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFile(`./uploads/${file.name}`, buffer);

  const data = await pdf(buffer);

  const chunks = createChunks(data.text);

  const result = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: chunk,
      });

      const embeddingResult = embedding.embeddings?.[0].values;

      // console.log({ chunk, embeddingResult }, "ayush ai result");

      return { chunk, embeddingResult };
    }),
  );
  // console.log(result, "ayush result");

  return Response.json({
    chunksSize: chunks.length,
    success: true,
  });
}

function createChunks(text: string, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

