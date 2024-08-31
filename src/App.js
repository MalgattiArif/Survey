import './css/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DynamicForm from './components/DynamicForm';
import Login from './components/Login';
import HomePage from './components/Home';




function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dynamic-form" element={<DynamicForm />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" />} /> 
    </Routes>
  </Router>
  );
}

export default App;
