//Login button
let wood = 0;
let cement = 0;
let tools = 0;
let misc = 0;
let clothes = 0;

let materialCosts = 0;

const inputDonationAmount = document.querySelector("#donation_input");

let DBRefUserDonation;

const urlParams = new URLSearchParams(window.location.search);
const urlCategory = urlParams.get("category");

//#region Navigating donation windows

const sectionWrapper = document.querySelector(".section_wrapper");
const returnButtons = document.querySelectorAll(".return");

//Set initial donation category if URL provides parameter
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

//DOM Content Loaded
document.addEventListener("DOMContentLoaded", initDonations);

//Initial function
function initDonations() {
  //Create material donations (suffix, name of donating item, destination, place in database)
  createItemDonation(
    "planker",
    "Træ",
    "#material_container",
    "wood",
    "material"
  );
  createItemDonation(
    "kg",
    "Cement",
    "#material_container",
    "cement",
    "material"
  );
  createItemDonation(
    "stk",
    "Tøj",
    "#material_container",
    "clothes",
    "material"
  );
  createItemDonation(
    "stk",
    "Diverse",
    "#material_container",
    "miscellaneous",
    "material"
  );
  createItemDonation("stk", "Feltrationer", "#food_container", "MRE", "food");
  createItemDonation("10L dunke", "Vand", "#food_container", "water", "food");

  //Return buttons
  returnButtons.forEach(returnButton => {
    returnButton.addEventListener("click", clearClasslist);
  });

  function clearClasslist() {
    sectionWrapper.classList.remove("money");
    sectionWrapper.classList.remove("materials");
    sectionWrapper.classList.remove("food");

    materialCosts = 0;
  }

  //Money
  document
    .querySelector("#money .section_overlay")
    .addEventListener("click", animateToMoney);
  document
    .querySelector("#payment_money")
    .addEventListener("click", paymentMoney);

  //Materials
  document
    .querySelector("#materials .section_overlay")
    .addEventListener("click", animateToMaterials);
  document
    .querySelector("#payment_materials")
    .addEventListener("click", paymentMaterials);

  //Food
  document
    .querySelector("#food .section_overlay")
    .addEventListener("click", animateToFood);
  document
    .querySelector("#payment_food")
    .addEventListener("click", paymentFood);

  //Form return button
  document
    .querySelector("#donation_form .return")
    .addEventListener("click", returnFromPayment);

  //#endregion

  document.querySelector("#confirm").addEventListener("click", confirmDonation);
}

//#region Animate donations

function animateToMoney() {
  if (!sectionWrapper.classList.contains("animating")) {
    sectionWrapper.classList.remove("materials");
    sectionWrapper.classList.remove("food");
    sectionWrapper.classList.add("money_animating");
    sectionWrapper.classList.add("animating");
    setTimeout(animationOverMoney, 300);
  }
}

function animateToMaterials() {
  if (!sectionWrapper.classList.contains("animating")) {
    sectionWrapper.classList.remove("money");
    sectionWrapper.classList.remove("food");
    sectionWrapper.classList.add("materials_animating");
    sectionWrapper.classList.add("animating");
    setTimeout(animationOverMaterials, 300);
  }
}

function animateToFood() {
  if (!sectionWrapper.classList.contains("animating")) {
    sectionWrapper.classList.remove("money");
    sectionWrapper.classList.remove("materials");
    sectionWrapper.classList.add("food_animating");
    sectionWrapper.classList.add("animating");
    setTimeout(animationOverFood, 300);
  }
}

//#endregion

//#region Animation over

function animationOverMoney() {
  sectionWrapper.classList.remove("money_animating");
  sectionWrapper.classList.remove("animating");
  sectionWrapper.classList.add("money");
}

function animationOverMaterials() {
  sectionWrapper.classList.remove("materials_animating");
  sectionWrapper.classList.remove("animating");
  sectionWrapper.classList.add("materials");
}

function animationOverFood() {
  sectionWrapper.classList.remove("food_animating");
  sectionWrapper.classList.remove("animating");
  sectionWrapper.classList.add("food");
}

//#endregion

//#region Payment

function paymentMoney() {
  document.querySelector("#money").classList.add("payment");
  document.querySelector("#donation_form").classList.add("payment");
  document.querySelector("#confirm").setAttribute("class", "donate_money");
}

function paymentMaterials() {
  document.querySelector("#materials").classList.add("payment");

  document.querySelector("#donation_form").classList.add("payment");

  document.querySelector("#confirm").setAttribute("class", "donate_materials");
}

function paymentFood() {
  document.querySelector("#food").classList.add("payment");
  document.querySelector("#donation_form").classList.add("payment");
  document.querySelector("#confirm").setAttribute("class", "donate_food");
}

function returnFromPayment() {
  document.querySelector("#money").classList.remove("payment");
  document.querySelector("#materials").classList.remove("payment");
  document.querySelector("#food").classList.remove("payment");
  document.querySelector("#donation_form").classList.remove("payment");
}

//#endregion

