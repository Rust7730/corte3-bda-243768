import { NextResponse } from 'next/server';
import { AuthSchema } from '@/lib/schema';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validación estricta con Zod
    const result = AuthSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Datos inválidos', detalles: result.error.issues }, { status: 400 });
    }

    const { rol, veterinario_id } = result.data;

    // 2. Regla de negocio: Si es veterinario, DEBE enviar su ID para el RLS
    if (rol === 'rol_veterinario' && !veterinario_id) {
      return NextResponse.json({ error: 'Falta el ID del veterinario' }, { status: 400 });
    }

    // 3. Guardar en cookies (Simulación de sesión)
    const cookieStore = await cookies();
    cookieStore.set('userRole', rol, { httpOnly: true, path: '/' });
    
    if (veterinario_id) {
      cookieStore.set('vetId', veterinario_id.toString(), { httpOnly: true, path: '/' });
    } else {
      cookieStore.delete('vetId');
    }

    return NextResponse.json({ success: true, rol, veterinario_id });

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}