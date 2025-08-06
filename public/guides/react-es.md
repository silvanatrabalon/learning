# React - Guía de Aprendizaje

## Props & State
**Descripción:** Props son datos inmutables pasados de componentes padre a hijo, mientras que State es el estado mutable interno de un componente que puede cambiar a lo largo del tiempo.

**Ejemplo:**
```javascript
// Componente con Props
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Componente con State usando useState
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Contador: {count}</h2>
      <div>
        <label>Paso: 
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

// Uso del componente con props
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

**Comparación:** Props vs State - Las props son inmutables y fluyen hacia abajo, el state es mutable y local al componente. Las props permiten la comunicación entre componentes, el state gestiona los datos internos.

## Presentational vs Container Components
**Descripción:** Los componentes presentacionales se enfocan en cómo se ven las cosas (UI), mientras que los contenedores se enfocan en cómo funcionan las cosas (lógica de negocio y estado).

**Ejemplo:**
```javascript
// Componente Presentacional - solo UI
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
        {isLoading ? 'Agregando...' : 'Agregar al carrito'}
      </button>
    </div>
  );
}

// Componente Container - lógica de negocio
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
      setError('Error al cargar el producto');
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
      // Mostrar notificación de éxito
      alert('Producto agregado al carrito');
    } catch (err) {
      alert('Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <ProductCard 
      product={product}
      onAddToCart={handleAddToCart}
      isLoading={adding}
    />
  );
}

// Lista de productos con separación clara
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

**Comparación:** Presentational vs Container - Los presentacionales son más reutilizables y fáciles de testear, los containers manejan la lógica compleja. Esta separación mejora la mantenibilidad y la arquitectura del código.

## Data Binding / Lifting State
**Descripción:** Técnica para compartir estado entre componentes hermanos elevando el estado al componente padre común y pasándolo hacia abajo mediante props.

**Ejemplo:**
```javascript
import React, { useState } from 'react';

// Componente hijo que muestra los datos
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
        <h2>Editar Perfil</h2>
        <input
          type="text"
          value={tempUser.name}
          onChange={(e) => setTempUser({...tempUser, name: e.target.value})}
          placeholder="Nombre"
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
          placeholder="Rol"
        />
        <div>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <button onClick={() => setIsEditing(true)}>Editar</button>
    </div>
  );
}

// Componente hijo que muestra estadísticas
function UserStats({ user, activities }) {
  const userActivities = activities.filter(activity => activity.userId === user.id);
  
  return (
    <div className="user-stats">
      <h3>Estadísticas</h3>
      <p>Total de actividades: {userActivities.length}</p>
      <p>Último login: {user.lastLogin}</p>
      <p>Miembro desde: {user.joinDate}</p>
      <div className="recent-activities">
        <h4>Actividades Recientes:</h4>
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

// Componente padre que maneja el estado elevado
function UserDashboard() {
  // Estado elevado - compartido entre componentes hijos
  const [user, setUser] = useState({
    id: 1,
    name: 'María González',
    email: 'maria@email.com',
    role: 'Desarrolladora',
    lastLogin: '2024-01-15 10:30',
    joinDate: '2023-06-01'
  });

  const [activities] = useState([
    { id: 1, userId: 1, action: 'Login al sistema', date: '2024-01-15 10:30' },
    { id: 2, userId: 1, action: 'Actualizó perfil', date: '2024-01-14 15:20' },
    { id: 3, userId: 1, action: 'Subió archivo', date: '2024-01-14 14:10' },
    { id: 4, userId: 1, action: 'Comentó en proyecto', date: '2024-01-13 16:45' }
  ]);

  // Función para actualizar el usuario (pasada como prop)
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    // Aquí podrías hacer una llamada API
    console.log('Usuario actualizado:', updatedUser);
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

// Ejemplo más avanzado con contexto para estado global
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
      console.error('Error en login:', error);
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

// Hook personalizado para usar el contexto
function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
}
```

**Comparación:** Lifting State vs Context API - Lifting state es ideal para pocos niveles de componentes, Context API es mejor para estado global que necesita ser accedido por muchos componentes dispersos en el árbol.

## Virtual DOM & Keys
**Descripción:** El Virtual DOM es una representación en memoria del DOM real que React usa para optimizar actualizaciones. Las keys ayudan a React a identificar qué elementos han cambiado.

