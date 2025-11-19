import { Badge } from '@/components/ui/badge';
import { Estado, ESTADO_COLORS, ESTADO_LABELS } from '@/lib/constants';

interface EstadoBadgeProps {
  estado: Estado;
}

export function EstadoBadge({ estado }: EstadoBadgeProps) {
  return (
    <Badge className={`${ESTADO_COLORS[estado]} border font-semibold px-3 py-1`}>
      {ESTADO_LABELS[estado]}
    </Badge>
  );
}
