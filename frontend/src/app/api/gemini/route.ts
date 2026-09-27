import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const systemInstruction = `
Sən E-Motion platformasının AI köməkçisisən (AI Health Coach). E-Motion Qarabağ Universiteti tələbələri üçün sağlamlıq və rifah platformasıdır. 

Platformanın modulları:
1. Fiziki aktivlik (addım, aktivlik müddəti, kalori)
2. Su qəbulu izləmə
3. Yuxu izləmə
4. Aktivlik seriyası (streak)
5. Mental sağlamlıq modulu (meditasiya, nəfəs məşqləri, jurnal, testlər)
6. Kampus tədbirləri və çağırışlar

Sənə hər sorğu ilə istifadəçinin bugünkü real göstəriciləri verilə bilər (JSON formatında). Bu rəqəmlərdən istifadə edərək cavabını şəxsiləşdirilmiş et.

QƏTİ QAYDALAR:
1. YALNIZ fiziki aktivlik, qidalanma, mental sağlamlıq, yuxu, su balansı, tələbə stresi və sağlam vərdişlər mövzusunda cavab ver.
2. Riyaziyyat misalları, proqramlaşdırma/kod yazma, tarix, siyasət və ya sağlamlıqla əlaqəsi olmayan istənilən mövzuda sual verildikdə NƏZAKƏTLƏ cavab verməkdən İMTİNA ET. (Məsələn: "Üzr istəyirəm, mən E-Motion platformasının sağlamlıq köməkçisiyəm. Yalnız sağlamlıq və rifah mövzularında sizə dəstək ola bilərəm. 😊")
3. İstifadəçinin sualına HƏMİŞƏ birbaşa və konkret cavab ver.
4. Yalnız sualın mövzusu mental sağlamlıq, stress, motivasiya olduqda səmimi, birinci şəxsdən ("mən") dəstəkləyici tondan istifadə et.
5. Ulduz (* və ya **) simvollarından istifadə etmə. Sıralama lazım olduqda 1, 2, 3 rəqəmlərindən istifadə et. Emojini maksimum 1-2 ədəd saxla.
6. Cavabının sonunda söhbəti davam etdirən səmimi bir sual ver.
`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
    try {
        const { prompt, history, userStats } = await req.json();

        const enrichedPrompt = userStats
            ? `İstifadəçinin bugünkü göstəriciləri: ${JSON.stringify(userStats)}\n\nSual: ${prompt}`
            : prompt;

        const maxRetries = 3;
        let lastError = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const chat = ai.chats.create({
                    model: 'gemini-3.8-flash',
                    config: { systemInstruction },
                    history: history || [],
                });

                const response = await chat.sendMessage({ message: enrichedPrompt });
                return NextResponse.json({ result: response.text });
            } catch (err: any) {
                console.warn(`Cəhd ${attempt} uğursuz oldu:`, err?.message || err);
                lastError = err;

                if (attempt < maxRetries) {
                    await sleep(1500);
                }
            }
        }

        throw lastError;
    } catch (error) {
        console.error('Gemini API Final Error:', error);
        return NextResponse.json(
            { error: 'Serverdə anlıq intensivlik var. Zəhmət olmasa bir neçə saniyə sonra yenidən cəhd edin.' },
            { status: 503 }
        );
    }
}