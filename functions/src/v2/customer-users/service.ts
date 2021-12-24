import { CustomerUsersRepository } from "./repository";
import { CustomerUserDomain } from "./domain/customer-user.domain";
import { PurchaselyRepository } from "../../utils/types/purchasely-repository.type";
import { PurchaselyService } from "../../utils/types/purchasely-service.type";
import FirebaseFirestore from "@google-cloud/firestore";

export type PurchaselyUsersServiceInterface =
  PurchaselyService<CustomerUserDomain>;

export const PurchaselyUsersService = (
  repository: PurchaselyRepository<CustomerUserDomain>
): PurchaselyUsersServiceInterface => {
  return {
    create: (id: string, item: CustomerUserDomain) => repository.create(id, item),
    update: (id: string, item: CustomerUserDomain) => repository.update(id, item),
    delete: (id: string) => repository.delete(id),
  };
};

export const PurchaselyUsersServiceFirestoreInstance =
  (collectionName: string) =>
    (db: FirebaseFirestore.Firestore): PurchaselyUsersServiceInterface =>
      PurchaselyUsersService(CustomerUsersRepository(collectionName)(db));
