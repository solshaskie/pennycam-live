import { NextRequest, NextResponse } from 'next/server';
import { signalingStore } from '@/lib/signaling-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const peerType = searchParams.get('peerType') as 'base-station' | 'remote-viewer' | null;

  if (!id || !peerType) {
    return NextResponse.json({ error: 'Connection ID and peerType are required' }, { status: 400 });
  }

  const candidates = signalingStore.getIceCandidates(id, peerType);

  // After getting the candidates, we can clear them from the store
  // so they are not sent again.
  if (candidates.length > 0) {
    signalingStore.clearCandidates(id, peerType);
  }

  return NextResponse.json({ candidates });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const peerType = searchParams.get('peerType') as 'base-station' | 'remote-viewer' | null;
  const { candidate } = await req.json();

  if (!id || !peerType || !candidate) {
    return NextResponse.json({ error: 'Connection ID, peerType, and candidate are required' }, { status: 400 });
  }

  signalingStore.addIceCandidate(id, peerType, candidate);

  return NextResponse.json({ success: true });
}
