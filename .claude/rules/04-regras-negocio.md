---

# Regras de negócio

## Níveis de habilidade

- Cor sempre derivada de `getCorFromPeso(nivel.peso)` — nunca hardcoded
- Hierarquia definida pela ordem de progressão (1–5), nunca pelo nome
- Nomes são definidos livremente pelo RH (não são fixos)
- Texto em badges de nível: sempre `text-white`
- Desempate de ordem igual: ordem alfabética pelo nome
- Atenção: `nivelToNumber` em `mockData.ts` usa nomes fixos (Básico, Intermediário,
  Avançado, Especialista) — isso é limitação do mock, não regra do sistema.
  No sistema real os nomes são livres.

### Ciclo de vida dos estados de nível
```
Ativo → Desativado → Arquivado
```
- **Desativado**: não aparece em novas seleções; histórico de uso preservado
- **Arquivado**: removido das listas; histórico preservado em relatórios
- **Restaurar arquivado** → volta para Desativado (não para Ativo)

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

## Perfil Colaborador — status de implementação

As telas do Colaborador (Meu Perfil, Minhas Avaliações,
Minha Carreira) estão em construção ativa.

Regras importantes:
- Não assumir que nenhuma regra de negócio está definida
  para o Colaborador sem confirmação explícita
- Limiares de cobertura de habilidades ainda não definidos
- Visualizações (radar, barras) ainda em validação nas
  rotas /testes/*
- Ao implementar qualquer coisa no perfil Colaborador,
  perguntar antes: "Há regra definida para isso?"
- Nunca replicar lógica do Admin para o Colaborador
  assumindo que é a mesma

Telas com banner "Em construção":
- MeuPerfilPage
- MinhasAvaliacoesPage
- MinhaCarreiraPage

## Arquivos sem rota (código morto)

- `CarreirasContext.tsx`: possui alterações não commitadas —
  verificar estado atual antes de modificar.
