import { Pool } from 'pg';   

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function executeQuery(query: string, params: any[], userRole: string, vetId?: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (['rol_admin', 'rol_recepcion', 'rol_veterinario'].includes(userRole)) {
      await client.query(`SET ROLE ${userRole}`);
    }

    if (userRole === 'rol_veterinario' && vetId) {
      await client.query(`SELECT set_config('app.current_vet_id', $1::text, true)`, [vetId]);
    }

     const result = await client.query(query, params); 

    await client.query('COMMIT');
    return result.rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}