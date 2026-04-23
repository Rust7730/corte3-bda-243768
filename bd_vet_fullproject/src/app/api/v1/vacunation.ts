import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { createClient } from 'redis';

// Instancia global de Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

export async function GET(request: Request) {
  try {
    const cacheKey = 'vacunacion_pendiente';
    
    // 1. Intentar buscar en Redis
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log('[CACHE HIT] vacunacion_pendiente');
      return NextResponse.json(JSON.parse(cachedData));
    }
    
    console.log('[CACHE MISS] vacunacion_pendiente - Consultando a PostgreSQL...');
    
    const data = await executeQuery(
      'SELECT * FROM v_mascotas_vacunacion_pendiente', 
      [], 
      'rol_admin' 
    );
    
    await redisClient.setEx(cacheKey, 300, JSON.stringify(data));
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}