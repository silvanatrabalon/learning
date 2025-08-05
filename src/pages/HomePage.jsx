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
          
          <div className="action-card disabled">
            <div className="card-icon">🧪</div>
            <h2>Test Knowledge</h2>
            <p>Coming soon - Test your skills with interactive quizzes and challenges</p>
            <span className="card-status">Coming Soon</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
