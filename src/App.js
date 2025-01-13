import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import DepotMaster from "./pages/DepotMaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmpMaster from "./pages/EmpMaster";
import EmpAnalysis from "./pages/empAnalysis";
import DepotWiseAnalysis from "./pages/depotWiseAnalysis";
import Transfer from "./pages/Transfer";
import EmpTransferHistori from "./pages/EmpTransferHistori";
import PostEmployeeModification from "./pages/PostEmployeeModification ";
import SkillMaster from "./pages/SkillMaster";
import EducationMaster from "./pages/EducationMaster";
import DepotWiseEmpSkillData from "./pages/DepotWiseEmpSkillData";
import EditableEmpMaster from "./pages/EditableEmpMaster";
import Analytics from "./pages/Analytics";
import EmpAnalytics from "./pages/EmpAnalytics";

import MutualTransferSearch from "./pages/MutualTransferSearch ";
import MutualsearchRegistration from "./pages/MutualsearchRegistration";
import BulkUpdatEmp from "./pages/BulkUpdatEmp";
import SearchStaffPosition from "./pages/SearchStaffPosition";
import Registration from "./pages/registration";

import LogIn from "./pages/LogIn";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/DepotMaster" element={<DepotMaster />} />
          <Route path="/EmpMaster" element={<EmpMaster />} />
          <Route
            path="/PostEmployeeModification"
            element={<PostEmployeeModification />}
          />
          <Route path="/EmpAnalysis" element={<EmpAnalysis />} />
          <Route path="/EmpTransferHistori" element={<EmpTransferHistori />} />
          <Route path="/DepotWiseAnalysis" element={<DepotWiseAnalysis />} />
          <Route path="/Transfer" element={<Transfer />} />
          <Route path="/SkillMaster" element={<SkillMaster />} />
          <Route path="/EducationMaster" element={<EducationMaster />} />
          <Route
            path="/DepotWiseEmpSkillData"
            element={<DepotWiseEmpSkillData />}
          />
          <Route path="/EditableEmpMaster" element={<EditableEmpMaster />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/EmpAnalytics" element={<EmpAnalytics />} />
          <Route
            path="/MutualTransferSearch"
            element={<MutualTransferSearch />}
          />
          <Route
            path="/MutualsearchRegistration"
            element={<MutualsearchRegistration />}
          />
          <Route path="/BulkUpdatEmp" element={<BulkUpdatEmp />} />
          <Route
            path="/SearchStaffPosition"
            element={<SearchStaffPosition />}
          />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/RegistrationgIn" element={<Registration />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
