import type { Timesheet } from "../../types/Timesheet";

export interface ICalendarViewProps {
  data: Timesheet[];
  onSelectDate: (date: string) => void;
  onCancel: () => void;
}