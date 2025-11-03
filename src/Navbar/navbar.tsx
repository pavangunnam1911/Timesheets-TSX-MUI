import React from "react";
import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import {Link} from "react-router-dom";

interface Page {
    name:string,
    id:string
}

const pages: Page [] = [{name:"Home",id:"home"},{name:"Progress",id:"progress"},{name:"Count", id:"count"}];

const Navbar:React.FC = () => {
    const anchorStyle ={color:"white" ,fontWeight:600 ,textDecoration:"none"} ;
    const headerStyle = {display: 'flex',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',width: '100%',};

    return(
    <AppBar>
        <Toolbar>
            <Stack sx={headerStyle} >
                <Typography variant="h5">Employee Timesheet</Typography>
                <Stack direction="row" gap={3}>
                    {pages.map((page) => (<Link key={page.id} to={`${page.id}`} style={anchorStyle}>{page.name}</Link>))}
                </Stack>
            </Stack>
        </Toolbar>
    </AppBar>);
};

export default Navbar;