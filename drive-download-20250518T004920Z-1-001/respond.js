import { supabase } from './supabase.js';

const map = L.map('map').setView([14.5995, 120.9842], 13); // Default to Manila

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors',
}).addTo(map);

const urlParams = new URLSearchParams(window.location.search);
const reportId = urlParams.get('id');

async function getEmergencyDetails() {
  const { data, error } = await supabase
    .from('emergency_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) {
    console.error('Failed to fetch report:', error);
    return;
  }

  const { location, description } = data;

  // For demo: Get current location
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    const [emLat, emLng] = location.split(',').map(Number);

    const userMarker = L.marker([userLat, userLng]).addTo(map).bindPopup("You");
    const emergencyMarker = L.marker([emLat, emLng]).addTo(map).bindPopup("Emergency");

    L.Routing.control({
      waypoints: [L.latLng(userLat, userLng), L.latLng(emLat, emLng)],
      routeWhileDragging: false
    }).addTo(map);

    await getAIResponse(description, userLat, userLng, emLat, emLng);
  });
}

async function getAIResponse(description, userLat, userLng, emLat, emLng) {
  const aiDiv = document.getElementById('ai-response');

  const prompt = `
  An emergency has been reported: ${description}
  Responder is currently at [${userLat}, ${userLng}].
  The emergency is located at [${emLat}, ${emLng}].

  1. What is the fastest route?
  2. Any cautions to be aware of during travel?
  3. What should the volunteer do upon arrival?
  Please format clearly.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDj14MIi4L7pCxXIxMfJVFTTaZ5h_stxdI`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const result = await response.json();
  const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "AI failed to respond.";
  aiDiv.innerText = aiText;
}

getEmergencyDetails();
