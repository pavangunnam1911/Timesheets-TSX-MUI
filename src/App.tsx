import Navbar from "./Navbar/navbar"
import React, { useState } from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Welcomepage from "./Pages/Welcomepage";
import FloatingActionButton from "./components/FabMenu";
import TimesheetTable from "./components/TimesheetTable";
import AddDataForm from "./components/AddDataForm";

const App:React.FC =()=>{
  const [formView,setFormView] = useState<>
  return(
    <BrowserRouter>
    <Navbar></Navbar>
    <Routes>
      <Route path="/home" element={<Welcomepage/>}/>
      <Route path="/progress" element={<TimesheetTable/>}/>
      <Route path="/count" element={<Welcomepage/>}/>
    </Routes>
    <FloatingActionButton>
    </FloatingActionButton>
    <AddDataForm open={open}></AddDataForm>
    </BrowserRouter>

  );
}

export default App;