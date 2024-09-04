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

// import PrivateRoute from "./components/PrivateRoute";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
