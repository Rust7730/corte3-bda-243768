import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('[Redis] error', err));
  }

  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error('[Redis] connect failed', error);
      return null;
    }
  }

  return redisClient;
}

export async function GET(request: Request) {
  try {
    const cacheKey = 'vacunacion_pendiente';
    const redis = await getRedisClient();

    if (redis) {
      try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
          console.log('[CACHE HIT] vacunacion_pendiente');
          return NextResponse.json(JSON.parse(cachedData));
        }
      } catch (err) {
        console.error('[Redis] read failed', err);
      }
    }

    console.log('[CACHE MISS] vacunacion_pendiente - Consultando a PostgreSQL...');

    const data = await executeQuery(
      'SELECT * FROM v_mascotas_vacunacion_pendiente',
      [],
      'rol_admin'
    );

    if (redis) {
      try {
        await redis.setEx(cacheKey, 300, JSON.stringify(data));
      } catch (err) {
        console.error('[Redis] write failed', err);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[vacunacion_pendiente] error', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}