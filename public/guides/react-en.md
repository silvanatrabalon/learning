# React - Learning Guide

## Props & State
**Description:** Props are immutable data passed from parent components to child components, while State is the internal mutable state of a component that can change over time.

**Example:**
```javascript
// Component with Props
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Component with State using useState
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <div>
        <label>Step: 
          <input 
            type="number" 
            value={step} 
            onChange={(e) => setStep(Number(e.target.value))} 
          />
        </label>
      </div>
      <button onClick={increment}>+{step}</button>
      <button onClick={decrement}>-{step}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Using component with props
function App() {
  const users = [
    { id: 1, name: "Ana García", email: "ana@email.com", avatar: "/avatars/ana.jpg" },
    { id: 2, name: "Luis Martín", email: "luis@email.com", avatar: "/avatars/luis.jpg" }
  ];

  return (
    <div>
      <Counter />
      {users.map(user => (
        <UserCard 
          key={user.id}
          name={user.name}
          email={user.email}
          avatar={user.avatar}
        />
      ))}
    </div>
  );
}
```

**Comparison:** 
| Concept           | Props                                         | State                              |
|-------------------|-----------------------------------------------|----------------------------------|
| Mutability        | Immutable                                    | Mutable                          |
| Data flow         | Flow downward (from parent to child component) | Local to component               |
| Purpose           | Communication between components             | Internal data management         |
| Modification      | Cannot be modified by the receiving component | Can be modified within the component |


## Presentational vs Container Components
**Description:** Presentational components focus on how things look (UI), while container components focus on how things work (business logic and state).

**Example:**
```javascript
// Presentational Component - UI only
function ProductCard({ product, onAddToCart, isLoading }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="description">{product.description}</p>
      <button 
        onClick={() => onAddToCart(product.id)}
        disabled={isLoading}
        className="add-to-cart-btn"
      >
        {isLoading ? 'Adding...' : 'Add to cart'}
      </button>
    </div>
  );
}

// Container Component - business logic
import { useState, useEffect } from 'react';

function ProductContainer({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (id) => {
    try {
      setAdding(true);
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: 1 })
      });
      // Show success notification
      alert('Product added to cart');
    } catch (err) {
      alert('Error adding to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <ProductCard 
      product={product}
      onAddToCart={handleAddToCart}
      isLoading={adding}
    />
  );
}

// Product list with clear separation
function ProductsList() {
  const [productIds] = useState([1, 2, 3, 4, 5]);

  return (
    <div className="products-grid">
      {productIds.map(id => (
        <ProductContainer key={id} productId={id} />
      ))}
    </div>
  );
}
```

**Comparison:** Presentational vs Container - Presentational components are more reusable and easier to test, containers handle complex logic. This separation improves maintainability and code architecture.

## Data Binding / Lifting State
**Description:** Technique to share state between sibling components by lifting the state to the common parent component and passing it down through props.

