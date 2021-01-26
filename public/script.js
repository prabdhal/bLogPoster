const closeErrorButtons = document.querySelectorAll('.error-button');
const dataCommentLikeButtons = document.querySelectorAll(
  '[data-comment-like-btn]'
);
const dataCommentReplyButtons = document.querySelectorAll(
  '[data-comment-reply-button]'
);
const dataCancelReplyButtons = document.querySelectorAll(
  '[data-cancel-reply-button]'
);
const dataReplyInputBoxContainers = document.querySelectorAll(
  '[data-reply-input-box-container]'
);
const dataEditCommentButtons = document.querySelectorAll(
  '[data-edit-comment-button]'
);
const dataEditCommentInputContainers = document.querySelectorAll(
  '[data-edit-comment-input-container]'
);
const dataCommentInputContainers = document.querySelectorAll(
  '[data-comment-input-container]'
);
const dataCommentButtonContainers = document.querySelectorAll(
  '[data-comments-btn-containers]'
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

// open corresponding reply box
dataCommentReplyButtons.forEach((replyButton) => {
  replyButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
    replyButton.parentElement.parentElement.parentElement.nextElementSibling.classList.remove(
      'hide'
    );
  });
});

// adds listener to close all reply inputs to the cancel button
dataCancelReplyButtons.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    this.closeAllReplyContainers();
  });
});

// closes all reply inputs
function closeAllReplyContainers() {
  dataReplyInputBoxContainers.forEach((replyBox) => {
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
