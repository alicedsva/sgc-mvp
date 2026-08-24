# Auditoria — cards informativos, modais e alertas do fluxo de Avaliações

Levantamento de todo elemento que informa, confirma ou avisa o usuário (Admin
ou Colaborador) em qualquer tela do fluxo de Avaliações. Organizado por
tela/etapa, na ordem em que o usuário encontra cada um. Cada item traz onde
aparece (arquivo/linha), quando aparece (condição/gatilho) e por que existe.

Escopo: `FormularioAvaliacao.tsx` (todas as etapas/caminhos, incluindo os
sub-componentes que ele renderiza — `SeletorGerenciaGranular.tsx`,
`QuestionarioPreview.tsx`), `CriarAvaliacaoPage.tsx`,
`EditarAvaliacaoRascunhoPage.tsx`, `AvaliacaoDetalhePage.tsx` (as duas views),
`EditarAvaliacaoModal.tsx`, `ModalResumoAvaliacao.tsx`, `ConfirmationModal.tsx`
(uso neste fluxo), `RespostaAvaliacaoPage.tsx`, `ResultadoAvaliacao.tsx`,
`ParticipanteResultadoPage.tsx`.

---

## 1. FormularioAvaliacao.tsx — wizard de criação/edição de Rascunho

### Etapa "Público" (só criação — escolha do caminho)

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Dica lateral "Escolha o ponto de partida" | `FormularioAvaliacao.tsx:590-596` | Sempre, enquanto `currentStepKey === 'publico'` | Explica a diferença entre os dois caminhos (Por Jornada vs. Por Público-alvo) antes do Admin escolher — evita que ele escolha errado e precise recomeçar. |

### Etapa "Colaboradores" (só Caminho "Por Público-alvo")

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Dica lateral "Escolhendo os participantes" | `FormularioAvaliacao.tsx:598-601` | Sempre nesta etapa | Explica que dá pra combinar gerência inteira + colaboradores avulsos — a combinação "mista" não é óbvia pela UI sozinha. |
| Card "Incluir automaticamente novos colaboradores desta gerência" (toggle) | `SeletorGerenciaGranular.tsx:186-198` | Quando uma gerência está marcada **inteira** (`gerenciaAtivaEstado === 'toda'`) | Deixa explícito que marcar uma gerência inteira tem uma decisão adicional (auto-inclusão de futuros colaboradores) — evita que o Admin pense que é só uma foto do momento atual. Grava a intenção em `Avaliacao.gerenciasComAutoInclusao`, mas **nenhum mecanismo do sistema reage a isso hoje** (ver schema.ts) — o texto do card não avisa disso ao Admin. |
| Aviso de duplicidade (yellow) | `FormularioAvaliacao.tsx:931-936` | `duplicidadeDetectada` — mesmo nome + mesmo conjunto de colaboradores selecionados já existe em outra avaliação | Avisa (não bloqueia) que o Admin pode estar recriando uma avaliação equivalente por engano. |

### Etapa "Identificação"

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Dica lateral "O que essa jornada já define" | `FormularioAvaliacao.tsx:604-611` | Caminho Jornada | Avisa que habilidades/participantes já vêm prontos da jornada, e que dá pra ajustar habilidades na etapa seguinte. |
| Dica lateral "Nomeando a avaliação" | `FormularioAvaliacao.tsx:612-615` | Caminho Público-alvo | Explica a regra de nome único por público-alvo antes do Admin digitar (evita frustração ao ver o erro de duplicidade depois). |
| Link "Ver colaboradores" + contador de participantes/habilidades pré-marcadas | `FormularioAvaliacao.tsx:960-976` (texto), `997-1003` (link) | Caminho Jornada, modo **criação**, jornada já selecionada | Deixa o Admin conferir quem exatamente vai participar antes de avançar, sem precisar chegar na Revisão. Abre `ColaboradoresListaModal`. |
| Erro de duplicidade inline (texto vermelho, não banner) | `FormularioAvaliacao.tsx:1027-1029` | Caminho Jornada + `duplicidadeDetectada` | Mesmo aviso de duplicidade da etapa Colaboradores, mas para o caminho Jornada (onde a duplicidade já é conhecida nesta etapa, por depender só do `jornadaId`). |

### Etapa "Habilidades"

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Dica lateral "Habilidades pré-selecionadas" | `FormularioAvaliacao.tsx:618-625` | Caminho Jornada | Avisa que a pré-seleção vem da matriz mas pode ser livremente ajustada — evita que o Admin ache que está travado nas habilidades da jornada. |
| Dica lateral "Monte a lista livremente" | `FormularioAvaliacao.tsx:626-629` | Caminho Público-alvo | Orienta que não há pré-seleção nesse caminho, é escolha livre. |

