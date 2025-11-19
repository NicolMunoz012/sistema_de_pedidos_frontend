import { DetalleFactura } from '@/components/factura/DetalleFactura';

export default function FacturaPage({ params }: { params: { id: string } }) {
  const codigoFactura = parseInt(params.id);
  
  return <DetalleFactura codigoFactura={codigoFactura} />;
}
