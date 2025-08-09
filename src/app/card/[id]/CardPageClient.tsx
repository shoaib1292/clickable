'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Download, Share2, Copy, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react'

interface Card {
  id: string
  title: string
  description?: string
  destinationUrl: string
  imageFilename?: string
  cardSize: 'large' | 'small'
  createdAt: Date
}

interface Props {
  card: Card
  imageUrl: string
  baseUrl: string
}

export default function CardPageClient({ card, imageUrl, baseUrl }: Props) {
  const [copied, setCopied] = useState(false)
  
  const shareUrl = `${baseUrl}/card/${card.id}`

  const handleCardClick = () => {
    if (card.destinationUrl) {
      window.open(card.destinationUrl, '_blank')
    }
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy URL')
    }
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(card.title)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
  }

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${card.title} - ${shareUrl}`)}`
    window.open(whatsappUrl, '_blank')
  }

  const downloadCard = async () => {
    try {
      const response = await fetch(`/api/cards/${card.id}/download`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `social-card-${card.id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download card')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{card.title}</h1>
        {card.description && (
          <p className="text-gray-600 text-lg">{card.description}</p>
        )}
      </div>

      {/* Clickable Card Image */}
      <div className="flex justify-center mb-8">
        <div 
          onClick={handleCardClick}
          className="relative cursor-pointer group transition-transform hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: card.cardSize === 'large' ? '600px' : '300px',
            height: card.cardSize === 'large' ? '314px' : '157px'
          }}
        >
          <Image
            src={imageUrl}
            alt={card.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <span>Size: {card.cardSize === 'large' ? 'Large (1200×628)' : 'Small (600×314)'}</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <span>Card ID: {card.id}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={handleCardClick}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Website
          </button>
          
          <button
            onClick={downloadCard}
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Card
          </button>
        </div>
      </div>

      {/* Enhanced Share Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-blue-900 text-xl">Share This Card</h3>
        </div>
        
        {/* URL Copy Section */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-4 py-3 border border-blue-200 rounded-lg text-sm bg-white shadow-sm"
          />
          <button
            onClick={copyShareUrl}
            className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Social Media Share Buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 mb-3">Share directly on social platforms:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 px-4 rounded-lg hover:bg-[#166FE5] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </button>
            
            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white py-3 px-4 rounded-lg hover:bg-[#1A91DA] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </button>
            
            <button
              onClick={shareOnLinkedIn}
              className="flex items-center justify-center gap-2 bg-[#0A66C2] text-white py-3 px-4 rounded-lg hover:bg-[#095BB0] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </button>
            
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 rounded-lg hover:bg-[#22C55E] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-xs text-blue-700 font-medium">
            💡 <strong>Pro Tip:</strong> When you share this URL, it will automatically show a beautiful preview with your image, title, and description on all social platforms!
          </p>
        </div>
      </div>
    </div>
  )
}