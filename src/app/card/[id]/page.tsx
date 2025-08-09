import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ArrowLeft, Download, Share2, Copy } from 'lucide-react'
import CardPageClient from './CardPageClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const card = await prisma.card.findUnique({
    where: { id }
  })

  if (!card) {
    return {
      title: 'Card Not Found',
      description: 'The requested card could not be found.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const imageUrl = card.imageFilename 
    ? `${baseUrl}/api/uploads/${card.imageFilename}`
    : `${baseUrl}/placeholder-image.svg`
  const cardUrl = `${baseUrl}/card/${card.id}`

  return {
    title: card.title,
    description: card.description || 'Social media card created with ClickablePhoto',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: cardUrl,
    },
    openGraph: {
      title: card.title,
      description: card.description || 'Social media card created with ClickablePhoto',
      url: cardUrl,
      siteName: 'ClickablePhoto',
      images: [
        {
          url: imageUrl,
          width: card.cardSize === 'large' ? 1200 : 600,
          height: card.cardSize === 'large' ? 628 : 314,
          alt: card.title,
          type: 'image/jpeg',
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: card.title,
      description: card.description || 'Social media card created with ClickablePhoto',
      images: [{
        url: imageUrl,
        alt: card.title,
      }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    other: {
      'fb:app_id': '1234567890',
    },
  }
}

export default async function CardPage({ params }: Props) {
  const { id } = await params
  const card = await prisma.card.findUnique({
    where: { id }
  })

  if (!card) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const imageUrl = card.imageFilename 
    ? `/api/uploads/${card.imageFilename}`
    : '/placeholder-image.svg'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </Link>
        </div>

        <CardPageClient 
          card={{
            ...card,
            description: card.description ?? undefined,
            imageFilename: card.imageFilename ?? undefined,
            cardSize: card.cardSize as 'large' | 'small'
          }}
          imageUrl={imageUrl}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  )
}