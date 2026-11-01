CLARITY — compartilhamento de tela para duas pessoas

REQUISITOS
- Node.js 18 ou mais recente
- npm

RODAR LOCALMENTE
1. Extraia a pasta.
2. Abra um terminal dentro dela.
3. Execute:
   npm install
   npm start
4. Abra http://localhost:3000

PUBLICAR NO RENDER
1. Envie TODOS os arquivos desta pasta para a raiz do repositório GitHub.
2. Render → New + → Web Service → conecte o repositório.
3. Runtime: Node
4. Build Command: npm install
5. Start Command: npm start
6. Deploy.

NOTAS
- O servidor usa Socket.IO para sinalização e WebRTC para áudio/vídeo/tela.
- O projeto permite até duas pessoas por sala.
- Para conexões entre redes restritivas, pode ser necessário configurar um servidor TURN (credenciais próprias).
- O compartilhamento de áudio do sistema depende do navegador e da opção selecionada na janela de compartilhamento.

CORREÇÃO DE CONEXÃO: nesta versão, o participante que já está na sala inicia a negociação WebRTC; isso evita offers simultâneas que deixavam o convidado preso em 'conectando'.