**Example:**
```javascript
import React, { useState } from 'react';

// Child component that displays data
function UserProfile({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  const handleSave = () => {
    onUpdateUser(tempUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUser(user);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="user-profile editing">
        <h2>Edit Profile</h2>
        <input
          type="text"
          value={tempUser.name}
          onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
          placeholder="Name"
        />
        <input
          type="email"
          value={tempUser.email}
          onChange={(e) => setTempUser({...tempUser, email: e.target.value})}
          placeholder="Email"
        />
        <input
          type="text"
          value={tempUser.role}
          onChange={(e) => setTempUser({...tempUser, role: e.target.value})}
          placeholder="Role"
        />
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}

// Child component that displays statistics
function UserStats({ user, activities }) {
  const userActivities = activities.filter(activity => activity.userId === user.id);
  
  return (
    <div className="user-stats">
      <h3>Statistics</h3>
      <p>Total activities: {userActivities.length}</p>
      <p>Last login: {user.lastLogin}</p>
      <p>Member since: {user.joinDate}</p>
      <div className="recent-activities">
        <h4>Recent Activities:</h4>
        {userActivities.slice(0, 3).map(activity => (
          <div key={activity.id} className="activity-item">
            <span>{activity.action}</span>
            <small>{activity.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// Parent component that manages lifted state
function UserDashboard() {
  // Lifted state - shared between child components
  const [user, setUser] = useState({
    id: 1,
    name: 'María González',
    email: 'maria@email.com',
    role: 'Developer',
    lastLogin: '2024-01-15 10:30',
    joinDate: '2023-06-01'
  });

  const [activities] = useState([
    { id: 1, userId: 1, action: 'System login', date: '2024-01-15 10:30' },
    { id: 2, userId: 1, action: 'Updated profile', date: '2024-01-14 15:20' },
    { id: 3, userId: 1, action: 'Uploaded file', date: '2024-01-14 14:10' },
    { id: 4, userId: 1, action: 'Commented on project', date: '2024-01-13 16:45' }
  ]);

  // Function to update user (passed as prop)
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    // Here you could make an API call
    console.log('User updated:', updatedUser);
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-grid">
        <UserProfile 
          user={user} 
          onUpdateUser={handleUpdateUser} 
        />
        <UserStats 
          user={user} 
          activities={activities} 
        />
      </div>
    </div>
  );
}

// Advanced example with context for global state
const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      updateUser: setUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use context
function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

**Comparison:** Lifting State vs Context API - Lifting state is ideal for few component levels, Context API is better for global state that needs to be accessed by many dispersed components in the tree.

## Virtual DOM & Keys
**Description:** is an in-memory representation of the real DOM that React uses to optimize updates. Keys help React identify which elements have changed.

**Example:**
```javascript
import React, { useState } from 'react';

