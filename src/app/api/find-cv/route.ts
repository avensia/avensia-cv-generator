import { getDB } from '@/lib/database/d1db';
import getAuthUser from '@/lib/database/getAuthUser';
import { NextResponse } from 'next/server';
import { hydrateCv } from '../cv/hydratecv';

export async function GET(req: Request) {
  const db = getDB();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const name = url.searchParams.get('name');

  try {
    let query;
    if (name) {
      query = db.prepare('SELECT * FROM Cvs WHERE FullName LIKE "%" || ? || "%"').bind(name);
    } else {
      query = db.prepare('SELECT * FROM Cvs WHERE UserID != ?').bind(user.userId);
    }

    const rows = await query.all<CvDataDbModel>();

    if (!rows.results.length) {
      return NextResponse.json({ error: 'No CVs found' }, { status: 404 });
    }

    const hydrated = rows.results.map(hydrateCv);
    return NextResponse.json(hydrated, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch CVs' }, { status: 500 });
  }
}
