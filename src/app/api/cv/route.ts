import { getDB } from '@/lib/database/d1db';
import getAuthUser from '@/lib/database/getAuthUser';
import { NextResponse } from 'next/server';
import { hydrateCv } from './hydratecv';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as CvData;

    // Minimal validation
    if (!body.fullName || !body.email) {
      return NextResponse.json({ error: 'fullName and email are required' }, { status: 400 });
    }

    const db = getDB();

    const sql = `
      INSERT INTO Cvs
        (FullName, ImgDataUrl, Position, Email, LinkedIn, Phone, About,
         Education, Projects, Skills, Certificates, WorkExperience, UserID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING CvID;
    `;

    const inserted = await db
      .prepare(sql)
      .bind(
        body.fullName,
        body.imgDataUrl ?? null,
        body.position ?? null,
        body.email ?? null,
        body.linkedIn ?? null, // maps to LinkedIn column
        body.phone ?? null,
        body.about ?? null,
        toJSON(body.education ?? []),
        toJSON(body.projects ?? []),
        toJSON(body.skills ?? []),
        toJSON(body.certificates ?? []),
        toJSON(body.workExperience ?? []),
        String(user.userId), // UserID TEXT
      )
      .first<{ CvID: number }>();

    return NextResponse.json({ id: inserted?.CvID }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? 'Failed to create CV' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const db = getDB();
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queryStm = db.prepare('SELECT * FROM Cvs WHERE UserID = ?');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const row = await queryStm.bind(id).first<CvDataDbModel>(); // as written in your code

      if (!row) {
        return NextResponse.json({ error: 'CV not found or not owned by user' }, { status: 404 });
      }

      const hydrated = hydrateCv(row);
      return NextResponse.json(hydrated, { status: 200 });
    }

    // Otherwise: get most recent CV for this user (your SQL currently returns first match)
    const row = await queryStm.bind(user.userId).first<CvDataDbModel>();

    if (!row) {
      return NextResponse.json({ error: 'No CV found for this user' }, { status: 404 });
    }

    const hydrated = hydrateCv(row);
    return NextResponse.json(hydrated, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

// 👇 Updated UPDATE route
// ============== PUT: update CV by id (D1) ==============
export async function PUT(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as Partial<CvData>;
    const id = body.cvId ?? body.cvId;
    if (!id) return NextResponse.json({ error: 'Missing CV id' }, { status: 400 });

    const db = getDB();

    // Build the update list only for fields provided
    const sets: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const args: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setField = (col: string, val: any, json = false) => {
      sets.push(`${col} = ?`);
      args.push(json ? toJSON(val) : val ?? null);
    };

    if ('fullName' in body) setField('FullName', body.fullName);
    if ('imgDataUrl' in body) setField('ImgDataUrl', body.imgDataUrl);
    if ('imgDataUrl' in body) setField('ImgVersion', String(body.imgVersion));
    if ('position' in body) setField('Position', body.position);
    if ('email' in body) setField('Email', body.email);
    if ('linkedIn' in body) setField('LinkedIn', body.linkedIn);
    if ('phone' in body) setField('Phone', body.phone);
    if ('about' in body) setField('About', body.about);
    if ('education' in body) setField('Education', body.education, true);
    if ('projects' in body) setField('Projects', body.projects, true);
    if ('skills' in body) setField('Skills', body.skills, true);
    if ('certificates' in body) setField('Certificates', body.certificates, true);
    if ('workExperience' in body) setField('WorkExperience', body.workExperience, true);

    if (sets.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // WHERE clause (enforce ownership)
    const sql = `
      UPDATE Cvs
      SET ${sets.join(', ')}
      WHERE CvID = ? AND UserID = ?
    `;

    args.push(Number(id), String(user.userId));

    const res = await db
      .prepare(sql)
      .bind(...args)
      .run();

    if (res.meta.changes === 0) {
      return NextResponse.json({ error: 'CV not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update CV' }, { status: 500 });
  }
}

function toJSON(val: unknown) {
  return JSON.stringify(val ?? null);
}
