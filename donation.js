//Login button
let wood = 0;
let cement = 0;
let tools = 0;
let misc = 0;
let clothes = 0;

const inputDonationAmount = document.querySelector("#donation_input");

let DBRefUserDonation;

const urlParams = new URLSearchParams(window.location.search);
const urlCategory = urlParams.get("category");

//#region Navigating donation windows

const sectionWrapper = document.querySelector(".section_wrapper");
const returnButtons = document.querySelectorAll(".return");

//Set initial donation category

if (
  urlCategory === "money" ||
  urlCategory === "materials" ||
  urlCategory === "food"
) {
  console.log(urlCategory);

  sectionWrapper.classList.add(urlCategory);

  //set return btn to go to index.html
  document
    .querySelector("#" + urlCategory + " .return")
    .addEventListener("click", () => {
      window.location.replace("index.html#donate_section");
    });

  //Re-activate donate btn in nav
  document.querySelector("nav p.current").addEventListener("click", () => {
    window.location.replace("donation.html");
  });
  document
    .querySelector("nav p.current")
    .classList.replace("current", "reactivated");
}

//Return buttons

returnButtons.forEach(returnButton => {
  returnButton.addEventListener("click", clearClasslist);
});

function clearClasslist() {
  sectionWrapper.classList.remove("money");
  sectionWrapper.classList.remove("materials");
  sectionWrapper.classList.remove("food");
}

//Money

document
  .querySelector("#money .section_overlay")
  .addEventListener("click", () => {
    if (!sectionWrapper.classList.contains("animating")) {
      sectionWrapper.classList.remove("materials");
      sectionWrapper.classList.remove("food");
      sectionWrapper.classList.add("money_animating");
      sectionWrapper.classList.add("animating");
      setTimeout(() => {
        sectionWrapper.classList.remove("money_animating");
        sectionWrapper.classList.remove("animating");
        sectionWrapper.classList.add("money");
      }, 300);
    }
  });

document.querySelector("#payment_money").addEventListener("click", () => {
  document.querySelector("#money").classList.add("payment");

  document.querySelector("#donation_form").classList.add("payment");

  document.querySelector("#confirm").setAttribute("class", "donate_money");
});
//Materials

document
  .querySelector("#materials .section_overlay")
  .addEventListener("click", () => {
    if (!sectionWrapper.classList.contains("animating")) {
      sectionWrapper.classList.remove("money");
      sectionWrapper.classList.remove("food");
      sectionWrapper.classList.add("materials_animating");
      sectionWrapper.classList.add("animating");
      setTimeout(() => {
        sectionWrapper.classList.remove("materials_animating");
        sectionWrapper.classList.remove("animating");
        sectionWrapper.classList.add("materials");
      }, 300);
    }
  });

document.querySelector("#payment_materials").addEventListener("click", () => {
  document.querySelector("#materials").classList.add("payment");

  document.querySelector("#donation_form").classList.add("payment");

  document.querySelector("#confirm").setAttribute("class", "donate_materials");
});

//Food

document
  .querySelector("#food .section_overlay")
  .addEventListener("click", () => {
    if (!sectionWrapper.classList.contains("animating")) {
      sectionWrapper.classList.remove("money");
      sectionWrapper.classList.remove("materials");
      sectionWrapper.classList.add("food_animating");
      sectionWrapper.classList.add("animating");
      setTimeout(() => {
        sectionWrapper.classList.remove("food_animating");
        sectionWrapper.classList.remove("animating");
        sectionWrapper.classList.add("food");
      }, 300);
    }
  });

document.querySelector("#payment_food").addEventListener("click", () => {
  document.querySelector("#food").classList.add("payment");
  document.querySelector("#donation_form").classList.add("payment");
  document.querySelector("#confirm").setAttribute("class", "donate_food");
});

document
  .querySelector("#donation_form .return")
  .addEventListener("click", () => {
    document.querySelector("#money").classList.remove("payment");
    document.querySelector("#materials").classList.remove("payment");
    document.querySelector("#food").classList.remove("payment");
    document.querySelector("#donation_form").classList.remove("payment");
  });

//#endregion

document.querySelector("#confirm").addEventListener("click", confirmDonation);

