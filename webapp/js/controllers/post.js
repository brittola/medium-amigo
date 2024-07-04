angular.module('mediumAmigo').controller('PostController', function($scope, PostService){
    $scope.posts = [];
    $scope.page = 1;

    PostService.get($scope.page)
        .success(data => {
            $scope.posts = data.data
        })
        .error(data => console.log(data));

    $scope.setShowOptions = function(post_id) {
        $scope.showOptions = $scope.showOptions === post_id ? null : post_id;
    }
});