import React, { useState, useEffect } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,MenuItem} from "@mui/material";
import dayjs from "dayjs";
import type { Timesheet } from "../../types/Timesheet";
import type { IAddDataFormProps } from "./IAddDataFormProps"; 

const defaultForm: Timesheet = {
  id: "",
  name: "",
  date: dayjs().format("YYYY-MM-DD"),
  loginTime: "10:00",
  logoutTime: "20:00",
  task: "",
  description: "",
  priority: "Medium",
  status: "Pending", 
};

const AddDataForm: React.FC<IAddDataFormProps> = ({open,onClose,onSave,editData}) => {

  const [form, setForm] = useState<Timesheet>(defaultForm);

  useEffect(() => {
    setForm(editData ? editData : { ...defaultForm, date: dayjs().format("YYYY-MM-DD") });
  }, [editData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.task) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave({ ...form, id: form.id || Date.now().toString(), createdAt: Date.now() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Edit Timesheet Entry" : "Add New Timesheet Entry"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField required label="Employee Name" name="name" value={form.name} onChange={handleChange} />
        <TextField required type="date" label="Date" name="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField required type="time" label="Login Time" name="loginTime" value={form.loginTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField required type="time" label="Logout Time" name="logoutTime" value={form.logoutTime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField required label="Task" name="task" value={form.task} onChange={handleChange} />
        <TextField label="Description" name="description" multiline rows={3} value={form.description} onChange={handleChange} />
        <TextField select label="Priority" name="priority" value={form.priority} onChange={handleChange}>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
        <TextField select label="Status" name="status" value={form.status} onChange={handleChange}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDataForm;
