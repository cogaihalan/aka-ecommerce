export interface Address {
  id: number;
  type: "shipping" | "billing";
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  phone?: string;
  isDefault: boolean;
}
