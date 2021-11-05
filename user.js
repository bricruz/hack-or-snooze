"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

let starEmpty = '<span class= "empty">&star;</span>';
let starFull = '<span class="full">&starf;</span>';

$('.stories-container').on('click', 'span', function (evt) {
  let $target = $(evt.target);
  let storyID = $target.parent()[0].id;
  let storyTitle = $target.siblings()[0].innerText;
  let storyAuthor = $target.siblings()[2].innerText;
  let storyUrl = $target.siblings()[0].href;
  let storyUser = $target.siblings()[3].innerText;
  let spanID = $target[0].id;

  if ($target[0].className == ('empty') || $target[0].className == ('hidden empty')) {
    $target[0].innerHTML = '&starf;';
    $target[0].className = 'full'
    // storyId, title, author, url, username, createdAt
    let newStory = { storyId: storyID, title: storyTitle, author: storyAuthor, url: storyUrl, username: storyUser, spanID: spanID };
    currentUser.addFav(newStory);
    // User.addFavorite(currentUser, newStory.storyID);
  } else {
    currentUser.removeFav(spanID);
    console.log('confused');
    $target[0].innerHTML = '&star;';
    $target[0].className = 'empty';

  }


  // console.log($target.siblings());
  // console.log($target.parent()[0].id);
  // console.log(newStory);

})

function spanIDs() {
  for (let i = 0; i < $('span').length; i++) {
    $('span').eq(i).attr('id', `${i}`);
  }
}



function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();
  $('#favorite').show();
  $('span').show();
  spanIDs();
  updateNavOnLogin();
}

