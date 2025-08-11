import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { SiJavascript, SiNextdotjs, SiNestjs, SiNodedotjs, SiGit, SiReact, SiTypescript } from 'react-icons/si'
import { FaBuilding, FaUniversalAccess, FaTools, FaCogs, FaVial, FaMobile, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import SearchBar from '../components/SearchBar'
import TopicSelector from '../components/TopicSelector'
import MultiTopicDropdown from '../components/MultiTopicDropdown'
import LanguageToggle from '../components/LanguageToggle'
import ContentIndex from '../components/ContentIndex'
import MobileMenu from '../components/MobileMenu'
import Modal from '../components/Modal'
import './StartLearning.css'
import '../styles/markdown-tables.css'

function StartLearning() {
  const [selectedTopics, setSelectedTopics] = useState(['javascript']) // Changed to array
  const [language, setLanguage] = useState('en')
  const [markdownContents, setMarkdownContents] = useState({}) // Changed to object for multiple topics
  const [searchResults, setSearchResults] = useState([])
  const [selectedConcept, setSelectedConcept] = useState(null)
  const [showExampleModal, setShowExampleModal] = useState(false)
  const [contentIndices, setContentIndices] = useState({}) // Changed to object for multiple topics

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

  useEffect(() => {
    loadAllTopicsContent()
  }, [selectedTopics, language])

  const loadAllTopicsContent = async () => {
    const allContents = {}
    const allIndices = {}

    for (const topicId of selectedTopics) {
      try {
        const response = await fetch(`/learning/guides/${topicId}-${language}.md`)
        const content = await response.text()
        allContents[topicId] = content
        allIndices[topicId] = parseContentIndex(content, topicId)
      } catch (error) {
        console.error(`Error loading ${topicId}:`, error)
        allContents[topicId] = ''
        allIndices[topicId] = []
      }
    }

    setMarkdownContents(allContents)
    setContentIndices(allIndices)
    setSelectedConcept(null)
    setShowExampleModal(false)
  }

  const parseContentIndex = (content, topicId) => {
    const lines = content.split('\n')
    const index = []

    lines.forEach((line, i) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '')
        const topic = topics.find(t => t.id === topicId)
        index.push({
          title,
          line: i,
          id: `${topicId}-${title.toLowerCase().replace(/\s+/g, '-')}`, // Make unique across topics
          topicId, // Add topic information
          topicName: topic?.name || topicId,
          topicIcon: topic?.icon || '📚' // This will be a React component now
        })
      }
    })

    return index
  }

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results = []

    // Search across all selected topics
    selectedTopics.forEach(topicId => {
      const content = markdownContents[topicId]
      const index = contentIndices[topicId] || []

      if (!content) return

      const lines = content.split('\n')

      index.forEach(concept => {
        if (concept.title.toLowerCase().includes(query.toLowerCase())) {
          const startLine = concept.line
          let endLine = lines.length

          // Find the end of this concept (next ## or end of file)
          for (let i = startLine + 1; i < lines.length; i++) {
            if (lines[i].startsWith('## ')) {
              endLine = i
              break
            }
          }

          const conceptContent = lines.slice(startLine, endLine).join('\n')
          results.push({
            title: concept.title,
            content: conceptContent,
            id: `${topicId}-${concept.id}`, // Make unique across topics
            topicId: concept.topicId,
            topicName: concept.topicName,
            topicIcon: topics.find(t => t.id === topicId)?.icon || '📚' // React component
          })
        }
      })
    })

    setSearchResults(results)
  }

  const handleConceptSelect = (concept) => {
    // Check if the concept already has content (from ContentIndex) or needs to be processed (from MobileMenu)
    if (concept.content && concept.content.startsWith('## ')) {
      // Already processed by ContentIndex component or search
      setSelectedConcept(concept)
    } else {
      // Need to extract content from markdown (from MobileMenu)
      const topicId = concept.topicId
      const markdownContent = markdownContents[topicId]

      if (!markdownContent) return

      const lines = markdownContent.split('\n')
      const startLine = concept.line
      let endLine = lines.length

      // Find the end of this concept (next ## or end of file)
      for (let i = startLine + 1; i < lines.length; i++) {
        if (lines[i].startsWith('## ')) {
          endLine = i
          break
        }
      }

      const conceptContent = lines.slice(startLine, endLine).join('\n')

      const conceptData = {
        title: concept.title,
        content: conceptContent,
        id: concept.id,
        topicId: concept.topicId,
        topicName: concept.topicName,
        topicIcon: topics.find(t => t.id === topicId)?.icon || '📚' // React component
      }

      setSelectedConcept(conceptData)
    }

    setShowExampleModal(false)
    setSearchResults([])
  }

  const renderConceptContent = (content) => {
    // Always show content without examples (examples will be in modal)
    const lines = content.split('\n')
    const filteredLines = []
    let skipExample = false

    lines.forEach(line => {
      if (line.includes('**Example:**') || line.includes('**Ejemplo:**')) {
        skipExample = true
        return
      }
      if (line.includes('**Comparison:**') || line.includes('**Comparación:**')) {
        skipExample = false
      }
      if (!skipExample) {
        filteredLines.push(line)
      }
    })

    return filteredLines.join('\n')
  }

  const extractExampleContent = (content) => {
    const lines = content.split('\n')
    const exampleLines = []
    let inExample = false

    lines.forEach(line => {
      if (line.includes('**Example:**') || line.includes('**Ejemplo:**')) {
        inExample = true
        exampleLines.push(line)
        return
      }
      if (line.includes('**Comparison:**') || line.includes('**Comparación:**')) {
        inExample = false
        return
      }
      if (inExample) {
        exampleLines.push(line)
      }
    })

    return exampleLines.join('\n')
  }

  // Navigation functions for concept display
  const getAllConcepts = () => {
    return Object.values(contentIndices).flat()
  }

  const getCurrentConceptIndex = () => {
    if (!selectedConcept) return -1
    const allConcepts = getAllConcepts()
    return allConcepts.findIndex(concept => concept.id === selectedConcept.id)
  }

  const navigateToConcept = (direction) => {
    const allConcepts = getAllConcepts()
    const currentIndex = getCurrentConceptIndex()

    if (currentIndex === -1) return

    let newIndex
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % allConcepts.length // Wrap to beginning
    } else {
      newIndex = currentIndex === 0 ? allConcepts.length - 1 : currentIndex - 1 // Wrap to end
    }

    const newConcept = allConcepts[newIndex]
    handleConceptSelect(newConcept)
  }

  const canNavigate = () => {
    return getAllConcepts().length > 1 && selectedConcept
  }

  return (
    <div className="start-learning">
      <header className="learning-header">
        <Link to="/" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1>Start Learning</h1>
        <div className="header-controls">
          <MultiTopicDropdown
            topics={topics}
            selectedTopics={selectedTopics}
            onSelectionChange={setSelectedTopics}
            language={language}
          />
          <MobileMenu
            topics={topics}
            selectedTopic={selectedTopics[0] || 'javascript'} // Use first selected topic for mobile menu
            onTopicChange={(topicId) => setSelectedTopics([topicId])} // Convert back to single selection for mobile
            language={language}
            onLanguageChange={setLanguage}
            showModeSelector={false}
            contentIndex={Object.values(contentIndices).flat()} // Flatten all indices
            onConceptSelect={handleConceptSelect}
            showTopicSelector={false}
          />
          <div className="desktop-language-toggle">
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      <div className="learning-container">
        <aside className="sidebar">
          <ContentIndex
            index={Object.values(contentIndices).flat()} // Show all indices from all topics
            onConceptSelect={handleConceptSelect}
            markdownContent={Object.values(markdownContents).join('\n\n')} // Combine all content
            topics={topics} // Pass topics information for icons
          />
        </aside>

        <main className="main-content">
          <SearchBar onSearch={handleSearch} />

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results:</h3>
              {searchResults.map(result => (
                <div key={result.id} className="search-result-item">
                  <div className="result-header">
                    <h4>{result.title}</h4>
                    <span className="topic-badge">
                      {result.topicIcon} {result.topicName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleConceptSelect(result)}
                    className="select-concept-btn"
                  >
                    Read More
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedConcept ? (
            <div className="concept-display">
              <div className="concept-header">
                <div className="concept-title">
                  {selectedConcept.topicName && (
                    <span className="concept-topic-badge">
                      {selectedConcept.topicIcon} {selectedConcept.topicName}
                    </span>
                  )}
                </div>
              </div>
              <div className="markdown-content">
                <button
                  onClick={() => setShowExampleModal(true)}
                  className="example-toggle-btn"
                >
                  Show Example
                </button>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {renderConceptContent(selectedConcept.content)}
                </ReactMarkdown>
              </div>
              <div className="concept-actions">
                {canNavigate() && (
                  <div className="concept-navigation">
                    <button
                      onClick={() => navigateToConcept('previous')}
                      className="nav-btn prev-btn"
                      title="Previous concept"
                    >
                      <FaChevronLeft />
                      <span>Previous</span>
                    </button>
                    <span className="concept-position">
                      {getCurrentConceptIndex() + 1} of {getAllConcepts().length}
                    </span>
                    <button
                      onClick={() => navigateToConcept('next')}
                      className="nav-btn next-btn"
                      title="Next concept"
                    >
                      <span>Next</span>
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to Multi-Topic Learning</h2>
              <div className="selected-topics-preview">
                {selectedTopics.map(topicId => {
                  const topic = topics.find(t => t.id === topicId)
                  return (
                    <div key={topicId} className="topic-preview-card">
                      <span className="topic-icon">{topic?.icon}</span>
                      <span className="topic-name">{topic?.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Example Modal */}
      <Modal
        isOpen={showExampleModal}
        onClose={() => setShowExampleModal(false)}
        title={`${selectedConcept?.title} - Example`}
      >
        {selectedConcept && (
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {extractExampleContent(selectedConcept.content)}
            </ReactMarkdown>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StartLearning
