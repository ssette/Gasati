export interface OrderItem {
  ord_id: number;
  prod_id: number;
  oitm_quantity: number;
}

export interface OrderItemWProduct extends OrderItem {
  prod_description: string;
  prod_price: number;
}
