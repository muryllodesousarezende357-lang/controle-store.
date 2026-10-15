export type Product = { id: number; name: string; sku: string; stock: number; price: number };
export type Customer = { id: number; name: string; phone: string; balance: number };
export type Sale = { id: number; customer: string; total: number; date: string; status: string };

export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
