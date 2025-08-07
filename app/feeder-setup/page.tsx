"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Home, Wifi, Check, AlertCircle, ExternalLink, Camera, Shield, Clock, Zap, ChevronRight, ChevronDown, Copy, Play } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

interface FeederGuide {
  id: string
  name: string
  price: string
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  timeToSetup: string
  features: string[]
  pros: string[]
  cons: string[]
  buyLink: string
  icon: React.ReactNode
  color: string
}

const feeders: FeederGuide[] = [
  {
    id: 'petcube-bites',
    name: 'Petcube Bites 2',
    price: '$249',
    difficulty: 'Easy',
    timeToSetup: '10 minutes',
    features: ['Built-in HD Camera', 'Treat Dispenser', 'Two-way Audio', 'Night Vision', 'Mobile App'],
    pros: ['All-in-one solution', 'Perfect PennyCam companion', 'Great video quality', 'Easy setup'],
    cons: ['Higher price point', 'Requires subscription for cloud storage'],
    buyLink: 'https://petcube.com/bites/',
    icon: <Camera className="w-6 h-6" />,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'petsafe-smart-feed',
    name: 'PetSafe Smart Feed',
    price: '$179',
    difficulty: 'Easy',
    timeToSetup: '15 minutes',
    features: ['WiFi Connectivity', 'Smartphone Control', 'Scheduled Feeding', 'Portion Control', 'Low Food Alerts'],
    pros: ['Reliable scheduling', 'Large food capacity', 'Good app interface', 'Affordable'],
    cons: ['No camera', 'Basic automation only', 'Can be noisy'],
    buyLink: 'https://www.petsafe.com/smart-feed',
    icon: <Clock className="w-6 h-6" />,
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'sureflap-surefeed',
    name: 'SureFlap SureFeed',
    price: '$149',
    difficulty: 'Medium',
    timeToSetup: '20 minutes',
    features: ['RFID Pet Recognition', 'Selective Feeding', 'App Monitoring', 'Feeding History', 'Multi-pet Support'],
    pros: ['Perfect for multi-pet homes', 'Prevents food stealing', 'Detailed feeding analytics', 'Vet recommended'],
    cons: ['Requires RFID collar/chip', 'More complex setup', 'Limited treat dispensing'],
    buyLink: 'https://www.surepetcare.com/en-us/pet-feeder',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'petlibro-wifi',
    name: 'PETLIBRO WiFi Feeder',
    price: '$89',
    difficulty: 'Easy',
    timeToSetup: '12 minutes',
    features: ['WiFi Control', 'Voice Recording', 'Scheduled Meals', 'Portion Control', 'Backup Battery'],
    pros: ['Most affordable', 'Voice message feature', 'Reliable operation', 'Good customer support'],
    cons: ['Basic app features', 'No camera', 'Smaller food capacity'],
    buyLink: 'https://petlibro.com/products/automatic-cat-feeder',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500'
  }
]

