import { NextResponse } from "next/server";

import { generateContent } from "@/lib/gemini";

export async function POST(request: Request) {
  let body: { prompt?: string };

  try {
    body = (await request.json()) as { prompt?: string };
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON body." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "prompt alanı zorunludur." }, { status: 400 });
  }

  try {
    const content = await generateContent(prompt);
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
