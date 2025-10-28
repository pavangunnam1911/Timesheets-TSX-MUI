import type { Timesheet } from "../../types/Timesheet";

export interface IAddDataFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Timesheet) => void;
  editData: Timesheet | null;
}