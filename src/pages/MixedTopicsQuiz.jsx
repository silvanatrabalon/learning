import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SiJavascript, SiNextdotjs, SiNestjs, SiNodedotjs, SiGit, SiReact, SiTypescript } from 'react-icons/si'
import { FaBuilding, FaUniversalAccess, FaTools, FaCogs, FaVial, FaMobile } from 'react-icons/fa'
import MultiTopicSelector from '../components/MultiTopicSelector'
import SessionConfig from '../components/SessionConfig'
import DetailedReport from '../components/DetailedReport'
import FlashCard from '../components/FlashCard'
import MultipleChoiceCard from '../components/MultipleChoiceCard'
import ProgressBar from '../components/ProgressBar'
import LanguageToggle from '../components/LanguageToggle'
import MobileMenu from '../components/MobileMenu'
import './MixedTopicsQuiz.css'

function MixedTopicsQuiz() {
  const [selectedTopics, setSelectedTopics] = useState([])
  const [language, setLanguage] = useState('en')
  const [sessionConfig, setSessionConfig] = useState({
    questionsPerTopic: 5,
    sessionMode: 'mixed',
    questionTypes: 'both'
  })
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [mixedQuestions, setMixedQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionReport, setSessionReport] = useState(null)
  const [reviewedQuestions, setReviewedQuestions] = useState([])

  const topics = [
    { id: 'javascript', name: 'JavaScript', icon: <SiJavascript /> },
    { id: 'react', name: 'React', icon: <SiReact /> },
    { id: 'typescript', name: 'TypeScript', icon: <SiTypescript /> },
    { id: 'next', name: 'Next.js', icon: <SiNextdotjs /> },
    { id: 'nest', name: 'NestJS', icon: <SiNestjs /> },
    { id: 'node', name: 'Node.js', icon: <SiNodedotjs /> },
    { id: 'react-native', name: 'React Native', icon: <FaMobile /> },
    { id: 'testing', name: 'Testing', icon: <FaVial /> },
    { id: 'architecture', name: 'Architecture', icon: <FaBuilding /> },
    { id: 'accessibility', name: 'Accessibility', icon: <FaUniversalAccess /> },
    { id: 'git', name: 'Git', icon: <SiGit /> },
    { id: 'tooling', name: 'Tooling', icon: <FaTools /> },
    { id: 'devops', name: 'DevOps', icon: <FaCogs /> }
  ]

  const getTexts = () => {
    const texts = {
      en: {
        mixedTopicsQuiz: 'Mixed Topics Quiz',
        startSession: 'Start Mixed Session',
        sessionProgress: 'Session Progress',
        question: 'Question',
        of: 'of',
        score: 'Score',
        loading: 'Loading questions...',
        selectTopicsFirst: 'Please select at least 2 topics to continue.',
        currentTopic: 'Current Topic'
      },
      es: {
        mixedTopicsQuiz: 'Quiz de Temas Mixtos',
        startSession: 'Iniciar Sesión Mixta',
        sessionProgress: 'Progreso de la Sesión',
        question: 'Pregunta',
        of: 'de',
        score: 'Puntuación',
        loading: 'Cargando preguntas...',
        selectTopicsFirst: 'Por favor selecciona al menos 2 temas para continuar.',
        currentTopic: 'Tema Actual'
      }
    }
    
    return texts[language] || texts.en
  }

  const texts = getTexts()

  // Load content for all selected topics
  const loadAllTopicsContent = async () => {
    const allConcepts = {}
    
    for (const topicId of selectedTopics) {
      try {
        const response = await fetch(`/learning/guides/${topicId}-${language}.md`)
        const content = await response.text()
        const concepts = extractConcepts(content)
        allConcepts[topicId] = concepts
      } catch (error) {
        console.error(`Error loading ${topicId}:`, error)
        allConcepts[topicId] = []
      }
    }
    
    return allConcepts
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
        if (currentConcept && currentDescription) {
          concepts.push({
            name: currentConcept,
            description: currentDescription.trim(),
            comparison: currentComparison.trim()
          })
        }
        
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

    if (currentConcept && currentDescription) {
      concepts.push({
        name: currentConcept,
        description: currentDescription.trim(),
        comparison: currentComparison.trim()
      })
    }

    return concepts
  }

  const generateMixedQuestions = (allConcepts) => {
    const questions = []
    
    selectedTopics.forEach(topicId => {
      const concepts = allConcepts[topicId] || []
      const topicQuestions = []
      
      concepts.slice(0, sessionConfig.questionsPerTopic).forEach((concept, index) => {
        const shouldIncludeFlashcard = sessionConfig.questionTypes === 'flashcard' || sessionConfig.questionTypes === 'both'
        const shouldIncludeMultipleChoice = sessionConfig.questionTypes === 'multiple-choice' || sessionConfig.questionTypes === 'both'
        
        if (shouldIncludeFlashcard && concept.description) {
          topicQuestions.push({
            id: questions.length + topicQuestions.length,
            type: 'flashcard',
            topic: topicId,
            concept: concept.name,
            description: concept.description,
            comparison: concept.comparison,
            cardType: 'description'
          })
        }
        
        if (shouldIncludeMultipleChoice && concept.description) {
          const wrongAnswers = concepts
            .filter(c => c.name !== concept.name && c.description)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(c => c.description)
          
          if (wrongAnswers.length >= 3) {
            topicQuestions.push({
              id: questions.length + topicQuestions.length,
              type: 'multiple-choice',
              topic: topicId,
              concept: concept.name,
              question: getMultipleChoiceQuestion(concept.name, 'definition'),
              correctAnswer: concept.description,
              options: shuffleArray([concept.description, ...wrongAnswers])
            })
          }
        }
      })
      
      questions.push(...topicQuestions)
    })
    
    return sessionConfig.sessionMode === 'mixed' ? shuffleArray(questions) : questions
  }

  const getMultipleChoiceQuestion = (conceptName, type) => {
    const questions = {
      en: {
        definition: `What is ${conceptName}?`
      },
      es: {
        definition: `¿Qué es ${conceptName}?`
      }
    }
    
    return questions[language]?.[type] || questions.en[type]
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startSession = async () => {
    if (selectedTopics.length < 2) return
    
    const allConcepts = await loadAllTopicsContent()
    const questions = generateMixedQuestions(allConcepts)
    
    setMixedQuestions(questions)
    setSessionStarted(true)
    setCurrentQuestionIndex(0)
    setShowAnswer(false)
    setReviewedQuestions([])
  }

  const handleAnswer = (isCorrect) => {
    const currentQuestion = mixedQuestions[currentQuestionIndex]
    const questionResult = {
      ...currentQuestion,
      isCorrect,
      timestamp: new Date()
    }
    
    setReviewedQuestions([...reviewedQuestions, questionResult])

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= mixedQuestions.length) {
        completeSession([...reviewedQuestions, questionResult])
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setShowAnswer(false)
      }
    }, 1500)
  }

  const handleRevealAnswer = () => {
    setShowAnswer(true)
  }

  const completeSession = (allReviewed) => {
    const report = generateSessionReport(allReviewed)
    setSessionReport(report)
    setSessionComplete(true)
  }

  const generateSessionReport = (reviewed) => {
    const totalQuestions = reviewed.length
    const totalCorrect = reviewed.filter(q => q.isCorrect).length
    const overallScore = Math.round((totalCorrect / totalQuestions) * 100)

    const topicStats = {}
    selectedTopics.forEach(topicId => {
      const topicQuestions = reviewed.filter(q => q.topic === topicId)
      const topicCorrect = topicQuestions.filter(q => q.isCorrect).length
      
      topicStats[topicId] = {
        correct: topicCorrect,
        total: topicQuestions.length,
        percentage: topicQuestions.length > 0 ? Math.round((topicCorrect / topicQuestions.length) * 100) : 0
      }
    })

    const recommendations = generateRecommendations(topicStats)

    return {
      totalQuestions,
      totalCorrect,
      overallScore,
      topics: topicStats,
      recommendations,
      sessionStats: {
        totalTime: 0, // Could be calculated if we track timing
        avgPerQuestion: 0
      }
    }
  }

  const generateRecommendations = (topicStats) => {
    const recommendations = []
    const weakTopics = Object.entries(topicStats)
      .filter(([_, stats]) => stats.percentage < 70)
      .map(([topicId, _]) => topics.find(t => t.id === topicId)?.name || topicId)

    if (weakTopics.length > 0) {
      recommendations.push(`Focus more on: ${weakTopics.join(', ')}`)
    }

    const strongTopics = Object.entries(topicStats)
      .filter(([_, stats]) => stats.percentage >= 80)
      .map(([topicId, _]) => topics.find(t => t.id === topicId)?.name || topicId)

    if (strongTopics.length > 0) {
      recommendations.push(`Great job with: ${strongTopics.join(', ')}`)
    }

    return recommendations
  }

  const restartSession = () => {
    setSessionStarted(false)
    setSessionComplete(false)
    setCurrentQuestionIndex(0)
    setMixedQuestions([])
    setSessionReport(null)
    setReviewedQuestions([])
  }

  const newSession = () => {
    restartSession()
    setSelectedTopics([])
  }

  const currentQuestion = mixedQuestions[currentQuestionIndex]
  const currentScore = reviewedQuestions.filter(q => q.isCorrect).length

  if (sessionComplete && sessionReport) {
    return (
      <div className="mixed-topics-quiz">
        <header className="quiz-header">
          <Link to="/" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1>{texts.mixedTopicsQuiz}</h1>
          <div className="desktop-language-toggle">
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </header>

        <DetailedReport
          sessionReport={sessionReport}
          topics={topics}
          language={language}
          onRestartSession={restartSession}
          onNewSession={newSession}
        />
      </div>
    )
  }

  if (sessionStarted && mixedQuestions.length > 0) {
    return (
      <div className="mixed-topics-quiz">
        <header className="quiz-header">
          <Link to="/" className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1>{texts.mixedTopicsQuiz}</h1>
          <div className="header-controls">
            <MobileMenu
              topics={topics}
              selectedTopic=""
              onTopicChange={() => {}}
              language={language}
              onLanguageChange={setLanguage}
              showModeSelector={false}
              showTopicSelector={false}
            />
            <div className="desktop-language-toggle">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </header>

        <div className="session-container">
          <div className="current-topic-indicator">
            <span className="topic-label">{texts.currentTopic}:</span>
            <span className="topic-name">
              {topics.find(t => t.id === currentQuestion?.topic)?.icon} {topics.find(t => t.id === currentQuestion?.topic)?.name}
            </span>
          </div>

          <main className="session-main">
            {currentQuestion.type === 'flashcard' ? (
              <FlashCard
                card={currentQuestion}
                showAnswer={showAnswer}
                onShowAnswer={handleRevealAnswer}
                onAnswer={handleAnswer}
                language={language}
              />
            ) : (
              <MultipleChoiceCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                language={language}
              />
            )}
          </main>
        </div>

        <footer className="session-progress-footer">
          <div className="progress-content">
            <div className="progress-info-compact">
              <span className="progress-label">{texts.sessionProgress}</span>
              <div className="progress-details">
                <span className="question-counter">
                  {texts.question} {currentQuestionIndex + 1}/{mixedQuestions.length}
                </span>
                <span className="score-display">
                  {texts.score}: {currentScore}/{reviewedQuestions.length}
                  {reviewedQuestions.length > 0 && (
                    <span className="accuracy"> • {Math.round((currentScore / reviewedQuestions.length) * 100)}%</span>
                  )}
                </span>
              </div>
            </div>
            <ProgressBar 
              current={currentQuestionIndex + 1} 
              total={mixedQuestions.length}
              correct={currentScore}
            />
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="mixed-topics-quiz">
      <header className="quiz-header">
        <Link to="/" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1>{texts.mixedTopicsQuiz}</h1>
        <div className="header-controls">
          <MobileMenu
            topics={topics}
            selectedTopic=""
            onTopicChange={() => {}}
            language={language}
            onLanguageChange={setLanguage}
            showModeSelector={false}
            showTopicSelector={false}
          />
          <div className="desktop-language-toggle">
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <div className="setup-container">
        <MultiTopicSelector
          topics={topics}
          selectedTopics={selectedTopics}
          onSelectionChange={setSelectedTopics}
          language={language}
        />

        {selectedTopics.length >= 2 && (
          <SessionConfig
            selectedTopics={selectedTopics}
            topics={topics}
            onConfigChange={setSessionConfig}
            language={language}
          />
        )}

        <div className="start-session-container">
          {selectedTopics.length < 2 ? (
            <div className="warning-message">
              <span className="warning-icon">⚠️</span>
              {texts.selectTopicsFirst}
            </div>
          ) : (
            <button 
              className="start-session-btn"
              onClick={startSession}
            >
              {texts.startSession}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MixedTopicsQuiz
