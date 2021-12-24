import { PurchaselyRepository } from "../../utils/types/purchasely-repository.type";
import FirebaseFirestore from "@google-cloud/firestore";
import { CustomerUserDomain } from "./domain/customer-user.domain";

export const CustomerUsersRepository = (_collectionName: string) => (_db: FirebaseFirestore.Firestore): PurchaselyRepository<CustomerUserDomain> => {
  // const collection = db.collection(collectionName);
  return {
    create: (_id: string, _item: CustomerUserDomain) =>
      Promise.reject("Invalid user has no anonymous id nor vendor id"),
    update: (_id: string, _item: CustomerUserDomain) =>
      Promise.reject("Invalid user has no anonymous id nor vendor id"),
    delete: (_id: string) =>
      Promise.reject("Cannot delete customer user from customer users collection"),
  };
};
