homeApp.controller('HomeCtrl', function ($scope, $route) {
  // This controller instance
  var thisCtrl = this;

  $scope.json = "";
  $scope.steps = [];
  $scope.currentStep = null;
  $scope.icons = [];
  for (var k in icons) {
    $scope.icons[k] = go.Geometry.fillPath(icons[k]);
  }

  //Load and Validate Json
	thisCtrl.loadJson = function(validJson) { 
		if (validJson) {
			thisCtrl.parseJson(JSON.parse($scope.json));
		}
	}

  //Parse Json and load it on the chart
  thisCtrl.parseJson = function(json) {
    $scope.nodeData = [];
    $scope.linkData = [];
    $scope.steps = json.audit.steps;
    for (var i = 0; i < $scope.steps.length; i++) {
      var step = $scope.steps[i];
      $scope.nodeData.push({
        key: step.name,
        description: step.description,
        question: step.question,
        answers: step.answers,
        icon: "mobile",
      });
      if (i == 0) {
        $scope.currentStep = $scope.nodeData[0];
      }
      var links = step.goto;
      for (var j = 0; j < links.length; j++) {
        $scope.linkData.push({
          from: step.name,
          to: links[j],
        });
      }
    }   
    thisCtrl.loadChart(); 
  }

  thisCtrl.loadChart = function() {
    if ($scope.diagram) {
      $scope.diagram.model = new go.GraphLinksModel($scope.nodeData, $scope.linkData);
      return;
    }  

    var $ = go.GraphObject.make;
    var myDiagram =
    $(go.Diagram, "flow_chart",
      {
        initialContentAlignment: go.Spot.Top,
        "undoManager.isEnabled": true, 
        layout: $(go.TreeLayout, 
                  { angle: 90, layerSpacing: 35 })
      });
    $scope.diagram = myDiagram;


    // Node template
    myDiagram.nodeTemplate =
    $(go.Node, "Vertical",
      $(go.Shape,
        { margin: 2, fill: "black", strokeWidth: 0, width: 45, height:60 },
        new go.Binding("geometryString", "icon", function(icon) {return $scope.icons[icon]})),
      $(go.TextBlock, "Default Text",
        { margin: 12, stroke: "black", font: "bold 16px sans-serif" },
        new go.Binding("text", "key"))
    );

    // Link template
    myDiagram.linkTemplate =
    $(go.Link,
      { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape, { strokeWidth: 3, stroke: "#555" }), 
      $(go.Shape, { toArrow: "Standard", stroke: null })
     );

    myDiagram.model = new go.GraphLinksModel($scope.nodeData, $scope.linkData);

    //Event to set the chart's height when start 
    myDiagram.addDiagramListener("InitialLayoutCompleted", function(event) {
      var dia = event.diagram;
      dia.div.style.height = (dia.documentBounds.height + 24) + "px";
    });

    myDiagram.addDiagramListener("ObjectSingleClicked", function(event) {
      $scope.currentStep = event.subject.part.data;
      $route.reload();
    });
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
