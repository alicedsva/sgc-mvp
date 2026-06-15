export interface CargoDisponivel {
  id: string;
  nome: string;
  categoria: string;
}

export const cargosDisponiveisRM: CargoDisponivel[] = [
  { id: 'rm1',  nome: 'Desenvolvedor Junior',             categoria: 'Tecnologia' },
  { id: 'rm2',  nome: 'Desenvolvedor Pleno',              categoria: 'Tecnologia' },
  { id: 'rm3',  nome: 'Desenvolvedor Sênior',             categoria: 'Tecnologia' },
  { id: 'rm4',  nome: 'Tech Lead',                        categoria: 'Tecnologia' },
  { id: 'rm5',  nome: 'Arquiteto de Software',            categoria: 'Tecnologia' },
  { id: 'rm6',  nome: 'Analista de Infraestrutura Junior', categoria: 'Tecnologia' },
  { id: 'rm7',  nome: 'Analista de Infraestrutura Pleno',  categoria: 'Tecnologia' },
  { id: 'rm8',  nome: 'Analista de Infraestrutura Sênior', categoria: 'Tecnologia' },
  { id: 'rm9',  nome: 'Analista de Dados Junior',         categoria: 'Tecnologia' },
  { id: 'rm10', nome: 'Analista de Dados Pleno',          categoria: 'Tecnologia' },
  { id: 'rm11', nome: 'Analista de Dados Sênior',         categoria: 'Tecnologia' },
  { id: 'rm12', nome: 'Engenheiro de Software Junior',    categoria: 'Tecnologia' },
  { id: 'rm13', nome: 'Engenheiro de Software Pleno',     categoria: 'Tecnologia' },
  { id: 'rm14', nome: 'Engenheiro de Software Sênior',    categoria: 'Tecnologia' },
  { id: 'rm15', nome: 'Product Manager Junior',           categoria: 'Produto' },
  { id: 'rm16', nome: 'Product Manager Pleno',            categoria: 'Produto' },
  { id: 'rm17', nome: 'Product Manager Sênior',           categoria: 'Produto' },
];
