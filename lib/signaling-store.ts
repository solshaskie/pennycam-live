// A simple in-memory store for WebRTC signaling
type ConnectionData = {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  baseStationCandidates: RTCIceCandidateInit[];
  remoteViewerCandidates: RTCIceCandidateInit[];
};

const store = new Map<string, ConnectionData>();

function getConnection(id: string): ConnectionData {
  if (!store.has(id)) {
    store.set(id, {
      baseStationCandidates: [],
      remoteViewerCandidates: [],
    });
  }
  return store.get(id)!;
}

export const signalingStore = {
  setOffer(id: string, offer: RTCSessionDescriptionInit) {
    const connection = getConnection(id);
    connection.offer = offer;
    // Clean up old answers/candidates when a new offer is made
    connection.answer = undefined;
    connection.baseStationCandidates = [];
    connection.remoteViewerCandidates = [];
  },
  getOffer(id: string) {
    return getConnection(id).offer;
  },
  setAnswer(id: string, answer: RTCSessionDescriptionInit) {
    getConnection(id).answer = answer;
  },
  getAnswer(id: string) {
    const answer = getConnection(id).answer;
    return answer;
  },
  addIceCandidate(id: string, peerType: 'base-station' | 'remote-viewer', candidate: RTCIceCandidateInit) {
    const connection = getConnection(id);
    if (peerType === 'base-station') {
      connection.baseStationCandidates.push(candidate);
    } else {
      connection.remoteViewerCandidates.push(candidate);
    }
  },
  getIceCandidates(id: string, peerType: 'base-station' | 'remote-viewer') {
    const connection = getConnection(id);
    // Return the other peer's candidates
    return peerType === 'base-station' ? connection.remoteViewerCandidates : connection.baseStationCandidates;
  },
  clearCandidates(id: string, peerType: 'base-station' | 'remote-viewer') {
    const connection = getConnection(id);
    if (peerType === 'base-station') {
        // Base station is fetching remote viewer's candidates, so clear them after fetching
        connection.remoteViewerCandidates = [];
    } else {
        // Remote viewer is fetching base station's candidates, so clear them
        connection.baseStationCandidates = [];
    }
  },
  clear(id: string) {
    store.delete(id);
  },
};
