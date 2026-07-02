---

# Integridade de dados — regra fundamental

## Princípio central

`mockData.ts` é a única fonte de verdade do sistema.

Todo dado exibido em qualquer tela — número, contagem, lista, relação entre
entidades — deve ser **calculável a partir de `mockData.ts` no momento da
renderização**. Nunca um valor digitado à mão que precise ser lembrado e
atualizado manualmente depois.

Se um número pode ser calculado (`array.filter(...).length`, `array.find(...)`),
ele **deve** ser calculado — nunca armazenado como campo fixo que alguém
precisa lembrar de manter sincronizado.

## Por que essa regra existe

Historicamente, toda vez que uma entidade nova foi criada no SGC (Habilidades,
Competências, Carreiras, Avaliações), ela nasceu com uma cópia própria dos
dados — um array hardcoded dentro do componente ou do Context, desconectado
de `mockData.ts`. Quando os dados reais mudavam, essas cópias não
acompanhavam, e a interface passava a mostrar números que não existiam de
verdade (jornadas com cargos fantasmas, níveis com "0 habilidades vinculadas"
quando havia 17, competências que nunca apareciam no filtro).
Essa regra existe para que isso nunca aconteça de novo, em nenhuma entidade,
nova ou antiga.

## Proibições explícitas

O Claude Code nunca deve:

- Criar um array de dados (`useState([...])` com itens escritos à mão) que
  duplique uma entidade que já existe ou deveria existir em `mockData.ts`
- Armazenar um contador (`total`, `quantidade`, `habilidadesConfiguradas`,
  etc.) que poderia ser calculado dinamicamente a partir de outro array —
  exceto nos casos documentados em "Exceções" abaixo
- Inventar um nome, ID, ou referência que não existe em nenhuma entidade
  real de `mockData.ts` (ex: uma habilidade apontando para uma competência
  que não foi criada)
- Deixar uma tela nova exibir dado de exemplo "ilustrativo" sem deixar
  claro que é placeholder — dado ilustrativo não documentado se torna dado
  errado em duas semanas

## Antes de criar qualquer tela ou componente novo

Antes de implementar qualquer tela, componente ou Context que vá exibir
contagens, listas ou relações entre entidades, pergunte:

1. Esse dado já existe em `mockData.ts`? Se sim, ler de lá — nunca recriar.
2. Se não existir: é permitido criar o dado novo, mas ele deve ser
   adicionado de forma centralizada em `mockData.ts` (nunca direto na tela
   ou no componente). Ao criar, reporte o que foi adicionado.
3. Esse dado se relaciona com outra entidade (habilidade → competência,
   cargo → jornada, colaborador → cargo)? Se sim, use o ID real da entidade
   relacionada — nunca uma string livre que parece um nome.

## Toda tela nova precisa hidratar o dado real na montagem

Ter o dado correto em `mockData.ts` não é suficiente — a tela precisa
efetivamente carregá-lo quando é aberta pela primeira vez, não só quando
o usuário interage manualmente.

Bug já encontrado: uma tela de matriz tinha os dados corretos disponíveis
no Context, mas os estados locais que alimentavam a interface
(`habilidadesNaMatriz`, `matrizNiveis`) sempre iniciavam vazios e só eram
populados por ações do usuário (adicionar item, editar célula). Isso fazia
a tela parecer vazia mesmo com o dado correto existindo — não era bug de
dado, era falta de `useEffect` de hidratação na montagem.

Regra: toda vez que um componente novo usa `useState` para guardar uma
cópia local de dados vindos de um Context ou de `mockData.ts`, ele precisa
de um `useEffect` (ou inicialização direta no `useState`) que popule esse
estado a partir da fonte real assim que o componente monta — nunca deixar
o estado começar vazio esperando interação do usuário para se popular.

Ao revisar uma tela existente, sempre perguntar: "se eu abrir essa tela
agora, sem clicar em nada, ela mostra o dado real?" Se a resposta depender
de uma ação do usuário, há um bug de hidratação.

## Escalas e enums relacionados precisam ser cruzados na criação do dado

Quando duas entidades se relacionam através de um campo que tem opções
limitadas (ex: nível esperado, status, categoria), não basta cada uma ter
dados corretos isoladamente — é preciso confirmar que os valores usados em
uma correspondem às opções válidas da outra.

Bug já encontrado: o sistema tem duas escalas de nível diferentes (uma
com nomes Básico/Intermediário/Avançado/Especialista/Proficiente, outra
com Iniciante/Aprendiz/Praticante/Experiente/Referência). Algumas
habilidades usam uma escala, outras usam a outra. Ao popular a matriz de
habilidades por cargo, os níveis esperados foram preenchidos com nomes da
escala errada para algumas habilidades — o nome `'Básico'` foi usado para
uma habilidade que só aceita `'Iniciante'`. O dado existia, mas a busca
por nome falhava silenciosamente e a célula renderizava vazia.

Regra: ao criar ou expandir qualquer relação entre entidades que envolva
um campo de escala fixa (nível, status, categoria), confirme explicitamente
que o valor usado é uma das opções válidas DAQUELA entidade específica, não
apenas um nome que parece certo. Quando houver mais de uma escala possível
no sistema, prefira comparar e converter por peso/valor numérico
(`getPesoFromNome`), nunca por correspondência direta de string de nome.

## Todo Context novo segue o mesmo padrão

Qualquer Context novo que goste de uma lista de entidade (ex: um futuro
`CursosContext`, `ProjetosContext`) deve:

- Inicializar seu estado a partir de um array exportado de `mockData.ts`
  (`useState(entidadeData)`), nunca com `initialData` próprio dentro do
  Context
- Seguir exatamente o padrão já usado por `HabilidadesContext.tsx` e
  `CompetenciasContext.tsx` — não inventar uma estrutura diferente

## Protocolo de auditoria ao tocar em tela existente

Sempre que for editar uma tela existente por qualquer motivo — mesmo que o
pedido não tenha relação direta com dados — antes de finalizar, verifique:

- Os contadores exibidos nessa tela são calculados dinamicamente ou são
  campos armazenados?
- Se forem armazenados: calcule o valor real e compare. Se divergir,
  reporte antes de seguir — não corrija silenciosamente sem avisar, e não
  ignore o achado.

## Exceções documentadas (decisões conscientes, não bugs)

Estes campos são armazenados (não calculados) por decisão deliberada:

- `cargo.habilidadesConfiguradas` / `cargo.totalHabilidades` — sincronizados
  por `atualizarHabilidadesCargo` no `CarreirasContext`. Migrar para cálculo
  dinâmico exigiria mudança de interface sem ganho prático, já que o único
  caminho de escrita já está correto.

- `jornada.quantidadeCargos` — armazenado e mantido sincronizado em
  `CriarJornadaPage`, `EditarJornadaPage` e `CarreirasContext`, mas NENHUMA
  tela deve ler esse campo diretamente para exibição ou ordenação — sempre
  calcular via `cargos.filter(c => c.jornadaId === jornada.id).length`.
  Esse é o padrão aceitável: campo armazenado pode existir para fins de
  escrita/histórico, desde que toda leitura na interface seja sempre
  calculada, nunca lida do campo armazenado.

Nenhuma outra exceção está aprovada. Qualquer novo campo armazenado que pareça
necessário deve ser discutido com Alice antes de implementado — não assumir
que é um caso similar aos já aprovados.