**Ejemplo:**
```javascript
import React, { useState } from 'react';

// Ejemplo incorrecto - sin keys o keys incorrectas
function BadTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Aprender React', completed: false },
    { id: 2, text: 'Construir una app', completed: true },
    { id: 3, text: 'Desplegar a producción', completed: false }
  ]);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: `Nueva tarea ${todos.length + 1}`,
      completed: false
    };
    setTodos([newTodo, ...todos]); // Agregando al inicio
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <h3>❌ Ejemplo INCORRECTO (sin keys adecuadas)</h3>
      <button onClick={addTodo}>Agregar tarea</button>
      <ul>
        {todos.map((todo, index) => (
          // ❌ Usando índice como key es problemático
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
            <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Ejemplo correcto - con keys apropiadas
function GoodTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Aprender React', completed: false },
    { id: 2, text: 'Construir una app', completed: true },
    { id: 3, text: 'Desplegar a producción', completed: false }
  ]);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(), // ID único basado en timestamp
      text: `Nueva tarea ${todos.length + 1}`,
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
      <h3>✅ Ejemplo CORRECTO (con keys apropiadas)</h3>
      <button onClick={addTodo}>Agregar tarea</button>
      <ul>
        {todos.map(todo => (
          // ✅ Usando ID único como key
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
            <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Ejemplo de optimización con Virtual DOM
function OptimizedList() {
  const [items, setItems] = useState(
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 100
    }))
  );

  const [filter, setFilter] = useState('');

  // Filtra items basado en el filtro
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const updateRandomItems = () => {
    setItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        value: Math.random() * 100 // Solo algunos valores cambiarán
      }))
    );
  };

  return (
    <div>
      <h3>Lista Optimizada con Virtual DOM</h3>
      <div>
        <input
          type="text"
          placeholder="Filtrar items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={updateRandomItems}>
          Actualizar valores aleatorios
        </button>
      </div>
      <p>Mostrando {filteredItems.length} de {items.length} items</p>
      
      {/* Virtual DOM optimiza estas actualizaciones */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredItems.slice(0, 100).map(item => (
          <div
            key={item.id} // Key única para optimización
            style={{
              padding: '5px',
              margin: '2px 0',
              backgroundColor: item.value > 50 ? '#e8f5e8' : '#f5f5f5',
              borderLeft: `4px solid ${item.value > 50 ? 'green' : 'gray'}`
            }}
          >
            {item.name} - Valor: {item.value.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Ejemplo de React.Fragment
function FragmentExample() {
  return (
    <>
      <h3>Usando React.Fragment</h3>
      <p>Los fragments permiten agrupar elementos sin agregar nodos extra al DOM.</p>
      <GoodTodoList />
      <OptimizedList />
    </>
  );
}

// Comparación de rendimiento
function PerformanceComparison() {
  const [renderCount, setRenderCount] = useState(0);

  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div>
      <p>Este componente se ha renderizado {renderCount} veces</p>
      <FragmentExample />
    </div>
  );
}
```

**Comparación:** Virtual DOM vs DOM Real - El Virtual DOM permite a React hacer actualizaciones eficientes comparando versiones virtuales antes de tocar el DOM real. Las keys correctas previenen re-renderizados innecesarios y mantienen el estado de los componentes.

## useState Hook
**Descripción:** Hook fundamental para añadir estado local a componentes funcionales, proporcionando un valor de estado y una función para actualizarlo.

**Ejemplo:**
```javascript
import React, { useState } from 'react';

// Uso básico de useState
function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrementar
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// useState con objetos
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
    console.log('Usuario enviado:', user);
    alert('Usuario guardado correctamente');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ddd' }}>
      <h3>Formulario de Usuario</h3>
      
      <div>
        <label>Nombre: </label>
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
        <label>Edad: </label>
        <input
          type="number"
          value={user.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
        />
      </div>

      <div>
        <h4>Preferencias</h4>
        <label>
          Tema: 
          <select 
            value={user.preferences.theme}
            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
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
          Recibir notificaciones
        </label>
      </div>

      <button type="submit">Guardar Usuario</button>
      
      <div style={{ marginTop: '20px', backgroundColor: '#f5f5f5', padding: '10px' }}>
        <h4>Datos actuales:</h4>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </form>
  );
}

// useState con arrays
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
      <h3>Todo App con useState</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={addTodo} style={{ marginLeft: '10px', padding: '8px' }}>
          Agregar
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
          Todas ({todos.length})
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
          Activas ({activeCount})
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
          Completadas ({todos.length - activeCount})
        </button>
        
        {todos.some(todo => todo.completed) && (
          <button onClick={clearCompleted} style={{ marginLeft: '20px', padding: '5px 10px' }}>
            Limpiar completadas
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
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          {filter === 'all' ? 'No hay tareas' : `No hay tareas ${filter === 'active' ? 'activas' : 'completadas'}`}
        </p>
      )}
    </div>
  );
}

// useState con inicialización perezosa
function ExpensiveComponent() {
  // La función solo se ejecuta una vez, en el primer render
  const [expensiveValue, setExpensiveValue] = useState(() => {
    console.log('Cálculo costoso ejecutado');
    // Simular cálculo costoso
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  });

  const recalculate = () => {
    setExpensiveValue(() => {
      console.log('Recalculando...');
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.random();
      }
      return result;
    });
  };

  return (
    <div>
      <h3>Inicialización Perezosa</h3>
      <p>Valor calculado: {expensiveValue.toFixed(2)}</p>
      <button onClick={recalculate}>Recalcular</button>
    </div>
  );
}

// Ejemplo completo
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

**Comparación:** useState vs Variable normal - useState persiste el valor entre re-renderizados y desencadena actualizaciones cuando cambia, mientras que las variables normales se reinician en cada render y no causan actualizaciones.

## useEffect Hook
**Descripción:** Hook para manejar efectos secundarios en componentes funcionales, como llamadas a APIs, suscripciones, manipulación del DOM y limpieza de recursos.

**Ejemplo:**
```javascript
import React, { useState, useEffect } from 'react';

