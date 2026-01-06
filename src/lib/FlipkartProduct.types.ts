export interface FlipkartProductData {
  currentPrice: number;
  type: string;
  priceNotify: number;
  url: string;
  productId: number;
  history: ProductHistory[];
  isSoldOut: boolean;
  shouldNotify: boolean;
  lowestPrice: number;
  header: string;
}

export interface FlipkartProcessed {
  [key: string]: FlipkartProductData[];
}

export interface FlipkartLinks {
  url: string;
  type: string;
  priceNotify: number;
  soldOut?: boolean;
  header: string;
}

export interface ProductHistory {
  price: number;
  date: string;
  shouldNotify: boolean;
}
