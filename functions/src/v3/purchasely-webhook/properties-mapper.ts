import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
import { PurchaselyEventDomain } from "../purchasely-events";
import {
	PurchaselyConsumableWebhookDomain,
	PurchaselyNonConsumableWebhookDomain,
	PurchaselySubscriptionWebhookDomain
} from "./domain";

const dateFromOptionalDateString = (dateString?: string): DateTime | null => dateString === undefined ? null : DateTime.fromISO(dateString);

const purchaselyEventPropertiesMap: { [keyof: string]: (value: any) => any | null } = {
	"auto_resume_at": (value?: string) => dateFromOptionalDateString(value),
	"defer_end_at": (value?: string) => dateFromOptionalDateString(value),
	"effective_next_renewal_at": (value?: string) => dateFromOptionalDateString(value),
  "event_created_at": (value: string) => DateTime.fromISO(value),
	"expires_at": (value?: string) => dateFromOptionalDateString(value),
	"grace_period_expires_at": (value?: string) => dateFromOptionalDateString(value),
	"next_renewal_at": (value?: string) => dateFromOptionalDateString(value),
  "original_purchased_at": (value?: string) => dateFromOptionalDateString(value),
  "purchased_at": (value: string) => DateTime.fromISO(value),
  "received_at": (value: string) => DateTime.fromISO(value)
}

export const purchaselyEventPropertiesMapper = <T>(key: string, value: any | undefined): T | null => {
  const mapper = purchaselyEventPropertiesMap[key];
  if (mapper !== undefined) return mapper(value);
  return (value === undefined ? null : value);
}

type PurchaselyWebhookDomain = PurchaselyConsumableWebhookDomain | PurchaselyNonConsumableWebhookDomain | PurchaselySubscriptionWebhookDomain

export const purchaselyWebhookToEventMapper =
	<T extends PurchaselyWebhookDomain>(webhook: T): PurchaselyEventDomain => ({
    id: uuid(),
    ...Object.entries(webhook).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: purchaselyEventPropertiesMapper(key, value)
    }), { })
  } as PurchaselyEventDomain)