// Incorrect example - without keys or incorrect keys
function BadTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: `New task ${todos.length + 1}`,
      completed: false
    };
    setTodos([newTodo, ...todos]); // Adding to the beginning
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h3>❌ INCORRECT Example (without proper keys)</h3>
      <button onClick={addTodo}>Add task</button>
      <ul>
        {todos.map((todo, index) => (
          // ❌ Using index as key is problematic
          <li key={index} style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            backgroundColor: todo.completed ? '#f0f0f0' : 'white'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos(todos.map(t => 
                  t.id === todo.id ? {...t, completed: !t.completed} : t
                ));
              }}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Correct example - with appropriate keys
function GoodTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: true },
    { id: 3, text: 'Deploy to production', completed: false }
  ]);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(), // Unique ID based on timestamp
      text: `New task ${todos.length + 1}`,
      completed: false
    };
    setTodos([newTodo, ...todos]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ));
  };

  return (
    <div>
      <h3>✅ CORRECT Example (with appropriate keys)</h3>
      <button onClick={addTodo}>Add task</button>
      <ul>
        {todos.map(todo => (
          // ✅ Using unique ID as key
          <li key={todo.id} style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none',
            backgroundColor: todo.completed ? '#f0f0f0' : 'white',
            padding: '8px',
            margin: '4px 0',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ marginLeft: '8px', marginRight: '8px' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Optimization example with Virtual DOM
function OptimizedList() {
  const [items, setItems] = useState(
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 100
    }))
  );

  const [filter, setFilter] = useState('');

  // Filter items based on filter
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const updateRandomItems = () => {
    setItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        value: Math.random() * 100 // Only some values will change
      }))
    );
  };

  return (
    <div>
      <h3>Optimized List with Virtual DOM</h3>
      <div>
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={updateRandomItems}>
          Update random values
        </button>
      </div>
      <p>Showing {filteredItems.length} of {items.length} items</p>
      
      {/* Virtual DOM optimizes these updates */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredItems.slice(0, 100).map(item => (
          <div
            key={item.id} // Unique key for optimization
            style={{
              padding: '5px',
              margin: '2px 0',
              backgroundColor: item.value > 50 ? '#e8f5e8' : '#f5f5f5',
              borderLeft: `4px solid ${item.value > 50 ? 'green' : 'gray'}`
            }}
          >
            {item.name} - Value: {item.value.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

// React.Fragment example
function FragmentExample() {
  return (
    <>
      <h3>Using React.Fragment</h3>
      <p>Fragments allow grouping elements without adding extra nodes to the DOM.</p>
      <GoodTodoList />
      <OptimizedList />
    </>
  );
}

// Performance comparison
function PerformanceComparison() {
  const [renderCount, setRenderCount] = useState(0);

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div>
      <p>This component has rendered {renderCount} times</p>
      <FragmentExample />
    </div>
  );
}
```

**Comparison:** Virtual DOM vs Real DOM - The Virtual DOM allows React to make efficient updates by comparing virtual versions before touching the real DOM. Correct keys prevent unnecessary re-renders and maintain component state.

## useState Hook
**Description:** Fundamental hook for adding local state to functional components, providing a state value and a function to update it.

**Example:**
```javascript
import React, { useState } from 'react';

// Basic usage of useState
function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You have clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// useState with objects
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        [preference]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User submitted:', user);
    alert('User saved successfully');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd' }}>
      <h3>User Form</h3>
      
      <div>
        <label>Name: </label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Email: </label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Age: </label>
        <input
          type="number"
          value={user.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
        />
      </div>

      <div>
        <h4>Preferences</h4>
        <label>
          Theme: 
          <select 
            value={user.preferences.theme}
            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={user.preferences.notifications}
            onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
          />
          Receive notifications
        </label>
      </div>

      <button type="submit">Save User</button>
      
      <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '10px' }}>
        <h4>Current data:</h4>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </form>
  );
}

// useState with arrays
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h3>Todo App with useState</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What do you need to do?"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={addTodo} style={{ marginLeft: '10px', padding: '8px' }}>
          Add
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setFilter('all')}
          style={{ 
            backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
            color: filter === 'all' ? 'white' : 'black',
            margin: '0 5px',
            padding: '5px 10px'
          }}
        >
          All ({todos.length})
        </button>
        <button 
          onClick={() => setFilter('active')}
          style={{ 
            backgroundColor: filter === 'active' ? '#007bff' : '#f8f9fa',
            color: filter === 'active' ? 'white' : 'black',
            margin: '0 5px',
            padding: '5px 10px'
          }}
        >
          Active ({activeCount})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          style={{ 
            backgroundColor: filter === 'completed' ? '#007bff' : '#f8f9fa',
            color: filter === 'completed' ? 'white' : 'black',
            margin: '0 5px',
            padding: '5px 10px'
          }}
        >
          Completed ({todos.length - activeCount})
        </button>
        
        {todos.some(todo => todo.completed) && (
          <button onClick={clearCompleted} style={{ marginLeft: '20px', padding: '5px 10px' }}>
            Clear completed
          </button>
        )}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li 
            key={todo.id}
            style={{ 
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#666' : 'black'
              }}>
                {todo.text}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{ 
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          {filter === 'all' ? 'No tasks' : `No ${filter === 'active' ? 'active' : 'completed'} tasks`}
        </p>
      )}
    </div>
  );
}

