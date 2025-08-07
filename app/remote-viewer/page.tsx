"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Smartphone, Mic, MicOff, Volume2, VolumeX, Wifi, WifiOff, Home } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

export default function RemoteViewer() {
  const [connectionId, setConnectionId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [motionAlerts, setMotionAlerts] = useState<Array<{time: Date, message: string}>>([])
  const [hasUnreadMotion, setHasUnreadMotion] = useState(false)
  const [treatCount, setTreatCount] = useState(0)
  const [dailyTreatLimit] = useState(8) // Healthy limit for kittens
  const [treatLog, setTreatLog] = useState<Array<{time: Date, type: string}>>([])
  const [lastTreatTime, setLastTreatTime] = useState<Date | null>(null)

  // Update time every second when connected
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  // Kitten motion detection simulation for remote viewer
  useEffect(() => {
    if (!isConnected) return
    
    const motionInterval = setInterval(() => {
      const motionChance = 0.15
      const hasMotion = Math.random() < motionChance
      
      if (hasMotion) {
        console.log('📱 REMOTE: Kitten motion alert received!')
        const now = new Date()
        const newAlert = {
          time: now,
          message: "Penny is being adorable in her area"
        }
        
        setMotionAlerts(prev => [...prev.slice(-9), newAlert])
        setHasUnreadMotion(true)
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('PennyCam Kitten Alert', {
            body: 'Penny is moving around - so cute!',
            icon: '/penny-icon.png',
            tag: 'kitten-alert'
          })
        }
      }
    }, 4000)
    
    return () => clearInterval(motionInterval)
  }, [isConnected])

  const connectToBase = async () => {
    if (!connectionId.trim()) {
      alert("Please enter a PennyCam ID")
      return
    }

    setConnectionStatus("connecting")
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true)
      setConnectionStatus("connected")
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }, 2000)
  }

  const disconnect = () => {
    setIsConnected(false)
    setConnectionStatus("disconnected")
    setIsSpeaking(false)
  }

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
      setIsSpeaking(true)
      
      // Auto-stop after 5 seconds for demo
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setIsSpeaking(false)
      }, 5000)
    } catch (error: any) {
      console.error("Error accessing microphone:", error)
      
      let errorMessage = "Unable to access microphone. "
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow microphone permissions in your browser and try again."
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No microphone found on this device."
      } else {
        errorMessage += "Please check your browser permissions."
      }
      
      alert(errorMessage)
    }
  }

  const stopSpeaking = () => {
    setIsSpeaking(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const clearMotionAlerts = () => {
    setHasUnreadMotion(false)
  }

  const takePhoto = () => {
    // Flash effect
    const flashDiv = document.createElement('div')
    flashDiv.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
      background: white; opacity: 0.8; z-index: 9999; pointer-events: none;
    `
    document.body.appendChild(flashDiv)
    
    setTimeout(() => document.body.removeChild(flashDiv), 150)
    
    // Create download link for Penny's photo
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      canvas.width = 800
      canvas.height = 600
      
      // Fill with background
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add Penny's photo
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const imgWidth = img.width * 0.6
        const imgHeight = img.height * 0.6
        
        ctx.drawImage(img, centerX - imgWidth/2, centerY - imgHeight/2, imgWidth, imgHeight)
        
        // Add timestamp
        ctx.fillStyle = 'white'
        ctx.font = 'bold 24px Arial'
        ctx.fillText(`Penny - ${new Date().toLocaleString()}`, 20, 40)
        
        // Download the image
        const link = document.createElement('a')
        link.download = `penny-photo-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
        
        alert("📸 Photo saved! Check your downloads folder for Penny's adorable picture!")
      }
      img.src = '/penny-icon.png'
    }
  }

  const playKittenSound = () => {
    try {
      // Use the uploaded pspsps sound with better error handling
      const audio = new Audio()
      audio.volume = 0.7 // Gentle volume for sensitive kitten ears
      
      audio.addEventListener('canplaythrough', () => {
        console.log('🔊 Playing real pspsps sound for Penny!')
        audio.play()
          .then(() => {
            alert("🔊 Playing your custom pspsps sound for Penny! 🐱 *real pspsps*")
          })
          .catch((error) => {
            console.error('Audio playback failed:', error)
            fallbackKittenSound()
          })
      })
      
      audio.addEventListener('error', (error) => {
        console.error('Audio loading failed:', error)
        fallbackKittenSound()
      })
      
      // Set source after event listeners are attached
      audio.src = '/sounds/cat_pspsps.mp3'
      
    } catch (error) {
      console.error('Error creating audio:', error)
      fallbackKittenSound()
    }
  }

