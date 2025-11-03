import type { Timesheet } from "../../Interfaces/Timesheet";

export interface ICalendarViewProps {
  data: Timesheet[];
  onSelectDate: (date: string) => void;
  onCancel: () => void;
}