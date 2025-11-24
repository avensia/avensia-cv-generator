import getAuthUser from '@/lib/database/getAuthUser';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ userRole: user.userRole }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch auth' }, { status: 500 });
  }
}
