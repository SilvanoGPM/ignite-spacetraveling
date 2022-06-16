import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function dateFormatter(date: Date) {
  return format(date, 'dd MMM yyyy', {
    locale: ptBR,
  });
}

export function dateTimeFormatter(date: Date) {
  return format(date, "dd MMM yyyy, 'às' HH:mm", {
    locale: ptBR,
  });
}
