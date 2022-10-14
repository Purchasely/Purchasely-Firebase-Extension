# Run In-App Purchases & Subscriptions with Purchasely

**Author**: Purchasely (**[https://www.purchasely.com](https://www.purchasely.com)**)
**Contributorsr**:
- Thomas Léger ([https://github.com/el-fitz](https://github.com/el-fitz))

**Description**: Use this extension to keep track of your mobile apps' users' In-App Purchases & Subscriptions easily & seamlessly with [Purchasely](https://www.purchasely.com) via Firebase Authentication & Firebase Firestore.
This extension requires you to separately setup (or have already setup) your Purchasely project.

**Details**: Use this extension to keep track of your mobile apps' users' In-App Purchases & Subscriptions easily & seamlessly with [Purchasely](https://www.purchasely.com) via Firebase Authentication & Firebase Firestore.
This extension requires you to separately setup (or have already setup) your Purchasely project.

This extension stores your In-App Purchases & Subscriptions using Cloud Firestore and adds Custom Claims for your users' subscriptions using Firebase Authentication for convenient access control in your application.

#### Recommended usage

This extension is meant for both native & hybrid mobile applications In-App Purchases & Subscriptions using the app stores' In-App Purchases APIs.
Currently supported app stores are the Apple App Store, Googe Play Store, Huawei App Gallery & Amazon App Store.


## Demonstration apps

You can find examples of iOS & Android apps showcasing a Purchasely implementation using this Firebase Extension in the [Purchasely/Purchasely-DemoFirebase GitHub repository](https://github.com/Purchasely/Purchasely-DemoFirebase).

## Updating from 1.0.0

To update the extension, please go to your Firebase Console > Extensions > Run In-App Purchases & Subscriptions with Purchasely.
If you are currently using purchasely/purchasely-in-app-purchases@1.0.0, the console should display an update message, and allow you to update the Extension, and walk you through the wizard.

Please note that during the extension's update, the extension might be unavailable, and you may not be able to receive and process webhook events from Purchasely for a few minutes.
As our backend retries these events, this will resolve on it's own.

Once the extension is up to date, you may migrate your webhook to the latest (V3) version in the Purchasely Console.

## Setting up the extension

To setup the extension, visit **[https://console.firebase.google.com/project/_/extensions/install?ref=purchasely/purchasely-in-app-purchases](https://console.firebase.google.com/project/_/extensions/install?ref=purchasely/purchasely-in-app-purchases)**

#### Additional setup

Before installing this extension, set up the following Firebase services in your Firebase project:

- [Cloud Firestore](https://firebase.google.com/docs/firestore) to store In-App Purchases & Subscriptions details.
  - Follow the steps in the [documentation](https://firebase.google.com/docs/firestore/quickstart#create) to create a Cloud Firestore database.
- (optional) [Firebase Authentication](https://firebase.google.com/docs/auth) to enable different sign-up options for your users to enable the Custom Claims management.
  - Enable the sign-in methods in the [Firebase console](https://console.firebase.google.com/project/_/authentication/providers) that you want to offer your users.

Then, if you haven't already, in the [Purchasely Console](https://console.purchasely.io/):

- Get your [Client shared secret](https://docs.purchasely.com/quick-start/webhook-1/detailed-specification#request).
Purchasely Console > Applications > [YOUR APP] > App settings > Backend & SDK Configuration

#### Setting up the webhook URL in the Purchasely Console
Once the extension has been installed, you will need to get the extension's Cloud Function's URL and set it up in your Purchasely Console as the webhook URL.
The URL will only be available *after* the extension has *finished* being installed in your Firebase Console. This can take a few minutes.

- Find the Cloud Function's URL here:
Firebase Console > Your Project > Extensions > Run In-App Purchases & Subscriptions with Purchasely > Get Started | Manage > How this extension works > Configure Purchasely Webhook

- Set the webhook URL in the Purchasely Console:
  - Go to the [Purchasely Console](https://console.purchasely.io/).
  - Set the webhook URL (Purchasely Console > Applications > [YOUR APP] > App Settings > Backend & SDK configuration > Client webhook URL)


## Billing

This extension uses the following Firebase services which may have associated charges:

- Cloud Firestore
- Cloud Functions
- Firebase Authentication

This extension also uses the following third-party services:

- Purchasely ([Talk to Purchasely and get started!](https://www.purchasely.com/plan-demo-firebase))

You are responsible for any costs associated with your use of these services.

## Note from Firebase

To install this extension, your Firebase project must be on the Blaze (pay-as-you-go) plan. You will only be charged for the resources you use. Most Firebase services offer a free tier for low-volume use. [Learn more about Firebase billing.](https://firebase.google.com/pricing)

Starting August 17 2020, you will be billed a small amount (typically less than $0.10) when you install or reconfigure this extension. See the [Cloud Functions for Firebase billing FAQ](https://firebase.google.com/support/faq#expandable-15) for a detailed explanation.




**Configuration Parameters:**

* Cloud Functions deployment location: Where do you want to deploy the functions created for this extension? You usually want a location close to your database. For help selecting a location, refer to the [location selection guide](https://firebase.google.com/docs/functions/locations).

* Users' current Subscriptions Firestore Collection: What is the path to the Cloud Firestore collection where the extension should store your current users' subscriptions?

* Users' purchased Consumables Firestore Collection: What is the path to the Cloud Firestore collection where the extension should store your current users' consumables?

* Users' Purchased Non Consumables Firestore Collection: What is the path to the Cloud Firestore collection where the extension should store your current users' non consumables?

* Purchasely Webhook Raw Events Firestore Collection: What is the path to the Cloud Firestore collection where the extension should store the raw events coming from the Purchasely webhook? This should be a new collection that the extension will create when receiving the first events.

* Update Firebase Authentication Users' custom claims with current subscriptions: Do you want to automatically update your Firebase Authentication User's custom claims (see https://firebase.google.com/docs/auth/admin/custom-claims) with their current subscriptions? If set to "ENABLED", the extension will consider the Webhook event's user's vendor id to match the user's Firebase Authentication UID and attempt to update said user's Custom Claims with their current subscriptions' status. If set to "DISABLED" (default), the extension will NOT set & update the user's subscriptions in the user's Firebase Authentication Custom Claims.  If you do not use Firebase Authentication for your app or do not setup the Purchasely User Id in your app (see https://docs.purchasely.com/quick-start/sdk-configuration) to match with the UID provided for your user by Firebase, leave this option to "DISABLED".

* Purchasely Client Webhook Shared Secret: What is your Purchasely Client Webhook shared secret? To validate and authenticate incoming webhook requests, the extension needs to verify their signature (see https://docs.purchasely.com/quick-start/webhook-1/detailed-specification#request). It can be found or setup in your Purchasely Console (Client shared secret) Purchasely Console > Applications > [YOUR APP] > App Settings > Backend & SDK Configuration


**Cloud Functions:**

* **purchaselyWebhookHandler:** Receives the Server to Server notifications from Purchasely's webhook, validates it's signature, creates the associated Consumable, Non-Consumable or Subscription document, manages the user's Firebase Authentication Custom Claims for Subscriptions (if enabled) and creates and the raw Event document.




**Access Required**:

This extension will operate with the following project IAM roles:

* firebaseauth.admin(Reason: Allows the extension to set custom claims for users.)

* datastore.user (Reason: Allows the extension to store In-App Purchases & Subscriptions in Cloud Firestore.)




## Using the extension

If you haven't already, you will need to setup your Purchasely App and your In-App Purchases in each app store your app is available on.
To do so, you can follow the following guide: [Quick Start - Console Configuration](https://docs.purchasely.com/quick-start/console-configuration)

#### Sign-up users with Firebase Authentication (optional)

The quickest way to sign-up new users is by using the [Firebase Authentication SDK for your platform](https://firebase.google.com/docs/auth). Follow the steps outlined in the official docs. When configuring the extension you can choose to keep Firebase Authentication user's custom claims (https://firebase.google.com/docs/auth/admin/custom-claims) updated with their in-app subscriptions. If set to 'ENABLED' (default), upon receiving events the extension considers the Purchasely Event's `user.vendor_id` property to match the user's Firebase Authentication UID and updates the user's custom claims. If set to 'DISABLED', the extension will NOT update your users' Firebase Authentication custom claims

#### List your user's active subscriptions

Users' subscriptions are normal collections and docs in your Cloud Firestore and can be queried as such:

Javascript:
```js
db.collection('${param:PURCHASELY_SUBSCRIPTIONS_COLLECTION}')
  .where('is_subscribed', '==', true)
  .whereField('user.vendor_id', '==', '$CURRENT_USER_FIRESTORE_AUTHENTICATION_ID')
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

Swift:
```swift
firestore.collection('${param:PURCHASELY_SUBSCRIPTIONS_COLLECTION}')
  .whereField('is_subscribed', '==', true)
  .whereField('user.vendor_id', '==', '$CURRENT_USER_FIRESTORE_AUTHENTICATION_ID')
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

Kotlin:
```kotlin
Firebase.firestore.collection(PURCHASELY_SUBSCRIPTIONS_COLLECTION)
      .whereEqualTo("user.vendor_id", USER_FIRESTORE_AUTHENTICATION_ID)
      .whereEqualTo("is_subscribed", true)
      .addSnapshotListener { value, error ->
          val subscriptions = value?.documents?.map { it.data }
                                    ?.filter { it?.get("is_subscribed") == true }

          val isSubscribed = subscriptions?.isEmpty()?.not() ?: false
      }
```

#### List your user's consumables

Users' consumables are normal collections and docs in your Cloud Firestore and can be queried as such:

Javascript:
```js
db.collection('${param:PURCHASELY_CONSUMABLES_COLLECTION}')
  .whereField('user.vendor_id', '==', '$CURRENT_USER_FIRESTORE_AUTHENTICATION_ID')
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

Swift:
```swift
firestore.collection('${param:PURCHASELY_CONSUMABLES_COLLECTION}')
  .whereField('user.vendor_id', '==', '$CURRENT_USER_FIRESTORE_AUTHENTICATION_ID')
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

Kotlin:
```kotlin
Firebase.firestore.collection(PURCHASELY_CONSUMABLES_COLLECTION)
      .whereEqualTo("user.vendor_id", USER_FIRESTORE_AUTHENTICATION_ID)
      .addSnapshotListener { value, error ->
          val consumables = value?.documents?.map { it.data }
      }
```

#### List your user's non-consumables

Users' non-consumables are normal collections and docs in your Cloud Firestore and can be queried as such:

Javascript:
```js
db.collection('${param:PURCHASELY_NON_CONSUMABLES_COLLECTION}')
  .whereField('user.vendor_id', '==', '$CURRENT_USER_FIRESTORE_AUTHENTICATION_ID')
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

Swift:
```swift
firestore.collection('${param:PURCHASELY_NON_CONSUMABLES_COLLECTION}')
  .whereField('user.vendor_id', '==', '$CURRENT_USER_FIRESTORE_AUTHENTICATION_ID')
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

Kotlin:
```kotlin
Firebase.firestore.collection(PURCHASELY_NON_CONSUMABLES_COLLECTION)
      .whereEqualTo("user.vendor_id", USER_FIRESTORE_AUTHENTICATION_ID)
      .addSnapshotListener { value, error ->
          val nonConsumables = value?.documents?.map { it.data }
      }
```

#### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

Access the [Purchasely Console](https://console.purchasely.io/) to manage all aspects of your Purchasely Project

Enjoy and please submit any feedback and feature requests on [GitHub](https://github.com/Purchasely/Purchasely-Firebase-Extension/issues/new)
