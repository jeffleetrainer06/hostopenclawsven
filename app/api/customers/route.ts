import { NextResponse } from 'next/server';
import { getCustomers, addCustomer } from '@/lib/database';

export async function GET() {
  try {
    const customers = getCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, vehicle_interest, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = addCustomer({
      name,
      email,
      phone,
      vehicle_interest,
      notes,
    });

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Failed to add customer:', error);
    return NextResponse.json(
      { error: 'Failed to add customer' },
      { status: 500 }
    );
  }
}
