//Login button
let wood = 0;
let cement = 0;
let tools = 0;
let misc = 0;
let clothes = 0;

const inputDonationAmount = document.querySelector("#donation_input");

let DBRefUserDonation;

document.querySelector("#donate").addEventListener("click", () => {
  let userDonationAmount;
  let donationTotalAmount;
  DBRefUserDonation = firebase
    .database()
    .ref()
    .child("userinfo/" + firebasesAuthDatabaseID + "/donations");

  DBRefUserDonation.on(
    "value",
    snap => {
      snap.val(); // value
      userDonationAmount = snap.val().amount;
    },
    err => {}
  );

  DBRefUserDonation.update({
    amount: +userDonationAmount + +inputDonationAmount.value
  });

  const DBRefTotalDonation = firebase.database().ref().child("totaldonations");

  DBRefTotalDonation.on(
    "value",
    snap => {
      snap.val(); // value
      donationTotalAmount = snap.val().money;
    },
    err => {}
  );

  DBRefTotalDonation.update({
    money: +donationTotalAmount + +inputDonationAmount.value
  });
  console.log(donationTotalAmount);
});

function createItemDonation(what, asAString, where) {
  const template = document.querySelector("#donationButtons").content;
  const clone = template.cloneNode(true);
  clone.querySelector(".materials").dataset.type = asAString;

  document.querySelector(where).appendChild(clone);
  const element = document.querySelector(`[data-type="${asAString}"]`);
  element.querySelector(".btnplus").addEventListener("click", () => {
    what++;
    console.log(element.querySelector("p"));
    element.querySelector("p").textContent = what;
    if (what > 0) {
      element.querySelector(".btnminus").disabled = false;
    }
  });
  element.querySelector(".btnminus").addEventListener("click", () => {
    what--;
    element.querySelector("p").textContent = what;
    if (what == 0) {
      element.querySelector(".btnminus").disabled = true;
    }
  });
}
createItemDonation(wood, "wood", "#material_container");
createItemDonation(cement, "cement", "#material_container");
