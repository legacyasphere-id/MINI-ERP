import { formatDistanceToNow, isToday, format, parseISO } from 'date-fns';

export function relTime(iso: string): string {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return '—';
  }
}

export function isDueToday(iso: string): boolean {
  try {
    return isToday(parseISO(iso));
  } catch {
    return false;
  }
}

export function fmtTime(iso: string): string {
  try {
    return format(parseISO(iso), 'HH:mm');
  } catch {
    return '—';
  }
}

export function fmtShortDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d');
  } catch {
    return '—';
  }
}
