(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    var basePath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1) + '..';

    angular.module('angularFontStyles', ['nya.bootstrap.select', 'angularColorPicker'])
        .directive('fontStyle', ['$compile', '$timeout', '$http', function ($compile, $timeout, $http) {
            return {
                restrict: 'A',
                replace: true,
                require: 'ngModel',
                scope: {font: '=', hideFontSize: '@', hideFontColor: '@', minFontSize: '@', maxFontSize: '@', fontSizeSkip: '@'},
                templateUrl: basePath + '/templates/font-style.html',
                link: function ($scope, element, attrs, ngModel) {
                    $scope.init = function () {
                        $scope.$watch('font', function () {
                            ngModel.$setViewValue($scope.font);
                        });
                    };

                    $scope.$watch('fonts', $scope.init);
                    ngModel.$render = function () {
                        $scope.setFont(ngModel.$viewValue);
                    };

                    $scope.setFont = function (f) {
                        if ($scope.fonts) {
                            $scope.font = f;
                        } else {
                            $timeout($scope.setFont.bind(null, f), 100);
                        }
                    };
                },
                controller: function ($scope, $element) {
                    var baseURL = 'http://www.swf2vid.com';

                    $scope.init = function () {
                        $.getJSON(baseURL + '/api/fonts?type=list&callback=?', function (obj) {
                            $timeout(function () { $scope.fonts = obj; });
                        });

                        $scope.fontSizes = [];

                        for (var i = (parseInt($scope.minFontSize) || 10); i <= (parseInt($scope.maxFontSize) || 40); i += (parseInt($scope.fontSizeSkip) || 1)) {
                            $scope.fontSizes.push(i);
                        }
                    };

                    $scope.thumb = function (item) {
                        return baseURL + '/assets/fonts/thumbs/' + item + '.png';
                    };

                    $scope.init();
                }
            };
        }]);
})();

