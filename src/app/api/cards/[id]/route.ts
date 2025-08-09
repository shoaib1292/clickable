import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const card = await prisma.card.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      )
    }

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
    console.error('Error fetching card:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find card first
    const card = await prisma.card.findUnique({
      where: { id }
    })

    if (!card) {
      return NextResponse.json(
        { success: false, error: 'Card not found' },
        { status: 404 }
      )
    }

    // Delete associated image file if exists
    if (card.imageFilename) {
      const imagePath = join(UPLOAD_DIR, card.imageFilename)
      if (existsSync(imagePath)) {
        try {
          await unlink(imagePath)
        } catch (error) {
          console.error('Error deleting image file:', error)
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    await prisma.card.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Card deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}