"use client";
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      {/* Top Bar - Color Azul */}
      <div style={{ backgroundColor: 'var(--primary-blue)', color: 'white', padding: '10px 40px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
        <span>📍 Clínica Veterinaria Tuxtla</span>
        <span>Simulador de Roles BDA</span>
      </div>

      {/* Main Nav - Blanco */}
      <nav style={{ backgroundColor: 'var(--white)', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-dark)' }}>
            UNITED<span style={{ color: 'var(--primary-blue)' }}>PETS</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '600' }}>Búsqueda</Link>
          <Link href="/vacunacion" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: '600' }}>Vacunación</Link>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--secondary-magenta)', fontWeight: '600' }}>Cambiar Rol</Link>
        </div>
      </nav>
    </header>
  );
}