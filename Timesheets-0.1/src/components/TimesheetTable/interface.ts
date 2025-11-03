import type { Timesheet } from "../../Interfaces/Timesheet";

export interface ITableProps {
  data: Timesheet[];
  onEdit: (item: Timesheet) => void;
  onDelete: (id: string) => void;
}