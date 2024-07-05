angular.module('mediumAmigo').factory('PostService', function($http, ConfigValue){

    return {
        get: function(page) {
            return $http.get(`${ConfigValue.baseUrl}/posts?page=${page}`);
        },
        getById: function(id) {
            return $http.get(`${ConfigValue.baseUrl}/posts/${id}`);
        },
    }
});