const playMeowSound = () => {
  try {
    const audio = new Audio()
    audio.volume = 0.8 // Slightly louder for the meow
    
    audio.addEventListener('canplaythrough', () => {
      console.log('🐱 Playing meow sound for Penny!')
      audio.play()
        .then(() => {
          alert("🐱 Playing a cute meow for Penny! Maybe she'll meow back! 😸")
        })
        .catch((error) => {
          console.error('Meow audio playback failed:', error)
          alert("🐱 Meow sound failed to play, but Penny appreciates the thought! 😸")
        })
    })
    
    audio.addEventListener('error', (error) => {
      console.error('Meow audio loading failed:', error)
      alert("🐱 Couldn't load meow sound, but Penny knows you tried! 😸")
    })
    
    audio.src = '/sounds/miaw.mp3'
    
  } catch (error) {
    console.error('Error creating meow audio:', error)
    alert("🐱 Couldn't load meow sound, but Penny knows you tried! 😸")
  }
}

const playTrillingSound = () => {
  try {
    const audio = new Audio()
    audio.volume = 0.75 // Good volume for trilling
    
    audio.addEventListener('canplaythrough', () => {
      console.log('😺 Playing cat trilling sound for Penny!')
      audio.play()
        .then(() => {
          alert("😺 Playing adorable cat trilling sounds! Penny might think another kitty is talking to her! 🗣️🐱")
        })
        .catch((error) => {
          console.error('Trilling audio playback failed:', error)
          alert("😺 Trilling sound failed to play, but Penny felt the love! 🗣️🐱")
        })
    })
    
    audio.addEventListener('error', (error) => {
      console.error('Trilling audio loading failed:', error)
      alert("😺 Couldn't load trilling sound, but Penny appreciates your effort! 🗣️🐱")
    })
    
    audio.src = '/sounds/cat-trilling-75541.mp3'
    
  } catch (error) {
    console.error('Error creating trilling audio:', error)
    alert("😺 Couldn't load trilling sound, but Penny appreciates your effort! 🗣️🐱")
  }
}

  // Fallback function in case the audio file doesn't load
  const fallbackKittenSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime)
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + startTime + 0.01)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration)
      
      oscillator.start(audioContext.currentTime + startTime)
      oscillator.stop(audioContext.currentTime + startTime + duration)
    }
    
    playTone(2000, 0, 0.1)
    playTone(1800, 0.15, 0.1)
    playTone(2200, 0.3, 0.1)
    playTone(1900, 0.5, 0.15)
    playTone(2100, 0.7, 0.1)
    
    alert("🔊 Playing backup pspsps sounds for Penny! 🐱")
  }

  const sendVirtualPets = () => {
    // Create floating hearts animation
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const heart = document.createElement('div')
        heart.innerHTML = '❤️'
        heart.style.cssText = `
          position: fixed; 
          left: ${Math.random() * window.innerWidth}px; 
          top: ${window.innerHeight}px;
          font-size: 2rem; 
          pointer-events: none; 
          z-index: 1000;
          animation: floatUp 3s ease-out forwards;
        `
        
        // Add CSS animation
        if (!document.getElementById('heartAnimation')) {
          const style = document.createElement('style')
          style.id = 'heartAnimation'
          style.textContent = `
            @keyframes floatUp {
              to {
                transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                opacity: 0;
              }
            }
          `
          document.head.appendChild(style)
        }
        
        document.body.appendChild(heart)
        setTimeout(() => document.body.removeChild(heart), 3000)
      }, i * 200)
    }
    
    alert("❤️ Sending virtual pets and love to Penny! She can feel your affection! 🥰")
  }

