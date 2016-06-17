homeApp.controller('HomeCtrl', function ($scope) {
  // This controller instance
  var thisCtrl = this;

  $scope.json = "";
  $scope.steps = [];
  $scope.nodeData = [];
  $scope.linkData = [];
  $scope.show = false;

  // Load JSON
	thisCtrl.loadJson = function(validJson) { 
		if (validJson) {
			thisCtrl.parseJson(JSON.parse($scope.json));
		}
	}

  thisCtrl.parseJson = function(json) {
    $scope.steps = json.audit.steps;
    for (var i = 0; i < $scope.steps.length; i++) {
      var step = $scope.steps[i];
      $scope.nodeData.push({
        key: step.name,
        instruction: step.instruction,
        question: step.question,
        answers: step.answers,
        icon: "mobile",
      });
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
    for (var k in icons) {
      icons[k] = go.Geometry.fillPath(icons[k]);
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

    // Node template
    myDiagram.nodeTemplate =
    $(go.Node, "Vertical",
      $(go.Shape,
        { margin: 2, fill: "black", strokeWidth: 0, width: 45, height:60 },
        new go.Binding("geometryString", "icon", function(icon) {return icons[icon]})),
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
    myDiagram.addDiagramListener("InitialLayoutCompleted", function(e) {
      var dia = e.diagram;
      dia.div.style.height = (dia.documentBounds.height + 24) + "px";
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
