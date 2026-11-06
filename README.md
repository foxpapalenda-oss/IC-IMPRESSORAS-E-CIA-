TOP CELL

## Executar com proteção do servidor

1. Instale Node.js 18 ou superior.
2. Crie as variáveis de ambiente usando `.env.example` como referência.
3. Execute `npm start`.
4. Acesse `http://localhost:3000`.

Nunca envie `.env` para o GitHub e use uma senha forte no ambiente de produção. Gere o hash com:

```text
node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');const h=c.scryptSync('SUA_SENHA_FORTE',s,64).toString('hex');console.log(s+':'+h)"
```

## Sincronização das fichas

A assistência usa Firebase Authentication (e-mail/senha) e Cloud Firestore. Não é necessário ativar Firebase Storage nem mudar para o plano Blaze: as fotos são comprimidas e guardadas como documentos do Firestore, dentro das cotas gratuitas do projeto.

1. Habilite **E-mail/senha** em Firebase Authentication.
2. Em **Firestore Database → Regras**, cole o conteúdo de [`firestore.rules`](./firestore.rules) e publique. As regras permitem acesso somente à conta `ssllfelipe@gmail.com` com e-mail verificado.
3. Em **Authentication → Configurações → Domínios autorizados**, adicione o domínio onde o site está publicado.
4. Sirva o site por HTTPS (ou `localhost` durante o desenvolvimento). Não abra os arquivos diretamente como `file://`.
5. Na página de Assistência, use **Criar nova conta** para o e-mail autorizado e confirme o endereço pelo link recebido. Depois, entre com a mesma conta em cada celular.

Na página inicial, o botão **Entrar na conta** leva ao formulário de login. **Mantenha-me conectado** usa persistência entre visitas quando marcado; sem marcar, a sessão termina ao fechar o navegador.

Ao entrar pela primeira vez, fichas locais que ainda não existem na nuvem são importadas automaticamente. As imagens são convertidas para JPEG e reduzidas para caber no limite seguro de um documento do Firestore. A conta gratuita possui cotas diárias e de armazenamento; se forem excedidas, a sincronização apresentará erro até a cota ser renovada.

Quando houver alteração nas fotos sincronizadas, publique também a versão atual de [`firestore.rules`](./firestore.rules) no console do Firebase.

Cada ficha salva tem a opção **Baixar PDF**. O navegador abre a janela de impressão; escolha **Salvar como PDF** e habilite **Gráficos de fundo** para manter o layout preto com texto branco. O PDF inclui os dados, procedimentos e fotos e guarda uma cópia estruturada dos dados para permitir a importação posterior.

Use **Importar ficha PDF** para restaurar um PDF exportado pelo site. A importação recupera os campos, procedimentos e fotos para a ficha e sincroniza o registro. PDFs exportados antes da inclusão desse recurso precisam ser baixados novamente para conter os dados importáveis.