'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdministrarMenu } from '@/components/admin/AdministrarMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminMenuPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Navbar */}
        <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🍽️</div>
                <div>
                  <h1 className="font-serif text-3xl font-bold text-primary">
                    Gestión del Menú
                  </h1>
                  <p className="text-xs text-muted-foreground">Administra los items del restaurante</p>
                </div>
              </div>
              
              <Link href="/admin">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Panel
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <AdministrarMenu />
        </div>
      </div>
    </ProtectedRoute>
  );
}
