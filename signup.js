const txtUserName = document.querySelector("#signup_username");
const txtEmail = document.querySelector("#signup_email");
const txtPassword = document.querySelector("#signup_password");
const btnSignup = document.querySelector("#btn_signup");

//Sign up button
btnSignup.addEventListener("click", signUp);

function signUp(e) {
  e.preventDefault();
  //get info
  const username = txtUserName.value;
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();

  //Authentication of user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(authData => {
      console.log("User created successfully with payload-", authData);
      //Write code to use authData to add to Users
      firebase.database().ref("userinfo/").push({
        username: username,
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
      window.location.href = "index.html";
    })
    .catch(_error => {
      console.log("Login Failed!", _error);
    });
}
