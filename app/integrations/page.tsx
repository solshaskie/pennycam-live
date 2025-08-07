"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Home, Smartphone, Cloud, Bell, Camera, Share2, Database, Zap, Settings, Check, ExternalLink, Lightbulb, Shield, Clock, Heart } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'cloud' | 'notifications' | 'smart-home' | 'social' | 'storage'
  connected: boolean
  premium?: boolean
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Automatically backup Penny photos and videos to Dropbox',
      icon: <Cloud className="w-6 h-6" />,
      category: 'storage',
      connected: false
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Save recordings and photos to your Google Drive',
      icon: <Database className="w-6 h-6" />,
      category: 'storage',
      connected: true
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get motion alerts and updates in your Slack workspace (requires PennyCam Pro subscription)',
      icon: <Bell className="w-6 h-6" />,
      category: 'notifications',
      connected: false,
      premium: true
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Receive Penny updates in your Discord server',
      icon: <Bell className="w-6 h-6" />,
      category: 'notifications',
      connected: false
    },
    {
      id: 'alexa',
      name: 'Amazon Alexa',
      description: 'Control PennyCam with voice commands via Alexa (requires PennyCam Pro subscription)',
      icon: <Smartphone className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    },
    {
      id: 'google-home',
      name: 'Google Home',
      description: 'Ask Google about Penny\'s activity and status',
      icon: <Smartphone className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'smartthings',
      name: 'Samsung SmartThings',
      description: 'Integrate with SmartThings hub and automate smart home devices based on Penny\'s activity',
      icon: <Home className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'philips-hue',
      name: 'Philips Hue',
      description: 'Control smart lights based on Penny\'s activity - turn on lights when motion detected or create mood lighting',
      icon: <Lightbulb className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'lifx',
      name: 'LIFX',
      description: 'Automate LIFX smart bulbs to respond to Penny\'s movements and create custom lighting scenes',
      icon: <Lightbulb className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'nanoleaf',
      name: 'Nanoleaf',
      description: 'Create dynamic light patterns and effects with Nanoleaf panels when Penny is active (requires PennyCam Pro)',
      icon: <Lightbulb className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Share Penny\'s adorable moments to your Facebook timeline and stories',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      connected: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Share cute Penny moments directly to Instagram Stories (requires PennyCam Pro subscription)',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      connected: false,
      premium: true
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Tweet Penny\'s adorable photos automatically',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      connected: false
    },
    {
      id: 'ifttt',
      name: 'IFTTT',
      description: 'Create custom automations with If This Then That (requires PennyCam Pro for advanced triggers)',
      icon: <Zap className="w-6 h-6" />,
      category: 'cloud',
      connected: false,
      premium: true
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect PennyCam to 5000+ apps and services (requires PennyCam Pro subscription)',
      icon: <Zap className="w-6 h-6" />,
      category: 'cloud',
      connected: false,
      premium: true
    },
    {
      id: 'petcube-bites',
      name: 'Petcube Bites',
      description: 'Dispense real treats remotely with built-in camera integration - perfect companion to PennyCam!',
      icon: <Camera className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    },
    {
      id: 'petsafe-smart-feed',
      name: 'PetSafe Smart Feed',
      description: 'Schedule and control automatic feeding times based on Penny\'s activity patterns',
      icon: <Settings className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'sureflap-surefeed',
      name: 'SureFlap SureFeed',
      description: 'RFID-controlled smart feeding bowls that only open for Penny - prevent food stealing!',
      icon: <Shield className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    },
    {
      id: 'petlibro-feeder',
      name: 'PETLIBRO WiFi Feeder',
      description: 'Programmable automatic feeder with portion control and feeding schedules',
      icon: <Clock className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'whistle-smart-feeder',
      name: 'Whistle Smart Feeder',
      description: 'Advanced feeding with health tracking integration and portion monitoring',
      icon: <Heart className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Add these new state variables after the existing useState declarations
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [configSettings, setConfigSettings] = useState<{[key: string]: any}>({
    facebook: {
      autoPost: true,
      shareToStories: false,
      privacy: 'friends',
      postFrequency: 'motion',
      includeTimestamp: true,
      customMessage: "Look at Penny being adorable! 🐱"
    },
    'google-drive': {
      backupFolder: '/PennyCam Photos',
      autoBackupVideos: true,
      syncFrequency: 'hourly',
      fileNaming: 'penny-YYYY-MM-DD-HH-mm',
      maxFileSize: '100MB',
      deleteAfter: '30 days'
    },
    discord: {
      serverId: 'Pet Lovers Community',
      channelId: '#penny-updates',
      motionAlerts: true,
      photoSharing: true,
      mentionEveryone: false,
      alertSound: true,
      customEmoji: '<:penny:123456789>', // Custom Penny emoji
      availableServers: [
        { id: 'pet-lovers-community', name: 'Pet Lovers Community', members: 1247 },
        { id: 'family-server', name: 'Johnson Family Server', members: 8 },
        { id: 'cat-enthusiasts', name: 'Cat Enthusiasts United', members: 3421 },
        { id: 'penny-fan-club', name: 'Penny Fan Club', members: 156 },
        { id: 'smart-home-hub', name: 'Smart Home Automation', members: 892 }
      ],
      availableChannels: [
        '#penny-updates', '#pet-photos', '#motion-alerts', '#general', 
        '#cute-moments', '#feeding-schedule', '#vet-reminders'
      ]
    }
  })

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'storage', name: 'Cloud Storage', count: integrations.filter(i => i.category === 'storage').length },
    { id: 'notifications', name: 'Notifications', count: integrations.filter(i => i.category === 'notifications').length },
    { id: 'smart-home', name: 'Smart Home', count: integrations.filter(i => i.category === 'smart-home').length },
    { id: 'social', name: 'Social Media', count: integrations.filter(i => i.category === 'social').length },
    { id: 'cloud', name: 'Automation', count: integrations.filter(i => i.category === 'cloud').length }
  ]

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected }
        : integration
    ))
  }

  // Replace the configureIntegration function with this:
  const configureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowConfigModal(true)
  }

  const saveConfiguration = () => {
    if (selectedIntegration) {
      alert(`✅ Configuration saved for ${selectedIntegration.name}!\n\nYour settings have been applied and will take effect immediately.`)
      setShowConfigModal(false)
      setSelectedIntegration(null)
    }
  }

  const updateSetting = (key: string, value: any) => {
    if (selectedIntegration) {
      setConfigSettings(prev => ({
        ...prev,
        [selectedIntegration.id]: {
          ...prev[selectedIntegration.id],
          [key]: value
        }
      }))
    }
  }

  // Add this configuration modal component right before the return statement:
  const ConfigurationModal = () => {
    if (!showConfigModal || !selectedIntegration) return null
    
    const settings = configSettings[selectedIntegration.id] || {}
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  {selectedIntegration.icon}
                </div>
                {selectedIntegration.name} Configuration
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConfigModal(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Facebook Settings */}
            {selectedIntegration.id === 'facebook' && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800">📱 Posting Settings</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <label className="font-medium">Auto-post Penny photos</label>
                      <p className="text-sm text-gray-600">Automatically share photos when motion is detected</p>
                    </div>
                    <Switch 
                      checked={settings.autoPost} 
                      onCheckedChange={(value) => updateSetting('autoPost', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <label className="font-medium">Share to Facebook Stories</label>
                      <p className="text-sm text-gray-600">Also post to your 24-hour stories</p>
                    </div>
                    <Switch 
                      checked={settings.shareToStories} 
                      onCheckedChange={(value) => updateSetting('shareToStories', value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Privacy Setting</label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={settings.privacy}
                      onChange={(e) => updateSetting('privacy', e.target.value)}
                    >
                      <option value="public">Public - Anyone can see</option>
                      <option value="friends">Friends only</option>
                      <option value="close-friends">Close friends only</option>
                      <option value="custom">Custom audience</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Post Frequency</label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={settings.postFrequency}
                      onChange={(e) => updateSetting('postFrequency', e.target.value)}
                    >
                      <option value="motion">Every motion detection</option>
                      <option value="hourly">Maximum once per hour</option>
                      <option value="daily">Maximum once per day</option>
                      <option value="manual">Manual approval required</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Custom Message Template</label>
                    <Input
                      value={settings.customMessage}
                      onChange={(e) => updateSetting('customMessage', e.target.value)}
                      placeholder="Enter your custom message..."
                    />
                    <p className="text-xs text-gray-500">Use {timestamp} for automatic time, {activity} for detected activity</p>
                  </div>
                </div>
              </>
            )}
            
            {/* Google Drive Settings */}
            {selectedIntegration.id === 'google-drive' && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-800">☁️ Backup Settings</h4>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Backup Folder Path</label>
                    <Input
                      value={settings.backupFolder}
                      onChange={(e) => updateSetting('backupFolder', e.target.value)}
                      placeholder="/PennyCam Photos"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <label className="font-medium">Auto-backup Videos</label>
                      <p className="text-sm text-gray-600">Automatically save video recordings</p>
                    </div>
                    <Switch 
                      checked={settings.autoBackupVideos} 
                      onCheckedChange={(value) => updateSetting('autoBackupVideos', value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Sync Frequency</label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={settings.syncFrequency}
                      onChange={(e) => updateSetting('syncFrequency', e.target.value)}
                    >
                      <option value="realtime">Real-time (immediate)</option>
                      <option value="hourly">Every hour</option>
                      <option value="daily">Once daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">File Naming Convention</label>
                    <Input
                      value={settings.fileNaming}
                      onChange={(e) => updateSetting('fileNaming', e.target.value)}
                      placeholder="penny-YYYY-MM-DD-HH-mm"
                    />
                    <p className="text-xs text-gray-500">YYYY=year, MM=month, DD=day, HH=hour, mm=minute</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-medium">Max File Size</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={settings.maxFileSize}
                        onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                      >
                        <option value="50MB">50MB</option>
                        <option value="100MB">100MB</option>
                        <option value="500MB">500MB</option>
                        <option value="1GB">1GB</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium">Auto-delete After</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={settings.deleteAfter}
                        onChange={(e) => updateSetting('deleteAfter', e.target.value)}
                      >
                        <option value="never">Never delete</option>
                        <option value="30 days">30 days</option>
                        <option value="90 days">90 days</option>
                        <option value="1 year">1 year</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Discord Settings */}
            {selectedIntegration.id === 'discord' && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-800">💬 Discord Integration</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-medium">Discord Server</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={settings.serverId}
                        onChange={(e) => updateSetting('serverId', e.target.value)}
                      >
                        {settings.availableServers?.map(server => (
                          <option key={server.id} value={server.name}>
                            {server.name} ({server.members} members)
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500">Choose which Discord server to send Penny updates</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-medium">Channel</label>
                      <select 
                        className="w-full p-2 border rounded-lg"
                        value={settings.channelId}
                        onChange={(e) => updateSetting('channelId', e.target.value)}
                      >
                        {settings.availableChannels?.map(channel => (
                          <option key={channel} value={channel}>
                            {channel}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500">Specific channel for PennyCam notifications</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <label className="font-medium">Motion Alerts</label>
                        <p className="text-sm text-gray-600">Send message when Penny moves</p>
                      </div>
                      <Switch 
                        checked={settings.motionAlerts} 
                        onCheckedChange={(value) => updateSetting('motionAlerts', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <label className="font-medium">Photo Sharing</label>
                        <p className="text-sm text-gray-600">Automatically share cute photos</p>
                      </div>
                      <Switch 
                        checked={settings.photoSharing} 
                        onCheckedChange={(value) => updateSetting('photoSharing', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <label className="font-medium">@everyone Mentions</label>
                        <p className="text-sm text-gray-600">Notify all server members</p>
                      </div>
                      <Switch 
                        checked={settings.mentionEveryone} 
                        onCheckedChange={(value) => updateSetting('mentionEveryone', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <label className="font-medium">Alert Sound</label>
                        <p className="text-sm text-gray-600">Play notification sound</p>
                      </div>
                      <Switch 
                        checked={settings.alertSound} 
                        onCheckedChange={(value) => updateSetting('alertSound', value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium">Custom Emoji</label>
                    <div className="flex items-center gap-3">
                      <Input
                        value={settings.customEmoji}
                        onChange={(e) => updateSetting('customEmoji', e.target.value)}
                        placeholder="<:penny:123456789>"
                        className="flex-1"
                      />
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <img 
                          src="/penny-emoji.png" 
                          alt="Penny Custom Emoji" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Use your custom Penny emoji in Discord alerts</p>
                      <p>• Format: &lt;:penny:123456789&gt; (get from Discord server)</p>
                      <p>• Upload the Penny emoji to your Discord server first</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 text-sm mb-2">📤 How to Upload Custom Emoji:</h5>
                      <ol className="text-xs text-blue-700 space-y-1">
                        <li>1. Go to your Discord server settings</li>
                        <li>2. Click "Emoji" in the sidebar</li>
                        <li>3. Click "Upload Emoji" and select the Penny image</li>
                        <li>4. Name it "penny" and save</li>
                        <li>5. Copy the emoji code: &lt;:penny:ID&gt;</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Generic Settings for other integrations */}
            {!['facebook', 'google-drive', 'discord'].includes(selectedIntegration.id) && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">⚙️ General Settings</h4>
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-center text-gray-600">
                    🚧 Configuration panel for <strong>{selectedIntegration.name}</strong> would include:
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    <li>• Authentication & API keys</li>
                    <li>• Notification preferences</li>
                    <li>• Automation triggers</li>
                    <li>• Privacy & sharing settings</li>
                    <li>• Custom rules & filters</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={saveConfiguration} className="flex-1">
                💾 Save Configuration
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowConfigModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory)

  const connectedCount = integrations.filter(i => i.connected).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <AppHeader subtitle="Integrations" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{integrations.length}</div>
              <div className="text-sm text-gray-600">Available Integrations</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{connectedCount}</div>
              <div className="text-sm text-gray-600">Connected Services</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{integrations.filter(i => i.premium).length}</div>
              <div className="text-sm text-gray-600">PennyCam Pro Features</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Integrations Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredIntegrations.map(integration => (
                <Card key={integration.id} className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          integration.connected 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                        }`}>
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {integration.name}
                            {integration.premium && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                                PRO
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {integration.category.replace('-', ' ')}
                            </Badge>
                            {integration.connected && (
                              <Badge variant="default" className="bg-green-500 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={integration.connected}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                        disabled={integration.premium && !integration.connected}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm text-gray-600 mb-4">
                      {integration.description}
                    </CardDescription>
                    
                    {integration.connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Check className="w-4 h-4" />
                          <span>Successfully connected</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => configureIntegration(integration)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {integration.premium && !integration.connected ? (
                          <Link href="/billing">
                            <Button 
                              className="w-full" 
                              size="sm"
                            >
                              💎 Upgrade to PennyCam Pro
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => toggleIntegration(integration.id)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
                  <p className="text-gray-600">Try selecting a different category</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* PennyCam Pro Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              PennyCam Pro Subscription
            </CardTitle>
            <CardDescription>
              Unlock advanced integrations and premium features for enhanced pet monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-800 mb-3">What's Included:</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Advanced voice control with Alexa
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Professional notifications via Slack
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Instagram Stories integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Advanced automation with IFTTT & Zapier
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Premium smart lighting with Nanoleaf
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-center p-6 bg-white/60 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$2.99</div>
                  <div className="text-sm text-purple-700 mb-4">per month</div>
                  <Link href="/billing">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Integrations */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Popular Integration Ideas
            </CardTitle>
            <CardDescription>
              Here are some popular ways PennyCam users connect their pet monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🏠 Complete Smart Home</h4>
                <p className="text-sm text-blue-700">Connect SmartThings + Google Home + Philips Hue to automate lights and get voice updates about Penny</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🔔 Free Alert System</h4>
                <p className="text-sm text-green-700">Use Discord + Facebook to get motion alerts and share updates without any subscription fees</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">💎 Pro Social Sharing</h4>
                <p className="text-sm text-purple-700">Upgrade to Pro for Instagram Stories + Slack notifications + advanced IFTTT automations</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Smart Lighting</h4>
                <p className="text-sm text-yellow-700">Use Philips Hue + LIFX (free) or upgrade to Pro for advanced Nanoleaf light patterns</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🍖 Real Treat Dispensing</h4>
                <p className="text-sm text-green-700">Connect Petcube Bites + PetSafe Smart Feed for actual remote feeding triggered by Penny's activity</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">🍖 Real Smart Feeders</h4>
                <p className="text-sm text-orange-700 mb-3">Connect actual automatic feeders for remote treat dispensing and scheduled meals</p>
                <Link href="/feeder-setup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    📋 Feeder Setup Guide
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ConfigurationModal />
    </div>
  )
}
