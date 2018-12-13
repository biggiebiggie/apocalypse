const btnSignup = document.querySelector("#btn_signup");

//Sign up button
btnSignup.addEventListener("click", e => {
  //get info
  const email = txtEmail.value;
  const password = txtPassword.value;
  const auth = firebase.auth();
  //createuser
  // const promise = auth.createUserWithEmailAndPassword(email, password);
  // promise.catch(e => console.log(e.message));

  //Authentication of user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(authData => {
      console.log("User created successfully with payload-", authData);
      //Write code to use authData to add to Users
      firebase
        .database()
        .ref("userinfo/")
        .push({
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
