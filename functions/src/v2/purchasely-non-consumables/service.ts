import { UUID } from "../utils/types/uuid.type";
import { PurchaselyNonConsumablesRepository } from "./repository";
import { PurchaselyNonConsumableDomain } from "./domain/purchasely-non-consumable.domain";
import { PurchaselyRepository } from "../utils/types/purchasely-repository.type";
import { PurchaselyService } from "../utils/types/purchasely-service.type";
import FirebaseFirestore from "@google-cloud/firestore";

type ServiceDomain = PurchaselyNonConsumableDomain;

export type PurchaselyNonConsumablesServiceInterface =
  PurchaselyService<ServiceDomain>;

export const PurchaselyNonConsumablesService = (
  repository: PurchaselyRepository<ServiceDomain>
): PurchaselyNonConsumablesServiceInterface => {
  return {
    create: (id: UUID, item: ServiceDomain) => repository.create(id, item),
    update: (id: UUID, item: ServiceDomain) => repository.update(id, item),
    delete: (id: UUID) => repository.delete(id),
  };
};

export const PurchaselyNonConsumablesServiceFirestoreInstance =
  (collectionName: string) =>
    (db: FirebaseFirestore.Firestore): PurchaselyNonConsumablesServiceInterface =>
      PurchaselyNonConsumablesService(PurchaselyNonConsumablesRepository(collectionName)(db))
