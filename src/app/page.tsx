'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Facebook, Twitter, Linkedin, MessageCircle, ExternalLink, Share2, Copy, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Card {
  id: string
  title: string
  description?: string
  destinationUrl: string
  imageFilename?: string
  cardSize: 'large' | 'small'
  createdAt: string
}

export default function Home() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [cardSize, setCardSize] = useState<'large' | 'small'>('large')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCard, setGeneratedCard] = useState<Card | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Share URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Failed to copy URL')
    }
  }

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnTwitter = () => {
    const text = generatedCard ? `Check out this amazing social card: ${generatedCard.title}` : 'Check out this social card'
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  const shareOnWhatsApp = () => {
    const text = generatedCard ? `Check out this social card: ${generatedCard.title} - ${shareUrl}` : `Check out this social card - ${shareUrl}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const openCardPage = () => {
    if (generatedCard) {
      window.open(`/card/${generatedCard.id}`, '_blank')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !title || !destinationUrl) return

    setIsGenerating(true)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('destination_url', destinationUrl)
      formData.append('card_size', cardSize)

      const response = await fetch('/api/cards', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to generate card')
      }

      const result = await response.json()
      setGeneratedCard(result.card)
      
      // Set share URL
      const baseUrl = window.location.origin
      setShareUrl(`${baseUrl}/card/${result.card.id}`)
      
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      // Reset form
      setTitle('')
      setDescription('')
      setDestinationUrl('')
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Error generating card:', error)
      alert('Failed to generate card. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCard = async (cardId: string) => {
    try {
      const response = await fetch(`/api/cards/${cardId}/download`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `social-card-${cardId}.jpg`
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ClickablePhoto v2
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning social media cards with modern technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Create Your Card
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-32 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">Click or drag to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          {isDragActive ? 'Drop the image here' : 'Drag & drop an image'}
                        </p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter card title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination URL *
                </label>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com"
                  required
                />
              </div>

              {/* Card Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Size
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="large"
                      checked={cardSize === 'large'}
                      onChange={(e) => setCardSize(e.target.value as 'large' | 'small')}
                      className="mr-2"
                    />
                    Large (1200×628)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="small"
                      checked={cardSize === 'small'}
                      onChange={(e) => setCardSize(e.target.value as 'large' | 'small')}
                      className="mr-2"
                    />
                    Small (600×314)
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!selectedFile || !title || !destinationUrl || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  'Generate Card'
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Preview Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Live Preview</h2>
            
            <AnimatePresence mode="wait">
              {generatedCard ? (
                <motion.div
                  key="generated"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <div 
                    className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 text-center cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all duration-200 group"
                    onClick={openCardPage}
                  >
                    {generatedCard.imageFilename && (
                      <div className="mb-4">
                        <img
                          src={`/api/uploads/${generatedCard.imageFilename}`}
                          alt={generatedCard.title}
                          className="w-full max-w-md mx-auto rounded-lg shadow-md"
                          style={{
                            aspectRatio: generatedCard.cardSize === 'large' ? '1200/628' : '600/314'
                          }}
                        />
                      </div>
                    )}
                    <div className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                      {generatedCard.title}
                    </div>
                    {generatedCard.description && (
                      <div className="text-gray-600 mb-4">
                        {generatedCard.description}
                      </div>
                    )}
                    <div className="text-sm text-blue-600 flex items-center justify-center gap-1 group-hover:text-blue-700">
                      <ExternalLink className="w-4 h-4" />
                      Click to view full card
                    </div>
                  </div>
                  
                  {/* Enhanced Share Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Share2 className="w-6 h-6 text-blue-600" />
                      <span className="font-bold text-blue-900 text-lg">Share Your Card</span>
                    </div>
                    
                    {/* URL Copy Section */}
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-4 py-3 border border-blue-200 rounded-lg text-sm bg-white shadow-sm"
                        placeholder="Share URL will appear here"
                      />
                      <button
                        onClick={copyShareUrl}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                        title="Copy share URL"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>

                    {/* Social Media Buttons */}
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
                  
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => downloadCard(generatedCard.id)}
                      className="bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </motion.button>
                    <motion.button
                      onClick={openCardPage}
                      className="bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink className="w-5 h-5" />
                      View Card
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setGeneratedCard(null)
                        setShareUrl('')
                      }}
                      className="col-span-2 px-4 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create New Card
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    Your generated card will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
