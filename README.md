# jarvis
Assistente pessoal com interface de voz, lembretes locais, histórico de conversas, novo chat e respostas com Gemini e busca na web.

## Configurar e executar

Requer Node.js 20.6 ou superior e uma chave da API do Gemini.

1. Copie `.env.example` para `.env` e preencha `GEMINI_API_KEY`.
2. Execute `npm start`.
3. Abra `http://localhost:3001`.

A chave fica apenas no servidor e não é enviada ao navegador. Perguntas gerais são consultadas ao Gemini com busca por web; hora, data, cálculos e lembretes são processados localmente. Lembretes, histórico e preferências de personalização ficam armazenados no navegador. O reconhecimento de voz depende do suporte e das permissões do navegador. O Jarvis fala as respostas apenas para perguntas feitas pelo microfone; perguntas digitadas recebem respostas somente em texto. Use o botão **PERSONALIZAR** para trocar a cor, o nome do assistente e como ele chama você.

Modelo padrão: `gemini-3.8-flash`. É possível alterá-lo por `GEMINI_MODEL` no arquivo `.env`.

As contas usam senha protegida e sessão no servidor; entre com nome de usuário e senha, e informe o e-mail apenas ao criar a conta. Localmente, os dados são gravados em `accounts.json` dentro de `DATA_DIR` (padrão: `./data`). Em produção, configure `DATABASE_URL` com a URL PostgreSQL do Neon; o servidor exige essa variável em `NODE_ENV=production` para não perder as contas em reinicializações. Para lançar uma cópia local de contas no banco, configure a URL no `.env` e execute `npm run migrate:accounts`; a migração não apaga o arquivo e não substitui contas que já existam no banco. **Esqueceu a senha?** envia um código de seis dígitos para o e-mail cadastrado; o código expira em 10 minutos e só pode ser usado uma vez. Para ativar o envio real de e-mail, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` e `SMTP_FROM` no ambiente do serviço com os dados do seu provedor. Sem essa configuração, o site informa que não pode enviar o código. Nunca compartilhe ou versione suas credenciais. O arquivo de contas não é versionado. Histórico, lembretes e preferências continuam no navegador, separados por conta. O cadastro oferece todos os países e seleciona português, espanhol ou inglês automaticamente (países sem português ou espanhol usam inglês). Se o Gemini falhar ou indicar que não sabe, o Jarvis faz uma única busca web e apresenta a informação diretamente, sem dizer que consultou a web. As respostas são limitadas a cerca de 35 palavras para caber em até 20 segundos; o texto exibido e salvo é exatamente o mesmo enviado à voz.

## Publicar gratuitamente (Render + Neon)

1. Crie um banco PostgreSQL no [Neon](https://neon.tech/) e copie a connection string (`DATABASE_URL`) sem compartilhá-la.
2. No GitHub, envie este projeto ao seu repositório, sem adicionar `.env` nem `data/`.
3. No [Render](https://render.com/), crie um **Blueprint** a partir do repositório. O `render.yaml` configura o serviço web gratuito; informe `DATABASE_URL` e `GEMINI_API_KEY` quando solicitado.
4. Aguarde o deploy e abra a URL `.onrender.com` indicada pelo Render. A rota `/healthz` verifica se o serviço está ativo.

O serviço gratuito do Render pode suspender após inatividade e demorar para responder ao primeiro acesso. Use o plano gratuito apenas para hobby/testes, não para disponibilidade garantida. A recuperação por e-mail só funcionará depois que um provedor SMTP aceito for configurado no Render.
