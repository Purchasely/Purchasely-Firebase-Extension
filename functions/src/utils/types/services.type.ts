import { PurchaselyEventsServiceInterface as EventsService } from "../../purchasely-events/service";
import { PurchaselySubscriptionsServiceInterface as SubscriptionsService } from "../../purchasely-subscriptions/service";
import { PurchaselyConsumablesServiceInterface as ConsumablesService } from "../../v2/purchasely-consumables/service";
import { PurchaselyNonConsumablesServiceInterface as NonConsumablesService } from "../../purchasely-non-consumables/service";
import { FirebaseCustomClaimsServiceInterface as CustomClaimsService } from "../../v2/firebase-custom-claims/service";
import { PurchaselyLoggingServiceInterface } from "../../purchasely-logging/service";

export type Services = {
  events: EventsService | null;
  firebaseCustomClaims: CustomClaimsService | null;
  logs: PurchaselyLoggingServiceInterface;
  consumables: ConsumablesService | null;
  nonConsumables: NonConsumablesService | null;
  subscriptions: SubscriptionsService | null;
};