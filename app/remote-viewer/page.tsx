"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Smartphone, Mic, MicOff, Volume2, VolumeX, Wifi, WifiOff, Home, Zap } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function RemoteViewer() {
  const [connectionId, setConnectionId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [webRtcStatus, setWebRtcStatus] = useState("Disconnected")

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // ... (Keep other state for UI controls like treats, sounds etc.)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [motionAlerts, setMotionAlerts] = useState<Array<{time: Date, message: string}>>([])
  const [hasUnreadMotion, setHasUnreadMotion] = useState(false)
  const [treatCount, setTreatCount] = useState(0)
  const [dailyTreatLimit] = useState(8)
  const [treatLog, setTreatLog] = useState<Array<{time: Date, type: string}>>([])
  const [lastTreatTime, setLastTreatTime] = useState<Date | null>(null)


  const disconnect = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setIsConnected(false)
    setConnectionStatus("disconnected")
    setWebRtcStatus("Disconnected")
    setIsSpeaking(false)
  }, []);

  // Effect for cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    }
  }, [disconnect]);


  const connectToBase = async () => {
    if (!connectionId.trim()) {
      alert("Please enter a PennyCam ID")
      return
    }
    setConnectionStatus("connecting")

    // Start polling for the offer
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/signaling/offer?id=${connectionId}`);
        if (response.ok) {
          const { offer } = await response.json();
          if (offer) {
            // Offer found, stop polling for it
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            // Start the WebRTC connection process
            await setupWebRTCConnection(offer);
          }
        } else {
            console.log("Waiting for base station to send offer...")
        }
      } catch (error) {
        console.error("Error polling for offer:", error);
      }
    }, 3000);
  }

  const setupWebRTCConnection = async (offer: RTCSessionDescriptionInit) => {
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        fetch(`/api/signaling/ice-candidate?id=${connectionId}&peerType=remote-viewer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate: event.candidate }),
        });
      }
    };

    peerConnectionRef.current.oniceconnectionstatechange = () => {
        if(peerConnectionRef.current) {
            setWebRtcStatus(peerConnectionRef.current.iceConnectionState);
            if (peerConnectionRef.current.iceConnectionState === 'connected') {
                setIsConnected(true);
                setConnectionStatus("connected");
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
            }
            if (['disconnected', 'failed', 'closed'].includes(peerConnectionRef.current.iceConnectionState)) {
                disconnect();
            }
        }
    };

    peerConnectionRef.current.ontrack = (event) => {
      console.log("Received remote track!");
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(console.error);
      }
    };

    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      await fetch(`/api/signaling/answer?id=${connectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });

      // Start polling for ICE candidates
      startIceCandidatePolling();

    } catch (error) {
      console.error("Failed to setup WebRTC connection on remote viewer:", error);
      disconnect();
    }
  };

  const startIceCandidatePolling = () => {
    pollingIntervalRef.current = setInterval(async () => {
        try {
            const response = await fetch(`/api/signaling/ice-candidate?id=${connectionId}&peerType=remote-viewer`);
            if (response.ok) {
                const { candidates } = await response.json();
                if (candidates && candidates.length > 0) {
                    console.log(`Received ${candidates.length} new ICE candidates from base station.`);
                    candidates.forEach((candidate: RTCIceCandidateInit) => {
                        if (peerConnectionRef.current) {
                            peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error polling for ICE candidates:", error);
        }
    }, 5000);
  };

  const toggleMute = () => {
    if (remoteVideoRef.current) {
        remoteVideoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    }
  };

  // The rest of the functions (takePhoto, playKittenSound, etc.) can remain as they are
  // as they are not part of the core video streaming logic.
  // ... (paste all the other functions from the original file here)
  const startSpeaking = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Microphone access is not supported in this browser.")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      // In a real app, you'd add this stream to the peer connection
      // For now, it's just a local test
      setIsSpeaking(true)
      
      // Auto-stop after 5 seconds for demo
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setIsSpeaking(false)
      }, 5000)
    } catch (error: unknown) {
      console.error("Error accessing microphone:", error)
      if (error instanceof Error) {
        alert(`Could not access microphone: ${error.message}. Please check permissions.`)
      } else {
        alert("An unknown error occurred while accessing the microphone.")
      }
    }
  }

  const stopSpeaking = () => {
    setIsSpeaking(false)
  }

  const clearMotionAlerts = () => {
    setHasUnreadMotion(false)
  }

  const takePhoto = () => {
    if (!remoteVideoRef.current || !remoteVideoRef.current.srcObject) {
        alert("Not connected to live feed!");
        return;
    }
    const video = remoteVideoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.download = `penny-photo-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        alert("📸 Photo saved! Check your downloads folder.");
    }
  }

  const playKittenSound = () => { alert("Feature not connected to base station yet."); }
  const playMeowSound = () => { alert("Feature not connected to base station yet."); }
  const playTrillingSound = () => { alert("Feature not connected to base station yet."); }
  const sendVirtualPets = () => { alert("Feature not connected to base station yet."); }
  const dispenseTreat = () => { alert("Feature not connected to base station yet."); }
  const scheduleAutoTreat = () => { alert("Feature not connected to base station yet."); }


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader subtitle="Remote Viewer" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
                <img src="/penny-icon.png" alt="Penny" className="w-8 h-8 object-cover" />
                Connect to PennyCam
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">PennyCam ID</label>
                <Input
                  value={connectionId}
                  onChange={(e) => setConnectionId(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  className="mt-2 text-center font-mono text-xl font-bold tracking-wider h-14 bg-white/80 backdrop-blur"
                  maxLength={6}
                />
              </div>
              
              <Button 
                onClick={connectToBase} 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg"
                disabled={connectionStatus === "connecting"}
              >
                {connectionStatus === "connecting" ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connecting to Penny...
                  </>
                ) : (
                  <>
                    <Wifi className="w-5 h-5 mr-2" />
                    Connect to PennyCam
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <img src="/penny-icon.png" alt="Penny" className="w-6 h-6 object-cover" />
                      Live Penny View
                    </CardTitle>
                    <div className="flex items-center gap-2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      PENNY LIVE
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-inner" style={{ aspectRatio: '16/9' }}>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        onPlay={() => console.log("Remote video is playing")}
                        onError={(e) => console.error("Remote video error", e)}
                    />
                     <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            <Zap className="w-3 h-3"/>
                            {webRtcStatus}
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onMouseDown={startSpeaking}
                      onMouseUp={stopSpeaking}
                      onTouchStart={startSpeaking}
                      onTouchEnd={stopSpeaking}
                      variant={isSpeaking ? "destructive" : "default"}
                      className={`flex-1 shadow-lg ${isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'}`}
                    >
                      {isSpeaking ? "Talking..." : "Hold to Talk"}
                    </Button>
                    
                    <Button onClick={toggleMute} variant={isMuted ? "destructive" : "outline"} className="bg-white/80 backdrop-blur shadow-lg">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    
                    <Button onClick={disconnect} variant="outline" className="bg-white/80 backdrop-blur shadow-lg">
                      <WifiOff className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* All the side cards for actions can stay, but I'll simplify them */}
              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader><CardTitle>Kitten Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={takePhoto} variant="outline" className="w-full justify-start">📸 Take Photo</Button>
                  <Button onClick={playKittenSound} variant="outline" className="w-full justify-start">🔊 "Pspsps"</Button>
                  <Button onClick={playMeowSound} variant="outline" className="w-full justify-start">🐱 Meow</Button>
                  <Button onClick={playTrillingSound} variant="outline" className="w-full justify-start">😺 Trill</Button>
                  <Button onClick={sendVirtualPets} variant="outline" className="w-full justify-start">❤️ Send Pets</Button>
                  <Button onClick={dispenseTreat} variant="outline" className="w-full justify-start">🍖 Dispense Treat</Button>
                  <Button onClick={scheduleAutoTreat} variant="outline" className="w-full justify-start">⏰ Schedule Treat</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
