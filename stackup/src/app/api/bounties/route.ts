import { NextRequest, NextResponse } from 'next/server'

// Mock database for now - replace with MongoDB Atlas calls later
const bounties: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const difficulty = searchParams.get('difficulty')

    let filteredBounties = [...bounties]

    if (category) {
      filteredBounties = filteredBounties.filter(bounty => 
        bounty.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (status) {
      filteredBounties = filteredBounties.filter(bounty => 
        bounty.status.toLowerCase() === status.toLowerCase()
      )
    }

    if (difficulty) {
      filteredBounties = filteredBounties.filter(bounty => 
        bounty.difficulty.toLowerCase() === difficulty.toLowerCase()
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredBounties,
      total: filteredBounties.length
    })
  } catch (error) {
    console.error('Error fetching bounties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bounties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const bountyData = await request.json()

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'amount', 'creatorAddress', 
      'workerAddress', 'category', 'difficulty'
    ]
    
    for (const field of requiredFields) {
      if (!bountyData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const newBounty = {
      id: Date.now().toString(),
      ...bountyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: bountyData.status || 'pending',
      applications: [],
      viewCount: 0,
    }

    bounties.push(newBounty)

    return NextResponse.json({
      success: true,
      data: newBounty,
      message: 'Bounty created successfully'
    })
  } catch (error) {
    console.error('Error creating bounty:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create bounty' },
      { status: 500 }
    )
  }
}

// Add this to handle specific bounty requests
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bountyId = searchParams.get('id')
    
    if (!bountyId) {
      return NextResponse.json(
        { success: false, error: 'Bounty ID is required' },
        { status: 400 }
      )
    }

    const updateData = await request.json()
    const bountyIndex = bounties.findIndex(b => b.id === bountyId)
    
    if (bountyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Bounty not found' },
        { status: 404 }
      )
    }

    bounties[bountyIndex] = {
      ...bounties[bountyIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: bounties[bountyIndex],
      message: 'Bounty updated successfully'
    })
  } catch (error) {
    console.error('Error updating bounty:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update bounty' },
      { status: 500 }
    )
  }
}
