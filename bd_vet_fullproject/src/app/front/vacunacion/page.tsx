"use client";
import { useState, useEffect } from 'react';
import Header from '@/app/front/components/header';

export default function VacunacionPage() {
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aplicando, setAplicando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

  // Función para cargar la vista cacheada
  const cargarPendientes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vacunacion-pendiente');
      if (res.ok) {
        const data = await res.json();
        setPendientes(data);
      }
    } catch (error) {
      console.error("Error al cargar pendientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  // Simular la aplicación de la vacuna e invalidar el caché
  const aplicarVacuna = async (mascotaId: number, vacunaId: number) => {
    setAplicando(mascotaId);
    setMensaje('');
    try {
      // Llamada al endpoint POST para aplicar la vacuna
      const res = await fetch('/api/aplicar-vacuna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mascota_id: mascotaId, vacuna_id: vacunaId })
      });

      if (res.ok) {
        setMensaje('Vacuna aplicada en BD. Caché de Redis invalidado.');
        // Recargar la lista (esto forzará un MISS en el caché y actualizará los datos)
        await cargarPendientes();
      } else {
        setMensaje('Error al aplicar vacuna. Verifica tus permisos RLS.');
      }
    } catch (error) {
      setMensaje('Error de red al aplicar vacuna');
    } finally {
      setAplicando(null);
      // Limpiar el mensaje de éxito después de 4 segundos
      setTimeout(() => setMensaje(''), 4000);
    }
  };

  return (
    <>
      <Header />
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', color: 'var(--text-dark)', marginBottom: '10px' }}>
            Vacunación <span style={{ color: 'var(--primary-blue)' }}>Pendiente</span>
          </h2>
          <p style={{ color: 'var(--text-light)' }}>
            Superficie de prueba para caché Redis. 
            <br/><strong>Tip para la defensa:</strong> Abre la pestaña Network (F12) y observa el tiempo de respuesta al recargar.
          </p>
        </section>

        {mensaje && (
          <div style={{ 
            backgroundColor: mensaje.includes('Error') ? 'var(--secondary-magenta)' : 'var(--primary-blue)', 
            color: 'white', 
            padding: '12px', 
            textAlign: 'center', 
            borderRadius: '5px', 
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            {mensaje}
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {loading && pendientes.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              Consultando base de datos (o caché)...
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark)' }}>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid var(--border-color)' }}>ID Mascota</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid var(--border-color)' }}>Paciente</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid var(--border-color)' }}>Vacuna Pendiente</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid var(--border-color)', textAlign: 'right' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
                      No hay vacunaciones pendientes registradas.
                    </td>
                  </tr>
                ) : (
                  pendientes.map((item, index) => (
                    <tr key={`${item.mascota_id}-${item.vacuna_id}-${index}`} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '15px 20px', color: 'var(--text-light)' }}>#{item.mascota_id}</td>
                      <td style={{ padding: '15px 20px', fontWeight: '600' }}>{item.nombre_mascota}</td>
                      <td style={{ padding: '15px 20px', color: 'var(--secondary-magenta)' }}>{item.nombre_vacuna}</td>
                      <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                        <button 
                          className="btn-primary" 
                          onClick={() => aplicarVacuna(item.mascota_id, item.vacuna_id)}
                          disabled={aplicando === item.mascota_id}
                          style={{ 
                            padding: '8px 15px', 
                            fontSize: '12px', 
                            opacity: aplicando === item.mascota_id ? 0.5 : 1,
                            cursor: aplicando === item.mascota_id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {aplicando === item.mascota_id ? 'Registrando...' : 'Aplicar Vacuna'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}