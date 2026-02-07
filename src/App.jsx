import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import GenerateScript from './pages/GenerateScript';
import EditScript from './pages/EditScript';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/generate" element={<GenerateScript />} />
        <Route path="/edit" element={<EditScript />} />
      </Routes>
    </Router>
  );
}

export default App;
