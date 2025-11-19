import { DetallePedido } from '@/components/pedido/DetallePedido';

export default function PedidoDetallePage({ params }: { params: { id: string } }) {
  const codigoPedido = parseInt(params.id);
  
  return <DetallePedido codigoPedido={codigoPedido} />;
}
