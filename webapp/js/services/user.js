angular.module('mediumAmigo').service('UserService', function($http, ConfigValue) {
    return {
        login: function(user) {
            return $http.post(`${ConfigValue.baseUrl}/users/auth`, user);
        },
    }
});