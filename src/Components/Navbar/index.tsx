import {Stack,Toolbar,Typography,AppBar,} from "@mui/material";
import {Link} from "react-router-dom"
const pages = [
  { name: "Home", id: "home" },
  { name: "My Time Sheets", id: "progress" },
];

const stackStyle = {display: 'flex',flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',width: '100%'};
const linkStyles = {color: '#ffffff', textDecoration: 'none',}

const Header = () => {
  return (
    <AppBar>
        <Toolbar>
          <Stack sx={stackStyle}>
            <Typography variant="h6">Employee Timesheet</Typography>
            <Stack direction="row" gap={3} >
              {pages.map(page => (
                <Link key={page.id} to={page.id}>
                  <Typography sx={linkStyles}>{page.name}</Typography> 
                </Link>
              ))}
            </Stack>
          </Stack>
        </Toolbar>
    </AppBar>
  );
};
export default Header;