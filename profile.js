console.log(DBRefUserInfo);

// Real time auth listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  checkUserState();
  function checkUserState() {
    if (firebaseUser && profileLoaded) {
      console.log("profile.js");
      console.log(DBRefUserInfo);
      console.log(firebaseUser);
      //document.querySelector("#loading_screen").classList.add("loaded");
      getUserInfo();
    } else if (firebaseUser && !profileLoaded) {
      //profileLoaded is defined in database.js
      console.log("loading...");
      setTimeout(checkUserState, 100);
    }
  }
});

function getUserInfo() {
  DBRefUserProfileInfo = firebase
    .database()
    .ref()
    .child("userinfo/" + firebasesAuthDatabaseID);
  DBRefUserProfileInfo.on(
    "value",
    snap => {
      snap.val(); // value

      donationAmount = snap.val().donations.amount;

      //Set textContent of element that do not require further JS
      document.querySelector(
        "#welcome_header span"
      ).textContent = snap.val().username;
      document.querySelector(".profile_email p").textContent = snap.val().email;
      document.querySelector(
        ".profile_donation p"
      ).textContent = donationAmount;

      //Setup rank and rank progress
      donationProgress(donationAmount);
    },
    err => {}
  );
}

function donationProgress(amount) {
  console.log("donationRank()");
  console.log(amount);

  //#region Rank progress

  const lvlValue = 100;

  //Is value above 100?

  //if yes
  if (amount > lvlValue) {
    //Make string and get length
    const donationLength = amount.toString().length;

    //Get last 2 digits of donation amount (shows how close you are to rankup)
    let donationProgress = amount.toString().slice(donationLength - 2);

    //If donationProgress === 00, slice() to get one "0" only
    if (donationProgress === "00") {
      console.log("slicing");
      donationProgress = donationProgress.slice(1);
    }

    //Set textContent and bar width
    document.querySelector(
      ".profile_goalbar div span"
    ).textContent = donationProgress;
    document.querySelector(".profile_goalbar div .progress").style.width =
      donationProgress + "%";

    //if not
  } else {
    //Just set textContent and bar width
    document.querySelector(".profile_goalbar div span").textContent = amount;
    document.querySelector(".profile_goalbar div .progress").style.width =
      amount + "%";
  }

  //#endregion

  //#region Rank

  //find rank
  const rank = Math.floor(amount / lvlValue);

  const profileRankText = document.querySelector(".profile_rank .rank");

  //If rank is 10 or higher, make font size smaller
  if (rank >= 10) {
    //Get font-size, is not hard coded to avoid mistakes
    const initialFontSizeString = window
      .getComputedStyle(profileRankText, null)
      .getPropertyValue("font-size");

    //Remove "px" from font-size, always comes in px
    const initialFontSize = initialFontSizeString.slice(
      0,
      initialFontSizeString.length - 2
    );
    console.log(initialFontSize / 1.7);
    //Set new font-size
    profileRankText.style.fontSize = Math.round(initialFontSize / 1.5) + "px";
  }

  //Set textContent
  profileRankText.textContent = rank;

  //#endregion
}
