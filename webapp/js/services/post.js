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
        create: function(post) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.post(`${ConfigValue.baseUrl}/posts`, post, {
                headers: {
                    Authorization
                }
            });
        },
        update: function(post) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.put(`${ConfigValue.baseUrl}/posts/${post.id}`, post, {
                headers: {
                    Authorization
                }
            });
        },
        delete: function(id) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.delete(`${ConfigValue.baseUrl}/posts/${id}`, {
                headers: {
                    Authorization
                }
            });
        },
        like: function(id) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.post(`${ConfigValue.baseUrl}/posts/like/${id}`, {}, {
                headers: {
                    Authorization
                }
            });
        },
        unlike: function(id) {
            const Authorization = $rootScope.loggedUser ? `Bearer ${$rootScope.loggedUser.token}` : '';
            return $http.delete(`${ConfigValue.baseUrl}/posts/like/${id}`, {
                headers: {
                    Authorization
                }
            });
        }
    }
});