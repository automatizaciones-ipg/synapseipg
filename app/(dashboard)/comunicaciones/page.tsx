// ARCHIVO: app/comunicaciones/page.tsx
import NeonKanban from '@/components/comunications/NeonKanban';

export const metadata = {
  title: 'Comunicaciones | Synapse IPG',
  description: 'Centro de comando para proyectos y comunicaciones',
};

export default function ComunicacionesPage() {
  return (
    // Renderizamos el componente que acabamos de crear a pantalla completa
    <main className="w-full min-h-screen bg-[#060B19]">
      <NeonKanban />
    </main>
  );
}