// useState with lazy initialization
function ExpensiveComponent() {
  // Function only executes once, on first render
  const [expensiveValue, setExpensiveValue] = useState(() => {
    console.log('Expensive calculation executed');
    // Simulate expensive calculation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  });

  const recalculate = () => {
    setExpensiveValue(() => {
      console.log('Recalculating...');
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.random();
      }
      return result;
    });
  };

  return (
    <div>
      <h3>Lazy Initialization</h3>
      <p>Calculated value: {expensiveValue.toFixed(2)}</p>
      <button onClick={recalculate}>Recalculate</button>
    </div>
  );
}

// Complete example
function UseStateExample() {
  return (
    <div>
      <SimpleCounter />
      <hr />
      <UserForm />
      <hr />
      <TodoApp />
      <hr />
      <ExpensiveComponent />
    </div>
  );
}
```

**Comparison:** useState vs Normal variable - useState persists the value between re-renders and triggers updates when it changes, while normal variables reset on each render and don't cause updates.

## useEffect Hook
**Description:** Hook for handling side effects in functional components, such as API calls, subscriptions, DOM manipulation, and resource cleanup.

**Example:**
```javascript
import React, { useState, useEffect } from 'react';

// Basic useEffect - equivalent to componentDidMount and componentDidUpdate
function BasicEffect() {
  const [count, setCount] = useState(0);

  // Executes after every render
  useEffect(() => {
    document.title = `Counter: ${count}`;
    console.log('useEffect executed, count:', count);
  });

  return (
    <div>
      <h3>Basic useEffect</h3>
      <p>Counter: {count}</p>
      <p>Check the page title</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// useEffect with dependency array
function EffectWithDependencies() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(false);

  // Only executes when userId changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData = {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@email.com`,
          avatar: `https://picsum.photos/100/100?random=${userId}`
        };
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Only executes when userId changes

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h3>useEffect with Dependencies</h3>
      
      <div>
        <label>User ID: </label>
        <select 
          value={userId} 
          onChange={(e) => setUserId(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(id => (
            <option key={id} value={id}>User {id}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading user...</p>
      ) : user ? (
        <div style={{ marginTop: '20px' }}>
          <img src={user.avatar} alt={user.name} style={{ borderRadius: '50%' }} />
          <h4>{user.name}</h4>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p>Could not load user</p>
      )}
    </div>
  );
}

// useEffect with cleanup function
function TimerComponent() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    // Cleanup function - equivalent to componentWillUnmount
    return () => {
      if (interval) {
        clearInterval(interval);
        console.log('Timer cleaned up');
      }
    };
  }, [isActive]); // Executes when isActive changes

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h3>Timer with Cleanup</h3>
      <div style={{ fontSize: '2em', marginBottom: '20px' }}>
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>
      <button onClick={toggle}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset} style={{ marginLeft: '10px' }}>
        Reset
      </button>
    </div>
  );
}

// useEffect only on mount (empty array)
function OnMountEffect() {
  const [data, setData] = useState(null);
  const [renderCount, setRenderCount] = useState(0);

  // Only executes once, when component mounts
  useEffect(() => {
    console.log('Component mounted - only once');
    
    const fetchData = async () => {
      // Simulate initial data loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData({
        appName: 'My React Application',
        version: '1.0.0',
        loadTime: new Date().toISOString()
      });
    };

    fetchData();
  }, []); // Empty array = only executes on mount

  // This useEffect executes on every render
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e8' }}>
      <h3>useEffect only on Mount</h3>
      <p>Renders: {renderCount}</p>
      
      {data ? (
        <div>
          <h4>{data.appName}</h4>
          <p>Version: {data.version}</p>
          <p>Loaded at: {new Date(data.loadTime).toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading initial data...</p>
      )}
      
      <button onClick={() => {}}>Re-render (doesn't affect useEffect with [])</button>
    </div>
  );
}

// Multiple useEffect to separate concerns
function MultipleEffects() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [online, setOnline] = useState(navigator.onLine);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Effect for window size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect for connection status
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Effect for mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff3cd', minHeight: '200px' }}>
      <h3>Multiple useEffect</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div>
          <h4>Window</h4>
          <p>Width: {windowWidth}px</p>
        </div>
        <div>
          <h4>Connection</h4>
          <p>Status: {online ? '🟢 Online' : '🔴 Offline'}</p>
        </div>
        <div>
          <h4>Mouse</h4>
          <p>X: {mousePosition.x}</p>
          <p>Y: {mousePosition.y}</p>
        </div>
      </div>
    </div>
  );
}

// useEffect with async/await (correct pattern)
function AsyncEffect() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We can't make useEffect async directly
    // But we can create an async function inside
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        
        if (!response.ok) {
          throw new Error('Error loading posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Async useEffect</h3>
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0',
            borderRadius: '5px'
          }}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Complete example
