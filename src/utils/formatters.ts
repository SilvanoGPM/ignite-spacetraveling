import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function dateFormatter(date: Date) {
  return format(date, 'dd MMMM yyyy', {
    locale: ptBR,
  });
}
