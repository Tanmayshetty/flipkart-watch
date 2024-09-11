export interface FlipkartProductData {
  price: number;
  date: string;
  type: string;
  priceNotify: number;
  url: string;
  header: string;
  shouldNotify: boolean;
}

export interface FlipkartProcessed {
  [key: string]: FlipkartProductData[];
}

export interface FlipkartLinks {
  url: string;
  type: string;
  priceNotify: number;
  soldOut?: boolean;
}
