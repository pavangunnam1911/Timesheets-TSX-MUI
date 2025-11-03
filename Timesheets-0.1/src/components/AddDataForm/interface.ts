import type { Timesheet } from "../../Interfaces/Timesheet";

export interface IAddDataFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Timesheet) => void;
  onSaveLeave?: (data: Timesheet) => void;
  editData: Timesheet | null;
}