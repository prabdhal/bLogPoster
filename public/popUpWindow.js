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

function deleteAccountFunction(id) {
  dataAccountMessagePopupContainer.forEach((accountPopup) => {
    accountPopup.lastChild.previousSibling.lastChild.previousSibling.action = `/account/delete/${id}?_method=DELETE`;
    openMessagePopup('account');
  });
}

function deleteArticleFunction(id) {
  dataArticleMessagePopupContainer.forEach((articlePopup) => {
    articlePopup.lastChild.previousSibling.lastChild.previousSibling.action = `/bLogPoster/${id}?_method=DELETE`;
    openMessagePopup('article');
  });
}

function deleteCommentFunction(articleSlug, commentId) {
  dataCommentMessagePopupContainer.forEach((commentPopup) => {
    commentPopup.lastChild.previousSibling.lastChild.previousSibling.action = `/bLogPoster/view/${articleSlug}/comment/${commentId}?_method=DELETE`;
    openMessagePopup('comment');
  });
}

function deleteReplyFunction(articleSlug, commentId, replyId) {
  dataReplyMessagePopupContainer.forEach((replyPopup) => {
    replyPopup.lastChild.previousSibling.lastChild.previousSibling.action = `/bLogPoster/view/${articleSlug}/comment/${commentId}/reply/${replyId}?_method=DELETE`;
    openMessagePopup('reply');
  });
}

dataCancelButton.forEach((cancelButton) => {
  cancelButton.addEventListener('click', () => {
    closeMessagePopup();
  });
});

function openMessagePopup(window) {
  switch (window) {
    case 'account':
      dataAccountMessagePopupContainer.forEach((accountPopup) => {
        accountPopup.classList.remove('hide');
      });
      break;
    case 'article':
      dataArticleMessagePopupContainer.forEach((articlePopup) => {
        articlePopup.classList.remove('hide');
      });
      break;
    case 'comment':
      dataCommentMessagePopupContainer.forEach((commentPopup) => {
        commentPopup.classList.remove('hide');
      });
      break;
    case 'reply':
      dataReplyMessagePopupContainer.forEach((replyPopup) => {
        replyPopup.classList.remove('hide');
      });
      break;
  }
}

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