function UseEffectExamples() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div>
      <BasicEffect />
      <EffectWithDependencies />
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setShowTimer(!showTimer)}>
          {showTimer ? 'Hide Timer' : 'Show Timer'}
        </button>
        {showTimer && <TimerComponent />}
      </div>
      
      <OnMountEffect />
      <MultipleEffects />
      <AsyncEffect />
    </div>
  );
}
```

**Comparison:** useEffect vs class lifecycle methods - useEffect combines componentDidMount, componentDidUpdate, and componentWillUnmount into a single API, allowing better logical organization and less repetitive code.
| Dependency Array           | Behavior                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------- |
| No dependency array        | Runs **after every render**, including the first one.                                   |
| Empty array `[]`           | Runs **only once** after the first render (when the component mounts).                  |
| Array with state variables | Runs **after the first render** and **whenever any of the listed dependencies change**. |


## useCallback & useMemo
**Description:**  
- **useCallback**: Memoizes a function so it's not recreated on every render, avoiding unnecessary renders in child components.  
- **useMemo**: Memoizes the result of an expensive calculation to avoid recalculating it on every render.  

**Example:**
```javascript
import React, { useState, useCallback, useMemo } from 'react';

function ExpensiveList({ items, onItemClick }) {
  console.log('Rendering list...');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

const MemoizedList = React.memo(ExpensiveList);

function App() {
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');

  const items = useMemo(() => {
    console.log('Filtering items...');
    return [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' }
    ].filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  const handleItemClick = useCallback((id) => {
    alert(`Clicked on item ${id}`);
  }, []);

  return (
    <div>
      <h3>useCallback & useMemo</h3>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter..."
      />
      <MemoizedList items={items} onItemClick={handleItemClick} />
      <button onClick={() => setCount(count + 1)}>Increment ({count})</button>
    </div>
  );
}
```

**Comparison:**  
| Hook         | Main use                                    | Memoizes |
|--------------|---------------------------------------------|----------|
| useCallback  | Functions                                   | Yes      |
| useMemo      | Values/expensive calculations               | Yes      |

---

## React.memo
**Description:**  
Is a function that wraps a component so it only re-renders if its props change.

**Example:**
```javascript
import React from 'react';

const Child = React.memo(({ value }) => {
  console.log('Rendering Child...');
  return <div>Value: {value}</div>;
});

function Parent() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <Child value="Constant" />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
```

**Comparison:**  
React.memo ≈ PureComponent for functional components. Prevents unnecessary renders if props don't change.

## New Hooks in React 19
**Description:**  
React 19 introduces new hooks like:  
- **useOptimistic**: To show immediate UI changes before server confirmation.  
- **useFormStatus** and **useFormState**: Form handling with transitions and state.  

**Example:**
```javascript
import { useOptimistic, useState } from 'react';

function CommentForm({ onSubmit }) {
  const [comments, setComments] = useState([]);
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment) => [...state, newComment]
  );

  const handleSubmit = async (text) => {
    addOptimisticComment({ id: Date.now(), text });
    await onSubmit(text); // Simulate API call
  };

  return (
    <div>
      <ul>
        {optimisticComments.map(c => (
          <li key={c.id}>{c.text}</li>
        ))}
      </ul>
      <button onClick={() => handleSubmit('New comment')}>
        Add comment
      </button>
    </div>
  );
}
```

**Comparison:**  
The new hooks in React 19 are focused on **more responsive UI**, **better form handling**, and **optimistic updates**.


## useRef
**Description:**  
Allows creating a mutable reference that persists between renders without triggering re-renders when changed.

**Example:**
```javascript
import React, { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Write something..." />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}
```

**Comparison:**  
useRef ≠ state. Changing `.current` doesn't re-render the component.

## useContext / Context API
**Description:**  
Allows sharing global state and functions without manually passing props.

**Example:**
```javascript
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}
```

**Comparison:**  
Context API avoids **prop drilling** (passing props through multiple levels).


## React Router (v6+)
**Description:**  
Standard library for handling routes in React SPA applications, enabling declarative navigation.

**Example:**
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

function Home() {
  return <h2>Home Page</h2>;
}

function About() {
  return <h2>About</h2>;
}

function User() {
  const { id } = useParams();
  return <h3>User ID: {id}</h3>;
}

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/about">About</Link> | 
        <Link to="/user/42">User</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </Router>
  );
}
```

**Comparison:**  
React Router vs Manual navigation: React Router manages history and updates UI declaratively.

## React Query
**Description:**  
Library for remote data management (fetching, caching, synchronization), optimizing API calls.

**Example:**
```javascript
import React from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  return res.json();
}

function Posts() {
  const { data, error, isLoading } = useQuery(['posts'], fetchPosts);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <ul>
      {data.slice(0, 5).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default Posts;
```

**Comparison:**  
React Query vs useEffect + useState: React Query handles caching, retries, invalidation, and data synchronization automatically.

## Suspense and Lazy Loading
**Description:**  
Allows loading components lazily and showing a fallback while they load.

**Example:**
```javascript
import React, { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <h1>Lazy Loading Example</h1>
      <Suspense fallback={<p>Loading heavy component...</p>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

**Comparison:**  
Suspense + lazy avoids loading all code at once, improving initial performance.

## Error Boundaries
**Description:**  
Components that catch errors in their children and show a fallback.

**Example:**
```javascript
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>An error occurred in the component.</h2>;
    }
    return this.props.children;
  }
}

