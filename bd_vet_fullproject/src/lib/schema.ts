import { z } from 'zod';

export const AuthSchema = z.object({
  rol: z.enum(['rol_admin', 'rol_recepcion', 'rol_veterinario']),
  veterinario_id: z.number().int().positive().optional(), // Solo necesario si el rol es veterinario
});

export const BuscarMascotaSchema = z.object({
  q: z.string().min(1, "El término de búsqueda no puede estar vacío").max(100),
});

export const AplicarVacunaSchema = z.object({
  mascota_id: z.number().int().positive(),
  vacuna_id: z.number().int().positive(),
});