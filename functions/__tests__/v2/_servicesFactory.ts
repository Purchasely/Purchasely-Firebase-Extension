import { FirebaseCustomClaimsRepositoryInterface, RepositoryDomain as CustomClaimsRepositoryDomain } from "../../src/v2/firebase-custom-claims/repository"
import { FirebaseCustomClaimsService } from "../../src/v2/firebase-custom-claims/service"
import { PurchaselyConsumableDomain } from "../../src/v2/purchasely-consumables/domain/purchasely-consumable.domain"
import { PurchaselyConsumablesService } from "../../src/v2/purchasely-consumables/service"
import { PurchaselyEventDomain } from "../../src/v2/purchasely-events/domain/purchasely-event.domain"
import { PurchaselyEventsService } from "../../src/v2/purchasely-events/service"
import { PurchaselyNonConsumableDomain } from "../../src/v2/purchasely-non-consumables/domain/purchasely-non-consumable.domain"
import { PurchaselyNonConsumablesService } from "../../src/v2/purchasely-non-consumables/service"
import { PurchaselySubscriptionDomain } from "../../src/v2/purchasely-subscriptions/domain/purchasely-subscription.domain"
import { PurchaselySubscriptionsService } from "../../src/v2/purchasely-subscriptions/service"
import { PurchaselyRepository } from "../../src/utils/types/purchasely-repository.type"
import { PurchaselyLoggingService } from "../../src/purchasely-logging/service";

export const servicesFactory = () => {

  const fakeRepository = <T>(): PurchaselyRepository<T> => ({
    create: (_id: string, item: T) => Promise.resolve(item),
    update: (_id: string, item: T) => Promise.resolve(item),
    delete: (_id: string) => Promise.resolve(),
  });

  const fakeCustomClaimsRepository = (): FirebaseCustomClaimsRepositoryInterface => {
    const repository: {
      [key: string]: CustomClaimsRepositoryDomain
    } = {}
    return {
      get: (userFirestoreId: string) => Promise.resolve(repository[userFirestoreId] ?? { purchasely_subscriptions: [] }),
      update: (userFirestoreId: string, item: CustomClaimsRepositoryDomain) => {
        repository[userFirestoreId] = item;
        return Promise.resolve(item);
      },
      delete: (userFirestoreId: string) => {
        repository[userFirestoreId] = { purchasely_subscriptions: [] }
        return Promise.resolve(repository[userFirestoreId]);
      }
    }
  }

  const customClaimsRepository = fakeCustomClaimsRepository();
  const loggingService = PurchaselyLoggingService();
  return {
    firebaseCustomClaims: FirebaseCustomClaimsService(customClaimsRepository),
    customClaimsRepository,
    events: PurchaselyEventsService(fakeRepository<PurchaselyEventDomain>()),
    logs: {
      ...loggingService,
      logger: {
        ...loggingService.logger,
        debug: () => { },
        info: () => { },
      }
    },
    consumables: PurchaselyConsumablesService(fakeRepository<PurchaselyConsumableDomain>()),
    nonConsumables: PurchaselyNonConsumablesService(fakeRepository<PurchaselyNonConsumableDomain>()),
    subscriptions: PurchaselySubscriptionsService(fakeRepository<PurchaselySubscriptionDomain>()),
  }
}