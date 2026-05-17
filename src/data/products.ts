import meias from "@/assets/p-meias.jpg";
import faixa from "@/assets/p-faixa.jpg";
import sandalia from "@/assets/p-sandalia.jpg";
import tenis from "@/assets/p-tenis.jpg";
import cookie from "@/assets/p-cookie.jpg";
import oculos from "@/assets/p-oculos.jpg";
import jeans from "@/assets/p-jeans.jpg";
import kit from "@/assets/p-kit.jpg";

export type ProductCategory = "Produtos" | "Serviços" | "BW7 Social" | "BW7";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  tag?: "Novo" | "Mais vendido" | "Oferta";
  category: ProductCategory;
}

export const categories: ProductCategory[] = ["Produtos", "Serviços", "BW7 Social", "BW7"];

export const products: Product[] = [
  { id: "1", name: "Meias com fio premium", price: 19.9, oldPrice: 29.9, image: meias, tag: "Oferta", category: "Produtos" },
  { id: "2", name: "Faixinha de cabelo macia", price: 12.5, image: faixa, tag: "Novo", category: "Produtos" },
  { id: "3", name: "Sandália feminina elegante", price: 129.9, oldPrice: 159.9, image: sandalia, tag: "Mais vendido", category: "Produtos" },
  { id: "4", name: "Tênis terapêutico conforto", price: 219.0, image: tenis, category: "Produtos" },
  { id: "5", name: "Cookie Nutella artesanal", price: 9.9, image: cookie, tag: "Novo", category: "Produtos" },
  { id: "6", name: "Óculos feminino redondo", price: 89.9, oldPrice: 119.9, image: oculos, tag: "Oferta", category: "Produtos" },
  { id: "7", name: "Calça jeans modeladora", price: 179.9, image: jeans, category: "Produtos" },
  { id: "8", name: "Kit beleza completo", price: 149.0, oldPrice: 199.0, image: kit, tag: "Mais vendido", category: "Produtos" },
];