function ProblematicComponent() {
  throw new Error('Example Error');
}

export default function App() {
  return (
    <ErrorBoundary>
      <ProblematicComponent />
    </ErrorBoundary>
  );
}
```

**Comparison:**  
Error boundaries only work for rendering errors and lifecycle, not for events or async.

## Portals
**Description:**  
Render content outside the parent component's DOM.

**Example:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom';

function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}

export default function App() {
  return (
    <div>
      <h1>Main app</h1>
      <Modal>
        <p>This is a modal</p>
      </Modal>
    </div>
  );
}
```

**Comparison:**  
Portals are useful for modals, tooltips, notifications that need to break the z-index flow.

## Render Props
**Description:**  
Pattern where a component receives a function as a prop to decide what to render.

**Example:**
```javascript
function DataProvider({ render }) {
  const data = { user: 'John', age: 30 };
  return render(data);
}

export default function App() {
  return (
    <DataProvider render={(data) => (
      <p>User: {data.user} - Age: {data.age}</p>
    )} />
  );
}
```

**Comparison:**  
Render props allow high logic reusability, similar to custom hooks but in props pattern.


## High Order Components (HOC)
**Description:**  
Is a function that receives a component and returns a new component with additional functionality, without modifying the original component.  
Used to reuse logic between multiple components.

**Example:**
```javascript
import React from 'react';

// HOC that adds loading functionality
function withLoading(Component) {
  return function WrappedComponent({ isLoading, ...props }) {
    if (isLoading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}

// Base component
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// Enhanced component with HOC
const UserListWithLoading = withLoading(UserList);

export default function App() {
  const users = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Luis' }
  ];

  return (
    <div>
      <h3>HOC Example</h3>
      <UserListWithLoading isLoading={false} users={users} />
    </div>
  );
}
```

**Comparison:**  
| Concept | Characteristics                                    |
| ------- | -------------------------------------------------- |
| HOC     | Reuses logic by wrapping components                |
| Hooks   | Reuses logic within functional components          |

## Custom Hook
**Description:** 
is a JavaScript function whose name starts with use and can call other React hooks.
Used to extract reusable logic from components and share it between several.

