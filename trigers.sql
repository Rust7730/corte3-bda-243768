CREATE OR REPLACE FUNCTION fn_trg_historial_cita()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO historial_movimientos (cita_id, detalle, fecha_registro)
    VALUES (
        NEW.id, 
        'Nueva cita agendada. Motivo: ' || COALESCE(NEW.motivo, 'Sin especificar'), 
        CURRENT_TIMESTAMP
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_historial_cita
AFTER INSERT ON citas
FOR EACH ROW
EXECUTE FUNCTION fn_trg_historial_cita();