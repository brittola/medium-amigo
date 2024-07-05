angular.module('mediumAmigo').controller('PostController', function($scope, $routeParams, PostService) {
    PostService.getById($routeParams.id)
        .success(function(data) {
            $scope.post = data.data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});