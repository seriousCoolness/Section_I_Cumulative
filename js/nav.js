"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

function navStoryClick(evt) {
  console.debug("navStoryClick", evt);
  hidePageComponents();
  $storyForm.show();
  putStoriesOnPage();
  updateStars($allStoriesList);
  updateTrash($allStoriesList);
}

$navStory.on("click", navStoryClick);

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  updateStars($allStoriesList);
  updateTrash($allStoriesList);
}

$body.on("click", "#nav-all", navAllStories);

function navFavoriteStories(evt) {
  hidePageComponents();
  putFavoritesOnPage();
  updateStars($favoriteStoriesList);
  updateTrash($favoriteStoriesList);
}

$navFavorites.on("click", navFavoriteStories);

function navPostedStories(evt) {
  hidePageComponents();
  putPostedOnPage();
  updateStars($postedStoriesList);
  updateTrash($postedStoriesList);
}

$navPosts.on("click", navPostedStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navFavorites.show();
  $navStory.show();
  $navPosts.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
