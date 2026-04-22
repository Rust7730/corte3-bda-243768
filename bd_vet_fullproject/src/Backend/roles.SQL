DROP ROLE IF EXISTS rol_admin;
DROP ROLE IF EXISTS rol_recepcion;
DROP ROLE IF EXISTS rol_veterinario;

CREATE ROLE rol_admin WITH LOGIN PASSWORD 'admin123';
CREATE ROLE rol_recepcion WITH LOGIN PASSWORD 'recepcion123';
CREATE ROLE rol_veterinario WITH LOGIN PASSWORD 'vet123';

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;

-- =============================================
-- PERMISOS: ADMINISTRADOR
-- ===========================================
-- Regla de negocio: "Ve todo. Puede crear usuarios, asignar mascotas a veterinarios, y gestionar inventario".
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rol_admin;

-- ============================================
-- PERMISOS: RECEPCIÓN
-- ==========================================
-- Regla de negocio: "Ve todas las mascotas y sus dueños Puede agendar citaS No puede ver vacunas aplicadas".
GRANT SELECT ON mascotas TO rol_recepcion;
GRANT SELECT, INSERT, UPDATE ON citas TO rol_recepcion;
GRANT SELECT ON vet_atiende_mascota TO rol_recepcion; 

REVOKE ALL PRIVILEGES ON vacunas_aplicadas FROM rol_recepcion; 

-- ==========================================
-- PERMISOS: VETERINARIO
-- ============================================
-- Regla de negocio: "Registrar nuevas citas y aplicar vacunas.
GRANT SELECT ON mascotas TO rol_veterinario;
GRANT SELECT, INSERT, UPDATE ON citas TO rol_veterinario;
GRANT SELECT, INSERT ON vacunas_aplicadas TO rol_veterinario;
GRANT SELECT ON vacunas TO rol_veterinario; 
GRANT SELECT ON vet_atiende_mascota TO rol_veterinario;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_recepcion;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_veterinario;