### Etapa "Prazo"

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Dica lateral "Como o prazo funciona" (4 itens: Início, Término, Prazo de resposta, Sem Data de Início) | `FormularioAvaliacao.tsx:632-641` | Sempre nesta etapa | Explica o comportamento de cada um dos 3 campos livres e independentes (Início/Término/Prazo de resposta), incluindo a regra "Término sempre corta tudo" e o caso "sem Data de Início vira Rascunho" — nenhum desses comportamentos é óbvio só pelos `<input>`. |
| Aviso "Término chega antes do Prazo de resposta" (brand, não-bloqueante) | `FormularioAvaliacao.tsx:1100-1108` | `prazoTerminoCortaAntesDoPrazoDias` — os 3 campos preenchidos e o Término calculado chega antes do que o Prazo de resposta resultaria | Avisa que o Prazo de resposta configurado nunca chega a valer de fato para nenhum participante (o Término sempre teria precedência) — evita que o Admin configure um prazo individual "morto" sem perceber. **Texto reescrito nesta rodada** (ver seção 3 da resposta). |

### Etapa "Revisão"

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Botão "Visualizar questionário" → abre `QuestionarioPreview` | `FormularioAvaliacao.tsx:851-859` (botão), `1316-1323` (render) | Sempre nesta etapa | Deixa o Admin ver exatamente como o colaborador vai ver o questionário antes de publicar — sem gravar nada no Context (avaliação ainda não existe de fato). |
| Card "Público-alvo" — Carreira+Jornada (2 linhas) ou label de público-alvo, contador de participantes + link "Ver colaboradores" | `FormularioAvaliacao.tsx:1134-1157` | Sempre nesta etapa | Resumo final do público-alvo antes de concluir. Reescrito nesta rodada: Caminho Jornada agora mostra Carreira e Jornada em linhas separadas (via `getCarreiraEJornadaNomes`), e os dois caminhos ganharam o link "Ver colaboradores" (reaproveitando `ColaboradoresListaModal`, com `colaboradoresDaJornadaModal` ou `colaboradoresSelecionadosModal` conforme o caminho). |
| Card "Habilidades" — contagem + chips | `FormularioAvaliacao.tsx:1163-1183` | Sempre nesta etapa | Resumo final das habilidades selecionadas. |
| Card "Prazo" — texto único (`prazoTextoUnificado`, via `formatPeriodoAvaliacao`) | `FormularioAvaliacao.tsx:1187-1192` | Sempre nesta etapa | Resumo final do prazo. **Nota de divergência**: usa `formatPeriodoAvaliacao` (texto único), diferente do formato de 3 partes condicionais com tooltip que `AvaliacaoDetalhePage.tsx` passou a usar nesta rodada anterior — ver seção 4 "Divergências encontradas" abaixo. |
| Aviso "Sem colaboradores selecionados" (yellow) | `FormularioAvaliacao.tsx:1193-1200` | `semColaboradoresSelecionados` — Caminho Público-alvo sem nenhum colaborador escolhido | Explica por que o botão de publicar/ativar está bloqueado (só Salvar rascunho continua disponível). |
| Aviso de duplicidade (yellow) | `FormularioAvaliacao.tsx:1202-1207` | `duplicidadeDetectada`, qualquer caminho | Última chance de o Admin perceber a duplicidade antes de concluir (mesmo aviso das etapas anteriores, repetido aqui como confirmação final). |
| Dica lateral "Antes de concluir" (2 itens: Salvar rascunho / Agendar avaliação ou Publicar agora) | `FormularioAvaliacao.tsx:643-652` | Sempre nesta etapa | Explica a diferença entre as 3 ações possíveis do rodapé antes do Admin clicar — em especial que "Salvar rascunho" fica invisível até ativação manual. |

### Modais do wizard

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| `ColaboradoresListaModal` | `FormularioAvaliacao.tsx:209-266` (componente), `1325-1331` (render) | Clique em "Ver colaboradores" (Identificação/Jornada/criação, ou Revisão/qualquer caminho) | Lista somente-leitura de nome+cargo dos colaboradores que vão participar — generalizado nesta rodada anterior para aceitar tanto a lista vinda de `jornadaId` (título "Colaboradores da jornada" + subtítulo com o nome da jornada) quanto a lista vinda direto de `colaboradoresSelecionados` (título "Colaboradores selecionados", sem subtítulo). |
| `QuestionarioPreview` | `QuestionarioPreview.tsx` (componente inteiro), render em `FormularioAvaliacao.tsx:1316-1323` | Clique em "Visualizar questionário" (Revisão) | Simula o fluxo real do colaborador (Instruções → perguntas) sem gravar nada — inclui sua própria barra de aviso amarela fixa "Modo de visualização. Nenhuma resposta será salva." (`QuestionarioPreview.tsx:77-90`), para deixar claro a qualquer momento do preview que aquilo não é a avaliação real. |
| `ConfirmationModal` (variant `warning`) — "Publicar '{nome}' agora?" | `FormularioAvaliacao.tsx:1333-1348` | Clique em "Publicar agora" (Início vazio ou hoje — nunca em agendamento futuro) | Última confirmação antes de uma ação **irreversível na hora** (a avaliação fica visível aos colaboradores imediatamente) — mensagem varia conforme `modoPrazo` (indefinido / com Término / só com Prazo de resposta), sempre reaproveitando `prazoTextoUnificado`. |

