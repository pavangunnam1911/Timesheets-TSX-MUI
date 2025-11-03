import React, { useState, useEffect } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,MenuItem,Switch,Typography,Box} from "@mui/material";
import dayjs from "dayjs";
import type { Timesheet } from "../../Interfaces/Timesheet";
import type { IAddDataFormProps } from "./interface"; 

const defaultForm: Timesheet = {
  id: "",
  name: "",
  date: dayjs().format("YYYY-MM-DD"),
  loginTime: "10:00",
  logoutTime: "20:00",
  project: "",
  task: "",
  description: "",
  priority: "Medium",
  status: "Pending", 
};

const AddDataForm: React.FC<IAddDataFormProps> = (props) => {

  const [form, setForm] = useState<Timesheet>(defaultForm);
  const [isLeave, setIsLeave] = useState(false);

  useEffect(() => {
    setForm(props.editData ? props.editData : { ...defaultForm, date: dayjs().format("YYYY-MM-DD") });
  }, [props.editData, props.open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
  if (isLeave) {
    props.onSaveLeave && props.onSaveLeave({ ...form, id: form.id || Date.now().toString(), createdAt: Date.now(),isLeave });
    props.onClose();
    return;
  }
  if (!form.name || !form.project) {
    alert("Please fill in all required fields.");
    return;
  }
  props.onSave({ ...form, id: form.id || Date.now().toString(), createdAt: Date.now(),isLeave });
  props.onClose();
};

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>{props.editData ? "Edit Timesheet Entry" : "Add New Timesheet Entry"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <Typography sx={{ color: "green", fontWeight: 600, mr: 1 }}>
            In Office
          </Typography>
          <Switch checked={isLeave} onChange={() => setIsLeave(!isLeave)} color="error" />
          <Typography sx={{ color:"red", fontWeight: 600, ml: 1 }}>
            Leave
          </Typography>
        </Box>
        <TextField sx={{mt:1}} required label="Employee Name" name="name" value={form.name} onChange={handleChange} />
        <TextField required type="date" label="Date" name="date" value={form.date} onChange={handleChange} placeholder="Date" />
        <TextField required type="time" label="Login Time" name="loginTime" value={form.loginTime} onChange={handleChange} placeholder="Login" disabled={isLeave}/>
        <TextField required type="time" label="Logout Time" name="logoutTime" value={form.logoutTime} onChange={handleChange} placeholder="Logout" disabled={isLeave}/>
        <TextField required label="Project" name="project" value={form.project} onChange={handleChange} disabled={isLeave}/>
        <TextField required label="Task" name="task" value={form.task} onChange={handleChange} disabled={isLeave}/>
        <TextField label="Description" name="description" multiline rows={3} value={form.description} onChange={handleChange} />
        <TextField select label="Priority" name="priority" value={form.priority} onChange={handleChange}disabled={isLeave}>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>
        <TextField select label="Status" name="status" value={form.status} onChange={handleChange} disabled={isLeave}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {props.editData ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDataForm;