function confirmDonation(e) {
  if (e.target.classList.contains("donate_money")) {
    console.log("donate");
    let userDonationAmount;
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

    updateTotalDonation();
  } else if (e.target.classList.contains("donate_food")) {
    donateItems("MRE", "food");
    donateItems("water", "food");
  } else if (e.target.classList.contains("donate_materials")) {
    donateItems("wood", "materials");
    donateItems("cement", "materials");
    donateItems("clothes", "materials");
    donateItems("miscellaneous", "materials");
  }
}

//Donate money
// document.querySelector("#donate_money").addEventListener("click", () => {
//   let userDonationAmount;
//   DBRefUserDonation = firebase
//     .database()
//     .ref()
//     .child("userinfo/" + firebasesAuthDatabaseID + "/donations");
//   DBRefUserDonation.on(
//     "value",
//     snap => {
//       snap.val(); // value
//       userDonationAmount = snap.val().amount;
//     },
//     err => {}
//   );

//   DBRefUserDonation.update({
//     amount: +userDonationAmount + +inputDonationAmount.value
//   });

//   updateTotalDonation();
// });

// document.querySelector("#donate_materials").addEventListener("click", () => {
//   donateItems("wood", "materials");
//   donateItems("cement", "materials");
//   donateItems("clothes", "materials");
//   donateItems("miscellaneous", "materials");
// });

function donateItems(kind, where) {
  let userWoodAmount;

  DBRefUserDonation = firebase
    .database()
    .ref()
    .child("userinfo/" + firebasesAuthDatabaseID + "/donations/" + where);

  document
    .querySelectorAll("#" + where + " input[type=number]")
    .forEach(material => {
      console.log(Number(material.value));
      console.log(material.nextElementSibling.value);
      if (material.nextElementSibling.value == kind) {
        DBRefUserDonation.on(
          "value",
          snap => {
            snap.val(); // value
            amount = snap.val()[kind];
          },
          err => {}
        );
        DBRefUserDonation.update({
          [kind]: Number(amount) + Number(material.value)
        });
      }
    });
}

function updateTotalDonation() {
  //Total donation amount
  let donationTotalAmount;

  DBRefTotalDonation = firebase
    .database()
    .ref()
    .child("totaldonations");

  DBRefTotalDonation.on(
    "value",
    snap => {
      snap.val(); // value
      donationTotalAmount = snap.val().money;
    },
    err => {}
  );
  //Update total donation amount
  if (donationTotalAmount !== undefined) {
    DBRefTotalDonation.update({
      money: +donationTotalAmount + +inputDonationAmount.value
    });
  } else {
    DBRefTotalDonation.update({
      money: 0 + +inputDonationAmount.value
    });
  }
}

//Material donation
function createItemDonation(suffix, asAString, where, db) {
  const template = document.querySelector("#itemTemplate").content;
  const clone = template.cloneNode(true);

  //set data.type
  clone.querySelector(".materials").dataset.type = asAString;
  clone.querySelector("h3").textContent = asAString;
  clone.querySelector("p").textContent = "Antal af " + suffix;
  clone.querySelector("input[type=hidden]").value = db;

  //Make clone child of "where"
  document.querySelector(where).appendChild(clone);

  //search for set data.type
  const element = document.querySelector(`[data-type="${asAString}"]`);
  const donationInput = document.querySelector(
    `[data-type="${asAString}"] input[type="number"]`
  );

  //Plus clicked
  element.querySelector(".btnplus").addEventListener("click", () => {
    donationInput.value = Number(donationInput.value) + 1;
    if (Number(donationInput.value) > 0) {
      element.querySelector(".btnminus").disabled = false;
    }
  });
  //Minus clicked
  element.querySelector(".btnminus").addEventListener("click", () => {
    donationInput.value = Number(donationInput.value) - 1;
    if (Number(donationInput.value) == 0) {
      element.querySelector(".btnminus").disabled = true;
    }
  });
}

//Create material donations (suffix, name of donating item, destination, place in database)
createItemDonation("planker", "Træ", "#material_container", "wood");
createItemDonation("kg", "Cement", "#material_container", "cement");
createItemDonation("stk", "Tøj", "#material_container", "clothes");
createItemDonation("stk", "Diverse", "#material_container", "clothes");
createItemDonation("stk", "Feltrationer", "#food_container", "MRE");
createItemDonation("10L dunke", "Vand", "#food_container", "water");