---

## 2. CriarAvaliacaoPage.tsx / EditarAvaliacaoRascunhoPage.tsx

Nenhum card/modal/alerta próprio — as duas páginas só orquestram
`FormularioAvaliacao` (auditado acima) e `ModalResumoAvaliacao` (seção 5
abaixo). Único ponto de alerta é fora da UI de card: em
`EditarAvaliacaoRascunhoPage.tsx:35-40`, um `toast.error('Esta avaliação já
tem participantes. Só é possível prorrogar o prazo.')` dispara e redireciona
de volta para a listagem se alguém tentar acessar a URL de edição de rascunho
de uma avaliação que já foi ativada — guarda de acesso direto por URL, não um
card visível permanentemente.

---

## 3. AvaliacaoDetalhePage.tsx — Rascunho e Detalhe

### `AvaliacaoRascunhoView`

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Banner "Prévia" (yellow) | `AvaliacaoDetalhePage.tsx:277-283` | Sempre nesta view (status Rascunho) | Deixa claro, logo no topo, que a avaliação não é real ainda — evita que o Admin confunda com uma avaliação Ativa. |
| Tooltip no "Prazo de resposta: N dias" (header) | `AvaliacaoDetalhePage.tsx:145-159` (`getPrazoPartes`) | `avaliacao.prazoDias != null` | Explica que o prazo é individual por participante (contado da `dataEntrada`), não uma data fixa igual pra todo mundo — mesmo texto usado no wizard. |
| `EmptyState` "Nenhum colaborador selecionado" | `AvaliacaoDetalhePage.tsx:312-317` | `total === 0` (sempre, hoje — `participantes` de Rascunho é sempre `[]`, ver nota no código) | Explica por que a tabela está vazia e orienta a ação (editar o rascunho, etapa Colaboradores) em vez de deixar um espaço em branco sem contexto. |

### `AvaliacaoDetalheView`

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Tooltip no "Prazo de resposta: N dias" (header) | Mesma `getPrazoPartes`, `AvaliacaoDetalhePage.tsx:145-159` | `avaliacao.prazoDias != null` | Mesmo motivo acima — reaproveitado entre as duas views. |
| Ícone "Visualizar respostas" desabilitado + tooltip | `AvaliacaoDetalhePage.tsx:447-457` | Linha de participante com `status !== 'Concluída'` | Exceção deliberada à regra geral "nunca desabilitar, sempre esconder": manter o ícone visível (porém desabilitado, com tooltip "Disponível após o participante responder") evita que o Admin, acostumado a ver o ícone Eye em toda tabela do sistema, estranhe a ausência dele. |

---

## 4. EditarAvaliacaoModal.tsx — prorrogação de avaliação já materializada

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Banner "Esta avaliação já tem participantes..." (slate, ícone `Lock`) | `EditarAvaliacaoModal.tsx:105-112` | Sempre neste modal | Explica por que Nome/Habilidades/Público-alvo aparecem congelados (só leitura) mais abaixo no mesmo modal — o texto varia entre "definir" (modo `indefinido`, primeira vez) e "prorrogar" (já tem Término e/ou Prazo). |
| Hint text "Término precisa ser pelo menos amanhã..." | `EditarAvaliacaoModal.tsx:151-153` | Sempre, abaixo dos campos Término/Prazo (dias) | Explica a regra de validação (D+1 mínimo) e a regra "vence o que chegar primeiro" antes do Admin errar e ver o toast de erro. |
| `toast.error` de validação (não é card, é toast) | `EditarAvaliacaoModal.tsx:38-66` (`validarProrrogacao`) | Campos vazios, Término no passado/hoje, Prazo inválido, ou prazo que deixaria algum participante vencendo antes de amanhã | Bloqueia a prorrogação inválida com mensagem específica por caso. |

**Nota de divergência de nomenclatura**: este modal ainda usa o rótulo "Prazo
(dias)" (`EditarAvaliacaoModal.tsx:141`) e o texto "Prazo em dias"/"Prazo é
contado..." (linhas 109-110, 152) — a rodada anterior renomeou "Prazo (dias)"
→ "Prazo de resposta (em dias)" só na Etapa Prazo de `FormularioAvaliacao.tsx`
(criação/edição de Rascunho), não neste modal (prorrogação de avaliação já
Ativa/Encerrada). Ver seção "Divergências encontradas" abaixo.

