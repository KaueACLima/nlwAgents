import { useState } from 'react'
import Response from './Response'
import showdown from 'showdown'

const converter = new showdown.Converter()

const Form = () => {
  const [apiKey, setApiKey] = useState('')
  const [game, setGame] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey || !game || !question) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    setResponse('')

    try {
      const res = await fetchResponse(question, game, apiKey)
      setResponse(converter.makeHtml(res))
    } catch (err) {
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchResponse = async (question: string, game: string, apiKey: string): Promise<string> => {
    const model = 'gemini-2.0-flash'
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const prompt = `
## Especialidade
Você é um especialista assistente de meta para o jogo ${game}

## Tarefa
Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

## Regras
- Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
- Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
- Considere a data atual ${new Date().toLocaleDateString()}
- Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
- Nunca responda itens que você não tenha certeza de que existem no patch atual.

## Resposta
- Economize na resposta, seja direto e responda no máximo 500 caracteres
- Responda em markdown
- Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

## Exemplo de resposta
pergunta do usuário: Melhor build rengar jungle
resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

---
Aqui está a pergunta do usuário: ${question}
`

    const contents = [{ role: 'user', parts: [{ text: prompt }] }]
    const tools = [{ google_search: {} }]

    const res = await fetch(geminiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, tools }),
    })

    const data = await res.json()
    return data.candidates[0].content.parts[0].text
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="password"
        placeholder="Informe a API KEY do Gemini"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        required
      />
      <select value={game} onChange={(e) => setGame(e.target.value)} required>
        <option value="">Selecione um jogo</option>
        <option value="valorant">Valorant</option>
        <option value="lol">League of Legends</option>
        <option value="cs">CS:GO</option>
      </select>
      <input type="text"
        placeholder="Ex: Melhor build para ADC..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      <button disabled={loading}>{loading ? 'Perguntando...' : 'Perguntar'}</button>

      {response && <Response content={response} />}
    </form>
  )
}

export default Form

