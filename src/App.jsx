import Header from './components/Header'
import ApplicationCard from './components/ApplicationCard'


import './App.css'

function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <h2>Mina jobbansökningar</h2>
        <p>Dina jobbansökningar kommer att visas här.</p>

        <ApplicationCard 
          company="Företag AB" 
          position="Systemutvecklare. Net" 
          location="Stockholm" 
          status="Ansökt" 
        />
      </main>
    </div>
  )
}

export default App