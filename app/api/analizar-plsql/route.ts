import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'El prompt es requerido' }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('La clave de API de OpenAI no está configurada');
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error en la respuesta de la API de OpenAI: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Error en la respuesta de la API de OpenAI: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ respuesta: data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}