angular.module('mediumAmigo').factory('PostService', function($rootScope, $http, ConfigValue){

    return {
        get: function(page) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.get(`${ConfigValue.baseUrl}/posts?page=${page}`, {
                headers: {
                    Authorization
                }
            });
        },
        getById: function(id) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.get(`${ConfigValue.baseUrl}/posts/${id}`, {
                headers: {
                    Authorization
                }
            });
        },
    }
});