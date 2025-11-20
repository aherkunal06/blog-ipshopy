import { NextResponse } from "next/server";
import { query, queryOne, insert, execute } from "@/lib/db";

// ✅ Create Privacy Policy
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, createdDate } = body;

    const policyId = await insert(
      'INSERT INTO InformationPrivacyPolicy (title, content, createdDate) VALUES (?, ?, ?)',
      [title, content, createdDate ? new Date(createdDate) : new Date()]
    );

    const newPolicy = await queryOne<{
      id: number;
      title: string;
      content: string;
      createdDate: Date;
      updatedDate: Date;
    }>(
      'SELECT * FROM InformationPrivacyPolicy WHERE id = ?',
      [policyId]
    );

    return NextResponse.json(newPolicy, { status: 201 });
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}

// ✅ Update Privacy Policy
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content, updatedDate } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required for update" }, { status: 400 });
    }

    await execute(
      'UPDATE InformationPrivacyPolicy SET title = ?, content = ?, updatedDate = ? WHERE id = ?',
      [title, content, updatedDate ? new Date(updatedDate) : new Date(), id]
    );

    const updatedPolicy = await queryOne<{
      id: number;
      title: string;
      content: string;
      createdDate: Date;
      updatedDate: Date;
    }>(
      'SELECT * FROM InformationPrivacyPolicy WHERE id = ?',
      [id]
    );

    return NextResponse.json(updatedPolicy, { status: 200 });
  } catch (error) {
    console.error('Error updating policy:', error);
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}

// ✅ Get All Policies
export async function GET() {
  try {
    const policies = await query<Array<{
      id: number;
      title: string;
      content: string;
      createdDate: Date;
      updatedDate: Date;
    }>>(
      'SELECT * FROM InformationPrivacyPolicy ORDER BY createdDate DESC'
    );
    return NextResponse.json(policies, { status: 200 });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
  }
}

