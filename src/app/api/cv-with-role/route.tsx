import { getDB } from '@/lib/database/d1db';
import getAuthUser from '@/lib/database/getAuthUser';
import { NextResponse } from 'next/server';

export async function GET() {
  const db = getDB();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const query = db.prepare(`SELECT 
    Cvs.FullName AS fullName,
    Users.UserID AS userId,
    Users.UserEmail AS userEmail,
    Users.UserRole AS userRole,
    Roles.Name AS roleName
FROM Cvs
LEFT JOIN Users 
    ON Cvs.UserID = Users.UserID
LEFT JOIN Roles 
    ON Users.UserRole = Roles.id;
`);
    const rows = await query.all<CvDataWithRole>();

    if (!rows.results.length) {
      return NextResponse.json({ error: 'No Data found' }, { status: 404 });
    }

    return NextResponse.json(rows.results, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch Data' }, { status: 500 });
  }
}
