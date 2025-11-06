import type { Timesheet } from "../Interfaces/Timesheet";

function parseHoursToMinutes(h: string | undefined) {
  if (!h) return 0;
  const parts = h.split(":");
  if (parts.length !== 2) return 0;
  const hh = Number(parts[0]) || 0;
  const mm = Number(parts[1]) || 0;
  return hh * 60 + mm;
}

export default function useTotalHours(items: Timesheet[] = []) {
  const totalMinutes = items.reduce((acc, it) => {
    return acc + parseHoursToMinutes(it.hours as string | undefined);
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
