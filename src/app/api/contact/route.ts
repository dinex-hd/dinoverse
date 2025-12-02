import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { Contact } from '@/models/Contact';
import { Resend } from 'resend';

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  service: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = ContactSchema.parse(body);

    await connectToDatabase();

    const created = await Contact.create(data);

    // Email notification via Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'dinaolsisay18@gmail.com';
    const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Dinoverse <onboarding@resend.dev>';

    let emailQueued: boolean | undefined;
    let emailId: string | undefined;
    let emailError: string | undefined;

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        
        // Format message content
        const emailContent = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Service:</strong> ${data.service || 'Not specified'}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr>
          <h3>Message:</h3>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toISOString()}</small></p>
        `;
        
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: [TO_EMAIL],
          subject: `[New Contact] ${data.subject}`,
          reply_to: data.email,
          html: emailContent,
          text: `New contact submission\n\nName: ${data.name}\nEmail: ${data.email}\nService: ${data.service || '-'}\n\nMessage:\n${data.message}\n\nSubmitted at: ${new Date().toISOString()}`,
        });
        emailQueued = !!result?.id;
        emailId = result?.id;
      } catch (e: any) {
        emailQueued = false;
        // Capture more detailed error info
        const errorMsg = e?.message || e?.error?.message || JSON.stringify(e?.response?.data || e) || 'Unknown Resend error';
        emailError = errorMsg;
        console.error('Resend email send failed:', {
          message: e?.message,
          error: e?.error,
          response: e?.response?.data,
          fullError: e,
        });
      }
    }

    return NextResponse.json({
      success: true,
      id: created._id,
      createdAt: created.createdAt,
      emailQueued,
      emailId,
      emailError,
    }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: err.flatten() }, { status: 400 });
    }

    console.error('Contact POST error', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    // Lightweight health check
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}


