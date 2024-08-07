angular.module('mediumAmigo').controller('modalLoginController', function($scope, $rootScope, $modalInstance, UserService) {

    $scope.user = {
        email: '',
        password: ''
    }

    $scope.errorMessage = '';

    $scope.close = function() {
        $modalInstance.close();
    };

    $scope.dismiss = function() {
        $modalInstance.dismiss();
    }

    $scope.sendLogin = function(e) {
        e.preventDefault();

        Object.keys($scope.user).forEach(function(key) {
            $scope.user[key] = $scope.user[key].trim();

            console.log($scope.user[key]);

            if ($scope.user[key] === '') {
                $scope.errorMessage = 'Preencha todos os campos.';
            }
        });

        UserService.login($scope.user)
            .success(function(data) {
                console.log(data);
                $rootScope.loggedUser = data.data;
                localStorage.setItem('loggedUser', JSON.stringify(data.data));
                $scope.close();
            })
            .error(function(data) {
                console.log(data);
                if (data.error) {
                    $scope.errorMessage = 'Credenciais inválidas.';
                }
            });
    };
});