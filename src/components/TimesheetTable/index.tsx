import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React from "react";

interface TableHeadData{
    name:string,
    id:string    
}

const tableheaddata : TableHeadData[] = [
    {name:'Employee Name',id:'name'},
    {name:'Date',id:'date'},
    {name:'Login Time',id:'lit'},
    {name:'Logout Time',id:'lot'},
    {name:'Project Name',id:'project'},
    {name:'Task Name',id:'task'},
    {name:'Task Priority',id:'priority'},
    {name:'Total Working Hours',id:'hours'},
    {name:'Number of Leaves',id:'leaves'},
    {name:'Status',id:'status'}
]; 



const TableHeadStyle = {backgroundColor:"rgb(25,118,210)",color:"#ffffff",fontWeight:600}; 


const TimesheetTable:React.FC=()=>{
    return(
        <TableContainer sx={{mt:20}}>
            <Table>
                <TableHead >
                    <TableRow >
                        <TableCell sx={TableHeadStyle} >
                            <Checkbox></Checkbox>
                        </TableCell>
                        {tableheaddata.map((td) => (<TableCell sx={TableHeadStyle}  key={td.id}>{td.name}</TableCell>))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    
                </TableBody>
            </Table>
        </TableContainer>
        
    );
}

export default TimesheetTable;