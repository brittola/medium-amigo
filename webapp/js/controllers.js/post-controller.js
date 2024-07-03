angular.module('mediumAmigo').controller('PostController', function($scope, $http){
    $scope.posts = [];

    $http.get('http://localhost:3000/posts')
        .success(data => $scope.posts = data.data)
        .error(data => console.log(data));
});