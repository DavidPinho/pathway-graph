homeApp.controller('HomeCtrl', function ($scope) {
  // This controller instance
  var thisCtrl = this;

  $scope.jsont = "";
  $scope.hasError = false;

    // Load JSON
	thisCtrl.loadJson = function(validJson) { 
		if (validJson) {
			alert("valid");
		}
	}

});


homeApp.directive('jsonValidator', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, mCtrl) {
    	function isJson(str) {
		    try {
		        JSON.parse(str);
		    } catch (e) {
		        return false;
		    }
		    return true;
			}
      function validateJson(value) {
      	if (isJson(value)) {
      		mCtrl.$setValidity('json', true);
				} else {
					mCtrl.$setValidity('json', false);
				}
        return value;
      }
      mCtrl.$parsers.push(validateJson);
    }
  };
});
