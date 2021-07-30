import { PurchaselyRepository } from "../utils/types/purchasely-repository.type";
import { UUID } from "../utils/types/uuid.type";
import { PurchaselyNonConsumableDomain } from "./domain/purchasely-non-consumable.domain";
import FirebaseFirestore from "@google-cloud/firestore";

type RepositoryDomain = PurchaselyNonConsumableDomain;

export const PurchaselyNonConsumablesRepository = (collectionName: string) => (db: FirebaseFirestore.Firestore): PurchaselyRepository<RepositoryDomain> => {
  const collection = db.collection(collectionName);

  return {
    create: (id: string, item: RepositoryDomain) => {
      return collection
        .doc(id)
        .set({
          ...item,
          properties: {
            ...item.properties,
            purchased_at: item.properties.purchased_at.toJSDate(),
          },
          received_at: item.received_at.toJSDate(),
        }, { merge: false })
        .then(() => item);
    },
    update: (_id: string, _item: RepositoryDomain) =>
      Promise.reject(new Error("Method not implemented")),
    delete: (id: UUID) => {
      return collection
        .doc(id)
        .delete()
        .then(() => {
          return;
        });
    },
  };
};
