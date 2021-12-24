import { UUID } from "../utils/types/uuid.type";
import { PurchaselyEventsRepository } from "./repository";
import { PurchaselyEventDomain } from "./domain/purchasely-event.domain";
import { PurchaselyRepository } from "../utils/types/purchasely-repository.type";
import { PurchaselyService } from "../utils/types/purchasely-service.type";
import FirebaseFirestore from "@google-cloud/firestore";


type ServiceDomain = PurchaselyEventDomain;

export type PurchaselyEventsServiceInterface =
  PurchaselyService<ServiceDomain>;

export const PurchaselyEventsService = (
  repository: PurchaselyRepository<ServiceDomain>
): PurchaselyEventsServiceInterface => {
  return {
    create: (id: string, item: ServiceDomain) => repository.create(id, item),
    update: (id: string, item: ServiceDomain) => repository.update(id, item),
    delete: (id: UUID) => repository.delete(id),
  };
};

export const PurchaselyEventsServiceFirestoreInstance =
  (collectionName: string) =>
    (db: FirebaseFirestore.Firestore): PurchaselyEventsServiceInterface =>
      PurchaselyEventsService(PurchaselyEventsRepository(collectionName)(db));