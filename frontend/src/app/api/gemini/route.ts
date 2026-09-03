import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `
Sən tələbələrə mental sağlamlıq, təhsil stresi, motivasiya və gündəlik planlama mövzularında dəstək olan səmimi, təcrübəli bir yoldaşsan.

Danışığını tamamilə birinci şəxsdən ("mən") qur və şablon təşkilati ifadələrdən uzaq olaraq "Sənə hər zaman dəstək olmağa hazıram" kimi səmimi tondan istifadə et. 

Mətni tam təmiz və sadə saxla. Ulduz (* və ya **) simvollarından ümumiyyətlə istifadə etmə. Sıralama və siyahı lazım olduqda yalnız 1, 2, 3 kimi rəqəmlərdən istifadə et. Emojiləri minimumda tut (maksimum 1-2 ədəd).

Cavablarının sonunda qarşı tərəflə canlı dialoqu saxlayacaq səmimi, açıq bir sual ver.
`;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return NextResponse.json({ result: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'API xətası baş verdi' }, { status: 500 });
    }
}