angular.module('mediumAmigo').controller('modalLoginController', function($scope, $rootScope, $modalInstance, UserService) {

    $scope.newUser = {
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

        Object.keys($scope.newUser).forEach(function(key) {
            $scope.newUser[key] = $scope.newUser[key].trim();

            console.log($scope.newUser[key]);

            if ($scope.newUser[key] === '') {
                $scope.errorMessage = 'Preencha todos os campos.';
            }
        });

        UserService.login($scope.newUser)
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