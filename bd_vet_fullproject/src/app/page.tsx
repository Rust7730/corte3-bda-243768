"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [rol, setRol] = useState('rol_recepcion');
  const [veterinarioId, setVeterinarioId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rol,
        veterinario_id: rol === 'rol_veterinario' ? parseInt(veterinarioId) : undefined,
      }),
    });

    if (res.ok) {
      router.push('/front/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al autenticar');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-light)',
      backgroundImage: 'url("https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // Imagen placeholder de perros
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--primary-blue)' }}>Acceso al Sistema</h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--text-light)', fontSize: '14px' }}>Selecciona un perfil para realizar las pruebas de seguridad.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Rol del Personal:</label>
            <select 
              value={rol} 
              onChange={(e) => setRol(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
            >
              <option value="rol_recepcion">Recepción (Ve todo, no vacunas)</option>
              <option value="rol_veterinario">Veterinario (RLS activado)</option>
              <option value="rol_admin">Administrador (Acceso total)</option>
            </select>
          </div>

          {rol === 'rol_veterinario' && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>ID del Veterinario:</label>
              <input 
                type="number" 
                min="1"
                required
                value={veterinarioId}
                onChange={(e) => setVeterinarioId(e.target.value)}
                placeholder="Ej. 1 o 2 para probar RLS"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)' }}
              />
            </div>
          )}

          {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}