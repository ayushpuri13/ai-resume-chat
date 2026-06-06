import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req?.json();
  const question = body.question;

  const embedding = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: question,
  });

  const embeddingResult = embedding.embeddings?.[0].values;

  const storedEmbeddings = JSON.parse(
    await fs.readFile("./app/data/resume-embeddings.json", "utf8"),
  );

  //   console.log(
  //     "Ayush question result",
  //     storedEmbeddings.slice(0, 100),
  //     "Gappppp",
  //     embeddingResult?.slice(0, 10),
  //   );

  const result = [];

  for (const chunk of storedEmbeddings) {
    const score = cosineSimilarity(
      embeddingResult || [],
      chunk.embeddingResult,
    );
    result.push({ chunk, score });
  }

  const topChunks = result.sort((a, b) => b.score - a.score).slice(0, 3);

  //   console.log(topChunks, "topchunks ayush", result);

  const context = topChunks.map((item) => item.chunk.chunk).join("\n\n");

  const prompt = `
You are an AI resume assistant.

Answer the question using ONLY the provided context.

If the answer is not present in the context, say:
"I couldn't find that information in the resume."

Context:
${context}

Question:
${question}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  console.log(response.text, "Ayush final response");

  return Response.json({ success: true });
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
