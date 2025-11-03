import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#4A90E2" },
    secondary: { main: "#3bfa84ff" },
    warning : {main :  "#e53935"},
    info: {main:"#ffffff"}
    
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});