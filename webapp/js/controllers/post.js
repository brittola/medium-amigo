angular.module('mediumAmigo').controller('PostController', function($scope, $rootScope, $routeParams, PostService) {
    PostService.getById($routeParams.id)
        .success(function(data) {
            $scope.post = data.data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.handleLike = function(post) {
        if ($rootScope.loggedUser === null) {
            $rootScope.openLoginModal();
        }

        if (post.is_liked) {
            PostService.unlike(post.id)
                .success(function(data) {
                    post.is_liked = false;
                    post.likes--;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return;
        }

        PostService.like(post.id)
            .success(function(data) {
                post.is_liked = true;
                post.likes++;
            })
            .error(function(data) {
                console.log(data);
            });
    }
});