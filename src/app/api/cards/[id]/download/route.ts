import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find card in database
    const card = await prisma.card.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      )
    }

    if (!card.imageFilename) {
      return NextResponse.json(
        { success: false, error: 'No image associated with this card' },
        { status: 404 }
      )
    }

    const imagePath = join(UPLOAD_DIR, card.imageFilename)

    if (!existsSync(imagePath)) {
      return NextResponse.json(
        { success: false, error: 'Image file not found' },
        { status: 404 }
      )
    }

    // Read the image file
    const imageBuffer = await readFile(imagePath)

    // Return the image as a download
    return new NextResponse(imageBuffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="social-card-${id}.jpg"`,
        'Content-Length': imageBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Error downloading card:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}