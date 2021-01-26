const closeErrorButtons = document.querySelectorAll('.error-button');
const allLikeButtons = document.querySelectorAll('[data-comment-like-btn]');
const allReplyButtons = document.querySelectorAll(
  '[data-comment-reply-button]'
);
const allCancelReplyCommentButton = document.querySelectorAll(
  '[data-reply-comment-cancel-button]'
);
const allReplyCommentInputBoxContainers = document.querySelectorAll(
  '[data-reply-comment-input-box-container]'
);
const allEditCommentButtons = document.querySelectorAll(
  '[data-edit-comment-button]'
);
const dataEditCommentInputContainers = document.querySelectorAll(
  '[data-edit-comment-input-container]'
);
const commentInputContainer = document.querySelectorAll(
  '[data-comment-input-container]'
);
const commentButtonContainers = document.querySelectorAll(
  '[data-comments-btn-containers]'
);

// close error messages
closeErrorButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();

    e.target.parentElement.classList.add('hide');
  });
});

allEditCommentButtons.forEach((editButton) => {
  editButton.addEventListener('click', () => {
    this.closeAllEditContainers();
    // hide comment
    editButton.parentElement.parentElement.previousElementSibling.lastElementChild.firstElementChild.classList.add(
      'hide'
    );
    // hide comment buttons
    editButton.parentElement.parentElement.classList.add('hide');
    editButton.parentElement.parentElement.previousElementSibling.lastElementChild.lastElementChild.classList.remove(
      'hide'
    );
  });
});

// open corresponding reply box
allReplyButtons.forEach((replyButton) => {
  replyButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
    replyButton.parentElement.parentElement.parentElement.nextElementSibling.classList.remove(
      'hide'
    );
  });
});

// adds listener to close all reply inputs to the cancel button
allCancelReplyCommentButton.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
  });
});

// closes all reply inputs
function closeAllReplyContainers() {
  allReplyCommentInputBoxContainers.forEach((replyBox) => {
    replyBox.classList.add('hide');
    console.log('closing all reply containers');
  });
}

// closes all edit inputs
function closeAllEditContainers() {
  dataEditCommentInputContainers.forEach((editContainer) => {
    editContainer.parentElement.parentElement.nextElementSibling.classList.remove(
      'hide'
    );
    editContainer.classList.add('hide');
    console.log('closing all reply containers');
  });
}
