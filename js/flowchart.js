(function($){
  $(document).ready(function() {

  $('input[name=future-funds]').val("");

  /* loadJSON function source: http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery*/

  function loadJSON(path, success, error)
  {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
  }

  /* goJS flowchart editor source: http://gojs.net/latest/samples/flowchart.html */

  function init() {
    var $ = go.GraphObject.make;
    myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,
          "LinkDrawn": showLinkLabel,
          "LinkRelinked": showLinkLabel,
          "animationManager.duration": 800,
          "undoManager.isEnabled": true
        });

    function nodeStyle() {
      return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationSpot: go.Spot.Center,
          mouseEnter: function (e, obj) { showPorts(obj.part, true); },
          mouseLeave: function (e, obj) { showPorts(obj.part, false); }
        }
      ];
    }

    function makePort(name, spot, output, input) {
      return $(go.Shape, "Circle",
               {
                  fill: "transparent",
                  stroke: null,
                  desiredSize: new go.Size(8, 8),
                  alignment: spot, alignmentFocus: spot,
                  portId: name,
                  fromSpot: spot, toSpot: spot,
                  fromLinkable: output, toLinkable: input,
                  cursor: "pointer"
               });
    }

    myDiagram.nodeTemplateMap.add("Market Factor",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Diamond",
            { fill: "#00A9C9", stroke: null },
            new go.Binding("figure", "figure")),
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: 'whitesmoke',
              margin: 8,
              maxSize: new go.Size(100, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));
    myDiagram.nodeTemplateMap.add("Decision",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { fill: "#ff4da6", stroke: null },
            new go.Binding("figure", "figure")),
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: 'whitesmoke',
              margin: 8,
              maxSize: new go.Size(100, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));
    myDiagram.nodeTemplateMap.add("Start",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
          $(go.TextBlock, "Start",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: 'whitesmoke' },
            new go.Binding("text"))
        ),
        makePort("L", go.Spot.Left, true, false),
        makePort("R", go.Spot.Right, true, false),
        makePort("B", go.Spot.Bottom, true, false)
      ));

    myDiagram.nodeTemplateMap.add("End",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#cc33ff", stroke: null }),
          $(go.TextBlock, "End",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: 'whitesmoke', editable: true },
            new go.Binding("text"))
        ),
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, false, true),
        makePort("B", go.Spot.Bottom, true, false)
      ));

    myDiagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5, toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
          mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $(go.Shape,
          { toArrow: "standard", stroke: null, fill: "gray"}),
        $(go.Panel, "Auto",
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle",
            { fill: "#F8F8F8", stroke: null }),
          $(go.TextBlock, "Yes",
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );

    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }

    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

    loadJSON('data/data.json',
        function(data) {
          for (var key in data) {
            if (key == "nodeDataArray") {
              var size = data[key].length;
              var mf = 0;
              var d = 0;
              for (var i = 0; i < size; i++) {
                
                var this_element = data[key][i];
                if (this_element['category'] == "Start") {
                  data[key][i]['loc'] = "155 0";
                } else if (this_element['category'] == "Market Factor") {
                  var x = 100;
                  var y = (mf * 150) + 200;
                  data[key][i]['loc'] = x + " " + y;
                  mf++;
                } else if (this_element['category'] == "Decision") {
                  var x = 350;
                  var y = (d * 150) + 200;
                  data[key][i]['loc'] = x + " " + y;
                  d++;
                } else if (this_element['category'] == "End") {
                  data[key][i]['loc'] = "700 700";
                }
              }
            }
          }
        myDiagram.model = go.Model.fromJson(data); },
        function(xhr) { console.error(xhr); }
    );

    myDiagram.add(
    $(go.Part,
      $(go.Panel, "Table",
        $(go.TextBlock, "2016",
          { row: 0, column: 0, margin: 60, background: "white", stroke: "limegreen"  }),
        $(go.TextBlock, "2017",
          { row: 0, column: 1, margin: 60,
            background: "white", stroke: "limegreen" }),
        $(go.TextBlock, "2018",
          { row: 0, column: 2, margin: 60,
            background: "white", stroke: "limegreen" }),
        $(go.TextBlock, "2019",
          { row: 0, column: 3, margin: 60, background: "white", stroke: "limegreen" }),
        $(go.TextBlock, "2020",
          { row: 0, column: 4, margin: 60, background: "white", stroke: "limegreen" })
      )
    ));

    /*myDiagram.model.addChangedListener(function(e , obj) {
      for (var iter = myDiagram.selection.iterator; iter.next(); ) {
        var part = iter.value;
        if(part instanceof go.Node) {
          if(part.data.key<0) { //new nodes
            return;
          } else {  //existing nodes
            console.log(part.data.key); //the modified node
            part.data.key.nodeValue="new value";
          }
        }
      }
    });
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      myDiagram.model = go.Model.fromJson(data);
    });*/

    myPalette =
      $(go.Palette, "myPaletteDiv",
        {
          "animationManager.duration": 800,
          nodeTemplateMap: myDiagram.nodeTemplateMap,
          model: new go.GraphLinksModel([
            { category: "End", text: ""},
            { category: "Market Factor", text: "Market Factor", figure: "Circle" },
            { category: "Decision", text: "Decision", figure: "Circle" },
          ])
        });

    function showPorts(node, show) {
      var diagram = node.diagram;
      if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
      node.ports.each(function(port) {
          port.stroke = (show ? "white" : null);
      });

    }

  }

  init();

  $('#recalculate').on('click', function() {

    //this value should be calculated with algorithm pulling in api data
    var random_val = Math.random() * (100000 - 10000) + 10000;
    var rounded = Math.round(random_val*Math.pow(10,2))/Math.pow(10,2);
    $('input[name=future-funds]').val('$' + rounded);

  });

  $(".dropdown-menu li a").click(function(){

    $(".dropdown-toggle:first-child").text("Selected: " + $(this).text());
    $(".dropdown-toggle:first-child").val($(this).text());

  });

});

})(jQuery);
