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

//Variable setup

const btnLogin = document.querySelector("#btnLogin");
const btnLogout = document.querySelector("#btnLogout");

let profileLoaded = false;

let firebasesAuthDatabaseID = false;

let numberOfUsers = 0;

if (btnLogin) {
  btnLogin.addEventListener("click", e => {
    e.preventDefault();
    //get info
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    //signin
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  });

  // //Sign up button
  // btnSignup.addEventListener("click", e => {
  //   //get info
  //   const email = txtEmail.value;
  //   const password = txtPassword.value;
  //   const auth = firebase.auth();
  //   //createuser
  //   // const promise = auth.createUserWithEmailAndPassword(email, password);
  //   // promise.catch(e => console.log(e.message));

  //   //Authentication of user
  //   auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(authData => {
  //       console.log("User created successfully with payload-", authData);
  //       //Write code to use authData to add to Users
  //       firebase.database().ref("userinfo/").push({
  //         email: email,
  //         uid: authData.user.uid,
  //         donations: {
  //           amount: 0,
  //           materials: {
  //             wood: 0,
  //             cement: 0,
  //             miscellaneous: 0,
  //             clothes: 0
  //           },
  //           food: {
  //             water: 0,
  //             MRE: 0
  //           }
  //         }
  //       });
  //     })
  //     .catch(_error => {
  //       console.log("Login Failed!", _error);
  //     });
  // });

  //Logout button
  btnLogout.addEventListener("click", e => {
    firebase.auth().signOut();
    firebasesAuthDatabaseID = false;
  });
}

// Real time auth listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    if (document.querySelector("header")) {
      document.querySelector("header").classList.add("logged_in");
      document.querySelector("header #p_email").textContent =
        firebaseUser.email;
    }
    findFirebaseUser(firebaseUser.email);
  } else {
    console.log("not logged in");
    if (document.querySelector("header")) {
      document.querySelector("header").classList.remove("logged_in");
    }
  }
});

//Find user
function findFirebaseUser(email) {
  firebase
    .database()
    .ref("userinfo/")
    .orderByChild("email")
    .equalTo(email)
    .on("value", function(snap) {
      //snapshot would have list of NODES that satisfies the condition
      const object = snap.val();
      console.log(object);
      firebasesAuthDatabaseID = Object.keys(object)[0];
      console.log(firebasesAuthDatabaseID, "-----------");
      console.log(email);
      console.log("is admin: " + object[firebasesAuthDatabaseID].admin);
      profileLoaded = true;
      if (
        object[firebasesAuthDatabaseID].admin !== "undefined" &&
        object[firebasesAuthDatabaseID].admin
      ) {
        console.log("is admin: " + object[firebasesAuthDatabaseID].admin);
        document.querySelector("#btn_to_dashboard").classList.remove("hide");
      } else {
        console.log("is not admin");
        //document.querySelector("#btn_to_dashboard").classList.add("hide");
      }
    });
}

// DATABASE SETUP -- https://www.youtube.com/watch?v=noB98K6A0TY part 1 -- https://youtu.be/dBscwaqNPuk part 2

const userList = document.querySelector("#user_list");
// Create ref
const DBRefUserInfo = firebase
  .database()
  .ref()
  .child("userinfo");

DBRefUserInfo.on("child_added", snap => {
  if (userList) {
    const li = document.createElement("li");
    const userinfo = snap.val();

    li.innerText = userinfo.email;
    // `
    //   ` +
    // "Donations: " +
    // +userinfo.donations.amount +
    // `
    //   ` +
    // "Wood: " +
    // +userinfo.donations.materials.wood;

    li.id = snap.key; // key name for each item
    numberOfUsers++;
    if (document.querySelector("#number_of_users p")) {
      document.querySelector("#number_of_users p").textContent =
        "Antal brugere: " + numberOfUsers;
    }
    userList.appendChild(li);
  }
});

DBRefUserInfo.on("child_changed", snap => {
  if (userList) {
    const liChanged = document.querySelector("#" + snap.key);
    const userinfo = snap.val();

    liChanged.innerText = "Username: " + userinfo.email;
    // `
    // ` +
    // "Donations: " +
    // +userinfo.donations.amount +
    // `
    // ` +
    // "Wood: " +
    // +userinfo.donations.materials.wood;
  }
});
