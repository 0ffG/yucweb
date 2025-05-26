// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put, PutBlobResult } from "@vercel/blob"; // PutBlobResult tipini import edin
import { nanoid } from "nanoid"; // Benzersiz dosya isimleri için (opsiyonel ama önerilir)

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null; // null olabileceğini belirtin

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  // Opsiyonel: Dosya adını benzersiz hale getirmek çakışmaları önler
  const filename = `${nanoid()}-${file.name}`;

  try {
    const blob: PutBlobResult = await put(filename, file, { // filename kullanın
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Blob yükleme hatası:", error);
    return NextResponse.json(
      { error: `Dosya yüklenemedi: ${error.message || "Sunucu hatası"}` },
      { status: 500 }
    );
  }
}