const dispenseTreat = () => {
  const now = new Date()
  
  // Check daily limit
  if (treatCount >= dailyTreatLimit) {
    alert("🚫 Daily treat limit reached! Penny has had enough treats for today. Let's keep her healthy! 💚")
    return
  }
  
  // Check if too soon since last treat (prevent spam)
  if (lastTreatTime && (now.getTime() - lastTreatTime.getTime()) < 30000) { // 30 seconds
    const waitTime = Math.ceil((30000 - (now.getTime() - lastTreatTime.getTime())) / 1000)
    alert(`⏰ Please wait ${waitTime} more seconds before giving Penny another treat!`)
    return
  }
  
  // Dispense the treat!
  setTreatCount(prev => prev + 1)
  setLastTreatTime(now)
  setTreatLog(prev => [...prev.slice(-19), { time: now, type: 'Manual Treat' }])
  
  // Play treat dispensing sound with better error handling
  try {
    const audio = new Audio()
    audio.volume = 0.8 // Good volume for the pouring sound
    
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(console.error)
    })
    
    audio.addEventListener('error', (error) => {
      console.error('Treat sound failed:', error)
      // Continue without sound - treat still dispensed
    })
    
    audio.src = '/sounds/pouring-cat-biscuit-into-a-bowl-102440.mp3'
    
  } catch (error) {
    console.error('Error creating treat audio:', error)
    // Continue without sound - treat still dispensed
  }
  
  // Visual feedback
  createTreatAnimation()
  
  // Success message
  const remaining = dailyTreatLimit - treatCount - 1
  alert(`🍖 Treat dispensed! *realistic pouring sound* 🥣\n\nPenny can hear her treats hitting the bowl! 😋\n\n✅ Treats today: ${treatCount + 1}/${dailyTreatLimit}\n🎯 Remaining: ${remaining} treats\n⏰ Time: ${now.toLocaleTimeString()}`)
}

const createTreatAnimation = () => {
  // Create falling treat animation
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const treat = document.createElement('div')
      treat.innerHTML = '🍖'
      treat.style.cssText = `
        position: fixed; 
        left: ${Math.random() * window.innerWidth}px; 
        top: -50px;
        font-size: 1.5rem; 
        pointer-events: none; 
        z-index: 1000;
        animation: treatFall 2s ease-in forwards;
      `
      
      // Add CSS animation for falling treats
      if (!document.getElementById('treatAnimation')) {
        const style = document.createElement('style')
        style.id = 'treatAnimation'
        style.textContent = `
          @keyframes treatFall {
            to {
              transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
              opacity: 0;
            }
          }
        `
        document.head.appendChild(style)
      }
      
      document.body.appendChild(treat)
      setTimeout(() => document.body.removeChild(treat), 2000)
    }, i * 300)
  }
}

