import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le paramètre URL
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Paramètre URL manquant' }, { status: 400 });
    }

    // Récupérer l'image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Échec de la récupération de l'image : ${response.status}` },
        { status: response.status }
      );
    }

    // Récupérer les données de l'image
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageData = await response.arrayBuffer();

    // Retourner l'image avec les en-têtes appropriés
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Erreur lors du proxy de l\'image :', error);
    return NextResponse.json(
      { error: 'Échec du proxy de l\'image' },
      { status: 500 }
    );
  }
}
