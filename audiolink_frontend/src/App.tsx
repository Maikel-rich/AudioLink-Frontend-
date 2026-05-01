import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-dark text-light">
      <Outlet />
    </div>
  )
}

export default App