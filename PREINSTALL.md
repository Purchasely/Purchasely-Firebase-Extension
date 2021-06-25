Use this extension to keep track of your mobile apps' users' subscription status easily with [Purchasely](https://www.purchasely.com) via Firebase Authentication & Firebase Firestore.
This extension requires you to separately setup (or have already setup) your Purchasely project.

This extension syncs customers' subscription status with your Cloud Firestore and adds custom claims using Firebase Authentication for convenient access control in your application.

#### Recommended usage

This extension is meant for both native & hybrid mobile applications subscriptions using the app stores' in-app subscription APIs.
Currently supported app stores are the Apple App Store, Googe Play Store, Huawei App Galery & Amazon App Store.

#### Additional setup

Before installing this extension, set up the following Firebase services in your Firebase project:

- [Cloud Firestore](https://firebase.google.com/docs/firestore) to store customer & subscription details.
  - Follow the steps in the [documentation](https://firebase.google.com/docs/firestore/quickstart#create) to create a Cloud Firestore database.
- [Firebase Authentication](https://firebase.google.com/docs/auth) to enable different sign-up options for your users.
  - Enable the sign-in methods in the [Firebase console](https://console.firebase.google.com/project/_/authentication/providers) that you want to offer your users.

Then, if you haven't already, in the [Purchasely Console](https://console.purchasely.io/):

- Create a new [Client Webhook Shared Secret](https://docs.purchasely.com/quick-start/webhook-1/detailed-specification#request).
Purchasely Console > Applications > [YOUR APP] > Application settings

#### Billing

This extension uses the following Firebase services which may have associated charges:

- Cloud Firestore
- Cloud Functions
- Firebase Authentication

This extension also uses the following third-party services:

- Purchasely ([pricing information](https://www.purchasely.com/pricing))

You are responsible for any costs associated with your use of these services.

#### Note from Firebase

To install this extension, your Firebase project must be on the Blaze (pay-as-you-go) plan. You will only be charged for the resources you use. Most Firebase services offer a free tier for low-volume use. [Learn more about Firebase billing.](https://firebase.google.com/pricing)

Starting August 17 2020, you will be billed a small amount (typically less than $0.10) when you install or reconfigure this extension. See the [Cloud Functions for Firebase billing FAQ](https://firebase.google.com/support/faq#expandable-15) for a detailed explanation.