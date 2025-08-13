import { NextRequest, NextResponse } from 'next/server';
import { signalingStore } from '@/lib/signaling-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
  }

  const answer = signalingStore.getAnswer(id);

  if (!answer) {
    return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
  }

  return NextResponse.json({ answer });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { answer } = await req.json();

  if (!id || !answer) {
    return NextResponse.json({ error: 'Connection ID and answer are required' }, { status: 400 });
  }

  signalingStore.setAnswer(id, answer);

  return NextResponse.json({ success: true });
}
