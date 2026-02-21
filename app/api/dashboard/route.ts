import { NextResponse } from 'next/server';
import { getCustomers } from '@/lib/database-optional';
import type { Customer } from '@/lib/types';

export async function GET() {
  try {
    const customers = getCustomers() as Customer[];
    
    const activeLeads = customers.filter((c) => c.status !== 'closed').length;
    const testDrives = 0; // TODO: Implement test drive tracking
    const monthlySales = 0; // TODO: Implement sales tracking
    const salesTarget = 20;

    return NextResponse.json({
      activeLeads,
      testDrives,
      monthlySales,
      salesTarget,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
