angular.module('mediumAmigo', ["ngRoute"]).run(function($rootScope) {
    $rootScope.login = function() {
        $rootScope.loggedUser = { name: "Gabriel Rodrigues", id: 1 };
    };
});