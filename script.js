"use strict";

// Firebase login AUTH -- https://www.youtube.com/watch?v=-OKrloDzGpU
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAVgnFOmJtG7dXfBlRlxFy_REYn6ZOKpL8",
  authDomain: "apocalypse-7e201.firebaseapp.com",
  databaseURL: "https://apocalypse-7e201.firebaseio.com",
  projectId: "apocalypse-7e201",
  storageBucket: "apocalypse-7e201.appspot.com",
  messagingSenderId: "598371973277"
};
firebase.initializeApp(config);

const txtEmail = document.querySelector("#txtEmail");
const txtPassword = document.querySelector("#txtPassword");
const btnLogin = document.querySelector("#btnLogin");
const btnSignup = document.querySelector("#btnSignup");
const btnLogout = document.querySelector("#btnLogout");
const inputDonationAmount = document.querySelector("#donation_input");

let firebasesAuthDatabaseID = false;
let DBRefDonation;

let wood = 0;
let cement = 0;
let tools = 0;
let misc = 0;
let clothes = 0;

btnLogin.addEventListener("click", e => {
  //get info
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  //signin
  const promise = auth.signInWithEmailAndPassword(email, password);
  promise.catch(e => console.log(e.message));
});

btnSignup.addEventListener("click", e => {
  //get info
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  //createuser
  // const promise = auth.createUserWithEmailAndPassword(email, password);
  // promise.catch(e => console.log(e.message));

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(authData => {
      console.log("User created successfully with payload-", authData);
      //Write code to use authData to add to Users
      firebase.database().ref("userinfo/").push({
        email: email,
        uid: authData.user.uid,
        donations: {
          amount: 0,
          materials: {
            wood: 0,
            cement: 0,
            miscellaneous: 0,
            clothes: 0
          },
          food: {
            water: 0,
            MRE: 0
          }
        }
      });
    })
    .catch(_error => {
      console.log("Login Failed!", _error);
    });
});

btnLogout.addEventListener("click", e => {
  firebase.auth().signOut();
  firebasesAuthDatabaseID = false;
});

// Real time auth listener

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    btnLogout.classList.remove("hide");
    document.querySelector("#donation_container").classList.remove("hide");

    findFirebaseUser(firebaseUser.email);
  } else {
    console.log("not logged in");
    document.querySelector("#donation_container").classList.add("hide");
    btnLogout.classList.add("hide");
  }
});

function findFirebaseUser(email) {
  firebase
    .database()
    .ref("userinfo/")
    .orderByChild("email")
    .equalTo(email)
    .on("value", function(snap) {
      //snapshot would have list of NODES that satisfies the condition
      const object = snap.val();
      firebasesAuthDatabaseID = Object.keys(object)[0];
      console.log(firebasesAuthDatabaseID, "-----------");
      console.log(email);
    });
}

// Get elements
const userList = document.querySelector("#user_list");

// Create ref
const DBRefUserInfo = firebase.database().ref().child("userinfo");

document.querySelector("#donate").addEventListener("click", () => {
  let userDonationAmount;
  DBRefDonation = firebase
    .database()
    .ref()
    .child("userinfo/" + firebasesAuthDatabaseID + "/donations");

  DBRefDonation.on(
    "value",
    snap => {
      snap.val(); // value
      userDonationAmount = snap.val().amount;
    },
    err => {}
  );

  DBRefDonation.update({
    amount: +userDonationAmount + +inputDonationAmount.value
  });
});

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

// const plusbtns = document.querySelectorAll(".btnplus");
// const minusbtns = document.querySelectorAll(".btnminus");

// let elementplus = 0;

// plusbtns.forEach(button => {
//   button.addEventListener("click", () => {
//     const txtContent = .nextSibling.nextSibling.textContent;
//     console.log(txtContent);
//     //button.nextSibling.nextSibling.textContent = txtContent++;
//   });
// });

document.querySelector("#woodplus").addEventListener("click", () => {
  wood++;
  document.querySelector("#wood p").textContent = wood;
  if (wood > 0) {
    document.querySelector("#woodminus").disabled = false;
  }
});

document.querySelector("#woodminus").addEventListener("click", () => {
  wood--;
  document.querySelector("#wood p").textContent = wood;
  if (wood == 0) {
    document.querySelector("#woodminus").disabled = true;
  }
});

document.querySelector("#cementplus").addEventListener("click", () => {
  cement++;
  document.querySelector("#cement p").textContent = cement;
  if (cement > 0) {
    document.querySelector("#cementminus").disabled = false;
  }
});

document.querySelector("#cementminus").addEventListener("click", () => {
  cement--;
  document.querySelector("#cement p").textContent = cement;
  if (cement == 0) {
    document.querySelector("#cementminus").disabled = true;
  }
});

document.querySelector("#toolsplus").addEventListener("click", () => {
  tools++;
  document.querySelector("#tools p").textContent = tools;
  if (tools > 0) {
    document.querySelector("#toolsminus").disabled = false;
  }
});

document.querySelector("#toolsminus").addEventListener("click", () => {
  tools--;
  document.querySelector("#tools p").textContent = tools;
  if (tools == 0) {
    document.querySelector("#toolsminus").disabled = true;
  }
});

document.querySelector("#miscplus").addEventListener("click", () => {
  misc++;
  document.querySelector("#misc p").textContent = misc;
  if (misc > 0) {
    document.querySelector("#miscminus").disabled = false;
  }
});

document.querySelector("#miscminus").addEventListener("click", () => {
  misc--;
  document.querySelector("#misc p").textContent = misc;
  if (misc == 0) {
    document.querySelector("#miscminus").disabled = true;
  }
});

document.querySelector("#clothesplus").addEventListener("click", () => {
  clothes++;
  document.querySelector("#clothes p").textContent = clothes;
  if (clothes > 0) {
    document.querySelector("#clothesminus").disabled = false;
  }
});

document.querySelector("#clothesminus").addEventListener("click", () => {
  clothes--;
  document.querySelector("#clothes p").textContent = clothes;
  if (clothes == 0) {
    document.querySelector("#clothesminus").disabled = true;
  }
});
// DATABASE SETUP -- https://www.youtube.com/watch?v=noB98K6A0TY part 1 -- https://youtu.be/dBscwaqNPuk part 2

// Sync object changes
// DBRefObject.on("value", snap => {
//   preObject.innerHTML = JSON.stringify(snap.val(), null, 3);
// });

// Sync list changes
DBRefUserInfo.on("child_added", snap => {
  const li = document.createElement("li");
  const userinfo = snap.val();

  li.innerText =
    "Username: " +
    userinfo.email +
    `
    ` +
    "Donations: " +
    +userinfo.donations.amount +
    `
    ` +
    "Wood: " +
    +userinfo.donations.materials.wood;

  li.id = snap.key; // key name for each item

  userList.appendChild(li);
});

DBRefUserInfo.on("child_changed", snap => {
  const liChanged = document.querySelector("#" + snap.key);
  const userinfo = snap.val();

  liChanged.innerText =
    "Username: " +
    userinfo.email +
    `
    ` +
    "Donations: " +
    +userinfo.donations.amount +
    `
    ` +
    "Wood: " +
    +userinfo.donations.materials.wood;
});

// DBRefList.on("child_changed", snap => {
//   const liChanged = document.querySelector("#" + snap.key);
//   liChanged.innerText = snap.val();
// });

// DBRefList.on("child_removed", snap => {
//   const liToRemove = document.querySelector("#" + snap.key);
//   liToRemove.remove();
// });
