import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Avaliacao, ParticipanteAvaliacao, niveisDefaultData, colaboradoresData, habilidadesCargoData } from '../data/mockData';
import type { Habilidade, StatusAvaliacao, StatusParticipacaoAvaliacao, NivelNome } from '../../data/schema';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';

export interface ParticipacaoColaborador {
  avaliacao: Avaliacao;
  participante: ParticipanteAvaliacao;
}

// Formatação de período/data compartilhada entre MinhasAvaliacoes.tsx,
// RespostaAvaliacaoPage.tsx e ResultadoAvaliacao.tsx — evita reimplementar em
// cada tela (mesmo padrão de formatPeriodo já usado em DashboardPage.tsx,
// mas exportado aqui para reuso entre telas do Colaborador).
export function formatPeriodo(inicio: string, fim: string): string {
  const [yi, mi, di] = inicio.split('-');
  const [yf, mf, df] = fim.split('-');
  if (yi === yf) return `${di}/${mi} – ${df}/${mf}/${yf}`;
  return `${di}/${mi}/${yi} – ${df}/${mf}/${yf}`;
}

export function formatData(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Carreira + Jornada de uma avaliação "Por Jornada" — cruza jornadaId →
// carreiraId → nome da carreira pela FK real (nunca um campo denormalizado).
// Fonte única para AvaliacaoDetalhePage.tsx (header, via jornadasData/
// carreirasData) e FormularioAvaliacao.tsx (card de Revisão, via os arrays
// ao vivo de useCarreiras()) — por isso recebe as listas de jornadas/
// carreiras como parâmetro em vez de importar mockData diretamente: o
// wizard precisa refletir edições feitas no Context, não só o mock estático.
// Retorna null quando a jornada referenciada (ou a carreira dela) não existe
// mais nos dados — FK órfã não deve quebrar a tela, quem chama decide o
// fallback.
export function getCarreiraEJornadaNomes(
  jornadaId: string | undefined,
  jornadas: { id: string; nome: string; carreiraId: string }[],
  carreiras: { id: string; gerenciaId: string }[],
  gerencias: { id: string; nome: string }[]
): { carreira: string; jornada: string } | null {
  if (!jornadaId) return null;
  const jornada = jornadas.find((j) => j.id === jornadaId);
  const carreira = jornada ? carreiras.find((c) => c.id === jornada.carreiraId) : undefined;
  const gerencia = carreira ? gerencias.find((g) => g.id === carreira.gerenciaId) : undefined;
  if (!jornada || !carreira || !gerencia) return null;
  return { carreira: gerencia.nome, jornada: jornada.nome };
}

// 'YYYY-MM-DD' + N dias corridos, em aritmética de data pura (UTC) — nunca
// via Date local (setDate) para não deslocar por fuso horário. Único usado
// por calcularPrazoParticipante para o modo 'prazo_em_dias'.
function adicionarDias(dataISO: string, dias: number): string {
  const [y, m, d] = dataISO.split('-').map(Number);
  const data = new Date(Date.UTC(y, m - 1, d));
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

// Status efetivo de uma avaliação — fonte única de verdade para "o que essa
// avaliação é AGORA", nunca ler avaliacao.status diretamente em tela nenhuma
// (ver 06-integridade-de-dados.md: status gravado só registra decisão manual
// do Admin — Rascunho/Ativa ao ativar/Encerrada ao encerrar; Pendente e
// Expirada são sempre calculados, nunca gravados).
export function calcularStatusEfetivo(avaliacao: Avaliacao, hoje: Date): StatusAvaliacao {
  if (avaliacao.status === 'Encerrada') return 'Encerrada';
  // Só ativa por ação manual do Admin — nunca vira Pendente/Ativa sozinha
  // por data.
  if (avaliacao.status === 'Rascunho') return 'Rascunho';
  if (new Date(avaliacao.periodoInicio).getTime() > hoje.getTime()) return 'Pendente';
  // Término sempre tem PRECEDÊNCIA sobre Prazo para decidir se a avaliação
  // INTEIRA já expirou — presente em 'datas_fixas' e 'datas_fixas_com_prazo'
  // (ver ModoPrazoAvaliacao em schema.ts). Quando periodoFim já passou, a
  // avaliação vira Expirada independentemente de haver participantes com
  // data-limite individual (dataEntrada + prazoDias) ainda não vencida.
  // 'prazo_em_dias' puro e 'indefinido': a avaliação como um todo nunca
  // expira sozinha — em 'prazo_em_dias' só participantes individuais vencem
  // (ver calcularPrazoParticipante); em 'indefinido' ninguém vence, nunca há
  // prazo.
  if (
    (avaliacao.modoPrazo === 'datas_fixas' || avaliacao.modoPrazo === 'datas_fixas_com_prazo') &&
    avaliacao.periodoFim &&
    new Date(avaliacao.periodoFim).getTime() < hoje.getTime()
  ) {
    return 'Expirada';
  }
  return 'Ativa';
}

// Texto de exibição do status calculado de uma Avaliação — única função que
// traduz StatusAvaliacao para o que o usuário vê. O valor interno
// 'Pendente' NUNCA muda (calcularStatusEfetivo, comparações e filtros
// continuam usando esse literal) — só a palavra mostrada na tela vira
// "Agendada". Fonte única reusada por AvaliacaoDetalhePage.tsx e
// ContentArea.tsx (listagem Admin), para as duas nunca divergirem.
export function getStatusAvaliacaoLabel(status: StatusAvaliacao): string {
  return status === 'Pendente' ? 'Agendada' : status;
}

// Cor de badge do status de UMA Avaliação — fonte única para os 5 estados
// (Rascunho/Pendente/Ativa/Encerrada/Expirada). Sempre chamar com o status
// EFETIVO (calcularStatusEfetivo), nunca o campo bruto avaliacao.status.
// Reusada por ContentArea.tsx (listagem Admin) e AvaliacaoDetalhePage.tsx
// (as duas views), para as três nunca divergirem sobre qual cor cada
// estado usa.
export function getStatusAvaliacaoBadgeClass(status: StatusAvaliacao): string {
  if (status === 'Ativa') return 'bg-green-100 text-green-800';
  if (status === 'Pendente') return 'bg-blue-100 text-blue-800';
  if (status === 'Rascunho') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-700'; // Encerrada / Expirada
}

// Cor de badge do estado do colaborador numa avaliação
// (StatusParticipacaoAvaliacao) — fonte única para os 4 estados. Reusada
// por AvaliacaoDetalhePage.tsx e MinhasAvaliacoes.tsx, para as duas nunca
// divergirem.
export function getStatusParticipanteBadgeClass(status: StatusParticipacaoAvaliacao): string {
  if (status === 'Não iniciada') return 'bg-orange-100 text-orange-800';
  if (status === 'Em andamento') return 'bg-blue-100 text-blue-800';
  if (status === 'Concluída') return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-700'; // Expirada
}

// Prazo efetivo de UM participante — fonte única, nunca ler
// avaliacao.periodoFim diretamente para decidir vencimento/urgência
// individual (nos modos com prazoDias, cada participante tem uma data-limite
// diferente, contada a partir de quando ele entrou na avaliação — o número
// de dias é o mesmo para todos, só a data resultante varia). Retorna
// undefined no modo 'indefinido' — participante sem data-limite nenhuma.
// Nunca chamar estaVencida/calcularDiasAteVencimento/formatData direto com
// esse retorno sem checar undefined primeiro — use os wrappers abaixo
// (participanteVencido/diasAteVencimentoParticipante/formatPrazoParticipante).
// Assinatura em Pick (mesmo espírito de formatPeriodoAvaliacao acima) —
// permite chamar com uma Avaliacao simulada que ainda não existe de fato
// (ex.: QuestionarioPreview, dentro do wizard de criação), sem precisar
// forjar um objeto Avaliacao/ParticipanteAvaliacao completo só para bater
// com o tipo.
export function calcularPrazoParticipante(
  avaliacao: Pick<Avaliacao, 'modoPrazo' | 'periodoFim' | 'prazoDias'>,
  participante: Pick<ParticipanteAvaliacao, 'dataEntrada'>
): string | undefined {
  if (avaliacao.modoPrazo === 'indefinido') {
    return undefined;
  }
  if (avaliacao.modoPrazo === 'datas_fixas') {
    return avaliacao.periodoFim!;
  }
  const prazoIndividual = adicionarDias(participante.dataEntrada, avaliacao.prazoDias!);
  if (avaliacao.modoPrazo === 'datas_fixas_com_prazo') {
    // Término e Prazo juntos — o que vencer primeiro, nunca o Término
    // ignorando um prazo individual mais curto nem o contrário.
    return prazoIndividual < avaliacao.periodoFim! ? prazoIndividual : avaliacao.periodoFim!;
  }
  return prazoIndividual; // 'prazo_em_dias'
}

// Texto de período para exibição — única fonte que sabe formatar os 4 modos
// de prazo (indefinido / datas_fixas / prazo_em_dias / datas_fixas_com_prazo)
// e o caso "ainda não ativada, sem data nenhuma" (Rascunho). Reusada por qualquer tela que
// mostra o período de uma Avaliacao real (ContentArea.tsx,
// AvaliacaoDetalhePage.tsx, DashboardPage.tsx) e também pelo wizard
// (FormularioAvaliacao.tsx), que simula uma Avaliacao com os campos já
// inferidos para mostrar o mesmo texto em preview, antes de a avaliação
// existir de fato — por isso o parâmetro aceita só os 4 campos de prazo
// (Pick), não a Avaliacao inteira.
export function formatPeriodoAvaliacao(
  avaliacao: Pick<Avaliacao, 'modoPrazo' | 'periodoInicio' | 'periodoFim' | 'prazoDias'>
): string {
  if (!avaliacao.periodoInicio) return 'A definir';
  if (avaliacao.modoPrazo === 'datas_fixas') {
    return avaliacao.periodoFim
      ? formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim)
      : formatData(avaliacao.periodoInicio);
  }
  if (avaliacao.modoPrazo === 'indefinido') {
    return `A partir de ${formatData(avaliacao.periodoInicio)} – sem término`;
  }
  const dias = avaliacao.prazoDias;
  if (avaliacao.modoPrazo === 'datas_fixas_com_prazo') {
    const prazoTxt = dias != null ? `${dias} ${dias === 1 ? 'dia' : 'dias'} de prazo individual` : 'prazo individual a definir';
    return `A partir de ${formatData(avaliacao.periodoInicio)} · até ${avaliacao.periodoFim ? formatData(avaliacao.periodoFim) : 'A definir'} · ${prazoTxt} (o que vencer primeiro)`;
  }
  return `A partir de ${formatData(avaliacao.periodoInicio)} · ${dias != null ? `${dias} ${dias === 1 ? 'dia' : 'dias'} de prazo` : 'prazo a definir'}`;
}

// Ícone Info + tooltip "Esta avaliação se tornará ativa no dia X" — aviso
// sutil de que uma avaliação com status calculado 'Pendente' ("Agendada")
// vai ativar sozinha naquela data, sem ação nenhuma do Admin. Extraído como
// função própria (não JSX inline) para ser reusado tanto por getPrazoPartes
// (parte "Inicia em" da LinhaMeta) quanto pela coluna "Início" da tabela de
// Avaliações em ContentArea.tsx — nunca duplicar esse Tooltip/Info em cada
// lugar que precisa avisar sobre uma Data de Início futura.
// `corIcone` (default 'text-gray-400', mesmo padrão sutil dos demais ícones
// de tooltip) — a coluna "Início" de ContentArea.tsx passa 'text-red-500'
// quando a ativação está a 5 dias ou menos (ver getStatusAvaliacaoBadgeClass
// e a cor de alerta já documentada em 02-design-system.md, "Ícones > Cores
// por contexto"), sem alterar o padrão cinza usado em getPrazoPartes/
// AvaliacaoDetalhePage.tsx e no preview de FormularioAvaliacao.tsx.
// `texto` (opcional) sobrescreve a mensagem padrão "Esta avaliação se
// tornará ativa no dia X" — a mesma coluna "Início" passa a versão em
// contador regressivo ("Vai ficar ativa em N dias"/"amanhã"/"hoje") quando
// está dentro da janela de 5 dias, reaproveitando o N já calculado ali via
// calcularDiasAteVencimento, nunca recalculado de novo aqui dentro.
export function AvisoAtivacaoAgendada({
  dataISO,
  corIcone = 'text-gray-400',
  texto,
}: {
  dataISO: string;
  corIcone?: string;
  texto?: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className={`w-3.5 h-3.5 ${corIcone} flex-shrink-0`} />
      </TooltipTrigger>
      <TooltipContent>
        {texto ?? <>Esta avaliação se tornará ativa no dia {formatData(dataISO)}.</>}
      </TooltipContent>
    </Tooltip>
  );
}

// Partes condicionais do prazo (Início / Término / Prazo de resposta) — cada
// campo preenchido vira um item próprio (negrito), pra uso dentro de
// LinhaMeta (separado pelo "·" padrão do componente) — 1, 2 ou 3 partes,
// dependendo da combinação da avaliação (periodoFim e prazoDias são campos
// independentes, ver ModoPrazoAvaliacao em schema.ts). Quando nenhuma das
// três está definida (Rascunho recém-criado, antes de qualquer data), cai no
// mesmo "A definir" que já existia para esse caso. Extraída de
// AvaliacaoDetalhePage.tsx (era função local ali) para ser reusada também
// pelo card "Prazo" da etapa Revisão em FormularioAvaliacao.tsx, que simula
// uma Avaliacao com os campos já inferidos antes de ela existir de fato —
// por isso o parâmetro aceita só os 3 campos de prazo (Pick), não a
// Avaliacao inteira, mesmo espírito de formatPeriodoAvaliacao acima.
// `agendada` (default false) sinaliza que a Data de Início é futura — status
// calculado 'Pendente'/"Agendada" em AvaliacaoDetalhePage.tsx, ou
// dataInicioFutura na etapa Revisão do wizard (mesmo conceito, avaliação
// ainda não criada). Nesse caso, a parte "Inicia em" ganha um ícone Info
// (mesmo padrão w-3.5 h-3.5 do ícone de Prazo abaixo) com tooltip avisando
// que a ativação é automática — nunca um banner novo, só esse aviso sutil.
// Nunca passar `agendada` para uma Avaliacao Rascunho: Rascunho nunca tem
// status calculado 'Pendente' (calcularStatusEfetivo devolve 'Rascunho'
// direto, sem checar periodoInicio), mesmo com Data de Início futura já
// escolhida no wizard — por isso AvaliacaoRascunhoView em
// AvaliacaoDetalhePage.tsx nunca passa esse argumento.
// `peso` — 'semibold' (default) é o peso usado em toda parte que já
// reaproveita esta função (AvaliacaoDetalhePage.tsx, nas duas views).
// FormularioAvaliacao.tsx passa 'normal' só no card "Prazo" da etapa
// Revisão do wizard (exceção visual documentada em 02-design-system.md) —
// nunca duplicar a montagem do texto/partes em outro lugar só pra mudar o
// peso da fonte; sempre passar por aqui. Precisa setar a classe
// explicitamente nos dois casos (nunca omitir): `<strong>` é bold por
// padrão do user-agent, então "não aplicar font-semibold" sozinho não
// bastaria pra ficar regular.
export function getPrazoPartes(
  avaliacao: Pick<Avaliacao, 'periodoInicio' | 'periodoFim' | 'prazoDias'>,
  agendada = false,
  peso: 'semibold' | 'normal' = 'semibold'
): ReactNode[] {
  const pesoClasse = peso === 'normal' ? 'font-normal' : 'font-semibold';
  const partes: ReactNode[] = [];
  if (avaliacao.periodoInicio) {
    partes.push(
      <strong className={`${pesoClasse} inline-flex items-center gap-1`} key="inicio">
        Inicia em: {formatData(avaliacao.periodoInicio)}
        {agendada && <AvisoAtivacaoAgendada dataISO={avaliacao.periodoInicio} />}
      </strong>
    );
  }
  if (avaliacao.periodoFim) {
    partes.push(
      <strong className={pesoClasse} key="termino">
        Termina em: {formatData(avaliacao.periodoFim)}
      </strong>
    );
  }
  if (avaliacao.prazoDias != null) {
    partes.push(
      <strong className={`${pesoClasse} inline-flex items-center gap-1`} key="prazo">
        Prazo de resposta: {avaliacao.prazoDias} {avaliacao.prazoDias === 1 ? 'dia' : 'dias'}
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent>
            É o mesmo número de dias para todos, mas a data-limite de cada participante varia: é
            contada a partir da data em que ele entrou na avaliação.
          </TooltipContent>
        </Tooltip>
      </strong>
    );
  }
  return partes.length > 0 ? partes : ['A definir'];
}

// Wrappers null-safe de calcularPrazoParticipante — fonte única para toda
// tela que hoje decide vencimento/urgência/exibição de UM participante.
// Nunca repetir "calcularPrazoParticipante(...) != null &&" em cada tela;
// sempre passar por um destes 3.
export function participanteVencido(avaliacao: Avaliacao, participante: ParticipanteAvaliacao, hoje: Date): boolean {
  const prazo = calcularPrazoParticipante(avaliacao, participante);
  return prazo != null && estaVencida(prazo, hoje);
}

export function diasAteVencimentoParticipante(avaliacao: Avaliacao, participante: ParticipanteAvaliacao, hoje: Date): number | null {
  const prazo = calcularPrazoParticipante(avaliacao, participante);
  return prazo != null ? calcularDiasAteVencimento(prazo, hoje) : null;
}

export function formatPrazoParticipante(avaliacao: Avaliacao, participante: ParticipanteAvaliacao): string {
  const prazo = calcularPrazoParticipante(avaliacao, participante);
  return prazo != null ? formatData(prazo) : 'Sem prazo definido';
}

// Nível esperado por habilidade para o cargo ATUAL de um colaborador
// QUALQUER — fonte única para telas que precisam comparar a resposta de um
// colaborador arbitrário (não só João) contra o nível esperado do cargo
// dele. Lê sempre de habilidadesCargoData (fonte real usada pela Matriz do
// Admin), nunca de joaoHabilidadesCargoMatriz (mock exclusivo das telas de
// teste de João Silva — ver matrizParaCargo em minhaCarreiraShared.tsx, que
// é o equivalente já existente mas específico do fluxo Colaborador/João).
//
// Distingue os 3 estados documentados em 04-regras-negocio.md/
// 06-integridade-de-dados.md — nunca colapsar em um só:
// - 'configurado': há entrada em habilidadesCargoData com um nível real.
// - 'nao_exigido': há entrada, mas com nivelEsperado = 'not_required' —
//   decisão EXPLÍCITA do RH de que o cargo não exige essa habilidade.
// - 'nao_configurado': não há entrada nenhuma — RH ainda não definiu.
export type NivelEsperadoInfo =
  | { tipo: 'configurado'; nivel: NivelNome }
  | { tipo: 'nao_exigido' }
  | { tipo: 'nao_configurado' };

export function getNivelEsperadoPorColaborador(colaboradorId: string): Map<string, NivelEsperadoInfo> {
  const map = new Map<string, NivelEsperadoInfo>();
  const colaborador = colaboradoresData.find(c => c.id === colaboradorId);
  if (!colaborador) return map;
  habilidadesCargoData
    .filter(h => h.cargoId === colaborador.cargoId)
    .forEach(h => {
      map.set(
        h.habilidadeId,
        h.nivelEsperado === 'not_required'
          ? { tipo: 'nao_exigido' }
          : { tipo: 'configurado', nivel: h.nivelEsperado }
      );
    });
  return map;
}

// Escala de níveis ESPECÍFICA de uma habilidade (habilidade.niveis) — nunca
// niveisDefaultData inteiro, que mistura as duas escalas do sistema
// (Básico/Avançado E Iniciante/Aprendiz). Fonte única usada por
// RespostaAvaliacaoPage.tsx, para nunca divergir na junção nível+critério.
export function getNiveisHabilidade(habilidade: Habilidade) {
  return habilidade.niveis
    .map(n => {
      const nivel = niveisDefaultData.find(nd => nd.id === n.nivelId);
      return nivel ? { ...nivel, criterio: n.criterio } : null;
    })
    .filter((n): n is (typeof niveisDefaultData)[number] & { criterio: string } => n != null);
}

// Participações de um colaborador em avaliações reais — nunca inclui
// Rascunho (regra: avaliação Rascunho nunca é visível ao colaborador,
// ver 04-regras-negocio.md). Fonte única usada por ColaboradorView.tsx e
// MinhasAvaliacoes.tsx, para as duas nunca divergirem.
export function getParticipacoesColaborador(
  avaliacoes: Avaliacao[],
  colaboradorId: string
): ParticipacaoColaborador[] {
  return avaliacoes
    .filter(av => av.status !== 'Rascunho')
    .flatMap(av => {
      const participante = av.participantes.find(p => p.colaboradorId === colaboradorId);
      return participante ? [{ avaliacao: av, participante }] : [];
    });
}

export interface ProximaAvaliacaoInfo {
  diasAteVencimento: number | null;
  diasLabel: string;
  avaliacaoId: string | null;
}

// Dias até um periodoFim — fonte única do cálculo de dias restantes, usada
// tanto pelo card de resumo (getProximaAvaliacaoInfo) quanto por qualquer
// tela que precise da urgência de UMA avaliação específica (ex.: contorno
// por card em MinhasAvaliacoes.tsx). Nunca duplicar essa conta.
export function calcularDiasAteVencimento(periodoFim: string, hoje: Date): number {
  return Math.max(0, Math.ceil((new Date(periodoFim).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)));
}

// Dias decorridos desde uma data (ex.: periodoInicio) — usado pelo badge
// "Nova" em MinhasAvaliacoes.tsx. Mesma unidade de cálculo de
// calcularDiasAteVencimento, só invertendo a direção.
export function calcularDiasDesde(data: string, hoje: Date): number {
  return Math.max(0, Math.floor((hoje.getTime() - new Date(data).getTime()) / (1000 * 60 * 60 * 24)));
}

// Uma avaliação "Não iniciada"/"Em andamento" cujo prazo já passou deve virar
// Expirada dinamicamente — nunca depender de um campo status gravado à mão
// (ver 06-integridade-de-dados.md). Fonte única reusada por
// getProximaAvaliacaoInfo, MinhasAvaliacoes.tsx e ColaboradorView.tsx, para
// as três nunca divergirem sobre o que conta como "em aberto".
export function estaVencida(periodoFim: string, hoje: Date): boolean {
  return new Date(periodoFim).getTime() < hoje.getTime();
}

// Cálculo do "próxima avaliação encerra em" — fonte única usada por
// ColaboradorView.tsx (Meu Perfil) e MinhasAvaliacoes.tsx, mesmo espírito de
// calcularAderenciaPorTipo em minhaCarreiraShared.tsx: nunca duplicar a
// conta em cada tela. avaliacaoId identifica qual avaliação em aberto é essa
// "próxima", para telas destacarem a linha correspondente sem recalcular.
export function getProximaAvaliacaoInfo(
  participacoes: ParticipacaoColaborador[],
  hoje: Date
): ProximaAvaliacaoInfo {
  const prazoDe = ({ avaliacao, participante }: ParticipacaoColaborador) =>
    calcularPrazoParticipante(avaliacao, participante);
  // "Em aberto" inclui participantes em modoPrazo 'indefinido' (nunca
  // vencem), mas esses ficam de fora do reduce de "próximo a vencer" logo
  // abaixo — sem prazo, não fazem sentido como candidato a "próxima
  // avaliação encerra em X dias". Se só houver participações 'indefinido'
  // em aberto, diasAteVencimento fica null (exibido como "-").
  const emAberto = participacoes.filter(
    (pc) =>
      (pc.participante.status === 'Não iniciada' || pc.participante.status === 'Em andamento') &&
      !participanteVencido(pc.avaliacao, pc.participante, hoje)
  );
  const emAbertoComPrazo = emAberto.filter((pc) => prazoDe(pc) != null);
  const proximaVencimento = emAbertoComPrazo.length > 0
    ? emAbertoComPrazo.reduce((min, atual) => prazoDe(atual)! < prazoDe(min)! ? atual : min)
    : null;
  const diasAteVencimento = proximaVencimento
    ? calcularDiasAteVencimento(prazoDe(proximaVencimento)!, hoje)
    : null;
  const diasLabel = diasAteVencimento !== null
    ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
    : '-';
  return { diasAteVencimento, diasLabel, avaliacaoId: proximaVencimento?.avaliacao.id ?? null };
}
