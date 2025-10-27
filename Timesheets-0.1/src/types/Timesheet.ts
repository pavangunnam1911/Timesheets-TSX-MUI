export interface Timesheet {
  id: string;
  name: string;
  date: string;
  loginTime: string;
  logoutTime: string;
  task: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed"; 
  createdAt?: number;
}

export interface TableProps {
  data: Timesheet[];
  onEdit: (item: Timesheet) => void;
  onDelete: (id: string) => void;
}

export interface FabMenuProps {
  onAdd: () => void;
  onViewCalendar: () => void;
}

export interface AddDataFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Timesheet) => void;
  editData: Timesheet | null;
}

export interface CalendarViewProps {
  data: Timesheet[];
  onSelectDate: (date: string) => void;
  onCancel: () => void;
}