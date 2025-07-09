
export interface Variacao {
  id: string;
  nome: string;
  cor: string;
  tamanho: string;
  nomePersonalizado: string;
  sku: string;
  ean: string;
  precoCusto: string;
  imagem?: File;
}

export interface FormData {
  tipo: string;
  nome: string;
  sku: string;
  categoria: string;
  marca: string;
  descricao: string;
  precoCusto: string;
  estoque: string;
  armazem: string;
  altura: string;
  largura: string;
  comprimento: string;
  peso: string;
  codigoBarras: string;
  ncm: string;
  cest: string;
  unidade: string;
  origem: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}
