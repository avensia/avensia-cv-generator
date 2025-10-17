import { getCollection } from '@/lib/database/db';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const payload = (await req.json()) as Project;
  //insert validation here

  try {
    const col = await getCollection<Project & { createdAt: Date; updatedAt: Date; user_Id: ObjectId }>('projects');
    const { insertedId } = await col.insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
      user_Id: new ObjectId(id!),
    });
    return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create a project entry' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Missing user id parameter." }, { status: 422 })
  }

  try {
    const userCol = await getCollection<UserDoc>('users');
    const projCol = await getCollection<Project & { createdAt: Date; updatedAt: Date; user_id: ObjectId }>('projects');

    if (id) {
      const doc = await userCol.findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }
    }
    const projectDocs = await projCol.find({ user_id: new ObjectId(id!) }).sort({ createdAt: -1 }).toArray();

    const response = {
      user_id: new ObjectId(id),
      projects: projectDocs,
    }

    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error in getting Education documents.' }, { status: 500 });
  }
}

 export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if(!id){
    return NextResponse.json({error: "Missing user id parameter."}, {status: 422})
  }

  try{
    const userCol = await getCollection<UserDoc>('users');
    const projCol = await getCollection<Project & { createdAt: Date; updatedAt: Date; user_id: ObjectId }>('projects');
    
    if (id) {
      const doc = await userCol.findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }
    }
    const result = await projCol.deleteOne({ user_id: new ObjectId(id!) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Project Document deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Project Document not found" }, { status: 404 });
    }
  }catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error in deleting Project documents.' }, { status: 500 });
  }
}