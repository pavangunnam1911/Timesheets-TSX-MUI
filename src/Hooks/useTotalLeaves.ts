import type { Timesheet } from "../Interfaces/Timesheet";

export default function useTotalLeaves(items: Timesheet[] = []) {
  const total = items.reduce((acc, x) => {
    const v = Number(x.leaves ?? 0);
    if (Number.isNaN(v)) return acc;
    return acc + v;
  }, 0);

  return total;
}
