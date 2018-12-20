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

const userList = document.querySelector("#user_list");

const DBRefUserInfo = firebase
  .database()
  .ref()
  .child("userinfo");

//DOM Content Loaded
document.addEventListener("DOMContentLoaded", init);

//Initial function
function init() {
  //Burger menu
  document.querySelector("#burger").addEventListener("click", () => {
    document.querySelector("header nav").classList.toggle("open");
  });

  if (btnLogin) {
    btnLogin.addEventListener("click", userLogin);
    btnLogout.addEventListener("click", userSignOut);
  }

  //Child added
  DBRefUserInfo.on("child_added", createUserList);

  //Child changed
  DBRefUserInfo.on("child_changed", updateUserList);

  // Real time auth listener
  firebase.auth().onAuthStateChanged(checkIfLogged);
}

//#region login and signout

//Sign out
function userSignOut() {
  firebase.auth().signOut();
  firebasesAuthDatabaseID = false;
}

//Log in
function userLogin(e) {
  e.preventDefault();
  //get info
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  //signin
  const promise = auth.signInWithEmailAndPassword(email, password);
  promise.catch(e => console.log(e.message));
}

//#endregion

function checkIfLogged(firebaseUser) {
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
}

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
        object[firebasesAuthDatabaseID].admin &&
        document.querySelector("#btn_to_dashboard")
      ) {
        console.log("is admin: " + object[firebasesAuthDatabaseID].admin);
        document.querySelector("#btn_to_dashboard").classList.remove("hide");
      } else {
        console.log("is not admin");
        //document.querySelector("#btn_to_dashboard").classList.add("hide");
      }
    });
}

// DATABASE SETUP -part 1- https://www.youtube.com/watch?v=noB98K6A0TY
// DATABASE SETUP -part 2- https://youtu.be/dBscwaqNPuk

function createUserList(snap) {
  if (userList) {
    const li = document.createElement("li");
    const userinfo = snap.val();

    li.innerText = userinfo.email;

    li.id = snap.key; // key name for each item
    numberOfUsers++;
    if (document.querySelector("#number_of_users p")) {
      document.querySelector("#number_of_users p").textContent =
        "Antal brugere: " + numberOfUsers;
    }
    userList.appendChild(li);
  }
}

function updateUserList(snap) {
  if (userList) {
    const liChanged = document.querySelector("#" + snap.key);
    const userinfo = snap.val();

    liChanged.innerText = "Username: " + userinfo.email;
  }
}
