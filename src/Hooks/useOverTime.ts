import { useMemo } from "react";
import type { Timesheet } from "../Interfaces/Timesheet";

const OfficeHours = 8;

const useOvertime = (items: Timesheet[]) => {
  return useMemo(() => {
    let totalOvertime = 0;

    items.forEach((entry) => {
      const hours = parseFloat(entry.hours || "0");
      if (hours > OfficeHours) {
        totalOvertime += hours - OfficeHours;
      }
    });

    return totalOvertime.toFixed(2);
  }, [items]);
};

export default useOvertime;
