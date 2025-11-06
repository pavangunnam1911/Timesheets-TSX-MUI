import {  Box, Button, Card, CardContent, Checkbox, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Typography, Stack} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CollectDataForm from "../DataForm/DataForm";
import * as XLSX from 'xlsx';
import type { Timesheet } from "../../Interfaces/Timesheet";
import useTotalHours from "../../Hooks/useTotalHours";
import useTotalLeaves from "../../Hooks/useTotalLeaves";
import useProjectHours from "../../Hooks/useProjectHours";
import useOvertime from "../../Hooks/useOverTime";
import { useTimesheets } from "../../App";

interface TableHeadData {
  name: string;
  id: string;
}

const tableheaddata: TableHeadData[] = [
  { name: "Date", id: "date" },
  { name: "Login Time", id: "loginTime" },
  { name: "Logout Time", id: "logoutTime" },
  { name: "Total Hours", id: "hours" },
  { name: "Project Name", id: "project" },
  { name: "Task Name", id: "task" },
  { name: "Task Hours", id: "taskhours" },
  { name: "Task Priority", id: "priority" },
  { name: "Status", id: "status" },
];

const TableHeadStyle = {backgroundColor: "rgb(25,118,210)",color: "#ffffff",fontWeight: 600,whiteSpace:"nowrap",textAlign:"center"};
const selectStyle = {color:"#000000",width:120,mr:5}
const FilterStyle = {display:"flex",justifyContent:"space-between",mb:2}
const TableCellStyle = {textOverflow:"ellipsis",overflow:"hidden",textAlign:"center"}
const cardTotalStyle = { flex: 1, borderRadius: 2, boxShadow: 1, bgcolor: 'background.paper', minHeight: 88, display: 'flex', alignItems: 'center' }
const cardleavesStyle ={ flex: 1, borderRadius: 2, boxShadow: 1, bgcolor: 'background.paper', minHeight: 88, display: 'flex', alignItems: 'center' }
const cardProjectStyle = { flex: 2, borderRadius: 2, boxShadow: 1, bgcolor: 'background.paper', minHeight: 88 }
const projectBoxStyle = { display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 108, overflow: 'auto' };

interface TimesheetTableProps {
    hideFilters?: boolean;
    onlyDate?: string;
}

