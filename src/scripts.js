"use strict";

// Declaring constants.
const mainElement = document.getElementsByTagName("html")[0];
const logoIcon = document.getElementById("github-icon");
const themeIcon = document.getElementById("theme-icon");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// user detail constant.
const userProfile = document.getElementById("profile");
const userFullname = document.getElementById("fullname");
const userName = document.getElementById("username");
const userBio = document.getElementById("bio");

const userLocation = document.getElementById("location");
const userWebsite = document.getElementById("website");
const userTwitter = document.getElementById("twitter");
const userEmail = document.getElementById("email");
const userCompany = document.getElementById("company");

const userRepository = document.getElementById("repository");
const userFollowers = document.getElementById("followers");
const userFollowing = document.getElementById("following");
const userJoined = document.getElementById("created");

// The GitHub API URL for retrieving user data.
const URL = `https://api.github.com/users/`;

// Parses a date string and returns a JavaScript Date object.
const timestamp = (dateStr) => new Date(dateStr);

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Get an SVG image element based on the provided name.
 *
 * @param {string} - The name of the SVG icon (excluding the file extension).
 * @returns {string} A string containing the SVG image element.
 */
function getIcon(name) {
  return `<image href="src/assets/${name}.svg" class="w-full" />`;
}

/**
 * Sets the theme in the browser's local storage.
 *
 * @param {string} theme - The theme name or identifier to be stored.
 */
function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

/**
 * Sets properties for dark mode.
 * This function updates the inner HTML elements
 * to display icons suitable for a dark mode theme.
 */
function setDarkModeProperties() {
  themeIcon.innerHTML = getIcon("brightness-icon-light");
  logoIcon.innerHTML = getIcon("github-icon-light");
}

/**
 * Sets properties for light mode.
 * This function updates the inner HTML elements
 * to display icons suitable for a light mode theme.
 */
function setLightModeProperties() {
  themeIcon.innerHTML = getIcon("brightness-icon-dark");
  logoIcon.innerHTML = getIcon("github-icon-dark");
}

/**
 * Toggles between dark and light modes based on the class of the main element.
 * If the main element has the "dark" class, it sets dark mode properties and theme.
 * Otherwise, it sets light mode properties and theme.
 */
function setThemeMode() {
  if (mainElement.classList.contains("dark")) {
    setDarkModeProperties();
    setTheme("dark");
  } else {
    setLightModeProperties();
    setTheme("light");
  }
}

/**
 * Toggles the theme (dark/light) of the application.
 * This function toggles the "dark" class on the main element and then
 * calls setThemeMode() to apply the appropriate theme-related properties.
 */
function toggleTheme() {
  mainElement.classList.toggle("dark");
  setThemeMode();
}

// Adding click event listener in toggleTheme function.
themeIcon.addEventListener("click", toggleTheme);

function showUserDetail(data) {
  // define method for value check null or blank.
  const checkNull = (value) => {
    if (value === null || value === "") {
      return false;
    }
    return true;
  };

  // set user basic details.
  userProfile.src = data.avatar_url;
  userFullname.textContent = checkNull(data.name) ? data.name : "Not Found";
  userName.textContent = `@${data.login}`;
  userName.href = `https://github.com/${data.login}`;
  userBio.textContent = checkNull(data.bio) ? data.bio : "404 Bio Not Found";

  // set user social details.
  userLocation.textContent = checkNull(data.location)
    ? data.location
    : "Not Available";
  userWebsite.textContent = checkNull(data.blog) ? data.blog : "Not Available";
  userWebsite.href = checkNull(data.blog) ? data.blog : "#";
  userTwitter.textContent = checkNull(data.twitter_username)
    ? `@${data.twitter_username}`
    : "Not Available";
  userTwitter.href = checkNull(data.twitter_username)
    ? `https://twitter.com/${data.twitter_username}`
    : "#";
  userEmail.textContent = checkNull(data.email) ? data.email : "Not Available";
  userEmail.href = checkNull(data.email) ? `mailto:${data.email}` : "#";
  userCompany.textContent = checkNull(data.company)
    ? data.company
    : "Not Available";

  // set user repository and followers details.
  userRepository.textContent = data.public_repos;
  userFollowers.textContent = data.followers;
  userFollowing.textContent = data.following;
  userJoined.textContent = `Joined ${timestamp(data.created_at).toLocaleString(
    "en-US",
    options
  )}`;
}

/**
 * Fetches user data from the GitHub API for a given username.
 *
 * @param {string} - The GitHub username for which to fetch data.
 * @throws {Error} If an HTTP error occurs during the request.
 */
async function fetchUserData(username) {
  try {
    const response = await fetch(`${URL}${username}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let userData = await response.json();
    showUserDetail(userData);
  } catch (error) {
    throw error;
  }
}

/**
 * Event listener for the search form submission.
 * Prevents the default form submission behavior, fetches user data for the entered query,
 * and resets the search input field.
 *
 * @param {Event} event - The event object representing the form submission.
 */
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchUserData(searchInput.value);
  searchInput.value = "";
});

/**
 * This function is executed when the window loads.
 * It fetches user data for a specific username, checks the stored theme in localStorage,
 * and sets the theme mode and associated properties based on the stored theme.
 */
window.onload = function () {
  fetchUserData("github");
  if (localStorage.theme && localStorage.theme === "dark") {
    setDarkModeProperties();
    mainElement.classList.add("dark");
  } else {
    setLightModeProperties();
    mainElement.classList.remove("dark");
  }
};
