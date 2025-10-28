import type { Timesheet } from "../../types/Timesheet";

export interface ITableProps {
  data: Timesheet[];
  onEdit: (item: Timesheet) => void;
  onDelete: (id: string) => void;
}