const TimesheetTable:React.FC<TimesheetTableProps> = (props) =>{
    
        
    const {items,setItems} = useTimesheets();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Timesheet | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const Selectall =(event:React.ChangeEvent<HTMLInputElement>) =>{
        if (event.target.checked) {
            const allRows = filteredItems.map((x: { id: any; })=>x.id);
            setSelectedIds(allRows);
        }
        else{
            setSelectedIds([]);
        }
    }

    const CheckboxClick = (id:string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x!== id) : [...prev,id]
        );
    }; 

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            setItems(items.filter((x: { id: string; }) => x.id !== id));
            setSelectedIds(prev => prev.filter(selectedId => selectedId !== id)); 
        }
    };

    const multiDelete = () => {
       if (window.confirm(`Are you sure you want to delete selected entries?`)) {
            setItems(items.filter((x: { id: string; }) => !selectedIds.includes(x.id)));
            setSelectedIds([]);
        }
    }


    const openDialogForEdit = (x: Timesheet) => {
        setEditingItem(x);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingItem(null);
    };

    const handleDialogSave = (item: Timesheet) => {
        setItems(items.map((x: { id: string; }) => x.id === item.id ? item : x));
        setDialogOpen(false);
        setEditingItem(null);
    };


        const [selectedYear, setSelectedYear] = useState<string>("All");
        const [selectedMonth, setSelectedMonth] = useState<string>("All");
        const [selectedDay, setSelectedDay] = useState<string>("All");

        useEffect(() => {
            if (props.onlyDate) {
                const parts = props.onlyDate.split("-");
                if (parts.length === 3) {
                    const [y,m,d] = parts;
                    setSelectedYear(y);
                    setSelectedMonth(m);
                    setSelectedDay(d);
                }
            }
        }, [props.onlyDate]);

    const years = useMemo(() => {
        const a = new Set<string>();
        items.forEach((x: { date: string; }) => {
            if (x.date) a.add(x.date.split("-")[0]);
        });
        return Array.from(a).sort();
    }, [items]);

    const monthsForYear = useMemo(() => {
        const b = new Set<string>();
        items.forEach(x => {
            if (!x.date) return;
            const [year, month] = x.date.split("-");
            if (selectedYear === "All" || selectedYear === year) b.add(month);
        });
        return Array.from(b).sort((a, b) => Number(a) - Number(b));
    }, [items, selectedYear]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const filteredItems = useMemo(() => {
        return items.filter(x => {
            if (!x.date) return false;
            const [year, month, day] = x.date.split("-");
            if (selectedYear !== "All" && selectedYear !== year) return false;
            if (selectedMonth !== "All" && selectedMonth !== month) return false;
            if (selectedDay !== "All" && selectedDay !== day) return false;
            return true;
        });
    }, [items, selectedYear, selectedMonth, selectedDay]);

    const totalHours = useTotalHours(filteredItems);
    const totalLeaves = useTotalLeaves(filteredItems);
    const projectHours = useProjectHours(filteredItems);
    const totalOverTime = useOvertime(filteredItems);

    const filterActive = selectedYear !== "All" || selectedMonth !== "All" || selectedDay !== "All";

    const handleYearChange = (event: SelectChangeEvent) => {
        const x = event.target.value;
        setSelectedYear(x);
        setSelectedMonth("All");
        setSelectedDay("All");
    };

    const handleMonthChange = (event: SelectChangeEvent) => {
        const x = event.target.value;
        setSelectedMonth(x);
        setSelectedDay("All");
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const downloadExcel = () => {
        const exportData = filteredItems.map((x:Timesheet) => ({
            Date: x.date,
            Name: x.name,
            Project: x.project,
            Task: x.task,
            "Login Time": x.loginTime,
            "Logout Time": x.logoutTime,
            Priority: x.priority,
            Status: x.status,
            Description: (x as any).description || "",
            "Total Hours": x.hours,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheets");
        XLSX.writeFile(workbook, "Timesheets.xlsx");
    };

    return(
        <>
        {!props.hideFilters ? (
        <>
        <Box sx={FilterStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Select value={selectedYear} onChange={handleYearChange} displayEmpty sx={selectStyle}>
                    <MenuItem value="All">All Years</MenuItem>
                    {years.map(y => (<MenuItem key={y} value={y}>{y}</MenuItem>))}
                </Select>
                <Select value={selectedMonth} onChange={handleMonthChange} displayEmpty sx={selectStyle}>
                    <MenuItem value="All">All Months</MenuItem>
                    {monthsForYear.map(month => {
                        const num = parseInt(month, 10);
                        const label = (!isNaN(num) && num >=1 && num <=12) ? monthNames[num-1] : month;
                        return (<MenuItem key={month} value={month}>{label}</MenuItem>)
                    })}
                </Select>
            </Box>
            <Box >
                <Button variant="contained" color="error" onClick={multiDelete} disabled={selectedIds.length === 0} sx={{mr:2}}>Multi Delete</Button>
                <Button variant="contained" color="success" onClick={downloadExcel}>Download Excel</Button>
            </Box>
        </Box>

        {filterActive && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Card sx={cardTotalStyle}>
                <CardContent sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>Total Hours</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalHours}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>Overtime: {totalOverTime} hrs</Typography>
                </CardContent>
            </Card>

            <Card sx={cardleavesStyle}>
                <CardContent sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>Total Leaves</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{totalLeaves} days</Typography>
                </CardContent>
            </Card>

            <Card sx={cardProjectStyle}>
                <CardContent>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>Project Hours</Typography>
                    <Box sx={projectBoxStyle}>
                        {projectHours.length > 0 ? projectHours.map(ph => (
                            <Box key={ph.project} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.primary">{ph.project}</Typography>
                                <Typography variant="body2" color="text.secondary">{ph.hoursString}</Typography>
                            </Box>
                        )) : (
                            <Typography variant="body2" color="text.secondary">No projects</Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Stack>
    )}
        </>
        ) : null}
    
        <TableContainer>
            <Table size="small" sx={{tableLayout:"fixed"}}>
                <TableHead >
                    <TableRow>
                        <TableCell sx={TableHeadStyle}>
                            <Checkbox color="default" checked={selectedIds.length === filteredItems.length && filteredItems.length>0} indeterminate={selectedIds.length > 0 && selectedIds.length < filteredItems.length} onChange={Selectall} />
                            </TableCell>
                            {tableheaddata.map((x) => (
                                <TableCell sx={TableHeadStyle} key={x.id}>
                                    {x.name}
                                </TableCell>
                            ))}
                            <TableCell sx={TableHeadStyle}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredItems.map((x: Timesheet) => (
                        <TableRow key={x.id} sx={{backgroundColor: x.status === "Leave" ? "#e3b9b9" : "transparent", }}>
                        <TableCell sx={TableCellStyle}><Checkbox checked={selectedIds.includes(x.id)} onChange={()=>CheckboxClick(x.id)} /></TableCell>
                        <TableCell sx={TableCellStyle}>{formatDate(x.date)}</TableCell>
                        <TableCell sx={TableCellStyle}>{x.loginTime}</TableCell>
                        <TableCell sx={TableCellStyle}>{x.logoutTime}</TableCell>
                        <TableCell sx={TableCellStyle}>{x.hours}</TableCell>
                        <Tooltip title={x.project} placement="right" arrow>
                            <TableCell sx={TableCellStyle}>{x.project}</TableCell>
                        </Tooltip>
                        <Tooltip title={x.task} placement="right" arrow>
                            <TableCell sx={TableCellStyle}>{x.task}</TableCell>
                        </Tooltip>
                        <TableCell sx={TableCellStyle}>{x.taskhours}</TableCell>
                        <TableCell sx={TableCellStyle}>{x.priority}</TableCell>
                        <TableCell sx={TableCellStyle}>{x.status}</TableCell>
                        <TableCell >
                            <IconButton color="primary" onClick={() => openDialogForEdit(x)} size="small">
                            <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(x.id)} size="small">
                            <DeleteIcon />
                            </IconButton>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>


            </Table>
        </TableContainer>
        <CollectDataForm open={dialogOpen} initialData={editingItem} onClose={handleDialogClose} onSave={handleDialogSave} />
        </>
        
    );

};

export default TimesheetTable; 