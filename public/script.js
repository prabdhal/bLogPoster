const closeErrorButtons = document.querySelectorAll('.error-button');
const dataCommentLikeButtons = document.querySelectorAll(
  '[data-comment-like-btn]'
);
const dataCommentReplyButtons = document.querySelectorAll(
  '[data-comment-reply-button]'
);
const dataEditCommentButtons = document.querySelectorAll(
  '[data-edit-comment-button]'
);
const dataEditCommentInputContainers = document.querySelectorAll(
  '[data-edit-comment-input-container]'
);
const dataCloseEditInputBoxButtons = document.querySelectorAll(
  '[data-close-edit-input-box-button]'
);

const dataReplyInputBoxContainers = document.querySelectorAll(
  '[data-reply-input-box-container]'
);
const dataCancelReplyButtons = document.querySelectorAll(
  '[data-cancel-reply-button]'
);

const dataDeleteAccountButton = document.querySelectorAll(
  '[data-delete-account-button]'
);
const dataDeleteArticleButton = document.querySelectorAll(
  '[data-delete-article-button]'
);
const dataDeleteCommentButton = document.querySelectorAll(
  '[data-delete-comment-button]'
);
const dataDeleteReplyButton = document.querySelectorAll(
  '[data-delete-reply-button]'
);
const dataAccountMessagePopupContainer = document.querySelectorAll(
  '[data-account-message-popup-container]'
);
const dataArticleMessagePopupContainer = document.querySelectorAll(
  '[data-article-message-popup-container]'
);
const dataCommentMessagePopupContainer = document.querySelectorAll(
  '[data-comment-message-popup-container]'
);
const dataReplyMessagePopupContainer = document.querySelectorAll(
  '[data-reply-message-popup-container]'
);
const dataCancelButton = document.querySelectorAll('[data-cancel-btn]');

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

dataCloseEditInputBoxButtons.forEach((cancelButton) => {
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

dataCancelButton.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    closeMessagePopup();
  });
});

function closeMessagePopup() {
  dataAccountMessagePopupContainer.forEach((accountPopup) => {
    accountPopup.classList.add('hide');
  });
  dataArticleMessagePopupContainer.forEach((articlePopup) => {
    articlePopup.classList.add('hide');
  });
  dataCommentMessagePopupContainer.forEach((commentPopup) => {
    commentPopup.classList.add('hide');
  });
  dataReplyMessagePopupContainer.forEach((replyPopup) => {
    replyPopup.classList.add('hide');
  });
}

function deleteAccountFunction(id) {
  dataAccountMessagePopupContainer.forEach((accountPopup) => {
    accountPopup.lastChild.previousSibling.lastChild.previousSibling.action = `/blogs/<%= ${id} %>?_method=DELETE`;
    openMessagePopup('account');
  });
}

function deleteArticleFunction(id) {
  dataArticleMessagePopupContainer.forEach((articlePopup) => {
    articlePopup.lastChild.previousSibling.lastChild.previousSibling.action = `/blogs/${id}?_method=DELETE`;
    openMessagePopup('article');
  });
}

function deleteCommentFunction(articleSlug, commentId) {
  dataCommentMessagePopupContainer.forEach((commentPopup) => {
    commentPopup.lastChild.previousSibling.lastChild.previousSibling.action = `/blogs/view/${articleSlug}/comment/${commentId}?_method=DELETE`;
    openMessagePopup('comment');
  });
}

function deleteReplyFunction(articleSlug, commentId, replyId) {
  dataReplyMessagePopupContainer.forEach((replyPopup) => {
    replyPopup.lastChild.previousSibling.lastChild.previousSibling.action = `/blogs/view/${articleSlug}/comment/${commentId}/reply/${replyId}?_method=DELETE`;
    openMessagePopup('reply');
  });
}

function openMessagePopup(window) {
  console.log(window);
  switch (window) {
    case 'account':
      dataAccountMessagePopupContainer.forEach((accountPopup) => {
        console.log('open account popup');
        accountPopup.classList.remove('hide');
      });
      break;
    case 'article':
      dataArticleMessagePopupContainer.forEach((articlePopup) => {
        console.log('open article popup');
        articlePopup.classList.remove('hide');
      });
      break;
    case 'comment':
      dataCommentMessagePopupContainer.forEach((commentPopup) => {
        console.log('open comment popup');
        commentPopup.classList.remove('hide');
      });
      break;
    case 'reply':
      dataReplyMessagePopupContainer.forEach((replyPopup) => {
        console.log('open reply popup');
        replyPopup.classList.remove('hide');
      });
      break;
  }
}
