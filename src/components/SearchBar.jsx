import { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    
    // Real-time search with debouncing
    if (newQuery.trim()) {
      onSearch(newQuery)
    } else {
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for concepts (e.g., 'middleware', 'components')"
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </div>
    </form>
  )
}

export default SearchBar