function confirmDonation(e) {
  e.preventDefault();
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

    updateTotalDonation(inputDonationAmount.value);
  } else if (e.target.classList.contains("donate_food")) {
    donateItems("MRE", "food");
    donateItems("water", "food");
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
      amount: +userDonationAmount + +materialCosts
    });
    updateTotalDonation(materialCosts);
  } else if (e.target.classList.contains("donate_materials")) {
    donateItems("wood", "materials");
    donateItems("cement", "materials");
    donateItems("clothes", "materials");
    donateItems("miscellaneous", "materials");
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
      amount: +userDonationAmount + +materialCosts
    });
    updateTotalDonation(materialCosts);
  }
}

function donateItems(kind, where) {
  DBRefUserDonation = firebase
    .database()
    .ref()
    .child("userinfo/" + firebasesAuthDatabaseID + "/donations/" + where);

  let amount;

  DBRefUserDonation.on(
    "value",
    snap => {
      console.log(snap.val());
      snap.val(); // value
      amount = snap.val()[kind];
      console.log(amount);
    },
    err => {}
  );

  material = document.querySelector("#" + where + " .at_" + kind).value;

  console.log(material);

  DBRefUserDonation.update({
    [kind]: Number(amount) + Number(material)
  });

  pushToMaterialDonation();

  function pushToMaterialDonation() {
    let donationTotalAmount;

    DBRefTotalMaterials = firebase
      .database()
      .ref()
      .child("totaldonations/" + where);

    DBRefTotalDonation = firebase.database().ref().child("totaldonations");

    DBRefTotalDonation.on(
      "value",
      snap => {
        console.log(snap.val());
        snap.val(); // value
        donationTotalAmount = snap.val().money;
      },
      err => {}
    );

    if (
      amount !== undefined &&
      materialCosts !== undefined &&
      donationTotalAmount !== undefined
    ) {
      DBRefTotalMaterials.update({
        [kind]: Number(amount) + Number(material)
      });
      DBRefTotalDonation.update({
        money: +donationTotalAmount + +materialCosts
      });
      window.location.href = "index.html";
    } else {
      setTimeout(pushToMaterialDonation, 200);
      console.log("prøv igen");
    }
  }
}

function updateTotalDonation(input) {
  //Total donation amount
  let donationTotalAmount;
  DBRefTotalDonation = firebase.database().ref().child("totaldonations");

  console.log(DBRefTotalDonation);

  DBRefTotalDonation.on(
    "value",
    snap => {
      console.log(snap.val());
      snap.val(); // value
      donationTotalAmount = snap.val().money;
    },
    err => {}
  );
  //Update total donation amount
  pushToTotalDonation();

  function pushToTotalDonation() {
    if (donationTotalAmount !== undefined) {
      DBRefTotalDonation.update({
        money: donationTotalAmount + +input
      });
      window.location.href = "index.html";
    } else {
      setTimeout(pushToTotalDonation, 200);
    }
  }
}

//Material donation
function createItemDonation(suffix, asAString, where, db, type) {
  const template = document.querySelector("#itemTemplate").content;
  const clone = template.cloneNode(true);

  //set data.type
  clone.querySelector(".materials").dataset.type = asAString;
  clone.querySelector("h3").textContent = asAString;
  clone.querySelector("p").textContent = "Antal af " + suffix;
  clone.querySelector("input[type=hidden]").value = db;
  clone.querySelector("input[type=number]").classList.add("at_" + db);

  //Make clone child of "where"
  document.querySelector(where).appendChild(clone);

  //search for set data.type
  const element = document.querySelector(`[data-type="${asAString}"]`);
  const donationInput = document.querySelector(
    `[data-type="${asAString}"] input[type="number"]`
  );

  const materialCostContainer = document.querySelector(`.${type}_costs p`);

  //Plus clicked
  element.querySelector(".btnplus").addEventListener("click", () => {
    donationInput.value = Number(donationInput.value) + 1;
    if (db == "wood") {
      materialCosts += 20;
    } else if (db == "cement") {
      materialCosts += 30;
    } else if (db == "clothes") {
      materialCosts += 10;
    } else if (db == "miscellaneous") {
      materialCosts += 15;
    } else if (db == "MRE") {
      materialCosts += 10;
    } else if (db == "water") {
      materialCosts += 10;
    }
    if (Number(donationInput.value) > 0) {
      element.querySelector(".btnminus").disabled = false;
    }
    materialCostContainer.textContent = materialCosts + "kr.-";
  });
  //Minus clicked
  element.querySelector(".btnminus").addEventListener("click", () => {
    donationInput.value = Number(donationInput.value) - 1;
    if (db == "wood") {
      materialCosts -= 20;
    } else if (db == "cement") {
      materialCosts -= 30;
    } else if (db == "clothes") {
      materialCosts -= 10;
    } else if (db == "miscellaneous") {
      materialCosts -= 15;
    } else if (db == "MRE") {
      materialCosts -= 10;
    } else if (db == "water") {
      materialCosts -= 10;
    }
    if (Number(donationInput.value) == 0) {
      element.querySelector(".btnminus").disabled = true;
    }
    materialCostContainer.textContent = materialCosts + "kr.-";
  });
}
