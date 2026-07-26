import { useEffect } from 'react';
import CollectionPage from './pages/CollectionPage';

export default function DueloDeHuevos() {
  useEffect(() => {
    document.title = 'Galería | Duelo de Huevos';
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,224,138,0.9),_rgba(15,23,42,0.96)_58%)] text-slate-900">
      <CollectionPage />
    </main>
  );
}
