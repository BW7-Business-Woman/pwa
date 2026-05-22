export type MarketplaceService = {
  title: string;
  provider: string;
  category: string;
  location: string;
  price: string;
  duration: string;
  rating: string;
  badge: string;
  description: string;
};

export const marketplaceServices: MarketplaceService[] = [
  {
    title: "Consultoria de imagem",
    provider: "Marina Alves",
    category: "Moda e autoestima",
    location: "Online",
    price: "R$ 180",
    duration: "60 min",
    rating: "4,9",
    badge: "Mais buscado",
    description:
      "Sessao para organizar estilo pessoal, rotina e escolhas de compra com mais seguranca.",
  },
  {
    title: "Mentoria de negocios",
    provider: "Patricia Mendes",
    category: "Empreendedorismo",
    location: "Online",
    price: "R$ 220",
    duration: "90 min",
    rating: "5,0",
    badge: "BW7 Pro",
    description:
      "Plano pratico para vendas, posicionamento, precificacao e proximos passos da marca.",
  },
  {
    title: "Design para redes sociais",
    provider: "Studio Lume",
    category: "Marketing",
    location: "Sao Paulo, SP",
    price: "R$ 350",
    duration: "Pacote",
    rating: "4,8",
    badge: "Entrega rapida",
    description: "Identidade visual e artes para campanhas, lancamentos e comunicacao comercial.",
  },
  {
    title: "Aula particular de confeitaria",
    provider: "Doce Rede",
    category: "Gastronomia",
    location: "Curitiba, PR",
    price: "R$ 160",
    duration: "2h",
    rating: "4,7",
    badge: "Presencial",
    description:
      "Encontro individual para aprender receitas, montagem, acabamento e venda de doces.",
  },
];