// useEffect básico - equivale a componentDidMount y componentDidUpdate
function BasicEffect() {
  const [count, setCount] = useState(0);

  // Se ejecuta después de cada render
  useEffect(() => {
    document.title = `Contador: ${count}`;
    console.log('useEffect ejecutado, count:', count);
  });

  return (
    <div>
      <h3>useEffect Básico</h3>
      <p>Contador: {count}</p>
      <p>Mira el título de la página</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
}

// useEffect con array de dependencias
function EffectWithDependencies() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(1);
  const [loading, setLoading] = useState(false);

  // Solo se ejecuta cuando userId cambia
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Simular llamada API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData = {
          id: userId,
          name: `Usuario ${userId}`,
          email: `usuario${userId}@email.com`,
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
  }, [userId]); // Solo se ejecuta cuando userId cambia

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h3>useEffect con Dependencias</h3>
      
      <div>
        <label>ID de Usuario: </label>
        <select 
          value={userId} 
          onChange={(e) => setUserId(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(id => (
            <option key={id} value={id}>Usuario {id}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Cargando usuario...</p>
      ) : user ? (
        <div style={{ marginTop: '20px' }}>
          <img src={user.avatar} alt={user.name} style={{ borderRadius: '50%' }} />
          <h4>{user.name}</h4>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p>No se pudo cargar el usuario</p>
      )}
    </div>
  );
}

// useEffect con función de limpieza
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

    // Función de limpieza - equivale a componentWillUnmount
    return () => {
      if (interval) {
        clearInterval(interval);
        console.log('Timer limpiado');
      }
    };
  }, [isActive]); // Se ejecuta cuando isActive cambia

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h3>Timer con Limpieza</h3>
      <div style={{ fontSize: '2em', marginBottom: '20px' }}>
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>
      <button onClick={toggle}>
        {isActive ? 'Pausar' : 'Iniciar'}
      </button>
      <button onClick={reset} style={{ marginLeft: '10px' }}>
        Reset
      </button>
    </div>
  );
}

// useEffect solo en mount (array vacío)
function OnMountEffect() {
  const [data, setData] = useState(null);
  const [renderCount, setRenderCount] = useState(0);

  // Solo se ejecuta una vez, cuando el componente se monta
  useEffect(() => {
    console.log('Componente montado - solo una vez');
    
    const fetchData = async () => {
      // Simular carga inicial de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData({
        appName: 'Mi Aplicación React',
        version: '1.0.0',
        loadTime: new Date().toISOString()
      });
    };

    fetchData();
  }, []); // Array vacío = solo se ejecuta en mount

  // Este useEffect se ejecuta en cada render
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e8' }}>
      <h3>useEffect solo en Mount</h3>
      <p>Renders: {renderCount}</p>
      
      {data ? (
        <div>
          <h4>{data.appName}</h4>
          <p>Versión: {data.version}</p>
          <p>Cargado en: {new Date(data.loadTime).toLocaleString()}</p>
        </div>
      ) : (
        <p>Cargando datos iniciales...</p>
      )}
      
      <button onClick={() => {}}>Re-render (no afecta useEffect con [])</button>
    </div>
  );
}

// useEffect múltiples para separar concerns
function MultipleEffects() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [online, setOnline] = useState(navigator.onLine);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Efecto para el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Efecto para el estado de conexión
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

  // Efecto para la posición del mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff3cd', minHeight: '200px' }}>
      <h3>Múltiples useEffect</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div>
          <h4>Ventana</h4>
          <p>Ancho: {windowWidth}px</p>
        </div>
        <div>
          <h4>Conexión</h4>
          <p>Estado: {online ? '🟢 Online' : '🔴 Offline'}</p>
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

// useEffect con async/await (patrón correcto)
function AsyncEffect() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No podemos hacer el useEffect async directamente
    // Pero podemos crear una función async dentro
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular API call
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        
        if (!response.ok) {
          throw new Error('Error al cargar los posts');
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

  if (loading) return <div>Cargando posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>useEffect Async</h3>
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

// Ejemplo completo
function UseEffectExamples() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div>
      <BasicEffect />
      <EffectWithDependencies />
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setShowTimer(!showTimer)}>
          {showTimer ? 'Ocultar Timer' : 'Mostrar Timer'}
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

**Comparación:** useEffect vs métodos de ciclo de vida de clase - useEffect combina componentDidMount, componentDidUpdate y componentWillUnmount en una sola API, permitiendo mejor organización lógica y menos código repetitivo.
