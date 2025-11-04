import {  Button, Checkbox, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";

interface TableHeadData {
  name: string;
  id: string;
}

const tableheaddata: TableHeadData[] = [
  { name: "Employee Name", id: "name" },
  { name: "Date", id: "date" },
  { name: "Login Time", id: "loginTime" },
  { name: "Logout Time", id: "logoutTime" },
  { name: "Project Name", id: "project" },
  { name: "Task Name", id: "task" },
  { name: "Task Priority", id: "priority" },
  { name: "Total Hours", id: "hours" },
  { name: "Leaves", id: "priority" },
  { name: "Status", id: "status" },
];

const TableHeadStyle = {backgroundColor: "rgb(25,118,210)",color: "#ffffff",fontWeight: 600,};
const selectStyle = {color:"#000000",width:120}
const TimesheetTable:React.FC = () =>{

    return(
        <>
        <Select label="Yearly" sx={selectStyle}>
            <MenuItem></MenuItem>
        </Select>
        <Select label="Monthly"sx={selectStyle}>
            <MenuItem></MenuItem>
        </Select>
        <Select label="Daily" sx={selectStyle}>
            <MenuItem></MenuItem>
        </Select>
        
        <Button>Download Excel</Button>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={TableHeadStyle}>
                            <Checkbox color="default" />
                            </TableCell>
                            {tableheaddata.map((td) => (
                                <TableCell sx={TableHeadStyle} key={td.id}>
                                    {td.name}
                                </TableCell>
                            ))}
                            <TableCell sx={TableHeadStyle}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    
                </TableBody>

            </Table>
        </TableContainer>
        </>
        
    );

};

export default TimesheetTable; 