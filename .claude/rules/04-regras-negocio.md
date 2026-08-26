---

# Regras de negócio

## Níveis de habilidade

- Cor sempre derivada de `getCorFromPeso(nivel.peso)` — nunca hardcoded
- Hierarquia definida pela ordem de progressão (1–5), nunca pelo nome
- Nomes são fixos: Aprendiz, Iniciante, Intermediário, Avançado, Especialista (peso 1 a 5) — sem CRUD pelo RH.
- Texto em badges de nível: sempre `text-white`
- Desempate de ordem igual: ordem alfabética pelo nome

## Cálculo de avaliações

- Sempre usar a resposta mais recente quando uma habilidade aparece
  em múltiplas avaliações
- Habilidades não avaliadas: excluídas da média — nunca contadas como zero
- Cálculo de radar: média dos pesos dos níveis por competência, escala 0–5
- Domínio do radar: fixo em 0–5

### Estados de avaliação — Admin
| Estado    | Classes                          | Visível ao colaborador |
|-----------|----------------------------------|------------------------|
| Rascunho  | `bg-yellow-100 text-yellow-800`  | Nunca                  |
| Ativa     | `bg-green-100 text-green-800`    | Sim                    |
| Encerrada | `bg-gray-100 text-gray-700`      | Sim                    |

### Estados de avaliação — Colaborador (derivados)
| Estado        | Condição                                        | Classes                         |
|---------------|-------------------------------------------------|---------------------------------|
| Não iniciada  | Avaliação Ativa + colaborador não começou       | `bg-orange-100 text-orange-800` |
| Em andamento  | Avaliação Ativa + colaborador iniciou           | `bg-blue-100 text-blue-800`     |
| Concluída     | Avaliação Encerrada + colaborador respondeu     | `bg-green-100 text-green-800`   |
| Expirada      | Avaliação Encerrada + colaborador não respondeu | `bg-gray-100 text-gray-700`     |

Regra: Rascunho **nunca** visível ao colaborador, independente do estado.

## Cobertura de habilidades
```
cobertura = habilidades onde nivelAtual >= nivelEsperado
percentual = (cobertura / total) × 100
```
- ≥ 80%: verde (`text-green-600`, `bg-green-500`)
- 50–79%: amarelo (`text-yellow-600`, `bg-yellow-500`)
- < 50%: vermelho (`text-red-600`, `bg-red-500`)

### Exceção documentada — Dashboard (Seção 1: Cobertura por competência)

O Dashboard (`DashboardPage.tsx`, funções `getBarColor` / `getCoberturaTextColor`,
reaproveitadas também pela tabela da Seção 3 — Média por gerência) **não** usa a
paleta verde/amarelo/vermelho acima. Usa tons de azul/brand com limiares 70/50:

- ≥ 70%: `#009FC2` (brand)
- 50–69%: `#33BFDF`
- < 50%: `#99DFEF`

Isso é decisão consciente de produto para o Dashboard, não um bug de
inconsistência com a regra 80/50/verde-amarelo-vermelho documentada acima.
**Nunca "corrigir" `getBarColor`/`getCoberturaTextColor` para alinhar aos
limiares ou cores gerais** — são paletas propositalmente diferentes para
contextos diferentes.

### Indicadores de habilidade do colaborador
Texto apenas — sem fundo, sem badge:
- Acima do esperado: `text-xs text-green-600`
- No esperado: `text-xs text-green-600`
- Abaixo do esperado: `text-xs text-red-500`

## Matriz de habilidades

### Estados da célula
| Estado           | Visual                                                                 |
|------------------|------------------------------------------------------------------------|
| `null/undefined` | borda dashed `border-gray-300`; hover solid azul                       |
| `'not_required'` | borda dashed `border-amber-300`, `bg-amber-50`                         |
| string (nível)   | borda esquerda 3px via `getCorFromPeso(peso)` + conteúdo abaixo        |

Conteúdo da célula preenchida:
- Nome do nível: `text-xs font-semibold`
- Critério: `text-xs text-gray-500 line-clamp-3`
- "Progressão N": `text-[10px] text-gray-400`

### Distinção obrigatória
- **"Não configurado"** = célula nula — RH ainda não definiu
- **"Não exigido"** = valor `'not_required'` — decisão explícita do RH

São conceitos diferentes. Nunca tratar os dois da mesma forma.

### Regra de progresso da matriz
```
configuradas = células com nível definido OU 'not_required'
```
Cores da barra de progresso (hex fixo — sem equivalente Tailwind):
- 100% completo: `#16A34A`
- Parcial: `#F59E0B`
- Zero: `#E5E7EB`

## Perfil Colaborador — regras estabelecidas

Regras confirmadas em código (`minhaCarreiraShared.tsx`,
`ColaboradorView.tsx`, `MinhaCarreiraPage.tsx`):

- **Aderência ao cargo**: sempre `calcularAderenciaPorTipo` — única
  implementação, reusada entre o card "Aderência ao cargo atual" (Meu
  Perfil) e o gauge "Aderência ao cargo" (Minha Carreira). Nunca
  reimplementar essa fórmula localmente numa tela nova.
- **Habilidades não avaliadas** (`status === 'sem'`): sempre excluídas
  do numerador e do denominador do cálculo — nunca contam como gap.
- **Escopo**: sempre o cargo ATUAL do colaborador (`JOAO_CARGO_ATUAL`)
  — nunca a jornada inteira.
- **Sistema de cor por card em Meu Perfil** — exceção documentada ao
  padrão geral "cards de métrica nunca usam wrapper colorido"
  (02-design-system.md):
  - Neutro (`bg-[var(--brand-100)]`/`text-[var(--brand-600)]`):
    Avaliações em aberto, Próxima avaliação encerra em, Aderência ao
    cargo atual
  - Verde (`bg-green-100`/`text-green-800`): Avaliações concluídas
  - Âmbar (`bg-amber-100`/`text-amber-600`): Habilidades abaixo do
    esperado
- Nunca replicar lógica do Admin para o Colaborador assumindo que é a
  mesma — ainda válido como princípio geral para qualquer regra nova
  não coberta acima.

## Arquivos sem rota (código morto)

- `CarreirasContext.tsx`: possui alterações não commitadas —
  verificar estado atual antes de modificar.
