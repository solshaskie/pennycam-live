import { NextRequest, NextResponse } from 'next/server';
import { signalingStore } from '@/lib/signaling-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
  }

  const offer = signalingStore.getOffer(id);

  if (!offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }

  return NextResponse.json({ offer });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const { offer } = await req.json();

  if (!id || !offer) {
    return NextResponse.json({ error: 'Connection ID and offer are required' }, { status: 400 });
  }

  signalingStore.setOffer(id, offer);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Connection ID is required' }, { status: 400 });
  }

  signalingStore.clear(id);
  console.log(`Cleared signaling data for connection ID: ${id}`);
  return NextResponse.json({ success: true });
}
