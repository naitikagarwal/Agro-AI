// app/api/upload/route.ts
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const files: File[] = data.getAll('files') as unknown as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const filename = `${timestamp}_${randomString}.${fileExtension}`;

      // Create uploads directory in public folder
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Create directory if it doesn't exist
      try {
        await writeFile(path.join(uploadsDir, '.gitkeep'), '');
      } catch (error) {
        // Directory probably exists, ignore error
      }

      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);

      // Return the public URL path
      uploadedFiles.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ 
      message: 'Upload successful', 
      urls: uploadedFiles 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}