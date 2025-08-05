import './ContentIndex.css'

function ContentIndex({ index, onConceptSelect, markdownContent }) {
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
      id: concept.id
    }
    
    onConceptSelect(conceptData)
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
            {concept.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ContentIndex
