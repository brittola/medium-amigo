angular.module('mediumAmigo').factory('PostService', function($http){

    const BASE_URL = 'http://localhost:3000/posts';

    return {
        get: function(page) {
            return $http.get(`${BASE_URL}?page=${page}`);
        }
    }
});