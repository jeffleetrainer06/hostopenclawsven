import { NextResponse } from 'next/server';
import { getModelPreferences, setModelPreference } from '@/lib/database-optional';

export async function GET() {
  try {
    const preferences = getModelPreferences();
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Failed to fetch model preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { taskType, model, description } = await request.json();
    
    if (!taskType || !model) {
      return NextResponse.json(
        { error: 'taskType and model are required' },
        { status: 400 }
      );
    }

    setModelPreference(taskType, model, description);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update model preference:', error);
    return NextResponse.json(
      { error: 'Failed to update model preference' },
      { status: 500 }
    );
  }
}
