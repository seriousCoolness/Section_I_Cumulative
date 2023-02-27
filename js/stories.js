"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <i class="hidden fa-star"></i>
        <i class="hidden fa-trash"></i>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function updateTrash(list) {
  
  list.find('.fa-trash').show();
  list.find('.fa-trash').each(function() {
    toggleTrash(this);
  });
}

async function toggleTrash(trash) {
  if(currentUser.isOwner(trash.parentNode.id)) {
    trash.classList.add("fas");
    trash.classList.remove("hidden");
  }
  else {
    $(trash).hide();
    trash.classList.add("hidden");
    trash.classList.remove("fas");
  }
}

function updateStars(list) {
  
  list.find('.fa-star').show();
  list.find('.fa-star').each(function() {
    toggleStar(this);
  });
}

async function toggleStar(star) {
  console.log(star);
  if(currentUser.isFavorite(star.parentNode.id)) {
    star.classList.add("fas");
    star.classList.remove("far");
  }
  else {
    star.classList.add("far");
    star.classList.remove("fas");
  }
}

async function clickStar(evt) {
  if(evt.target.classList.contains("fa-star")) {
    const storyId = evt.target.parentElement.id;
    console.log(storyId);

    if(evt.target.classList.contains("fas")) {
      await currentUser.removeFavorite(storyId);
      evt.target.classList.toggle("fas");
      evt.target.classList.toggle("far");
    }
    else if(evt.target.classList.contains("far")) {
      await currentUser.addFavorite(storyId);
      evt.target.classList.toggle("far");
      evt.target.classList.toggle("fas");
    }
    
  }
}

async function clickTrash(evt) {
  if(evt.target.classList.contains("fa-trash")) {
    const storyId = evt.target.parentElement.id;
    console.log(storyId);

    if(evt.target.classList.contains("fas")) {
      await storyList.removeStory(currentUser, storyId);
      evt.target.parentNode.remove();
    }
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    $story.on("click", clickStar);
    $story.on("click", clickTrash);
  }

  $allStoriesList.show();
}

function putFavoritesOnPage() {

  $favoriteStoriesList.empty();

  for (let story of storyList.stories.filter((story) => {return currentUser.isFavorite(story.storyId);})) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
    $story.on("click", clickStar);
  }

  $favoriteStoriesList.show();
}

function putPostedOnPage() {

  $postedStoriesList.empty();

  for (let story of storyList.stories.filter((story) => {return story.username == currentUser.username;})) {
    const $story = generateStoryMarkup(story);
    $postedStoriesList.append($story);
    $story.on("click", clickStar);
  }

  $postedStoriesList.show();
}

async function submitStory(evt) {
  evt.preventDefault();
  
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-link").val();

  const newStory = await storyList.addStory(currentUser, {title, author, url});
  if(newStory instanceof Story == false) {
    throw new TypeError("storyList.addStory() returned invalid type! Must be of class Story.");
  }
  
  location.reload();
}

$storyForm.on("submit", submitStory);
