import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (error || !code) {
        return NextResponse.redirect(`${appUrl}/auth?error=${error || 'no_code'}`);
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
            console.error('Google Token Exchange Error:', tokenData);
            return NextResponse.redirect(`${appUrl}/auth?error=token_failed`);
        }

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();
        const userEmail = userData.email || '';

        if (!userEmail.toLowerCase().endsWith('@qu.edu.az')) {
            console.warn(`Giriş bloklandı: ${userEmail} Qarabağ Universiteti e-poçtu deyil.`);
            return NextResponse.redirect(`${appUrl}/auth?error=not_qu_student`);
        }

        const redirectUrl = `${appUrl}/auth?access_token=${tokenData.access_token}&userToken=google_logged_in`;

        const response = NextResponse.redirect(redirectUrl);

        response.cookies.set('user_email', userData.email || '', { path: '/', httpOnly: false });
        response.cookies.set('user_name', userData.name || '', { path: '/', httpOnly: false });
        response.cookies.set('user_avatar', userData.picture || '', { path: '/', httpOnly: false });

        return response;
    } catch (err) {
        console.error('OAuth Callback Error:', err);
        return NextResponse.redirect(`${appUrl}/auth?error=server_error`);
    }
}