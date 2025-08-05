import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import SearchBar from '../components/SearchBar'
import TopicSelector from '../components/TopicSelector'
import LanguageToggle from '../components/LanguageToggle'
import ContentIndex from '../components/ContentIndex'
import MobileMenu from '../components/MobileMenu'
import './StartLearning.css'

function StartLearning() {
  const [selectedTopic, setSelectedTopic] = useState('next')
  const [language, setLanguage] = useState('en')
  const [markdownContent, setMarkdownContent] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedConcept, setSelectedConcept] = useState(null)
  const [showExample, setShowExample] = useState(false)
  const [contentIndex, setContentIndex] = useState([])

  const topics = [
    { id: 'next', name: 'Next.js', icon: '⚛️' },
    { id: 'nest', name: 'NestJS', icon: '🪶' }
  ]

  useEffect(() => {
    loadMarkdownContent()
  }, [selectedTopic, language])

  const loadMarkdownContent = async () => {
    try {
      const response = await fetch(`/learning/guides/${selectedTopic}-${language}.md`)
      const content = await response.text()
      setMarkdownContent(content)
      parseContentIndex(content)
      setSelectedConcept(null)
      setShowExample(false)
    } catch (error) {
      console.error('Error loading markdown:', error)
    }
  }

  const parseContentIndex = (content) => {
    const lines = content.split('\n')
    const index = []
    
    lines.forEach((line, i) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '')
        index.push({
          title,
          line: i,
          id: title.toLowerCase().replace(/\s+/g, '-')
        })
      }
    })
    
    setContentIndex(index)
  }

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const lines = markdownContent.split('\n')
    const results = []
    
    contentIndex.forEach(concept => {
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
          id: concept.id
        })
      }
    })
    
    setSearchResults(results)
  }

  const handleConceptSelect = (concept) => {
    // Check if the concept already has content (from ContentIndex) or needs to be processed (from MobileMenu)
    if (concept.content && concept.content.startsWith('## ')) {
      // Already processed by ContentIndex component
      setSelectedConcept(concept)
    } else {
      // Need to extract content from markdown (from MobileMenu)
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
        id: concept.id
      }
      
      setSelectedConcept(conceptData)
    }
    
    setShowExample(false)
    setSearchResults([])
  }

  const renderConceptContent = (content) => {
    if (!showExample) {
      // Remove example sections from content
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
    
    return content
  }

  return (
    <div className="start-learning">
      <header className="learning-header">
        <Link to="/" className="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1>Start Learning</h1>
        <div className="header-controls">
          <TopicSelector 
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            language={language}
          />
          <MobileMenu
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            language={language}
            onLanguageChange={setLanguage}
            showModeSelector={false}
            contentIndex={contentIndex}
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
            index={contentIndex}
            onConceptSelect={handleConceptSelect}
            markdownContent={markdownContent}
          />
        </aside>

        <main className="main-content">
          <SearchBar onSearch={handleSearch} />
          
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results:</h3>
              {searchResults.map(result => (
                <div key={result.id} className="search-result-item">
                  <h4>{result.title}</h4>
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
              <div className="concept-actions">
                <button 
                  onClick={() => setShowExample(!showExample)}
                  className="example-toggle-btn"
                >
                  {showExample ? 'Hide Example' : 'Show Example'}
                </button>
              </div>
              
              <div className="markdown-content">
                <ReactMarkdown>
                  {renderConceptContent(selectedConcept.content)}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to {topics.find(t => t.id === selectedTopic)?.name} Guide</h2>
              <p>Use the search bar to find specific concepts, or browse the index on the left to explore all available topics.</p>
              <div className="topic-preview">
                <ReactMarkdown>
                  {markdownContent.split('\n').slice(0, 10).join('\n')}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default StartLearning
