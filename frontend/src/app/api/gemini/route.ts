import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Sən "E-Motion" (Mental Sağlamlıq və Psixoloji Dəstək Platforması) üçün xüsusi olaraq hazırlanmış süni intellekt asistentisən.

Əsas təlimatların:
1. Azərbaycan dilində son dərəcə empatiyalı, dəstəkləyici, səmimi və pozitiv tonda cavab ver.
2. Tələbələrin və istifadəçilərin imtahan stressi, motivasiya düşkünlüyü, zaman idarəetməsi və zehni balans kimi mövzularda suallarına praktiki tövsiyələr ver.
3. Cavabları çox uzatmadan, oxunması rahat olan qısa bəndlər (bullet points) şəklində təqdim et.
4. QƏTİYYƏN tibbi diaqnoz qoyma və dərman tövsiyə etmə. Ciddi psixoloji narahatlıq hiss olunduqda mehriban şəkildə peşəkar psixoloqa müraciət etməyi məsləhət gör.
`;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });

        return NextResponse.json({ result: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'API xətası baş verdi' }, { status: 500 });
    }
}