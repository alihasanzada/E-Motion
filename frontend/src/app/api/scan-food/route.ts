import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            return NextResponse.json({ error: 'Şəkil daxil edilməyib' }, { status: 400 });
        }

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        const prompt = `
      Bu şəkildəki yeməyi analiz et və yalnız aşağıdakı JSON formatında cavab ver. Heç bir əlavə mətn yazma, yalnız təmiz JSON qaytar:
      {
        "foodName": "Yeməyin adı (Azərbaycan dilində)",
        "calories": 450,
        "protein": "25g",
        "carbs": "50g",
        "fat": "15g",
        "advice": "Tələbələr üçün qısa sağlamlıq tövsiyəsi (1 cümlə)"
      }
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data,
                    },
                },
                prompt,
            ],
        });

        const textResponse = response.text || '';
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Analiz nəticəsi JSON formatında alınmadı');
        }

        const nutritionData = JSON.parse(jsonMatch[0]);
        return NextResponse.json(nutritionData);

    } catch (error) {
        console.error('Food Scan Error:', error);
        return NextResponse.json({ error: 'Yemək analiz edilərkən xəta baş verdi' }, { status: 500 });
    }
}