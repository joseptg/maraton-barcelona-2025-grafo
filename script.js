const map = L.map("map").setView([41.39, 2.17], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

fetch("maraton_barcelona_2025_graph.json")
  .then((res) => {
    console.log("Respuesta del fetch:", res);
    return res.json();
  })
  .then((data) => {
    console.log("Datos cargados del JSON:", data);
    // (resto del código...)
  })
  .catch((err) => {
    console.error("Error al cargar el JSON:", err);
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
