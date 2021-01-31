// close error message buttons
const closeErrorButtons = document.querySelectorAll('.error-button');
// edit buttons on comments and replies
const dataEditCommentButtons = document.querySelectorAll(
  '[data-edit-comment-button]'
);
// comment and reply input containers on comments and replies when edit button is clicked
const dataEditCommentInputContainers = document.querySelectorAll(
  '[data-edit-comment-input-container]'
);
// cancel button on comments and replies when editting
const dataCancelEditCommentButton = document.querySelectorAll(
  '[data-cancel-edit-comment-button]'
);
// like button on comments and replies
const dataCommentLikeButtons = document.querySelectorAll(
  '[data-comment-like-btn]'
);
// reply button on comments responsible for opening reply input to reply to a comment
const dataCommentReplyButtons = document.querySelectorAll(
  '[data-comment-reply-button]'
);
// reply input containers after comments
const dataReplyInputContainers = document.querySelectorAll(
  '[data-reply-input-container]'
);
// cancel buttons on reply inputs
const dataCancelReplyButtons = document.querySelectorAll(
  '[data-cancel-reply-button]'
);
// comment menu button on comments and replies by the user
const dataCommentMenuButton = document.querySelectorAll(
  '[data-comment-menu-button]'
);

// close error messages
closeErrorButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    e.target.parentElement.classList.add('hide');
  });
});

dataEditCommentButtons.forEach((editButton) => {
  editButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
    this.closeAllEditContainers();
    // hide comment
    editButton.parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.firstElementChild.classList.add(
      'hide'
    );
    // hide comment buttons
    editButton.parentElement.parentElement.classList.add('hide');
    editButton.parentElement.parentElement.previousElementSibling.firstElementChild.nextElementSibling.lastElementChild.classList.remove(
      'hide'
    );
  });
});

// close all edit, reply and comment input containers
dataCancelEditCommentButton.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
    this.closeAllEditContainers();
  });
});

// open corresponding reply box
dataCommentReplyButtons.forEach((replyButton) => {
  replyButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
    this.closeAllEditContainers();
    replyButton.parentElement.parentElement.parentElement.nextElementSibling.classList.remove(
      'hide'
    );
  });
});

// adds listener to close all reply inputs to the cancel button
dataCancelReplyButtons.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
    this.closeAllEditContainers();
  });
});

// closes all reply inputs
function closeAllReplyContainers() {
  dataReplyInputContainers.forEach((replyBox) => {
    replyBox.classList.add('hide');
  });
}

// closes all edit inputs
function closeAllEditContainers() {
  dataEditCommentInputContainers.forEach((editContainer) => {
    editContainer.parentElement.parentElement.nextElementSibling.classList.remove(
      'hide'
    );
    editContainer.classList.add('hide');
  });
}

dataCommentMenuButton.forEach((menuButton) => {
  menuButton.addEventListener('click', () => {
    hideAllModifyButtons(menuButton);
    menuButton.previousElementSibling.classList.toggle('hidden');
  });
});

function hideAllModifyButtons(button) {
  dataCommentMenuButton.forEach((menuButton) => {
    if (menuButton != button)
      menuButton.previousElementSibling.classList.add('hidden');
  });
}
