homeApp.service('stepInfoService', function($rootScope){
	
	this.setCurrentStep = function(step){
		$rootScope.$broadcast("updateCurrentStep", step);
	}
	
});