import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, honeypot } = body;

    if (honeypot) {
      return NextResponse.json(
        { success: false, error: 'Spam detected' },
        { status: 400 }
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    console.log(`[CONTACT FORM] Message received from ${name} (${email}): ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received successfully.',
    });
  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error processing request.' },
      { status: 500 }
    );
  }
}
