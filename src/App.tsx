import './styles/styles.css'
import logo from './assets/logo.png'
import Form from './components/Form'

function App() {
  return (
    <div>
      <header>
        <img src={logo} alt="Logo sports NLW" />
      </header>

      <main>
        <section>
          <div>
            <h2 className="title">Assistente de Meta</h2>
            <p>Pergunte sobre estratégias, build e dicas para seus jogos!</p>
            <Form />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

