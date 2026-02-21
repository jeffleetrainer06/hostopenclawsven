import { NextResponse } from 'next/server';
import { markAsRead } from '@/lib/database';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    markAsRead(customerId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to mark as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark as read' },
      { status: 500 }
    );
  }
}
