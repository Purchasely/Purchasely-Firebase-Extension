### Configuring the extension

Before you proceed, make sure you have the following Firebase services set up:

- [Cloud Firestore](https://firebase.google.com/docs/firestore) to store customer & subscription details.
  - Follow the steps in the [documentation](https://firebase.google.com/docs/firestore/quickstart#create) to create a Cloud Firestore database.
- [Firebase Authentication](https://firebase.google.com/docs/auth) to enable different sign-up options for your users.
  - Enable the sign-in methods in the [Firebase console](https://console.firebase.google.com/project/_/authentication/providers) that you want to offer your users.

#### Set your Cloud Firestore security rules

It is crucial to limit data access to authenticated users only and for users to only be able to see their own information. For product and pricing information it is important to disable write access for client applications. Use the rules below to restrict access as recommended in your project's [Cloud Firestore rules](https://console.firebase.google.com/project/${param:PROJECT_ID}/firestore/rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /${param:PURCHASELY_SUBSCRIPTIONS_COLLECTION}/{documentId} {
      allow read: if request.auth.uid == resource.data.user.vendor_id;
    }

    match /${param:PURCHASELY_EVENTS_COLLECTION}/{documentId} {
      allow read: if request.auth.uid == resource.data.user.vendor_id;
    }
  }
}
```

#### Configure Stripe webhooks

You need to set up the webhook that updates your Firebase project with your user's subscription details.

Here's how to set up the webhook and configure your extension to use it:

   1. Go to the [Purchasely Console](https://console.purchasely.io/).

   1. Use the URL of your extension's function as the endpoint URL. Here's your function's URL: `${function:purchaselyWebhookHandler.url}`

   1. Set it in your Purchasely Console (//TODO)


#### Assign custom claim roles to products

// TODO

### Using the extension


// TODO

#### Sign-up users with Firebase Authentication

The quickest way to sign-up new users is by using the [FirebaseUI library](https://firebase.google.com/docs/auth/web/firebaseui). Follow the steps outlined in the official docs. When configuring the extension you can choose to keep Firebase Authentication user's custom claims (https://firebase.google.com/docs/auth/admin/custom-claims) updated with their in-app subscriptions. If set to 'YES', when receiving events the extension considers the Purchasely Event's `user.vendor_id` property to match the user's Firebase Authentication UID and updates the user's custom claims. If set to 'NO' (default), the extension will NOT update your users' Firebase Authentication custom claims

#### List active subscriptions

Users' subscriptions are normal collections and docs in your Cloud Firestore and can be queried as such:

```js
db.collection('${param:PURCHASELY_SUBSCRIPTIONS_COLLECTION}')
  .where('is_subscribed', '==', true)
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(async function (doc) {
      console.log(doc.id, ' => ', doc.data());
    });
  });
```

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

### Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.

Access the [Purchasely Console](https://console.purchasely.io/) to manage all aspects of your Purchasely Project

Enjoy and please submit any feedback and feature requests on [GitHub](https://github.com/Purchasely/Purchasely-Firebase-Extension/issues/new)
