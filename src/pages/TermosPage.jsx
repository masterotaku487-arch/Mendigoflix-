import { useNavigate } from 'react-router-dom'
import './TermosPage.css'

export default function TermosPage() {
  const nav = useNavigate()
  const site = 'MendigoFlix'
  const email = 'contato@mendigoflix.com'

  return (
    <div className="legal-page">
      <div className="legal-header">
        <button className="legal-back" onClick={() => nav(-1)}>‹</button>
        <h1>📋 Termos de Uso</h1>
      </div>
      <div className="legal-body">
        <section>
          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar o {site}, você concorda com estes termos. Se não concordar, não utilize o serviço.</p>
        </section>
        <section>
          <h2>2. Sobre o Serviço</h2>
          <p>O {site} é uma plataforma que agrega e indexa conteúdo de fontes externas através de players públicos disponíveis na internet. Não hospedamos nenhum arquivo de vídeo em nossos servidores.</p>
        </section>
        <section>
          <h2>3. Conteúdo de Terceiros</h2>
          <p>Os vídeos exibidos são incorporados de plataformas de terceiros. O {site} não tem controle sobre esse conteúdo e não é responsável por sua disponibilidade ou precisão.</p>
        </section>
        <section>
          <h2>4. Uso Aceitável</h2>
          <p>Você concorda em usar o serviço apenas para fins pessoais e não comerciais. É proibido reproduzir, distribuir ou comercializar o conteúdo.</p>
        </section>
        <section>
          <h2>5. Isenção de Responsabilidade</h2>
          <p>O serviço é fornecido "como está". Não garantimos disponibilidade contínua ou ausência de erros.</p>
        </section>
        <section>
          <h2>6. Contato</h2>
          <p>Para questões sobre estes termos: {email}</p>
        </section>
        <p className="legal-date">Última atualização: Março de 2026</p>
      </div>
    </div>
  )
}
