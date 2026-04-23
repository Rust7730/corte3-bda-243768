import { NextResponse } from 'next/server';
import { AuthSchema } from '@/lib/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = AuthSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Datos inválidos', detalles: result.error.issues }, { status: 400 });
    }

    const { rol, veterinario_id } = result.data;

    if (rol === 'rol_veterinario' && !veterinario_id) {
      return NextResponse.json({ error: 'Falta el ID del veterinario' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, rol, veterinario_id });
    response.cookies.set('userRole', rol, { httpOnly: true, path: '/' });
    
    if (veterinario_id) {
      response.cookies.set('vetId', veterinario_id.toString(), { httpOnly: true, path: '/' });
    } else {
      response.cookies.delete('vetId'); // Limpiar ID si cambió a admin o recepción
    }

    return response;

  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}