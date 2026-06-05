import fs from "fs/promises";
import pdf from "pdf-parse-new";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("resume") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFile(`./uploads/${file.name}`, buffer);

  const data = await pdf(buffer);
  console.log("ayush file is here", file.name, data.text);
  return Response.json({
    success: true,
  });
}
