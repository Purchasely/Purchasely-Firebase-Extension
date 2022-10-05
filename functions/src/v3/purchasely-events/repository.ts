import { UUID } from "../../utils/types/uuid.type";
import { PurchaselyRepository } from "../../utils/types/purchasely-repository.type";
import { PurchaselyEventDomain } from "./domain/purchasely-event.domain";
import FirebaseFirestore from "@google-cloud/firestore";
import { DateTime } from "luxon";

type RepositoryDomain = PurchaselyEventDomain;

const dateFromNullableDateTime = (key: string, date: DateTime | undefined | null) => (date !== undefined && { [key]: (date === null ? null : date.toJSDate()) });

export const PurchaselyEventsRepository = (collectionName: string) => (db: FirebaseFirestore.Firestore): PurchaselyRepository<RepositoryDomain> => {
  const collection = db.collection(collectionName);

  return {
    create: (id: UUID, item: RepositoryDomain) => {
      return collection
        .doc(id)
        .set({
          ...item,
          ...dateFromNullableDateTime("auto_resume_at", item.auto_resume_at),
          ...dateFromNullableDateTime("defer_end_at", item.defer_end_at),
          event_created_at: item.event_created_at.toJSDate(),
          ...dateFromNullableDateTime("effective_next_renewal_at", item.effective_next_renewal_at),
          ...dateFromNullableDateTime("grace_period_expires_at", item.grace_period_expires_at),
          ...dateFromNullableDateTime("next_renewal_at", item.next_renewal_at),
          ...dateFromNullableDateTime("original_purchased_at", item.original_purchased_at),
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
