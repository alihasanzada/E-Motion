import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (error || !code) {
        return NextResponse.redirect(`${appUrl}/?fit_error=no_code`);
    }

    try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                redirect_uri: `${appUrl}/api/auth/callback/google`,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error('Google Fit Token Exchange Error:', tokenData);
            return NextResponse.redirect(`${appUrl}/?fit_error=token_failed`);
        }

        return NextResponse.redirect(`${appUrl}/?google_fit_token=${tokenData.access_token}`);
    } catch (err) {
        console.error('Google Fit Callback Error:', err);
        return NextResponse.redirect(`${appUrl}/?fit_error=server_error`);
    }
}