export default function FeederSetupPage() {
  const [selectedFeeder, setSelectedFeeder] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<{[key: string]: boolean}>({})
  const [setupProgress, setSetupProgress] = useState<{[key: string]: number}>({})

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }))
  }

  const markStepComplete = (feederId: string, stepIndex: number) => {
    setSetupProgress(prev => ({
      ...prev,
      [feederId]: Math.max(prev[feederId] || 0, stepIndex + 1)
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('📋 Copied to clipboard!')
  }

  const getSetupSteps = (feederId: string) => {
    const commonSteps = {
      'petcube-bites': [
        {
          title: '📦 Unbox Your Petcube Bites 2',
          content: (
            <div className="space-y-3">
              <p>What's in the box:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Petcube Bites 2 device</li>
                <li>Power adapter</li>
                <li>Treat container</li>
                <li>Quick start guide</li>
                <li>Mounting hardware</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-800">💡 <strong>Pro Tip:</strong> Choose a location with good WiFi signal and power outlet nearby!</p>
              </div>
            </div>
          )
        },
        {
          title: '📱 Download the Petcube App',
          content: (
            <div className="space-y-3">
              <p>Get the official app:</p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-black text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  App Store
                </Button>
                <Button size="sm" className="bg-green-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Play
                </Button>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">✅ <strong>Free to download</strong> - No subscription required for basic features!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔌 Power Up & Connect',
          content: (
            <div className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Plug in your Petcube Bites 2</li>
                <li>Wait for the LED to turn blue (about 30 seconds)</li>
                <li>Open the Petcube app and tap "Add Device"</li>
                <li>Follow the in-app WiFi setup wizard</li>
                <li>Enter your WiFi password when prompted</li>
              </ol>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">⚠️ <strong>WiFi Requirements:</strong> 2.4GHz network required (not 5GHz)</p>
              </div>
            </div>
          )
        },
        {
          title: '🍖 Fill with Treats & Test',
          content: (
            <div className="space-y-3">
              <p>Setup treats and test dispensing:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Fill the treat container with small, dry treats (pea-sized)</li>
                <li>Attach the container to the device</li>
                <li>Open the Petcube app</li>
                <li>Tap the "Treat" button to test dispensing</li>
                <li>Adjust treat size settings if needed</li>
              </ol>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">🎯 <strong>Recommended treats:</strong> Freeze-dried, small kibble, or Petcube's own treats work best!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔗 Connect to PennyCam',
          content: (
            <div className="space-y-3">
              <p>Integrate with your PennyCam system:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to PennyCam → Integrations → Smart Home</li>
                <li>Find "Petcube Bites" and click "Connect"</li>
                <li>Enter your Petcube account credentials</li>
                <li>Select your Petcube device from the list</li>
                <li>Test the connection by dispensing a treat</li>
              </ol>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="text-sm text-purple-800">🚀 <strong>You're all set!</strong> Now you can dispense real treats to Penny from anywhere!</p>
              </div>
            </div>
          )
        }
      ],
      'petsafe-smart-feed': [
        {
          title: '📦 Unbox Your PetSafe Smart Feed',
          content: (
            <div className="space-y-3">
              <p>What's included:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Smart Feed automatic feeder</li>
                <li>Power adapter</li>
                <li>Food hopper (holds up to 24 cups)</li>
                <li>Stainless steel food bowl</li>
                <li>Quick setup guide</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-800">💡 <strong>Placement tip:</strong> Keep away from water and in a quiet area for Penny!</p>
              </div>
            </div>
          )
        },
        {
          title: '📱 Get the My PetSafe App',
          content: (
            <div className="space-y-3">
              <p>Download the official app:</p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-black text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  iOS App Store
                </Button>
                <Button size="sm" className="bg-green-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Play Store
                </Button>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">✅ <strong>Free app</strong> with no monthly fees!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔧 Assembly & Setup',
          content: (
            <div className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Attach the food hopper to the base unit</li>
                <li>Place the stainless steel bowl in position</li>
                <li>Plug in the power adapter</li>
                <li>Press and hold the WiFi button until it blinks blue</li>
                <li>Open My PetSafe app and tap "Add Device"</li>
                <li>Follow the WiFi connection wizard</li>
              </ol>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">⚠️ <strong>Important:</strong> Use 2.4GHz WiFi only (not 5GHz)</p>
              </div>
            </div>
          )
        },
        {
          title: '🥘 Add Food & Configure Meals',
          content: (
            <div className="space-y-3">
              <p>Set up Penny feeding schedule:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Fill hopper with dry kibble (up to 24 cups)</li>
                <li>In the app, create Penny profile</li>
                <li>Set her weight and age for portion recommendations</li>
                <li>Schedule meal times (e.g., 8am, 12pm, 6pm)</li>
                <li>Test manual feeding to ensure proper dispensing</li>
              </ol>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">🎯 <strong>Portion guide:</strong> App automatically suggests portions based on Penny profile!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔗 PennyCam Integration',
          content: (
            <div className="space-y-3">
              <p>Connect to PennyCam for smart feeding:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to PennyCam → Integrations → Smart Home</li>
                <li>Find "PetSafe Smart Feed" and click "Connect"</li>
                <li>Enter your My PetSafe account login</li>
                <li>Select your Smart Feed device</li>
                <li>Set up automation rules (optional)</li>
              </ol>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="text-sm text-purple-800">🚀 <strong>Smart features unlocked!</strong> Feed Penny remotely and get low-food alerts!</p>
              </div>
            </div>
          )
        }
      ],
      'sureflap-surefeed': [
        {
          title: '📦 Unbox Your SureFeed System',
          content: (
            <div className="space-y-3">
              <p>What's in the package:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>SureFeed Microchip Pet Feeder</li>
                <li>Power adapter</li>
                <li>Stainless steel bowl</li>
                <li>Bowl holder</li>
                <li>RFID collar tag (if not using microchip)</li>
                <li>Setup guide</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-800">💡 <strong>Perfect for:</strong> Multi-pet homes where food stealing is an issue!</p>
              </div>
            </div>
          )
        },
        {
          title: '📱 Download Sure Petcare App',
          content: (
            <div className="space-y-3">
              <p>Get the official app:</p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-black text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  App Store
                </Button>
                <Button size="sm" className="bg-green-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Play
                </Button>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">✅ <strong>Free app</strong> with detailed feeding analytics!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔧 Hub Setup & Connection',
          content: (
            <div className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Connect the Hub to your router with ethernet cable</li>
                <li>Plug in the Hub power adapter</li>
                <li>Wait for green LED (about 2 minutes)</li>
                <li>Open Sure Petcare app and create account</li>
                <li>Follow the hub setup wizard</li>
                <li>Add your household and pets</li>
              </ol>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">⚠️ <strong>Hub required:</strong> The Hub connects all SureFlap devices to the internet</p>
              </div>
            </div>
          )
        },
        {
          title: '🐱 Register Penny ID',
          content: (
            <div className="space-y-3">
              <p>Set up Penny identification:</p>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="font-semibold text-sm mb-2">Option 1: Microchip (Recommended)</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Get Penny microchip number from vet</li>
                    <li>In app, add pet and enter microchip number</li>
                    <li>Hold Penny near feeder to register</li>
                  </ol>
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="font-semibold text-sm mb-2">Option 2: RFID Collar Tag</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Attach RFID tag to Penny collar</li>
                    <li>In app, add pet and scan tag</li>
                    <li>Test by having Penny approach feeder</li>
                  </ol>
                </div>
              </div>
            </div>
          )
        },
        {
          title: '🔗 PennyCam Integration',
          content: (
            <div className="space-y-3">
              <p>Connect to PennyCam for monitoring:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to PennyCam → Integrations → Smart Home</li>
                <li>Find "SureFlap SureFeed" and click "Connect"</li>
                <li>Enter your Sure Petcare account details</li>
                <li>Select your SureFeed device</li>
                <li>Configure feeding notifications</li>
              </ol>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="text-sm text-purple-800">🚀 <strong>Smart monitoring active!</strong> Get alerts when Penny eats and track her feeding patterns!</p>
              </div>
            </div>
          )
        }
      ],
      'petlibro-wifi': [
        {
          title: '📦 Unbox Your PETLIBRO Feeder',
          content: (
            <div className="space-y-3">
              <p>Package contents:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>PETLIBRO automatic feeder</li>
                <li>AC power adapter</li>
                <li>Backup battery pack (3 D batteries)</li>
                <li>Food hopper with lid</li>
                <li>Stainless steel food bowl</li>
                <li>User manual</li>
              </ul>
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-800">💡 <strong>Backup power:</strong> Batteries ensure Penny gets fed even during power outages!</p>
              </div>
            </div>
          )
        },
        {
          title: '📱 Get the PETLIBRO App',
          content: (
            <div className="space-y-3">
              <p>Download the app:</p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-black text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  iOS App Store
                </Button>
                <Button size="sm" className="bg-green-600 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Play
                </Button>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">✅ <strong>Completely free</strong> - No subscription fees ever!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔧 Setup & WiFi Connection',
          content: (
            <div className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Assemble the feeder (hopper + base + bowl)</li>
                <li>Install backup batteries (optional but recommended)</li>
                <li>Plug in the power adapter</li>
                <li>Press and hold WiFi button until LED blinks</li>
                <li>Open PETLIBRO app and tap "Add Device"</li>
                <li>Follow WiFi setup instructions</li>
              </ol>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">⚠️ <strong>Network:</strong> Requires 2.4GHz WiFi (most home networks work fine)</p>
              </div>
            </div>
          )
        },
        {
          title: '🎙️ Record Voice Message',
          content: (
            <div className="space-y-3">
              <p>Add a personal touch for Penny:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>In the PETLIBRO app, go to "Voice Recording"</li>
                <li>Tap and hold to record a 10-second message</li>
                <li>Say something like "Penny, dinner time!" in a happy voice</li>
                <li>Test the recording by playing it back</li>
                <li>Set it to play before each meal</li>
              </ol>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-800">🎯 <strong>Pro tip:</strong> Penny will learn to associate your voice with meal time!</p>
              </div>
            </div>
          )
        },
        {
          title: '🔗 Connect to PennyCam',
          content: (
            <div className="space-y-3">
              <p>Integrate with PennyCam:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to PennyCam → Integrations → Smart Home</li>
                <li>Find "PETLIBRO WiFi Feeder" and click "Connect"</li>
                <li>Enter your PETLIBRO account credentials</li>
                <li>Select your feeder from the device list</li>
                <li>Test remote feeding functionality</li>
              </ol>
              <div className="bg-purple-50 p-3 rounded border border-purple-200">
                <p className="text-sm text-purple-800">🚀 <strong>All connected!</strong> Now you can feed Penny remotely with your recorded voice message!</p>
              </div>
            </div>
          )
        }
      ]
    }

    return commonSteps[feederId as keyof typeof commonSteps] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <AppHeader subtitle="Smart Feeder Setup Guide" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/integrations">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Integrations
            </Button>
          </Link>
        </div>

        {!selectedFeeder ? (
          <>
            {/* Feeder Comparison */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl mb-8">
              <CardHeader>
                <CardTitle className="text-center text-2xl">🍖 Choose Your Smart Feeder</CardTitle>
                <CardDescription className="text-center">
                  Compare features and find the perfect automatic feeder for Penny
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {feeders.map(feeder => (
                    <Card key={feeder.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
                      <CardHeader className="pb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feeder.color} flex items-center justify-center mx-auto mb-4 shadow-lg text-white`}>
                          {feeder.icon}
                        </div>
                        <CardTitle className="text-lg text-center">{feeder.name}</CardTitle>
                        <div className="text-center space-y-2">
                          <div className="text-2xl font-bold text-green-600">{feeder.price}</div>
                          <div className="flex items-center justify-center gap-2">
                            <Badge variant={feeder.difficulty === 'Easy' ? 'default' : feeder.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                              {feeder.difficulty}
                            </Badge>
                            <Badge variant="outline">{feeder.timeToSetup}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">✨ Key Features:</h4>
                          <ul className="text-xs space-y-1">
                            {feeder.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Check className="w-3 h-3 text-green-600" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            onClick={() => setSelectedFeeder(feeder.id)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            size="sm"
                          >
                            📋 Setup Guide
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.open(feeder.buyLink, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Comparison Table */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle>📊 Detailed Comparison</CardTitle>
                <CardDescription>
                  Side-by-side feature comparison to help you decide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Feature</th>
                        {feeders.map(feeder => (
                          <th key={feeder.id} className="text-center p-3 min-w-32">
                            <div className="font-semibold">{feeder.name}</div>
                            <div className="text-lg font-bold text-green-600">{feeder.price}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Built-in Camera</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Treat Dispensing</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">⚠️</td>
                        <td className="text-center p-3">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Voice Recording</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Multi-Pet Support</td>
                        <td className="text-center p-3">⚠️</td>
                        <td className="text-center p-3">⚠️</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">⚠️</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Setup Difficulty</td>
                        <td className="text-center p-3">
                          <Badge variant="default" className="text-xs">Easy</Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="default" className="text-xs">Easy</Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="secondary" className="text-xs">Medium</Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="default" className="text-xs">Easy</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Best For</td>
                        <td className="text-center p-3 text-xs">All-in-one solution</td>
                        <td className="text-center p-3 text-xs">Scheduled feeding</td>
                        <td className="text-center p-3 text-xs">Multi-pet homes</td>
                        <td className="text-center p-3 text-xs">Budget-conscious</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Selected Feeder Setup Guide */}
            {(() => {
              const feeder = feeders.find(f => f.id === selectedFeeder)!
              const steps = getSetupSteps(selectedFeeder)
              const progress = setupProgress[selectedFeeder] || 0
              const progressPercentage = (progress / steps.length) * 100

              return (
                <div className="space-y-6">
                  {/* Header */}
                  <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feeder.color} flex items-center justify-center shadow-lg text-white`}>
                            {feeder.icon}
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{feeder.name} Setup Guide</CardTitle>
                            <CardDescription>
                              {feeder.difficulty} setup • {feeder.timeToSetup} • {feeder.price}
                            </CardDescription>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedFeeder(null)}
                          className="bg-white/80 backdrop-blur"
                        >
                          ← Back to Compare
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Setup Progress</span>
                          <span>{progress}/{steps.length} steps completed</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Setup Steps */}
                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const stepId = `${selectedFeeder}-step-${index}`
                      const isExpanded = expandedSteps[stepId]
                      const isCompleted = progress > index
                      const isCurrent = progress === index

                      return (
                        <Card key={stepId} className={`bg-white/80 backdrop-blur border-0 shadow-lg transition-all duration-300 ${
                          isCurrent ? 'ring-2 ring-blue-500 shadow-xl' : ''
                        } ${isCompleted ? 'bg-green-50/80' : ''}`}>
                          <CardHeader 
                            className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                            onClick={() => toggleStep(stepId)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-400'
                                }`}>
                                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{step.title}</CardTitle>
                                  {isCurrent && (
                                    <Badge variant="default" className="mt-1 bg-blue-500">
                                      Current Step
                                    </Badge>
                                  )}
                                  {isCompleted && (
                                    <Badge variant="default" className="mt-1 bg-green-500">
                                      ✅ Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!isCompleted && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markStepComplete(selectedFeeder, index)
                                    }}
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    Mark Complete
                                  </Button>
                                )}
                                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                              </div>
                            </div>
                          </CardHeader>
                          {isExpanded && (
                            <CardContent className="pt-0">
                              <div className="pl-14">
                                {step.content}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>

                  {/* Completion Card */}
                  {progress === steps.length && (
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-xl">
                      <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">🎉 Setup Complete!</h3>
                        <p className="text-gray-600 mb-6">
                          Your {feeder.name} is now connected to PennyCam and ready to feed Penny!
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Link href="/remote-viewer">
                            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                              <Play className="w-4 h-4 mr-2" />
                              Test Remote Feeding
                            </Button>
                          </Link>
                          <Link href="/integrations">
                            <Button variant="outline" className="bg-white/80 backdrop-blur">
                              View All Integrations
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick Reference */}
                  <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle>📋 Quick Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">✅ Pros:</h4>
                          <ul className="space-y-1 text-sm">
                            {feeder.pros.map((pro, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">⚠️ Considerations:</h4>
                          <ul className="space-y-1 text-sm">
                            {feeder.cons.map((con, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </>
        )}
      </div>
    </div>
  )
}
