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
          amount: 0
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
const DBRefObject = firebase.database().ref().child("userinfo");

document.querySelector("#donate").addEventListener("click", () => {
  console.log("donere");
  let userDonationAmount;
  DBRefDonation = firebase
    .database()
    .ref()
    .child("userinfo/" + firebasesAuthDatabaseID + "/donations");

  DBRefDonation.once(
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

// DATABASE SETUP -- https://www.youtube.com/watch?v=noB98K6A0TY part 1 -- https://youtu.be/dBscwaqNPuk part 2

// Sync object changes
// DBRefObject.on("value", snap => {
//   preObject.innerHTML = JSON.stringify(snap.val(), null, 3);
// });

// Sync list changes
DBRefObject.on("child_added", snap => {
  const li = document.createElement("li");
  const userinfo = snap.val();

  li.innerText =
    "Username: " +
    userinfo.email +
    `
    ` +
    "Donations: " +
    +userinfo.donations.amount;
  console.log(snap.val());
  li.id = snap.key; // key name for each item

  userList.appendChild(li);
});

// DBRefList.on("child_changed", snap => {
//   const liChanged = document.querySelector("#" + snap.key);
//   liChanged.innerText = snap.val();
// });

// DBRefList.on("child_removed", snap => {
//   const liToRemove = document.querySelector("#" + snap.key);
//   liToRemove.remove();
// });
