import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StartLearning from './pages/StartLearning'
import TestKnowledge from './pages/TestKnowledge'
import './App.css'

function App() {
  return (
    <Router basename="/learning">
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/start-learning" element={<StartLearning />} />
          <Route path="/test-knowledge" element={<TestKnowledge />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
