"use strict";

const DBRefMaterials = firebase
  .database()
  .ref()
  .child("totaldonations/materials");

const DBRefFood = firebase.database().ref().child("totaldonations/food");

var ctx1 = document.getElementById("materials_chart").getContext("2d");
var materialsChart = new Chart(ctx1, {
  type: "doughnut",
  data: {
    labels: ["Cement", "Clothes", "Miscellaneous", "Tools", "Wood"],
    datasets: [
      {
        label: "# of Votes",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
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
  options: {}
});
var ctx2 = document.getElementById("food_chart").getContext("2d");
var foodChart = new Chart(ctx2, {
  type: "doughnut",
  data: {
    labels: ["Cans", "MRE", "Water"],
    datasets: [
      {
        label: "# of Votes",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
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
  options: {}
});

DBRefMaterials.on("child_added", snap => {
  const materialsInfo = snap.val();

  materialsChart.data.datasets.forEach(dataset => {
    dataset.data.push(materialsInfo);
  });
  materialsChart.update();
});

DBRefFood.on("child_added", snap => {
  const foodInfo = snap.val();

  foodChart.data.datasets.forEach(dataset => {
    dataset.data.push(foodInfo);
  });
  foodChart.update();
});

function createMaterialChart(item) {
  materialsChart.data.labels.push(item);
  materialsChart.update();
}
