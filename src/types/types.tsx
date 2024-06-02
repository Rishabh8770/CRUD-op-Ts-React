export type ProductProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  status: ProductStatus;
};

export type ProductStatus = 'pending' | 'active' | 'rejected';
