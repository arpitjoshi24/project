
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import RoutePlanner from './pages/RoutePlanner';
import Students from './pages/Students';
import Buses from './pages/Buses';
import Stops from './pages/Stops';
import Settings from './pages/Settings';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="routes" element={<RoutePlanner />} />
            <Route path="students" element={<Students />} />
            <Route path="buses" element={<Buses />} />
            <Route path="stops" element={<Stops />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;