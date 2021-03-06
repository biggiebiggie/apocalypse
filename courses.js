//Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
let urlCourseNumber = urlParams.get("course");

//HTML element corresponding to the course from the URL, then run selectCourse() with that element
const courseFromUrl = document.querySelector(
  "#courses_container .course" + urlCourseNumber + " .course_overlay"
);
selectCourse(courseFromUrl);

//DOM Content Loaded
document.addEventListener("DOMContentLoaded", coursesInit);

//Initial function
function coursesInit() {
  //If .section_bg is clicked, run courseClicked() then look at the element clicked
  document
    .querySelector("#courses_container .section_bg")
    .addEventListener("click", courseClicked);
}

function courseClicked(event) {
  const course = event.target;
  //If clicked element is a course, run selectCourse(course)
  if (course.classList.contains("course_overlay")) {
    selectCourse(course);
  }
}

//Select a course to be shown, takes an HTML element as parameter
function selectCourse(courseOverlay) {
  const currentCourse = document.querySelector("#current_course_container");

  //Set src of iframe
  currentCourse.querySelector("h2").textContent =
    courseOverlay.nextElementSibling.nextElementSibling.textContent;

  //Set description
  currentCourse.querySelector("p").textContent =
    courseOverlay.nextElementSibling.nextElementSibling.nextElementSibling.textContent;

  //Set title of course
  currentCourse.querySelector("iframe").src =
    courseOverlay.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value;

  //Select all courses and remove .current
  const allCourses = document.querySelectorAll("#courses_container .course");

  allCourses.forEach(course => {
    course.classList.remove("current");
  });

  //add .current to selected course
  courseOverlay.parentNode.classList.add("current");
}
