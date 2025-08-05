import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TopicSelector from '../components/TopicSelector'
import LanguageToggle from '../components/LanguageToggle'
import ModeSelector from '../components/ModeSelector'
import FlashCard from '../components/FlashCard'
import MultipleChoiceCard from '../components/MultipleChoiceCard'
import ProgressBar from '../components/ProgressBar'
import './TestKnowledge.css'

function TestKnowledge() {
  const [selectedTopic, setSelectedTopic] = useState('next')
  const [language, setLanguage] = useState('en')
  const [mode, setMode] = useState('flashcard') // 'flashcard' or 'multiple-choice'
  const [flashCards, setFlashCards] = useState([])
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [reviewedCards, setReviewedCards] = useState([])
  const [allConcepts, setAllConcepts] = useState([])

  const topics = [
    { id: 'next', name: 'Next.js', icon: '⚛️' },
    { id: 'nest', name: 'NestJS', icon: '🪶' }
  ]

  useEffect(() => {
    loadContent()
    resetSession()
  }, [selectedTopic, language, mode])

  const loadContent = async () => {
    try {
      const response = await fetch(`/learning/guides/${selectedTopic}-${language}.md`)
      const content = await response.text()
      const concepts = extractConcepts(content)
      setAllConcepts(concepts)
      
      if (mode === 'flashcard') {
        const cards = generateFlashCards(concepts)
        setFlashCards(shuffleArray(cards))
      } else {
        const questions = generateMultipleChoiceQuestions(concepts)
        setMultipleChoiceQuestions(shuffleArray(questions))
      }
    } catch (error) {
      console.error('Error loading markdown:', error)
    }
  }

  const extractConcepts = (content) => {
    const lines = content.split('\n')
    const concepts = []
    
    let currentConcept = null
    let currentDescription = ''
    let currentComparison = ''
    let isInDescription = false
    let isInComparison = false

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        // Save previous concept if exists
        if (currentConcept && currentDescription) {
          concepts.push({
            name: currentConcept,
            description: currentDescription.trim(),
            comparison: currentComparison.trim()
          })
        }
        
        // Start new concept
        currentConcept = line.replace('## ', '')
        currentDescription = ''
        currentComparison = ''
        isInDescription = false
        isInComparison = false
      } else if (line.includes('**Descripción:**') || line.includes('**Description:**')) {
        isInDescription = true
        isInComparison = false
        currentDescription = line.replace(/\*\*(Descripción|Description):\*\*/, '').trim()
      } else if (line.includes('**Comparación:**') || line.includes('**Comparison:**')) {
        isInDescription = false
        isInComparison = true
        currentComparison = line.replace(/\*\*(Comparación|Comparison):\*\*/, '').trim()
      } else if (line.includes('**Ejemplo:**') || line.includes('**Example:**')) {
        isInDescription = false
        isInComparison = false
      } else if (isInDescription && line.trim() && !line.startsWith('```') && !line.startsWith('**')) {
        currentDescription += ' ' + line.trim()
      } else if (isInComparison && line.trim() && !line.startsWith('```') && !line.startsWith('**')) {
        currentComparison += ' ' + line.trim()
      }
    })

    // Don't forget the last concept
    if (currentConcept && currentDescription) {
      concepts.push({
        name: currentConcept,
        description: currentDescription.trim(),
        comparison: currentComparison.trim()
      })
    }

    return concepts
  }

  const generateFlashCards = (concepts) => {
    const cards = []
    
    concepts.forEach((concept, index) => {
      if (concept.description) {
        cards.push({
          id: cards.length,
          concept: concept.name,
          description: concept.description,
          comparison: concept.comparison,
          type: 'description'
        })
      }
      
      if (concept.comparison) {
        cards.push({
          id: cards.length,
          concept: concept.name,
          description: concept.description,
          comparison: concept.comparison,
          type: 'comparison'
        })
      }
    })

    return cards
  }

  const generateMultipleChoiceQuestions = (concepts) => {
    const questions = []
    
    concepts.forEach((concept, index) => {
      if (concept.description) {
        // Definition question
        const wrongAnswers = concepts
          .filter(c => c.name !== concept.name && c.description)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.description)
        
        questions.push({
          id: questions.length,
          type: 'definition',
          question: getMultipleChoiceQuestion(concept.name, 'definition'),
          correctAnswer: concept.description,
          options: shuffleArray([concept.description, ...wrongAnswers]),
          concept: concept.name
        })
      }
      
      if (concept.comparison) {
        // Comparison question
        const wrongAnswers = concepts
          .filter(c => c.name !== concept.name && c.comparison)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(c => c.comparison)
        
        questions.push({
          id: questions.length,
          type: 'comparison',
          question: getMultipleChoiceQuestion(concept.name, 'comparison'),
          correctAnswer: concept.comparison,
          options: shuffleArray([concept.comparison, ...wrongAnswers]),
          concept: concept.name
        })
      }
    })

    return questions
  }

  const getMultipleChoiceQuestion = (conceptName, type) => {
    const questions = {
      en: {
        definition: `What is ${conceptName}?`,
        comparison: `How does ${conceptName} compare to other concepts?`
      },
      es: {
        definition: `¿Qué es ${conceptName}?`,
        comparison: `¿Cómo se compara ${conceptName} con otros conceptos?`
      }
    }
    
    return questions[language][type] || questions.en[type]
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setScore({ correct: 0, total: 0 })
    setIsSessionComplete(false)
    setReviewedCards([])
  }

  const handleAnswer = (isCorrect) => {
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1
    }
    setScore(newScore)
    
    const currentItem = mode === 'flashcard' ? flashCards[currentCardIndex] : multipleChoiceQuestions[currentCardIndex]
    const cardResult = {
      ...currentItem,
      isCorrect,
      timestamp: new Date()
    }
    setReviewedCards([...reviewedCards, cardResult])

    // Move to next card after a short delay
    setTimeout(() => {
      const totalItems = mode === 'flashcard' ? flashCards.length : multipleChoiceQuestions.length
      if (currentCardIndex + 1 >= totalItems) {
        setIsSessionComplete(true)
      } else {
        setCurrentCardIndex(currentCardIndex + 1)
        setShowAnswer(false)
      }
    }, 1500)
  }

  const restartSession = () => {
    if (mode === 'flashcard') {
      setFlashCards(shuffleArray(flashCards))
    } else {
      const questions = generateMultipleChoiceQuestions(allConcepts)
      setMultipleChoiceQuestions(shuffleArray(questions))
    }
    resetSession()
  }

  const currentCard = mode === 'flashcard' ? flashCards[currentCardIndex] : null
  const currentQuestion = mode === 'multiple-choice' ? multipleChoiceQuestions[currentCardIndex] : null
  const totalItems = mode === 'flashcard' ? flashCards.length : multipleChoiceQuestions.length

  const getSessionTexts = () => {
    const texts = {
      en: {
        sessionComplete: 'Test Knowledge - Session Complete!',
        complete: '🎉 Session Complete!',
        excellent: 'Excellent work! 🌟',
        good: 'Good job! 👏',
        practice: 'Keep practicing! 💪',
        tryAgain: '🔄 Try Again',
        studyMore: '📚 Study More',
        sessionProgress: 'Session Progress',
        card: 'Card',
        of: 'of',
        score: 'Score',
        accuracy: 'Accuracy',
        loading: 'Loading flashcards...'
      },
      es: {
        sessionComplete: 'Test Knowledge - ¡Sesión Completa!',
        complete: '🎉 ¡Sesión Completa!',
        excellent: '¡Excelente trabajo! 🌟',
        good: '¡Buen trabajo! 👏',
        practice: '¡Sigue practicando! 💪',
        tryAgain: '🔄 Intentar de Nuevo',
        studyMore: '📚 Estudiar Más',
        sessionProgress: 'Progreso de la Sesión',
        card: 'Tarjeta',
        of: 'de',
        score: 'Puntuación',
        accuracy: 'Precisión',
        loading: 'Cargando flashcards...'
      }
    }
    
    return texts[language] || texts.en
  }

  const sessionTexts = getSessionTexts()

  if (isSessionComplete) {
    const getScoreMessage = () => {
      const ratio = score.correct / score.total
      if (ratio >= 0.8) return sessionTexts.excellent
      if (ratio >= 0.6) return sessionTexts.good
      return sessionTexts.practice
    }

    return (
      <div className="test-knowledge">
        <header className="test-header">
          <Link to="/" className="back-button">← Back to Home</Link>
          <h1>{sessionTexts.sessionComplete}</h1>
          <LanguageToggle language={language} onLanguageChange={setLanguage} />
        </header>

        <div className="session-complete">
          <div className="final-score">
            <h2>{sessionTexts.complete}</h2>
            <div className="score-display">
              <span className="score-number">{score.correct}/{score.total}</span>
              <span className="score-percentage">
                {Math.round((score.correct / score.total) * 100)}%
              </span>
            </div>
            <p>{getScoreMessage()}</p>
          </div>

          <div className="session-actions">
            <button onClick={restartSession} className="restart-btn">
              {sessionTexts.tryAgain}
            </button>
            <Link to="/start-learning" className="study-btn">
              {sessionTexts.studyMore}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="test-knowledge">
      <header className="test-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1>Test Knowledge</h1>
        <LanguageToggle language={language} onLanguageChange={setLanguage} />
      </header>

      <div className="test-container">
        <aside className="test-sidebar">
          <TopicSelector 
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
          />
          
          <ModeSelector 
            mode={mode}
            onModeChange={setMode}
            language={language}
          />
          
          <div className="session-stats">
            <h3>{sessionTexts.sessionProgress}</h3>
            <ProgressBar 
              current={currentCardIndex + 1} 
              total={totalItems}
              correct={score.correct}
            />
            <div className="score-info">
              <p>{sessionTexts.card}: {currentCardIndex + 1} {sessionTexts.of} {totalItems}</p>
              <p>{sessionTexts.score}: {score.correct}/{score.total}</p>
              {score.total > 0 && (
                <p>{sessionTexts.accuracy}: {Math.round((score.correct / score.total) * 100)}%</p>
              )}
            </div>
          </div>
        </aside>

        <main className="test-main">
          {totalItems > 0 ? (
            mode === 'flashcard' && currentCard ? (
              <FlashCard
                card={currentCard}
                showAnswer={showAnswer}
                onShowAnswer={() => setShowAnswer(true)}
                onAnswer={handleAnswer}
                language={language}
              />
            ) : mode === 'multiple-choice' && currentQuestion ? (
              <MultipleChoiceCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                language={language}
              />
            ) : null
          ) : (
            <div className="loading">
              <p>{sessionTexts.loading}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default TestKnowledge
