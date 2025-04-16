const map = L.map("map").setView([41.39, 2.17], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

fetch("maraton_barcelona_2025_graph.json")
  .then((res) => res.json())
  .then((data) => {
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: [...data.nodes, ...data.edges],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#0074D9",
            "label": "data(label)",
            "width": 6,
            "height": 6
          }
        },
        {
          selector: "edge",
          style: {
            "line-color": "#AAAAAA",
            "width": 1
          }
        }
      ],
      layout: { name: "preset" }
    });

    // Posicionar los nodos
    data.nodes.forEach((n) => {
      const latlng = L.latLng(n.data.latitude, n.data.longitude);
      const point = map.latLngToContainerPoint(latlng);
      cy.getElementById(n.data.id).position({ x: point.x, y: point.y });
    });

    // Interacción
    cy.on("tap", "node", (evt) => {
      const d = evt.target.data();
      alert(`Punto ${d.id}
Lat: ${d.latitude}
Lon: ${d.longitude}
Elevación: ${d.elevation} m
Hora: ${d.timestamp}`);
    });

    // Reposicionar si se mueve el mapa
    map.on("zoomend moveend resize", () => {
      data.nodes.forEach((n) => {
        const latlng = L.latLng(n.data.latitude, n.data.longitude);
        const point = map.latLngToContainerPoint(latlng);
        cy.getElementById(n.data.id).position({ x: point.x, y: point.y });
      });
    });
  });
