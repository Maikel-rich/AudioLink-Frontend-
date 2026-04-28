import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-[#0C1117] text-white flex items-center justify-center">
      <Outlet />
    </div>
  )
}

export default App