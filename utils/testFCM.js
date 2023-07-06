const { notifications } = require("../firebaseConfig");
const testFCM = async (message) => {
  try {
    const result = await notifications.send(message);
    console.log({ result });
  } catch (error) {
    console.log({ error });
  }
};

// const { notifications } = require("../firebaseConfig");
// const testFCM = (message) => {
//   // This registration token comes from the client FCM SDKs.
//   // const registrationToken =
//   //   "eRwwzOueRey4mybid4EwzG:APA91bHqe4AqQZ6hOqeGXbeDMlIjIRgR3IufckQ8EC33an8tNGRTakHXEb8xA2LvwJwg8z39DFa5BSBz2odULV-Zzo2MuL3tvhYX7PiObgpSxYIk9q7r17-TCKUm05gvu0flsi588_to";

//   // const message = {
//   //   notification: {
//   //     title: "test1",
//   //     body: "test2",
//   //   },
//   //   token: registrationToken,
//   // };

//   // Send a message to the device corresponding to the provided
//   // registration token.
//   notifications
//     .send(message)
//     .then((response) => {
//       // Response is a message ID string.
//       console.log("Successfully sent message:", response);
//     })
//     .catch((error) => {
//       console.log("Error sending message:", error);
//     });
// };

module.exports = testFCM;
