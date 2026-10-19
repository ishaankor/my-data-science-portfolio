import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const staticJsonPath = path.join(process.cwd(), 'data', 'loc-static.json');
    if (fs.existsSync(staticJsonPath)) {
      const content = fs.readFileSync(staticJsonPath, 'utf8');
      const data = JSON.parse(content);
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      });
    }
  } catch (err: any) {
    console.error('Error serving /api/loc:', err.message);
  }
  return NextResponse.json([]);
}
