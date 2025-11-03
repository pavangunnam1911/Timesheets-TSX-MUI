import {Typography } from "@mui/material";
import "./navbar.css";
import {Link} from "react-router-dom";
import { amber } from "@mui/material/colors";

const NavBar = () =>{
    return(
        <>
        <ul className="navItems">
            <Link to={"/"}><li  className="home" ><Typography  sx={{color:amber[800], fontWeight:600,textDecoration:"none"}}>Home</Typography></li></Link>
            <Link to={"/TableView"}><li className="tableView"><Typography  sx={{color:amber[800], fontWeight:600,textDecoration:"none"}}>Employee Data</Typography></li></Link>
            <Link to={"/EmployeeCount"}><li className="empCount"><Typography  sx={{color:amber[800], fontWeight:600,textDecoration:"none"}}>Status cards</Typography></li></Link>
        </ul>
        </>
    );
}

export default NavBar;