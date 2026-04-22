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