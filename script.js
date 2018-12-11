"use strict";

// Get elements

// skal bruges til materialsdonation
// document.querySelector("#donate").addEventListener("click", () => {
//   let userDonationAmount;
//   DBRefDonation = firebase
//     .database()
//     .ref()
//     .child("userinfo/" + firebasesAuthDatabaseID + "/donations");

//   DBRefDonation.on(
//     "value",
//     snap => {
//       snap.val(); // value
//       userDonationAmount = snap.val().amount;
//     },
//     err => {}
//   );

//   DBRefDonation.update({
//     amount: +userDonationAmount + +inputDonationAmount.value
//   });
// });

// Sync object changes
// DBRefObject.on("value", snap => {
//   preObject.innerHTML = JSON.stringify(snap.val(), null, 3);
// });

// Sync list changes

// DBRefList.on("child_changed", snap => {
//   const liChanged = document.querySelector("#" + snap.key);
//   liChanged.innerText = snap.val();
// });

// DBRefList.on("child_removed", snap => {
//   const liToRemove = document.querySelector("#" + snap.key);
//   liToRemove.remove();
// });