const scheduleAutoTreat = () => {
  const times = ['8:00 AM', '12:00 PM', '4:00 PM', '7:00 PM']
  const randomTime = times[Math.floor(Math.random() * times.length)]
  
  alert(`⏰ Automatic treat scheduled for ${randomTime}!\n\n🤖 PennyCam will automatically give Penny a treat at this time.\n\n📱 You'll get a notification when it happens!`)
  
  // Simulate scheduled treat (in real app, this would use actual scheduling)
  setTimeout(() => {
    if (treatCount < dailyTreatLimit) {
      setTreatCount(prev => prev + 1)
      setTreatLog(prev => [...prev.slice(-19), { time: new Date(), type: 'Scheduled Treat' }])
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('PennyCam Auto-Treat', {
          body: `Penny just got her scheduled treat! 🍖 (${treatCount + 1}/${dailyTreatLimit} today)`,
          icon: '/penny-icon.png'
        })
      }
    }
  }, 10000) // Demo: 10 seconds instead of hours
}

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
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/penny-icon.png" 
                    alt="Penny" 
                    className="w-full h-full object-cover"
                  />
                </div>
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

              <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-1">Need the PennyCam ID?</p>
                <p>Get the 6-digit code from your base station device</p>
                <p className="text-xs mt-2 text-blue-600">Demo: Enter any 6 characters to test</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg overflow-hidden">
                        <img 
                          src="/penny-icon.png" 
                          alt="Penny" 
                          className="w-full h-full object-cover"
                        />
                      </div>
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
                    {/* Demo video feed using Penny's photo */}
                    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="relative">
                        <img 
                          src="/penny-icon.png" 
                          alt="Penny Live Feed" 
                          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
                          style={{ 
                            maxWidth: '60%', 
                            maxHeight: '60%',
                            filter: 'brightness(0.95) contrast(1.05)',
                            userSelect: 'none',
                            pointerEvents: 'none'
                          }}
                          draggable={false}
                        />
                        {/* Subtle breathing animation overlay */}
                        <div 
                          className="absolute inset-0 bg-white opacity-5 rounded-lg animate-pulse"
                          style={{ animationDuration: '3s' }}
                        ></div>
                      </div>
                      
                      {hasUnreadMotion && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                            KITTEN ACTIVITY
                          </div>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
                          {currentTime.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {/* Demo mode indicator */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-xs">
                          Demo Mode - Simulated Penny Feed
                        </div>
                      </div>
                      
                      {/* Connection quality indicator */}
                      <div className="absolute bottom-4 right-4">
                        <div className="flex items-center gap-1 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          HD Quality
                        </div>
                      </div>
                    </div>
                    
                    {isMuted && (
                      <div className="absolute top-16 right-4">
                        <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                          <VolumeX className="w-3 h-3 mr-1 inline" />
                          Muted
                        </div>
                      </div>
                    )}
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
                      {isSpeaking ? (
                        <>
                          <div className="animate-pulse w-4 h-4 bg-white rounded-full mr-2"></div>
                          Talking to Penny...
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Hold to Talk to Penny
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={toggleMute}
                      variant={isMuted ? "destructive" : "outline"}
                      className="bg-white/80 backdrop-blur shadow-lg"
                    >
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
              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></div>
                    <span className="text-sm font-medium">Connected to PennyCam {connectionId}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium">Penny's Video Stream Active</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm font-medium">Audio {isMuted ? 'Muted' : 'Active'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      🐱 Kitten Alerts
                      {hasUnreadMotion && (
                        <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          NEW
                        </div>
                      )}
                    </CardTitle>
                    <Button
                      onClick={clearMotionAlerts}
                      size="sm"
                      variant="outline"
                      className="text-xs bg-orange-100 border-orange-300 hover:bg-orange-200"
                    >
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {motionAlerts.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No kitten alerts yet</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {motionAlerts.slice().reverse().map((alert, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs p-2 bg-orange-50 rounded border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1"></div>
                          <div className="flex-1">
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-gray-500">{alert.time.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Kitten Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={takePhoto}
                    variant="outline" 
                    className="w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-blue-50" 
                    size="sm"
                  >
                    📸 Take Photo of Penny
                  </Button>
                  <Button 
                    onClick={playKittenSound}
                    variant="outline" 
                    className="w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-green-50" 
                    size="sm"
                  >
                    🔊 Gentle "Pspsps" for Penny
                  </Button>
                  <Button 
                    onClick={playMeowSound}
                    variant="outline" 
                    className="w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-yellow-50" 
                    size="sm"
                  >
                    🐱 Play Meow Sound
                  </Button>
                  <Button 
                    onClick={playTrillingSound}
                    variant="outline" 
                    className="w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-purple-50" 
                    size="sm"
                  >
                    😺 Cat Talking/Trilling
                  </Button>
                  <Button 
                    onClick={sendVirtualPets}
                    variant="outline"
                    className="w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-pink-50"
                    size="sm"
                  >
                    ❤️ Send Virtual Pets
                  </Button>
                  <Button 
                    onClick={dispenseTreat}
                    variant="outline"
                    className={`w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-yellow-50 ${treatCount >= dailyTreatLimit ? 'opacity-50' : ''}`}
                    size="sm"
                    disabled={treatCount >= dailyTreatLimit}
                  >
                    🍖 Dispense Treat ({treatCount}/{dailyTreatLimit})
                  </Button>
                  <Button 
                    onClick={scheduleAutoTreat}
                    variant="outline"
                    className="w-full justify-start bg-white/80 backdrop-blur shadow-sm hover:bg-orange-50"
                    size="sm"
                  >
                    ⏰ Schedule Auto-Treat
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🍖 Treat Tracker
                    {treatCount > 0 && (
                      <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        {treatCount}
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-sm font-medium">Today's Treats</span>
                    <span className="text-lg font-bold text-yellow-700">{treatCount}/{dailyTreatLimit}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(treatCount / dailyTreatLimit) * 100}%` }}
                    ></div>
                  </div>
                  
                  {treatCount >= dailyTreatLimit && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                      🚫 Daily limit reached! Penny is full and happy! 💚
                    </div>
                  )}
                  
                  {lastTreatTime && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                      Last treat: {lastTreatTime.toLocaleTimeString()}
                    </div>
                  )}
                  
                  {treatLog.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      <div className="text-xs font-medium text-gray-700">Recent Treats:</div>
                      {treatLog.slice().reverse().slice(0, 3).map((log, index) => (
                        <div key={index} className="text-xs text-gray-600 flex justify-between">
                          <span>{log.type}</span>
                          <span>{log.time.toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
