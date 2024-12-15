import './index.css' // Tailwind base styles
import Scene from './components/3D/Scene'

function App() {
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        overflow: 'hidden',
        touchAction: 'none'  // Prevents unwanted touch behaviors on mobile
      }}
    >
      <Scene />
    </div>
  )
}

export default App