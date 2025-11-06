import { Route,Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Header from "./Components/Navbar";
import { Toolbar } from "@mui/material";
import WelcomePage from "./Pages/WelcomePage";
import TimesheetTable from "./Components/Timesheettable";
import FloatingActionButton from './Components/Fab';
import CollectDataForm from './Components/DataForm/DataForm';
import { useState } from 'react';
import useLocalStorage from './Hooks/useLocalstorage';
import type { Timesheet } from './Interfaces/Timesheet';
import { createContext,useContext } from 'react';



const TimesheetContext = createContext<any>(null);
export const useTimesheets = () => useContext(TimesheetContext);

function App() {
  const [open,setOpen] = useState(false);
  const [items, setItems] = useLocalStorage<Timesheet[]>("timesheets", []);

  const handleDialogOpen = () =>{
    setOpen(true);
  };

  const handleDialogClose = () =>{
    setOpen(false);
  };
  
  const handleSave = (item: Timesheet) => {
    setItems(prev => [...prev, item]);
    setOpen(false);
  };

  return (
    <>
    <TimesheetContext.Provider value={{items,setItems}}>
    <BrowserRouter>
    <Header></Header>
    <Toolbar />
    <Routes>
      <Route path='/home' element={<WelcomePage />}></Route>
      <Route path='/progress' element={<TimesheetTable />}></Route>
    </Routes>
    <FloatingActionButton onClick={handleDialogOpen}></FloatingActionButton>
    <CollectDataForm open={open} onClose={handleDialogClose} onSave={handleSave}></CollectDataForm>
    </BrowserRouter>
    </TimesheetContext.Provider>
    </>
    
  )
}

export default App;
