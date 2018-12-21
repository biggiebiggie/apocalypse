"use strict";

const DBRefMaterials = firebase
  .database()
  .ref()
  .child("totaldonations/materials");

const DBRefFood = firebase.database().ref().child("totaldonations/food");

const DBRefTotalDonation = firebase.database().ref().child("totaldonations");

let donationTotalAmount;

Chart.defaults.global.defaultFontColor = "#FFF";
var ctx1 = document.getElementById("materials_chart").getContext("2d");
var materialsChart = new Chart(ctx1, {
  type: "doughnut",
  data: {
    labels: ["Cement", "Tøj", "Diverse", "Træ"],
    datasets: [
      {
        label: "# of Votes",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)"
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});
var ctx2 = document.getElementById("food_chart").getContext("2d");
var foodChart = new Chart(ctx2, {
  type: "doughnut",
  data: {
    labels: ["Feltrationer", "Vand"],
    datasets: [
      {
        label: "# of Votes",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132)",
          "rgba(54, 162, 235)",
          "rgba(255, 206, 86)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
          "rgba(255, 159, 64)"
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scaleFontColor: "#FFFFFF"
  }
});

document.addEventListener("DOMContentLoaded", dashboardInit);

function dashboardInit() {
  DBRefMaterials.on("child_added", addedMaterial);
  DBRefMaterials.on("child_changed", changedMaterial);
  DBRefFood.on("child_added", addedFood);
  DBRefFood.on("child_changed", changedFood);
  DBRefTotalDonation.on("value", donationAmount);
}

function addedMaterial(snap) {
  const materialsInfo = snap.val();

  materialsChart.data.datasets.forEach(dataset => {
    dataset.data.push(materialsInfo);
  });
  materialsChart.update();
}

function changedMaterial(snap) {
  {
    const materialsInfo = snap.val();

    materialsChart.data.datasets.forEach(dataset => {
      dataset.data.push(materialsInfo);
    });
    materialsChart.update();
  }
}

function addedFood(snap) {
  const foodInfo = snap.val();

  foodChart.data.datasets.forEach(dataset => {
    dataset.data.push(foodInfo);
  });
  foodChart.update();
}

function changedFood(snap) {
  const foodInfo = snap.val();

  foodChart.data.datasets.forEach(dataset => {
    dataset.data.push(foodInfo);
  });
  foodChart.update();
}

function donationAmount(snap) {
  donationTotalAmount = snap.val().money;
  let goalBar = document.querySelector(".goal_fill");
  let barFill = donationTotalAmount / 20000 * 100;
  goalBar.style.width = barFill + "%";
  console.log(snap.val().money);
}
