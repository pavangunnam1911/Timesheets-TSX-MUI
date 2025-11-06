import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography, Button, Select, MenuItem, FormControl, InputLabel, Checkbox } from "@mui/material";
import React, { useEffect, useState } from "react";
import useLocalStorage from "../../Hooks/useLocalstorage";
import type { Timesheet } from "../../Interfaces/Timesheet";
import type { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { computeHours } from "../../CalculateHours/computeHours";

interface SimpleDialogProps {
    open: boolean;
    initialData?: Timesheet | null;
    onClose: () => void;
    onSave?: (item: Timesheet) => void;
    
}

const dialogContentStyle= {
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '5px',
          },

        };

const CollectDataForm: React.FC<SimpleDialogProps> = (prop) => {
    const [items, setItems] = useLocalStorage<Timesheet[]>("timesheets", []);
    
    const today = dayjs().format("YYYY-MM-DD");
    const defaultLogin = dayjs().hour(10).minute(0).format("HH:mm");  
    const defaultLogout = dayjs().hour(20).minute(0).format("HH:mm"); 

    const defaultForm = {
        id: undefined,
        name: "",
        date: today,
        loginTime: defaultLogin,
        logoutTime: defaultLogout,
        project: "",
        task: "",
        taskhours: "",
        description: "",
        priority: "",
        status: "",
        leaves: "0",
    };


    const [form, setForm] = useState<Partial<Timesheet>>(defaultForm);
    const [onLeave, setOnLeave] = useState<boolean>(false);
    const [leaveType, setLeaveType] = useState<'none' | 'full' | 'half'>('none');

    useEffect(() => {
        if (prop.initialData) {
            const init = { ...(prop.initialData as Timesheet) } as Partial<Timesheet>;
            if (init.leaves === "1") {
                setOnLeave(true);
                init.status = "Leave";
                init.leaves = "1";
                setLeaveType('full');
            } else if (init.status === 'Half Day Leave' || init.leaves === '0.5') {
                setOnLeave(true);
                init.status = 'Half Day Leave';
                init.leaves = '0.5';
                setLeaveType('half');
            } else {
                setLeaveType('none');
            }
            setForm(init);
        } else {
            setForm(defaultForm);
            setLeaveType('none');
        }
    }, [prop.initialData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const name = (event.target as any).name as string;
        const value = event.target.value as string;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleLeaveToggle = (checked: boolean) => {
        setOnLeave(checked);
        if (checked) {
            setLeaveType('full');
            setForm(prev => ({ ...(prev || {}), leaves: "1", status: "Leave", loginTime: "", logoutTime: "", project: "", task: "" }));
        } else {
            setLeaveType('none');
            setForm(prev => ({ ...(prev || {}), leaves: "0", status: "" }));
        }
    };

    const handleLeaveTypeChange = (type: 'full' | 'half') => {
        setLeaveType(type);
        if (type === 'full') {
            setForm(prev => ({ ...(prev || {}), leaves: '1', status: 'Leave', loginTime: '', logoutTime: '', project: '', task: '' }));
        } else {
            setForm(prev => ({ ...(prev || {}), leaves: '0.5', status: 'Half Day Leave' }));
        }
    };

    const handleSubmit = () => {
        if (!form.name || !form.name.toString().trim()) {
            alert("Name is required");
            return;
        }
        if (!form.description || !form.description.toString().trim()) {
            alert("Description is required");
            return;
        }
        if (onLeave && leaveType === 'half') {
            if (!form.loginTime || !form.logoutTime) {
                alert("For half day leave please provide login and logout times");
                return;
            }
        }

        const id = (form.id as string) || Date.now().toString();
        const hours = computeHours(form.loginTime || "", form.logoutTime || "");
        const newItem: Timesheet = {
            id,
            description: form.description || "",
            name: form.name || "",
            date: form.date || "",
            loginTime: form.loginTime || "",
            logoutTime: form.logoutTime || "",
            project: form.project || "",
            task: form.task || "",
            taskhours:form.taskhours|| "",
            priority: form.priority || "",
            status: form.status || (onLeave ? (leaveType === 'half' ? 'Half Day' : 'Leave') : ""),
            leaves: form.leaves || (onLeave ? (leaveType === 'half' ? '0.5' : '1') : '0'),
            hours,
        };

        if (prop.onSave) {
            prop.onSave(newItem);
        } else {
            setItems([...items, newItem]);
        }

        setForm(defaultForm);
        prop.onClose();
    };

    const totalhoursStyle = { mt: 2, '& input::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 }, '& input::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 }, '& input[type=number]': { MozAppearance: 'textfield' } }

    return (
        <>
            <Dialog open={prop.open} onClose={() => prop.onClose()} >
                <DialogTitle>Add Your Entry</DialogTitle>
                <DialogContent sx={dialogContentStyle}>
                    <Stack direction={"row"} gap={3} sx={{ mt: 2 }}>
                        <TextField required variant="outlined" label="Name" name="name" value={form.name} onChange={handleChange}></TextField>
                        <FormControlLabel control={<Switch checked={onLeave} onChange={(e) => handleLeaveToggle((e.target as HTMLInputElement).checked)} />} label="Are you on Leave" />
                    </Stack>
                    {onLeave && (
                        <Stack direction={"row"} gap={2} sx={{ mt: 1, alignItems: 'center' }}>
                            <FormControlLabel
                                control={<Checkbox checked={leaveType === 'full'} onChange={() => handleLeaveTypeChange('full')} />}
                                label="Full Day"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={leaveType === 'half'} onChange={() => handleLeaveTypeChange('half')} />}
                                label="Half Day Leave"
                            />
                        </Stack>
                    )}
                    <Stack sx={{ mt: 2 }}>
                        <TextField required variant="outlined" name="date" type="date" value={form.date} onChange={handleChange}></TextField>
                    </Stack>

                    <Stack direction={"row"} gap={3} sx={{ mt: 2 }}>
                        <Box>
                            <Typography>Login Time</Typography>
                            <TextField variant="outlined" name="loginTime" type="time" value={form.loginTime} onChange={handleChange} disabled={onLeave && leaveType !== 'half'}></TextField>
                        </Box>
                        <Box>
                            <Typography>Login Out</Typography>
                            <TextField variant="outlined" name="logoutTime" type="time" value={form.logoutTime} onChange={handleChange} disabled={onLeave && leaveType !== 'half'}></TextField>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} gap={3} sx={{ mt: 2 }}>
                        <TextField variant="outlined" label="Project" name="project" value={form.project} onChange={handleChange} disabled={onLeave}></TextField>
                        <TextField variant="outlined" label="Task" name="task" value={form.task} onChange={handleChange} disabled={onLeave}></TextField>
                    </Stack>
                    <Stack>
                        <TextField variant="outlined" label="Total Hours Worked on This Task" name="taskhours" type="number" onChange={handleChange} disabled={onLeave} sx={totalhoursStyle}></TextField>
                    </Stack>
                    <Stack gap={3} sx={{ mt: 2 }}>
                        <TextField required variant="outlined" label="Description" name="description" multiline rows={4} value={form.description ?? ""} onChange={handleChange}></TextField>
                    </Stack>
                    <Stack direction={"row"} gap={3} sx={{ mt: 2 }}>
                        <FormControl sx={{ minWidth: 140 }}>
                            <InputLabel id="priority-label">Priority</InputLabel>
                            <Select label="Priority" name="priority" value={form.priority ?? ""} onChange={handleSelectChange} disabled={onLeave}>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 160 }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select label="Status" name="status" value={form.status ?? ""} onChange={handleSelectChange} disabled={onLeave}>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                    <Button variant="outlined" color="secondary" onClick={() => prop.onClose()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CollectDataForm;