**Example:**
```javascript
import React, { useState, useEffect } from 'react';

// Custom hook to fetch data from an API
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Request error');
        const json = await res.json();
        if (!cancel) setData(json);
      } catch (err) {
        if (!cancel) setError(err.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancel = true; // prevents state update if component unmounts
    };
  }, [url]);

  return { data, loading, error };
}

// Using the custom hook
function PostsList() {
  const { data: posts, loading, error } = useFetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map(p => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <div>
      <h3>Custom Hook Example</h3>
      <PostsList />
    </div>
  );
}
```

**Comparison:**  
| Concept | Characteristics                                    |
| ------- | -------------------------------------------------- |
| HOC     | Reuses logic by wrapping components                |
| Hooks   | Reuses logic within functional components          |

## useReducer
**Description:**  
Hook for managing complex states using a Redux-like pattern, where updates are performed through actions and a reducer.

**Example:**
```javascript
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Counter: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

**Comparison:**  
useReducer is preferable when state update logic is complex or involves multiple sub-values.

## useTransition and useDeferredValue
**Description:**  
Hooks for handling concurrent updates and keeping UI responsive.

**Example:**
```javascript
// (useTransition)
import React, { useState, useTransition } from 'react';

export default function FilterList() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    startTransition(() => {
      const filtered = Array.from({ length: 20000 }, (_, i) => `Item ${i}`)
        .filter(item => item.includes(value));
      setList(filtered);
    });
  };

  return (
    <div>
      <input value={input} onChange={handleChange} placeholder="Filter..." />
      {isPending && <p>Filtering...</p>}
      <ul>{list.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}

// (useDeferredValue)
import React, { useState, useDeferredValue } from 'react';

export default function DeferredList() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  const list = Array.from({ length: 20000 }, (_, i) => `Item ${i}`)
    .filter(item => item.includes(deferredInput));

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <ul>{list.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}
```


## Server Components
**Description:**  
Components that render on the server and send pre-built HTML to the client. They reduce the JavaScript size sent to the browser and improve performance.
- Don't include JS code on the client.
- Don't have state hooks or effects.
- Can directly access databases or private APIs.

**Comparison:**  
Server Components ≠ traditional SSR. Server Components don't send JS for interaction, SSR does.

## Testing in React
**Description:**  
Used to validate that components work as expected. Tools like React Testing Library and Jest allow unit and integration testing.

**Example:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments the counter', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('+'));
  expect(screen.getByText(/Counter:/)).toHaveTextContent('1');
});
```

### Compound Components
**Description:**  
Allow creating components that work together, sharing common state without prop drilling.

**Example:**
```javascript
import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext();

function Tabs({ children }) {
  const [active, setActive] = useState(0);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div>{children}</div>;
}

function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      style={{ fontWeight: active === index ? 'bold' : 'normal' }}
      onClick={() => setActive(index)}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }) {
  const { active } = useContext(TabsContext);
  return <div>{children[active]}</div>;
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;

export default function App() {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab index={0}>One</Tabs.Tab>
        <Tabs.Tab index={1}>Two</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <div>Content 1</div>
        <div>Content 2</div>
      </Tabs.Panels>
    </Tabs>
  );
}
```

## Performance Optimization
**Description:**  
Techniques and tools to improve rendering speed and user experience.
- **React.memo** to avoid unnecessary renders.
- **Code splitting** with `React.lazy` and `Suspense`.
- **List virtualization** with `react-window`.

**Example:**
```javascript
import { FixedSizeList as List } from 'react-window';

export default function VirtualizedList() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={35}
      width={300}
    >
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </List>
  );
}
```

## Internationalization (i18n)
**Description:**  
Allows supporting multiple languages and date/number formats in an app.

**Example:**
```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <p>{t('welcome_message')}</p>
      <button onClick={() => i18n.changeLanguage('es')}>ES</button>
      <button onClick={() => i18n.changeLanguage('en')}>EN</button>
    </div>
  );
}

export default MyComponent;
```

**Comparison:**  
i18n ≠ simple text translation; it also includes date formats, currencies, and pluralization.
