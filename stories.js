"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  if (currentUser !== undefined) {
    putStoriesOnPageLI();
    console.log('put stories on page LI');
    $('span').show();
  }
  else { putStoriesOnPage(); }
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
      <span id="${story.spanID}" class="hidden empty">&star;</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
function generateFaveMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span id="${story.spanID}" class="full">&starf;</span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">${story.author}</small>
        <small class="story-user">${story.username}</small>
      </li>
    `);
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putStoriesOnPageLI() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);

    for (let fave of currentUser.favorites) {
      if (story.storyId === fave.storyId) {
        $story.children('span').html('&starf;');
        $story.children('span').attr('class', 'full');
        console.log('this shouldve worked');
      }
    }
    $allStoriesList.append($story);

  }

  $allStoriesList.show();
}

// function submitAddStory() {
//   let story = {};
//   $author = $('#author-name').val();
//   $title = $('#story-title').val();
//   $url = $('#story-url').val();
//   story.title = $title;
//   story.author = $author;
//   story.url = $url;
//   console.log(({ ...story }));
// }

async function submitAddStory(e) {
  e.preventDefault();
  let story = {};

  $('#story-url').val();
  story.title = $('#story-title').val();
  story.author = $('#author-name').val();
  story.url = $('#story-url').val();
  console.log(({ ...story }));
  await storyList.addStory(currentUser, { ...story });

}
$('#story-form').on('click', $('#submit-button'), submitAddStory);





