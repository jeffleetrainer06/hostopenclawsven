import { NextResponse } from 'next/server';
import { getConversations, addMessage, getCustomer } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const conversations = getConversations(customerId);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = parseInt(params.id);
    const { message, sender } = await request.json();

    if (!message || !sender) {
      return NextResponse.json(
        { error: 'Message and sender are required' },
        { status: 400 }
      );
    }

    const result = addMessage(customerId, message, sender);

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Failed to add message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
