import { Outlet } from "react-router-dom";
import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <AudioProvider>
      <AuthProvider>
        <div className="min-h-screen bg-dark text-light">
          <Outlet />
        </div>
      </AuthProvider>
    </AudioProvider>
  )
}

export default App