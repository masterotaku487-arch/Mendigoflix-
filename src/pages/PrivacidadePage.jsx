import { useNavigate } from 'react-router-dom'
import './TermosPage.css'

export default function PrivacidadePage() {
  const nav = useNavigate()

  return (
    <div className="legal-page">
      <div className="legal-header">
        <button className="legal-back" onClick={() => nav(-1)}>‹</button>
        <h1>🔒 Política de Privacidade</h1>
      </div>
      <div className="legal-body">
        <section>
          <h2>1. Dados Coletados</h2>
          <p>O MendigoFlix armazena apenas dados localmente no seu dispositivo (histórico de visualização, favoritos e preferências). Não coletamos dados pessoais identificáveis.</p>
        </section>
        <section>
          <h2>2. Armazenamento Local</h2>
          <p>Utilizamos localStorage do seu navegador para salvar preferências, histórico e favoritos. Esses dados ficam apenas no seu dispositivo e podem ser apagados a qualquer momento.</p>
        </section>
        <section>
          <h2>3. APIs Externas</h2>
          <p>Utilizamos as seguintes APIs externas:</p>
          <ul>
            <li><strong>TMDB</strong> — dados de filmes e séries</li>
            <li><strong>Jikan/MyAnimeList</strong> — dados de animes</li>
            <li><strong>MangaDex</strong> — dados de mangás</li>
          </ul>
          <p>Consulte as políticas de privacidade dessas plataformas para mais informações.</p>
        </section>
        <section>
          <h2>4. Cookies</h2>
          <p>Não utilizamos cookies de rastreamento ou publicidade.</p>
        </section>
        <section>
          <h2>5. Seus Direitos</h2>
          <p>Você pode apagar todos os dados locais acessando Perfil → Limpar dados a qualquer momento.</p>
        </section>
        <section>
          <h2>6. Contato</h2>
          <p>Dúvidas: contato@mendigoflix.com</p>
        </section>
        <p className="legal-date">Última atualização: Março de 2026</p>
      </div>
    </div>
  )
}
