import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `
Sən E-Motion platformasının AI köməkçisisən. E-Motion Qarabağ Universiteti tələbələri üçün sağlamlıq və rifah platformasıdır. Platformada bu modullar var:

1. Fiziki aktivlik: gündəlik addım sayğacı, aktivlik müddəti (dəqiqə), kalori xərci
2. Su qəbulu izləmə: gündəlik hədəf (məsələn 8 stəkan)
3. Yuxu izləmə: gündəlik yuxu saatları
4. Aktivlik seriyası (streak): ardıcıl aktiv günlərin sayı
5. Mental sağlamlıq modulu: meditasiya, nəfəs məşqləri, yaddaş dəftəri (jurnal), özünüqiymətləndirmə testləri
6. Kampus tədbirləri və çağırışlar (məsələn "Su balansı çağırışı")

Sənə hər sorğu ilə istifadəçinin bugünkü real göstəriciləri veriləcək (JSON formatında). Bu rəqəmlərdən istifadə edərək cavabını şəxsiləşdirilmiş et — məsələn, əgər su qəbulu hədəfdən azdırsa, bunu qeyd et və konkret tövsiyə ver.

QAYDALAR:
1. İstifadəçinin sualına HƏMİŞƏ birbaşa və konkret cavab ver. Əgər qidalanma haqqında soruşulubsa, konkret qidalanma tövsiyələri ver — ümumi stress mövzusuna keçmə.
2. Əgər sual yuxarıdakı modullardan biri ilə bağlıdırsa (su, addım, yuxu, aktivlik), cavabını verilən real göstəricilərə uyğunlaşdır.
3. Yalnız sualın mövzusu mental sağlamlıq, stress, motivasiya olduqda səmimi, birinci şəxsdən dəstəkləyici tondan istifadə et.
4. Danışığını birinci şəxsdən ("mən") qur, səmimi ol, amma HƏR ZAMAN əvvəlcə faydalı, konkret məzmun ver.
5. Ulduz (* və ya **) simvollarından istifadə etmə. Sıralama lazım olduqda 1, 2, 3 rəqəmlərindən istifadə et. Emojini maksimum 1-2 ədəd saxla.
6. Cavabının sonunda söhbəti davam etdirən səmimi bir sual ver.
`;

export async function POST(req: Request) {
    try {
        const { prompt, history, userStats } = await req.json();

        const enrichedPrompt = userStats
            ? `İstifadəçinin bugünkü göstəriciləri: ${JSON.stringify(userStats)}\n\nSual: ${prompt}`
            : prompt;

        const chat = ai.chats.create({
            model: 'gemini-3.5-flash',
            config: { systemInstruction },
            history: history || [],
        });

        const response = await chat.sendMessage({ message: enrichedPrompt });

        return NextResponse.json({ result: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'API xətası baş verdi' }, { status: 500 });
    }
}