"use client";
import { useState, useEffect } from 'react';
import Header from '@/app/front/components/header'; 

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    buscarMascotas('');
  }, []);

  const buscarMascotas = async (termino: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/mascotas/buscar?q=${encodeURIComponent(termino)}`);
      if (res.ok) {
        const data = await res.json();
        setMascotas(data);
      } else {
        setError('Error al conectar con el servidor.');
      }
    } catch (err) {
      setError('Fallo de red.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    buscarMascotas(query);
  };

  return (
    <>
      <Header />
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Sección Hero Interna */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', color: 'var(--text-dark)', marginBottom: '10px' }}>
            Directorio de <span style={{ color: 'var(--primary-blue)' }}>Pacientes</span>
          </h2>
          <p style={{ color: 'var(--text-light)' }}>
            Busca pacientes por nombre. (Intenta un ataque SQLi como: <code style={{backgroundColor: '#eee', padding: '2px 5px'}}> ' OR '1'='1 </code>)
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Ej. Firulais..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '400px',
                padding: '12px 20px',
                fontSize: '16px',
                borderRadius: '30px',
                border: '1px solid var(--border-color)',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-secondary" style={{ borderRadius: '30px', padding: '12px 30px' }}>
              Buscar
            </button>
          </form>
        </section>

        {/* Mensajes de Estado */}
        {loading && <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Consultando base de datos...</p>}
        {error && <p style={{ textAlign: 'center', color: 'var(--secondary-magenta)' }}>{error}</p>}
        {!loading && mascotas.length === 0 && !error && (
          <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No se encontraron pacientes que coincidan con tu búsqueda.</p>
        )}

        {/* Grid de Resultados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {mascotas.map((mascota) => (
            <div key={mascota.id} style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '10px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              borderLeft: '4px solid var(--primary-blue)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-dark)' }}>{mascota.nombre}</h3>
              <p style={{ margin: '5px 0', fontSize: '14px', color: 'var(--text-light)' }}><strong>Especie:</strong> {mascota.especie} ({mascota.raza})</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: 'var(--text-light)' }}><strong>Dueño ID:</strong> {mascota.id_dueno}</p>
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button className="btn-primary" style={{ padding: '5px 15px', fontSize: '12px' }}>Ver Detalles</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}