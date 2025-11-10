import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ActivityLogs from "./pages/ActivityLogs";
import Clients from "./pages/Clients";
import ProjectModal from "./components/ProjectModal";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/activitys" element={<ActivityLogs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
