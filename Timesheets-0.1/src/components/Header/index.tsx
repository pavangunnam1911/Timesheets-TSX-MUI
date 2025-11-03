import React from "react";
import { AppBar, Toolbar, Typography,Avatar,Button } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import NavBar from "../../Navbar/navbar";
import './style.css';

const Header: React.FC = () => (
  <div className="appBar">
    <AppBar position="static" color="primary" elevation={0} sx={{width:'100%'}}>
      <Toolbar >
        <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600}}>
          Employee TimeSheets
        </Typography>
        <NavBar/>
        <Button  sx={{pl:2}} >
          <Avatar sx={{ bgcolor: deepPurple[500] }}>GP</Avatar>
          <Typography fontSize={"1rem"}  sx={{ flexGrow: 1, fontWeight: 600, ml:1}} color="white">Admin</Typography>
        </Button>
        
      </Toolbar>
    </AppBar>
  </div>
  
);

export default Header;