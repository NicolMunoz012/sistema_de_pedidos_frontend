'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-900 to-amber-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🍕</div>
              <h2 className="font-serif text-3xl font-bold">
                Sabor Express
              </h2>
            </div>
            <p className="text-orange-100 mb-4">
              Tu restaurante favorito ahora más cerca. Ordena en línea y disfruta de la mejor comida con entrega rápida.
            </p>
            <p className="text-orange-200 text-sm">
              © 2024 Sabor Express. Todos los derechos reservados.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-orange-100 hover:text-white transition-colors">
                  Menú
                </Link>
              </li>
              <li>
                <Link href="/historial" className="text-orange-100 hover:text-white transition-colors">
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="text-orange-100 hover:text-white transition-colors">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-orange-100">
              <li>📞 +1 (555) 123-4567</li>
              <li>📧 info@saborexpress.com</li>
              <li>📍 Calle Principal #123</li>
              <li>🕐 Lun-Dom: 10:00 - 22:00</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
