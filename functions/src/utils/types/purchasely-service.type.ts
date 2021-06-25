export type PurchaselyService<T> = {
  create: (id: string, item: T) => Promise<T>;
  update: (id: string, item: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
};
