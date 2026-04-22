ALTER TABLE mascotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacunas_aplicadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS PARA: MASCOTAS
-- =====================================
-- Admin y Recepción ven todo
CREATE POLICY admin_ve_todo_mascotas ON mascotas FOR ALL TO rol_admin USING (true);
CREATE POLICY recepcion_ve_todo_mascotas ON mascotas FOR SELECT TO rol_recepcion USING (true);

-- Veterinarios solo ven las mascotas que atienden
CREATE POLICY vet_ve_sus_mascotas ON mascotas 
FOR SELECT TO rol_veterinario 
USING (
    id IN (
        SELECT mascota_id 
        FROM vet_atiende_mascota 
        WHERE veterinario_id = current_setting('app.current_vet_id', true)::integer
    )
);

-- =========================================
-- POLÍTICAS PARA: VACUNAS_APLICADAS
-- ====================================
-- Admin ve todo (Recepción no necesita política porque ya le quitamos el GRANT SELECT)
CREATE POLICY admin_ve_todo_vacunas ON vacunas_aplicadas FOR ALL TO rol_admin USING (true);

-- Veterinarios solo ven y aplican vacunas a SUS mascotas
CREATE POLICY vet_ve_sus_vacunas ON vacunas_aplicadas 
FOR ALL TO rol_veterinario 
USING (
    mascota_id IN (
        SELECT mascota_id 
        FROM vet_atiende_mascota 
        WHERE veterinario_id = current_setting('app.current_vet_id', true)::integer
    )
);

-- ==========================================
-- POLÍTICAS PARA: CITAS
-- ==========================================
-- Admin y Recepción ven todo y pueden gestionar todo
CREATE POLICY admin_ve_todo_citas ON citas FOR ALL TO rol_admin USING (true);
CREATE POLICY recepcion_gestiona_todo_citas ON citas FOR ALL TO rol_recepcion USING (true);

-- Veterinarios solo ven y gestionan sus propias citas
CREATE POLICY vet_ve_sus_citas ON citas 
FOR ALL TO rol_veterinario 
USING (
    veterinario_id = current_setting('app.current_vet_id', true)::integer
);