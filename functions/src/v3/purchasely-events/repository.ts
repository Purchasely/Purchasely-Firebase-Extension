import { UUID } from "../../utils/types/uuid.type";
import { PurchaselyRepository } from "../../utils/types/purchasely-repository.type";
import { PurchaselyEventDomain } from "./domain/purchasely-event.domain";
import FirebaseFirestore from "@google-cloud/firestore";

type RepositoryDomain = PurchaselyEventDomain;

export const PurchaselyEventsRepository = (collectionName: string) => (db: FirebaseFirestore.Firestore): PurchaselyRepository<RepositoryDomain> => {
  const collection = db.collection(collectionName);

  return {
    create: (id: UUID, item: RepositoryDomain) => {
      return collection
        .doc(id)
        .set({
          ...item,
          auto_resume_at: item.auto_resume_at === null ? null : item.auto_resume_at.toJSDate(),
          defer_end_at: item.defer_end_at === null ? null : item.defer_end_at.toJSDate(),
          event_created_at: item.event_created_at.toJSDate(),
          effective_next_renewal_at: item.effective_next_renewal_at === null ? null : item.effective_next_renewal_at.toJSDate(),
          grace_period_expires_at: item.grace_period_expires_at === null ? null : item.grace_period_expires_at.toJSDate(),
          next_renewal_at: item.next_renewal_at === null ? null : item.next_renewal_at.toJSDate(),
          original_purchased_at: item.original_purchased_at === null ? null : item.original_purchased_at.toJSDate(),
          purchased_at: item.purchased_at.toJSDate(),
          store_country: item.store_country === null ? null : item.store_country
        })
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
