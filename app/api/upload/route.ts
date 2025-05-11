import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  return handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['image/jpeg', 'image/png'],
      addRandomSuffix: true,
    }),
    onUploadCompleted: async ({ blob }) => {
      console.log('Yükleme tamamlandı:', blob.url);
    },
  });
}
