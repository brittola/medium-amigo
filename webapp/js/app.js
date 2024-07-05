angular.module('mediumAmigo', ["ngRoute"]).run(function($rootScope, ConfigValue) {
    $rootScope.login = function() {
        $rootScope.loggedUser = { name: "Gabriel Rodrigues", id: 1 };
    };

    $rootScope.goTo = function(path) {
        location.href = path;
    };
});