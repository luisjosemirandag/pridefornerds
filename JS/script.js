function openTab(evt, tab) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
  };


svg = d3.select('svg');
rotate = [0,0]
projection = d3.geoOrthographic();
pathGenerator = d3.geoPath().projection(projection);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(data){
    world = {type:"Sphere"};
    countries = topojson.feature(data,data.objects.countries)
    countries_wt   = [];
    for (var i = 0; i < 177 ; i++){
        countries_wt.push(topojson.feature(data,data.objects.countries.geometries[i]));
    }
    n = countries_wt.lenght
    countries_marraige_eq = ['Netherlands','Belgium','Spain','Canada','South Africa','Norway','Sweden','Portugal','Iceland','Argentina','Denmark','Brazil','France','Uruguay','New Zealand','Luxembourg','United States of America','Ireland','Colombia','Finland','Malta','Germany','Australia','Austria','Taiwan','Ecuador','United Kingdom','Costa Rica','Puerto Rico']
    countries_civil_un = ['Chile','Switzerland','Slovenia','Croatia','Hungary','Czechia','Cyprus','Greece','Italy','Estonia']
    indexes_marr = []
    indexes_civil = []
    for (g = 0; g < 29; g++){
      for (i = 0; i < 177; i++) {
          if (countries_marraige_eq[g].includes(countries_wt[i].properties.name)){
            indexes_marr.push(i)
          }
        }
    }
    for (g = 0; g < 10; g++){
        for (i = 0; i < 177; i++) {
            if (countries_civil_un[g].includes(countries_wt[i].properties.name)){
                indexes_civil.push(i)
            }
          }
      }

    svg.append("path")
        .attr('class','sphere')
        .datum(world)
        .attr("d", pathGenerator)

    country = svg.selectAll(null).data(countries.features).enter().append('path').attr('d', pathGenerator)
        .attr('class','countries')
        .attr('d',pathGenerator)
        .style("fill", function(d, j) {
            if (indexes_marr.includes(j)){
                return "#F7A8B8"
            }
            else if (indexes_civil.includes(j)){
                return "#c699fa"
            }
            else {return "azure"}
        })
        .append('title')
            .text(d => d.properties.name)
  });

    svg.call(d3.drag()
    .subject(function() { return {x: rotate[0], y: -rotate[1]}; })
    .on("drag", function() {
        x = d3.event.x;
        y = -d3.event.y;
        rotate = [x,y]
        projection.rotate(rotate);
        path = d3.geoPath().projection(projection);
        d3.selectAll("path").attr("d", pathGenerator);
        }));

    svg.append("circle").attr("cx",7).attr("cy",449).attr("r", 7).style("fill", "#F7A8B8")
    svg.append("text").attr("x", 27).attr("y", 450).text("Legal marriage").style("font-size", "25px").style("fill", "azure").style('font-family','Staatliches, cursive').attr("alignment-baseline","middle")
    svg.append("circle").attr("cx",7).attr("cy",483).attr("r", 7).style("fill", "#c699fa")
    svg.append("text").attr("x", 27).attr("y", 485).text("Civil unions").style("font-size", "25px").style("fill", "azure").style('font-family','Staatliches, cursive').attr("alignment-baseline","middle")
