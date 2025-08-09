import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import sharp from 'sharp'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    // Directory already exists
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir()
    
    const formData = await request.formData()
    const image = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const destinationUrl = formData.get('destination_url') as string
    const cardSize = formData.get('card_size') as string || 'large'

    if (!image || !title || !destinationUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate image
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Process image
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Generate unique filename
    const fileId = randomUUID().substring(0, 8)
    const filename = `${fileId}.jpg`
    const filepath = join(UPLOAD_DIR, filename)

    // Determine card dimensions
    const isLarge = cardSize === 'large'
    const cardWidth = isLarge ? 1200 : 600
    const cardHeight = isLarge ? 628 : 314
    
    // Create social media card
    const processedImage = await sharp(buffer)
      .resize(cardWidth, cardHeight, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 })
      .toBuffer()

    // Save processed image
    await writeFile(filepath, processedImage)

    // Save to database
    const card = await prisma.card.create({
      data: {
        title,
        description: description || null,
        destinationUrl,
        imageFilename: filename,
        cardSize
      }
    })

    return NextResponse.json({
      success: true,
      card: {
        id: card.id,
        title: card.title,
        description: card.description,
        destinationUrl: card.destinationUrl,
        imageFilename: card.imageFilename,
        cardSize: card.cardSize,
        createdAt: card.createdAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      cards: cards.map(card => ({
        id: card.id,
        title: card.title,
        description: card.description,
        destinationUrl: card.destinationUrl,
        imageFilename: card.imageFilename,
        cardSize: card.cardSize,
        createdAt: card.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}