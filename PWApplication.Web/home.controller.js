angular.module('pwapp')
        .controller('homeController', ['$location', '$rootScope', '$cookies', '$scope', 'TransactionService', 'DataProvider', function ($location, $rootScope, $cookies, $scope, TransactionService, DataProvider) {
            $scope.transactions = [];
            $scope.reverse = true;
            $scope.sortProperty = 'DateTime';
            $scope.sort = sort;
            $scope.getSortClass = getSortClass;

            $scope.selectedTransaction = null;
            $scope.setSelected = setSelected;
            $scope.createCopy = createCopy;
            $scope.create = create;

            $scope.filter1 = filter1;
            $scope.filterProperty = 'Amount';
            $scope.filterExpression = {
                CorrespondentUser: undefined,
                DateTime: undefined,
                Amount: undefined,
                ResultingBalance: undefined
            };

            $scope.search = {   
                isUser:false, user: undefined,
                isDateTime: false, datetime: undefined,
                isAmount: false, amount: undefined,
                isResultingBalance: false, balance: undefined
            };

            TransactionService.GetByUser($rootScope.currentUser.login).then(function (response) {
                if (response != null && response != [] && response.length > 0)
                    $scope.transactions = response;
            });

            function sort(property) {
                if ($scope.sortProperty == property)
                    $scope.reverse = !$scope.reverse;
                else {
                    $scope.reverse = false;
                    $scope.sortProperty = property;
                }
            }

            function getSortClass(property) {
                if ($scope.sortProperty == property)
                    return $scope.reverse ? 'arrow-down' : 'arrow-up';
            }

            function filter1() {
                $scope.filterExpression = {};
                $scope.filterExpression.CorrespondentUser = $scope.search.user;
                $scope.filterExpression.DateTime = $scope.search.datetime;
                $scope.filterExpression.Amount = $scope.search.amount;
            }

            function setSelected (selectedTransaction) {
                $scope.selectedTransaction = selectedTransaction;
            };

            function createCopy() {
                if ($scope.selectedTransaction != null) {
                    DataProvider.data = $scope.selectedTransaction;
                    $location.path('/transactions');
                }
            }

            function create() {
                $location.path('/transactions');
            }
        }]);