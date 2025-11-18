import { getDB } from '@/lib/database/d1db';
import getAuthUser from '@/lib/database/getAuthUser';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ userName: string }> }) {
  const db = getDB();
  const { userName } = await params;
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const statement = db.prepare('SELECT * FROM Cvs WHERE FullName LIKE "%" || ? || "%"');

    if (userName) {
      const row = await statement.bind(userName).all<CvDataDbModel>(); // as written in your code

      if (!row) {
        return NextResponse.json({ error: 'CV not found or not owned by user' }, { status: 404 });
      }

      return NextResponse.json(row, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No search sent from client' }, { status: 404 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}
