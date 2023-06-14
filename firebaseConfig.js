const firebase = require("firebase-admin");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const serviceAccount = require("./aghaty-3eaff-firebase-adminsdk-97qvu-9629f98004.json");

initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL:
    "https://aghaty-3eaff-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = getDatabase();
const ref = db.ref("Aghaty");
const deliveryRef = ref.child("deliveries");

module.exports = { db, deliveryRef };
