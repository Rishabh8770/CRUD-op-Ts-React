export type ProductProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  status: ProductStatus;
};

export type ProductStatus =
  | "pending"
  | "active"
  | "rejected"
  | "delete_pending"
  | "deleted"
  | "approval_pending"
  | "delete_approval_pending"
  
export type LocationState = {
  product?: ProductProps;
  editingProduct?: boolean;
  addingNewProduct?: boolean;
  viewOnly?: boolean;
  viewOnlyStatus?: boolean;
};

export type ButtonProps = {
  title: string;
  onSubmit: (newProduct: ProductProps) => void;
  product?: ProductProps;
};

export type ProductListProps = {
  id: string;
  name: string;
  business: string[];
  regions: string[];
  deleteProduct: (id: string) => void;
  isDelete: boolean;
  status: string;
  isAddNewProduct?: boolean;
};
