angular.module('homeApp').component('stepInfo', {
  controller: function ($scope, stepInfoService) {
	  	$scope.$on('updateCurrentStep', function(event, step){
	  		$scope.currentStep = step;
	  	}); 	
  },
  templateUrl: 'components/step-info/stepInfo.html',
});