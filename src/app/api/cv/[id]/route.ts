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
    const payload = (await req.json()) as CvCreateFormRequest;

    //const { projects, education, workExperience, ...cvData} = payload;

    //acquire collections
    const cvCol = await getCollection<CvData & { createdAt: Date; updatedAt: Date; userId: ObjectId }>('cvs');
    /*
    const eduCol = await getCollection<Education & { createdAt: Date; updatedAt: Date; user_id: ObjectId }>('educations');
    const workExCol = await getCollection<WorkExperience &{ createdAt: Date; updatedAt: Date; user_id: ObjectId }>('workexperiences');
    const projCol = await getCollection<Project & { createdAt: Date; updatedAt: Date; user_id: ObjectId }>('projects');
    */
    
    //create CV document
    const { insertedId } = await cvCol.insertOne({
      ...payload,//cvData,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: new ObjectId(user.userId),
    });
    /*
    //create related documents on affected tables
    await eduCol.insertMany(
        education.map(document => ({
            ...document,
            user_id: new ObjectId(insertedId), // ensure userId is included
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
    );
    await projCol.insertMany(
        projects.map(document => ({
            ...document,
            user_id: new ObjectId(insertedId), // ensure userId is included
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
    );
    await workExCol.insertMany(
        workExperience.map(document => ({
            ...document,
            user_id: new ObjectId(insertedId), // ensure userId is included
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
    );
    */

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
    const eduCol = await getCollection<Education & { createdAt: Date; updatedAt: Date; user_id: ObjectId }>('educations');
    const workExCol = await getCollection<WorkExperience &{ createdAt: Date; updatedAt: Date; user_id: ObjectId }>('workexperiences');
    const projCol = await getCollection<Project & { createdAt: Date; updatedAt: Date; user_id: ObjectId }>('projects');

    // Check if an id param was provided
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const doc = await cvCol.findOne({ _id: new ObjectId(id), userId: new ObjectId(user.userId) });
      if (!doc) {
        return NextResponse.json({ error: 'CV not found or not owned by user' }, { status: 404 });
      }
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
/*
type CvDoc = Omit<CvData, 'userId' | '_id'> & {
  _id?: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
*/