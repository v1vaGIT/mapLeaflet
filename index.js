//buttons
const formContainer = document.createElement("form");
formContainer.className = "buttons";

const Button1 = document.createElement("button");
Button1.type = "button";
Button1.innerText = "Достойные ВУЗы";
Button1.addEventListener("click", function(){academyStatus("good")} );

const Button2 = document.createElement("button");
Button2.type = "button";
Button2.innerText = "Неплохие ВУЗы";
Button2.addEventListener("click", function(){academyStatus("ok")} );

const Button3 = document.createElement("button");
Button3.type = "button";
Button3.innerText = "Сомнительные ВУЗы";
Button3.addEventListener("click", function(){academyStatus("bad")} );

const Button4 = document.createElement("button");
Button4.type = "button";
Button4.innerText = "Все ВУЗы";
Button4.addEventListener("click", function(e) {
    map_polygons.map(i => {
      map.removeLayer(i)
    })

    polygons.forEach(function (bounds) {
      const area = L.polygon(bounds.bounds, {
        color: bounds.color,
        weight: bounds.weight,
      }).addTo(map)
      .on("mouseover", function (e) {
        area.bindPopup(bounds.label).openPopup();
      })
      .on("mouseout", function (e) {
        area.bindPopup(bounds.label).closePopup();
      });
      map_polygons.push(area)
    });
} );

formContainer.append(Button4,Button1, Button2, Button3);
document.body.append(formContainer);

function academyStatus(status) {
    //status.preventDefault();
    map_polygons.map(i => {
        map.removeLayer(i)
    })
    // map_markers.map(i => {
    //     map.removeLayer(i)
    // })
  
    map_polygons = [];
    polygons.filter(i => i.status == status).forEach(function (bounds) {
      const area = L.polygon(bounds.bounds, {
        color: bounds.color,
        weight: bounds.weight,
      }).addTo(map)
      .on("mouseover", function (e) {
        area.bindPopup(bounds.label).openPopup();
      })
      .on("mouseout", function (e) {
        area.bindPopup(bounds.label).closePopup();
      });
      map_polygons.push(area)
    });
};


//map
var map = L.map("map", {drawControl: true}).setView([48.51541039023157, 135.0571632385254], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

map.pm.addControls({
  position: 'topleft',
  drawCircle: false, 
  drawRectangle: false,
  drawPolyline: false,
  drawCircleMarker: false,
});


let points = []
map.on('pm:drawstart', ({ workingLayer }) => {
  workingLayer.on('pm:vertexadded', e => {
    points.push(e.latlng)
  });
});

map.on('pm:drawend', (e) => {
  polygons.forEach(pol => {
    let count = 0;
    pol.bounds.forEach(p => {
      let is = isPointInsidePolygon(p, points)
      if (is) {
        count++
      }
    })
    if (count === pol.bounds.length) {
      alert(`в полигон входят: ${pol.label}`)
    }
  })
});


const isPointInsidePolygon = (point, vs) => {    
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i].lat, yi = vs[i].lng;
      let xj = vs[j].lat, yj = vs[j].lng
      
      let intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  
  return inside;
};


// markers
// const coordinates = [
//   { coords: [48.52720660409438, 135.05113899707794], label: "ХГУЭП", status: 'ok' },
//   { coords: [48.53090123856703, 135.0527858734131], label: "ТОГУ", status: 'ok' },
//   { coords: [48.49384322304583, 135.06194829940796], label: "ДВГУПС", status: 'good' },
// ];

// let map_markers = [];
// coordinates.forEach(function (coords) {
//   const marker = L.marker(coords.coords)
//     .addTo(map)
//     .on("mousemove", function (e) {
//       marker.bindPopup(coords.label).openPopup();
//     })
//     .on("mouseout", function (e) {
//       marker.bindPopup(coords.label).closePopup();
//     });
//     map_markers.push(marker)
// });

// polygons
const polygons = [
  {
    bounds: [
      [48.52673409774523, 135.0506615638733], 
      [48.526744755831785, 135.05167007446286],
      [48.52761515866186, 135.0516539812088],
      [48.527572527034934, 135.05066692829132],
      [48.52673409774523, 135.0506615638733],
    ],
    color: "#fffc00",
    weight: 1,
    status: "ok",
    label: "ХГУЭП"
  },
  {
    bounds: [
      [48.53200957634482, 135.05154132843018],
      [48.52989589838217, 135.0515627861023],
      [48.52990655580327, 135.05362808704376],
      [48.53199181471274, 135.05362272262573],
      [48.53200957634482, 135.05154132843018],
    ],
    color: "#fffc00",
    weight: 1,
    status: "ok",
    label: "ТОГУ"
  },
  {
    bounds: [
      [48.494923932330636, 135.0607681274414],
      [48.493359740381564, 135.05993127822876],
      [48.49263450774077, 135.06319284439084],
      [48.49422716187729, 135.06398677825928],
      [48.494923932330636, 135.0607681274414],
    ],
    color: "#00d600",
    weight: 1,
    status: "good",
    label: "ДВГУПС"
  },
];

let map_polygons = [];
polygons.forEach(function (bounds) {
  const area = L.polygon(bounds.bounds, {
    color: bounds.color,
    weight: bounds.weight,
  }).addTo(map)
  .on("mouseover", function (e) {
    area.bindPopup(bounds.label).openPopup();
  })
  .on("mouseout", function (e) {
    area.bindPopup(bounds.label).closePopup();
  });
  map_polygons.push(area)
});

map.fitBounds(polygons);