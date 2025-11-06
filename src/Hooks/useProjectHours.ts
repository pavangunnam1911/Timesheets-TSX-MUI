import type { Timesheet } from "../Interfaces/Timesheet";

function parseHoursToMinutes(h: string | undefined) {
  if (!h) return 0;
  const parts = h.split(":");
  if (parts.length !== 2) return 0;
  const hh = Number(parts[0]) || 0;
  const mm = Number(parts[1]) || 0;
  return hh * 60 + mm;
}

export type ProjectHours = {
  project: string;
  minutes: number;
  hoursString: string;
};

export default function useProjectHours(items: Timesheet[] = []): ProjectHours[] {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = item.project || "(No project)";
    const mins = parseHoursToMinutes(item.hours as string | undefined);
    map.set(key, (map.get(key) || 0) + mins);
  }

  const arr: ProjectHours[] = Array.from(map.entries()).map(([project, minutes]) => {
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    return { project, minutes, hoursString: `${hh}:${mm.toString().padStart(2, "0")}` };
  });

  arr.sort((a, b) => a.project.localeCompare(b.project, undefined, { sensitivity: "base" }));
  return arr;
};
