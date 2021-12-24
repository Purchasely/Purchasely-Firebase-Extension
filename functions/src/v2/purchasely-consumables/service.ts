import { UUID } from "../../utils/types/uuid.type";
import { PurchaselyConsumablesRepository } from "./repository";
import { PurchaselyConsumableDomain } from "./domain/purchasely-consumable.domain";
import { PurchaselyRepository } from "../../utils/types/purchasely-repository.type";
import { PurchaselyService } from "../../utils/types/purchasely-service.type";
import FirebaseFirestore from "@google-cloud/firestore";

type ServiceDomain = PurchaselyConsumableDomain;

export type PurchaselyConsumablesServiceInterface =
  PurchaselyService<ServiceDomain>;

export const PurchaselyConsumablesService = (
  repository: PurchaselyRepository<ServiceDomain>
): PurchaselyConsumablesServiceInterface => {
  return {
    create: (id: UUID, item: ServiceDomain) => repository.create(id, item),
    update: (id: UUID, item: ServiceDomain) => repository.update(id, item),
    delete: (id: UUID) => repository.delete(id),
  };
};

export const PurchaselyConsumablesServiceFirestoreInstance =
  (collectionName: string) =>
    (db: FirebaseFirestore.Firestore): PurchaselyConsumablesServiceInterface =>
      PurchaselyConsumablesService(PurchaselyConsumablesRepository(collectionName)(db))
