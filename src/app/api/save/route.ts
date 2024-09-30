import connectMongo from '../../../../lib/mongodb';
import Transaction from "../../../../models/transaction";
import { NextRequest, NextResponse } from "next/server";

// READ data
export async function GET() {
  try {
    await connectMongo();
    const transactionResult = await Transaction.find({});
    return NextResponse.json({ data: transactionResult });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || "Something went wrong" });
  }
}

// Create new record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await Transaction.create(body);
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" });
  }
}

// Update
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body; 
    const res = await Transaction.findByIdAndUpdate(_id, updateData, { new: true }); 
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" });
  }
}

// Delete
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await Transaction.findByIdAndDelete(body._id); // ใช้ _id เพื่อระบุ Todo ที่ต้องการลบ
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Something went wrong" });
  }
}