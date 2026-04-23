CREATE OR REPLACE PROCEDURE sp_agendar_cita(
    p_mascota_id INT,
    p_veterinario_id INT,
    p_fecha_hora TIMESTAMP,
    p_motivo TEXT,
    OUT p_cita_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_mascota_id IS NULL OR p_veterinario_id IS NULL OR p_fecha_hora IS NULL THEN
        RAISE EXCEPTION 'Los campos mascota, veterinario y fecha_hora no pueden ser NULL.';
    END IF;


    INSERT INTO citas (mascota_id, veterinario_id, fecha_hora, motivo)
    VALUES (p_mascota_id, p_veterinario_id, p_fecha_hora, COALESCE(p_motivo, 'Revisión general'))
    RETURNING id INTO p_cita_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error interno al agendar la cita: %', SQLERRM;
END;
$$;


CREATE OR REPLACE FUNCTION fn_total_facturado(
    p_mascota_id INT,
    p_anio INT
)
RETURNS NUMERIC AS $$
DECLARE
    v_total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(monto), 0) INTO v_total
    FROM facturas
    WHERE mascota_id = p_mascota_id
      AND EXTRACT(YEAR FROM fecha) = p_anio;

    RETURN v_total;
END;
$$ LANGUAGE plpgsql;