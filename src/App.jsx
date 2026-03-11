import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import KhavdaDashboard from "./Dashboards/KhavdaDashboard"
import AvaadaDashboard from "./Dashboards/AvaadaREintelligence"

export default function App() {

  return (

    <BrowserRouter>

      <div style={{
        padding:12,
        borderBottom:"1px solid #ddd",
        display:"flex",
        gap:20
      }}>

        <Link to="/">Khavda Transmission</Link>

        <Link to="/avaada">Avaada Intelligence</Link>

      </div>

      <Routes>

        <Route
          path="/"
          element={<KhavdaDashboard />}
        />

        <Route
          path="/avaada"
          element={<AvaadaDashboard />}
        />

      </Routes>

    </BrowserRouter>

  )
}
