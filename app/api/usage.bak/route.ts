import { NextResponse } from 'next/server';
import { getUsageStats, getUsageByTaskType } from '@/lib/database-optional';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get('days')) || 30;

    const byModel = getUsageStats(days);
    const byTask = getUsageByTaskType(days);

    return NextResponse.json({
      byModel,
      byTask,
    });
  } catch (error) {
    console.error('Failed to fetch usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    );
  }
}
