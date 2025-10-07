import { getCollection } from '@/lib/database/db';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const {user_id} = req.query;
  
  const payload = (await req.json()) as Education;
  //insert validation here

  try{
    const col = await getCollection<Education & { createdAt: Date; updatedAt: Date; user_Id: ObjectId }>('educations');
    const { insertedId } = await col.insertOne({
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
      user_Id: new ObjectId(user_id),
    });
    return NextResponse.json({ id: insertedId.toString() }, { status: 201 });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create a education entry' }, { status: 500 });
  }
}