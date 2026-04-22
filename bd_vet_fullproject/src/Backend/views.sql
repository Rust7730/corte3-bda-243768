CREATE OR REPLACE VIEW v_mascotas_vacunacion_pendiente AS
SELECT 
    m.id AS mascota_id,
    m.nombre AS nombre_mascota,
    v.id AS vacuna_id,
    v.nombre AS nombre_vacuna
FROM mascotas m
CROSS JOIN vacunas v 
LEFT JOIN vacunas_aplicadas va 
    ON m.id = va.mascota_id 
    AND v.id = va.vacuna_id
WHERE va.id IS NULL; 