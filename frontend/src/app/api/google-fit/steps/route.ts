import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { accessToken } = await req.json();

        if (!accessToken) {
            return NextResponse.json({ error: 'Access token tələb olunur' }, { status: 400 });
        }

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = now.getTime();

        const googleFitRes = await fetch(
            'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    aggregateBy: [
                        {
                            dataTypeName: 'com.google.step_count.delta',
                            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
                        },
                    ],
                    bucketByTime: { durationMillis: 86400000 },
                    startTimeMillis: startOfDay,
                    endTimeMillis: endOfDay,
                }),
            }
        );

        if (!googleFitRes.ok) {
            const errData = await googleFitRes.json();
            console.error('Google Fit API Error:', errData);
            return NextResponse.json(
                { error: 'Google Fit-dən məlumat alınarkən xəta baş verdi' },
                { status: googleFitRes.status }
            );
        }

        const data = await googleFitRes.json();
        let totalSteps = 0;

        if (data.bucket && data.bucket[0] && data.bucket[0].dataset[0].point) {
            data.bucket[0].dataset[0].point.forEach((point: any) => {
                point.value.forEach((val: any) => {
                    totalSteps += val.intVal || 0;
                });
            });
        }

        return NextResponse.json({
            success: true,
            steps: totalSteps,
            isSynced: true,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Backend Google Fit Error:', error);
        return NextResponse.json({ error: 'Daxili server xətası' }, { status: 500 });
    }
}