---

## 5. ModalResumoAvaliacao.tsx

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Modal de sucesso (ícone verde `CheckCircle2`), título e corpo variáveis | `ModalResumoAvaliacao.tsx` (componente inteiro) | Ao final de qualquer conclusão do wizard: Salvar rascunho, Agendar ou Publicar agora | Confirma o que aconteceu e reforça a próxima expectativa (ex: "fica invisível até você ativá-la" para Rascunho; o prazo formatado, via `formatPeriodoAvaliacao`, para Agendada/Publicada) antes de voltar para a listagem. |

---

## 6. RespostaAvaliacaoPage.tsx (fluxo do Colaborador)

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Card de Instruções (lista numerada de 4 regras) | `RespostaAvaliacaoPage.tsx:241-256` | Passo `'instrucoes'` (tela própria, antes das perguntas) | Explica as regras do fluxo (escolher por descrição não por nome, "Sem conhecimento" em vez de chutar, o que a resposta é usada para, e que dá pra sair e continuar depois) antes do colaborador começar — evita habilidades/competências reveladas antes da hora (por isso é uma tela separada, sem o painel lateral). |
| "Prazo de entrega: {prazo}" | `RespostaAvaliacaoPage.tsx:235-238` (instruções) e `196-199` (header sticky durante perguntas) | Sempre, nas duas telas | Reforça a data-limite individual do colaborador (`formatPrazoParticipante`) — repetida no header fixo durante as perguntas para nunca sair da visão do colaborador. |

Nenhum modal de confirmação neste fluxo — envio final é bloqueado por
`toast.error` (não card) quando há habilidade sem resposta
(`RespostaAvaliacaoPage.tsx:169-173`), e "Salvar e sair" não pede confirmação
porque a persistência já acontece a cada seleção de nível (comentário no
próprio arquivo, linhas 24-30).

---

## 7. ResultadoAvaliacao.tsx (Colaborador — dentro de Minha Carreira/MinhasAvaliacoes)

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Banner de contexto (brand) "Use estes resultados como ponto de partida..." | `ResultadoAvaliacao.tsx:178-183` | Sempre nesta tela | Orienta o uso pretendido do resultado (conversa com o gestor, autopercepção do momento) — evita que o colaborador leve o resultado como avaliação de desempenho formal. |
| Tooltip "Sem referência para seu cargo" | `ResultadoAvaliacao.tsx:216-227` | Habilidade avaliada sem entrada na matriz do cargo atual do colaborador (`nivelEsperado == null`) | Explica por que não há comparação "esperado" pra aquela habilidade especificamente, em vez de deixar a ausência do dado parecer um erro. |

---

## 8. ParticipanteResultadoPage.tsx (Admin — vê a resposta de 1 participante)

| Item | Onde | Quando | Motivo |
|---|---|---|---|
| Tooltip na coluna "Esperado" (`—` + ícone Info) | `ParticipanteResultadoPage.tsx:311-328` | `info.tipo !== 'configurado'` — habilidade sem entrada na matriz (`nao_configurado`) ou explicitamente marcada como não exigida pelo RH (`nao_exigido`) | Distingue os dois motivos possíveis de não haver "esperado" pra essa linha — texto muda conforme o tipo, nunca um "—" genérico sem explicação (mesma distinção de `06-integridade-de-dados.md`: "Não configurado" ≠ "Não exigido"). |

---

## Divergências encontradas (não corrigidas nesta auditoria — reportar antes de mexer)

1. **"Prazo (dias)" vs. "Prazo de resposta (em dias)"** — a rodada anterior
   renomeou só a Etapa Prazo de `FormularioAvaliacao.tsx` (criação/edição de
   Rascunho). `EditarAvaliacaoModal.tsx` (prorrogação de avaliação já
   materializada) ainda usa a nomenclatura antiga em 3 pontos (label do
   campo, banner de contexto, hint text — ver seção 4). Ambos os modais
   descrevem o mesmo campo do schema (`Avaliacao.prazoDias`), então o Admin
   vê dois nomes diferentes pro mesmo conceito dependendo de estar
   criando/editando rascunho ou prorrogando.
2. **Formato do texto de prazo diverge entre 2 telas** — `AvaliacaoDetalhePage.tsx`
   (`getPrazoPartes`) monta 3 partes condicionais em negrito com tooltip no
   Prazo de resposta; o card "Prazo" da Etapa Revisão do wizard
   (`FormularioAvaliacao.tsx:1187-1192`) continua usando `formatPeriodoAvaliacao`
   (texto único, sem tooltip). Não é necessariamente um bug — a Revisão é um
   resumo de formulário, não o header de uma avaliação real — mas é uma
   diferença visual real entre as duas telas que mostram basicamente a mesma
   informação.
