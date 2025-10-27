import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header: React.FC = () => (
  <AppBar position="static" color="primary" elevation={0} sx={{width:'100%'}}>
    <Toolbar >
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600}}>
        Employee TimeSheets
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;