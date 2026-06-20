import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import KhavdaDashboard from "./Dashboards/KhavdaDashboard"

export default function App() {
  return (
    <BrowserRouter>

      <div
        style={{
          padding: 12,
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: 20,
        }}
      >
        <Link to="/">Khavda Transmission</Link>
      </div>

      <Routes>

        <Route
          path="/"
          element={<KhavdaDashboard />}
        />

        <Route
          path="/avaada"
          element={
            <div
              style={{
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h1>Avaada Dashboard Moved</h1>
              <p>
                This dashboard has been migrated to the internal Avaada environment.
              </p>
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}
