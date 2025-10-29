import React from "react";
import { AppBar, Toolbar, Typography,Avatar,Button } from "@mui/material";

const Header: React.FC = () => (
  <AppBar position="static" color="primary" elevation={0} sx={{width:'100%'}}>
    <Toolbar >
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600}}>
        Employee TimeSheets
      </Typography>
      <Button  sx={{pl:2}} >
        <Typography fontSize={"1rem"}  sx={{ flexGrow: 1, fontWeight: 600}} color="white">Admin</Typography>
        <Avatar sx={{ml:2}}></Avatar>
      </Button>
      
    </Toolbar>
    
    
  </AppBar>
);

export default Header;