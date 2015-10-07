'use strict';
app.controller('PostsCtrl', function($scope, $location, Post, Auth){

 $scope.posts = Post.all;
 $scope.user = Auth.user;

  $scope.post = {teamA: '', teamB: '', votes: 0};
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
 // console.log('upvotes' + $scope.post.upvotes);

 $scope.submitPost = function () {
  $scope.post.creator = $scope.user.profile.username;
  $scope.post.creatorUID = $scope.user.uid;
  Post.create($scope.post).then(function (ref) {
    $location.path('/posts/' + ref.name());
    $scope.post = {teamA: '', teamB: ''};
  });
};

  $scope.post = {teamA: '', teamB: '', votes: 0};

  $scope.deletePost = function (post) {
    Post.delete(post);
  	};
	
  $scope.upvote = function(post) {
  post.votes +=1;
  Post.vote(post.$id, post.votes);
};

  $scope.downvote = function(post) {
  post.votes -=1;
  Post.vote(post.$id, post.votes);
};

});