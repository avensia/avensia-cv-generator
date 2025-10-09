import { getCollection } from '@/lib/database/db';
import getAuthUser from '@/lib/database/getAuthUser';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = (await req.json()) as CvData;
    const col = await getCollection<CvData & { createdAt: Date; updatedAt: Date; userId: ObjectId }>('cvs');
    const { insertedId } = await col.insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: new ObjectId(user.userId),
    });
    return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create CV' }, { status: 500 });
  }
}

export async function GET(req: Request) { 
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cvCol = await getCollection<CvData & { createdAt: Date; updatedAt: Date; userId: ObjectId }>('cvs');
    const eduCol = await getCollection<{ createdAt: Date; updatedAt: Date; user_id: ObjectId }>('educations');
    const workExCol = await getCollection<{ createdAt: Date; updatedAt: Date; user_id: ObjectId }>('workexperiences');
    const projCol = await getCollection<{ createdAt: Date; updatedAt: Date; user_id: ObjectId }>('projects');

    // Check if an id param was provided
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const doc = await cvCol.findOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      if (!doc) {
        return NextResponse.json({ error: 'CV not found or not owned by user' }, { status: 404 });
      }
      return NextResponse.json(doc, { status: 200 });
    }

    // Otherwise: just get the single CV for this user (most recent one if multiple exist)
    const doc = await cvCol.findOne(
      { userId: new ObjectId(user.userId) },
      {
        sort: { createdAt: -1 },
      },
    );

    if (!doc) {
      return NextResponse.json({ error: 'No CV found for this user' }, { status: 404 });
    }
    
    // Fetch all related educations to the user
    const educationDocs = await eduCol.find({ user_id: new ObjectId(user.userId) }).sort({ createdAt: -1 }).toArray();
    
    // Fetch all related projects to the user
    const workExperienceDocs = await workExCol.find({ user_id: new ObjectId(user.userId) }).sort({ createdAt: -1 }).toArray();
    
    // Fetch all related educations to the user
    const projectDocs = await projCol.find({ user_id: new ObjectId(user.userId) }).sort({ createdAt: -1 }).toArray();

    const response = {
      ...doc,
      projects : projectDocs,
      workExperience : workExperienceDocs,
      educations : educationDocs,
    }

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

// server-only DB type (so filters match Mongo reality)
type CvDoc = Omit<CvData, 'userId' | '_id'> & {
  _id?: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

// 👇 Updated UPDATE route
export async function PUT(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = (await req.json()) as Partial<CvData> & { id?: string; _id?: string };

    // fix the typo: "body", not "bodv"
    const id = body.id ?? body._id;
    if (!id) return NextResponse.json({ error: 'Missing CV id' }, { status: 400 });

    // Create a mutable copy and remove immutable/server-managed fields
    const safePayload: Record<string, unknown> = { ...body };
    delete safePayload.id;
    delete safePayload._id; // ✅ prevents "_id is immutable" error
    delete safePayload.userId;
    delete safePayload.createdAt;
    delete safePayload.updatedAt;

    const col = await getCollection<CvDoc>('cvs');

    const result = await col.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(user.userId) },
      { $set: { ...safePayload, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'CV not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update CV' }, { status: 500 });
  }
}
