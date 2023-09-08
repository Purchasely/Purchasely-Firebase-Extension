import { PurchaselyAppPlatform, PurchaselyStore } from "../../v2/purchasely-events";

export const appPlatformFromStore = (store: PurchaselyStore): PurchaselyAppPlatform => {
  switch (store) {
    case PurchaselyStore.AMAZON_APP_STORE:
      return PurchaselyAppPlatform.ANDROID;
    case PurchaselyStore.APPLE_APP_STORE:
      return PurchaselyAppPlatform.IOS;
    case PurchaselyStore.GOOGLE_PLAY_STORE:
      return PurchaselyAppPlatform.ANDROID;
    case PurchaselyStore.HUAWEI_APP_GALLERY:
      return PurchaselyAppPlatform.ANDROID;
    case PurchaselyStore.STRIPE:
      return PurchaselyAppPlatform.WEB;
  }
}
