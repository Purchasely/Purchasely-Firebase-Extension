import { UUID } from "../utils/types/uuid.type";
import { PurchaselySubscriptionsRepository } from "./repository";
import { PurchaselySubscriptionDomain } from "./domain/purchasely-subscription.domain";
import { PurchaselyRepository } from "../utils/types/purchasely-repository.type";
import { PurchaselyService } from "../utils/types/purchasely-service.type";
import FirebaseFirestore from "@google-cloud/firestore";

type ServiceDomain = PurchaselySubscriptionDomain;

export type PurchaselySubscriptionsServiceInterface =
  PurchaselyService<ServiceDomain>;

export const PurchaselySubscriptionsService = (
  repository: PurchaselyRepository<ServiceDomain>
): PurchaselySubscriptionsServiceInterface => {
  return {
    create: (id: UUID, item: ServiceDomain) => repository.create(id, item),
    update: (id: UUID, item: ServiceDomain) => repository.update(id, item),
    delete: (id: UUID) => repository.delete(id),
  };
};

export const PurchaselySubscriptionsServiceFirestoreInstance =
  (collectionName: string) =>
    (db: FirebaseFirestore.Firestore): PurchaselySubscriptionsServiceInterface =>
      PurchaselySubscriptionsService(PurchaselySubscriptionsRepository(collectionName)(db))
