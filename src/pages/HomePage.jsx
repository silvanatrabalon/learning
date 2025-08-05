import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Learning Platform</h1>
        <p>Master modern web development technologies with our interactive guides</p>
      </header>
      
      <main className="main-content">
        <div className="action-cards">
          <Link to="/start-learning" className="action-card">
            <div className="card-icon">📚</div>
            <h2>Start Learning</h2>
            <p>Explore comprehensive guides for Next.js, NestJS, and more technologies</p>
            <span className="card-arrow">→</span>
          </Link>
          
          <Link to="/test-knowledge" className="action-card">
            <div className="card-icon">🧪</div>
            <h2>Test Knowledge</h2>
            <p>Test your skills with interactive flashcards and track your progress</p>
            <span className="card-arrow">→</span>
          </Link>

          <Link to="/mixed-topics-quiz" className="action-card featured">
            <div className="card-icon">🎯</div>
            <h2>Mixed Topics Quiz</h2>
            <p>Challenge yourself with questions from multiple topics and get detailed performance reports</p>
            <span className="card-badge">NEW</span>
            <span className="card-arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default HomePage
