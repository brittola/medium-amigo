angular.module('mediumAmigo').config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'view/home.html',
        controller: 'HomeController'
    });
    $routeProvider.when('/post/:id', {
        templateUrl: 'view/post.html',
        controller: 'PostController'
    });
});