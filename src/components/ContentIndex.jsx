import './ContentIndex.css'

function ContentIndex({ index, onConceptSelect, markdownContent, topics = [] }) {
  const handleConceptClick = (concept) => {
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
      topicIcon: concept.topicIcon || topics.find(t => t.id === concept.topicId)?.icon
    }
    
    onConceptSelect(conceptData)
  }

  const getTopicIcon = (concept) => {
    if (concept.topicIcon) return concept.topicIcon
    if (concept.topicId) {
      const topic = topics.find(t => t.id === concept.topicId)
      return topic?.icon || '📚'
    }
    return '📚'
  }

  return (
    <div className="content-index">
      <h3>Content Index</h3>
      <div className="index-list">
        {index.map(concept => (
          <button
            key={concept.id}
            onClick={() => handleConceptClick(concept)}
            className="index-item"
          >
            <span className="topic-icon">{getTopicIcon(concept)}</span>
            <span className="concept-title">{concept.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ContentIndex
