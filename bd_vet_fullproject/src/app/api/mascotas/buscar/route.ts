import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value || 'rol_recepcion';
    const vetId = cookieStore.get('vetId')?.value ? parseInt(cookieStore.get('vetId')?.value as string) : undefined;

 
    const query = `
      SELECT id, nombre, especie, raza, fecha_nacimiento, id_dueno 
      FROM mascotas 
      WHERE nombre ILIKE $1
    `;
    const params = [`%${q}%`];

    const resultados = await executeQuery(query, params, userRole, vetId);

    return NextResponse.json(resultados);
  } catch (error: any) {
    console.error("Error en búsqueda:", error);
    return NextResponse.json({ error: 'Error al buscar mascotas' }, { status: 500 });
  }
}