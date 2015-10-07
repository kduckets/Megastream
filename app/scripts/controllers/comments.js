'use strict';

app.controller('CommentsCtrl', function ($scope, $routeParams, Post, Auth) {
  $scope.post = Post.get($routeParams.postId);
  $scope.commentsA = Post.commentsA($routeParams.postId);
  $scope.commentsB = Post.commentsB($routeParams.postId);

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.view_tab = 'null';

  $scope.changeTab = function(tab) {
    $scope.view_tab = tab;
}

  $scope.addCommentA = function () {
    if(!$scope.commentText || $scope.commentText === '') {
      return;
    }

    var comment = {
      text: $scope.commentText,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      votes: 0
    };
    $scope.commentsA.$add(comment);

    $scope.commentText = '';
  };

  $scope.addCommentB = function () {
    if(!$scope.commentText || $scope.commentText === '') {
      return;
    }

    var comment = {
      text: $scope.commentText,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      votes: 0
    };
    $scope.commentsB.$add(comment);

    $scope.commentText = '';
  };

  $scope.deleteCommentA = function (comment) {
  $scope.commentsA.$remove(comment);
};

  $scope.deleteCommentB = function (comment) {
  $scope.commentsB.$remove(comment);
};

  $scope.upvoteA = function(comment) {
  comment.votes +=1;
  Post.commentAVote($routeParams.postId, comment.$id, comment.votes);

};

  $scope.upvoteB = function(comment) {
  comment.votes +=1;
  Post.commentBVote($routeParams.postId, comment.$id, comment.votes);

};

  $scope.downvoteA = function(comment) {
  comment.votes -=1;
  Post.commentAVote($routeParams.postId, comment.$id, comment.votes);

};

  $scope.downvoteB = function(comment) {
  comment.votes -=1;
  Post.commentBVote($routeParams.postId, comment.$id, comment.votes);

};

});