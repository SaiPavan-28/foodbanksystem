import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DonationRequest, Volunteer, HungerHotspot } from '../types/foodbridge';

interface LiveMapProps {
  requests: DonationRequest[];
  volunteers: Volunteer[];
  hotspots: HungerHotspot[];
  onSelectRequest?: (req: DonationRequest) => void;
  showHotspotHeatmap?: boolean;
  selectedRequestId?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  requests,
  volunteers,
  hotspots,
  onSelectRequest,
  showHotspotHeatmap = true,
  selectedRequestId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const centerLat = 13.0400;
  const centerLng = 80.2300;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // 1. Render Food Requests with Pulsing Glow Halos
    requests.forEach(req => {
      let pinColor = '#10B981'; // Green
      if (req.isSmallQuantity) pinColor = '#F59E0B'; // Amber
      if (req.status === 'requested') pinColor = '#EF4444'; // Red pulsing action needed

      const isSelected = selectedRequestId === req.id;

      const reqIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="
          position: relative;
          background-color: ${pinColor};
          width: ${isSelected ? '36px' : '28px'};
          height: ${isSelected ? '36px' : '28px'};
          border-radius: 50%;
          border: 3px solid #0F172A;
          box-shadow: 0 0 16px ${pinColor};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 13px;
          transition: all 0.3s ease;
        ">
          🍱
          <div style="
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 2px solid ${pinColor};
            opacity: 0.6;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([req.location.lat, req.location.lng], { icon: reqIcon });
      marker.bindPopup(`
        <div style="color: #0F172A; font-family: sans-serif; padding: 4px;">
          <h4 style="font-weight: bold; margin: 0; font-size: 14px;">📍 Request Origin: ${req.donorName}</h4>
          <p style="margin: 4px 0; font-size: 12px; color: #475569;">${req.quantityKg} kg • ${req.foodType}</p>
          <p style="margin: 0; font-size: 11px; color: #059669; font-weight: 600;">Status: ${req.status.toUpperCase()}</p>
        </div>
      `);

      if (onSelectRequest) {
        marker.on('click', () => onSelectRequest(req));
      }
      marker.addTo(markersGroupRef.current!);
    });

    // 2. Render Volunteers
    volunteers.forEach(vol => {
      const volIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="
          background-color: #0D9488;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 2px solid #84CC16;
          box-shadow: 0 0 12px #0D9488;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
        ">🚴</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([vol.currentLocation.lat, vol.currentLocation.lng], { icon: volIcon });
      marker.bindPopup(`
        <div style="color: #0F172A; font-family: sans-serif;">
          <h4 style="font-weight: bold; margin: 0;">${vol.name} (${vol.vehicleType})</h4>
          <p style="margin: 2px 0; font-size: 11px;">Status: <b style="color: #0D9488">${vol.status.toUpperCase()}</b></p>
        </div>
      `);
      marker.addTo(markersGroupRef.current!);
    });

    // 3. Render Route Polylines connecting active dispatches
    requests.forEach(req => {
      if (req.assignedVolunteerId) {
        const vol = volunteers.find(v => v.id === req.assignedVolunteerId);
        const hs = hotspots[0]; // Nearest shelter
        if (vol && hs) {
          const latlngs: L.LatLngExpression[] = [
            [req.location.lat, req.location.lng],
            [vol.currentLocation.lat, vol.currentLocation.lng],
            [hs.lat, hs.lng]
          ];
          const polyline = L.polyline(latlngs, {
            color: '#10B981',
            weight: 3,
            dashArray: '8, 8',
            opacity: 0.8
          });
          polyline.addTo(markersGroupRef.current!);
        }
      }
    });

    // 4. Hotspot Heatmap Circles
    if (showHotspotHeatmap) {
      hotspots.forEach(hs => {
        const circle = L.circle([hs.lat, hs.lng], {
          color: '#EA580C',
          fillColor: '#EA580C',
          fillOpacity: 0.25,
          radius: 1200
        });
        circle.bindPopup(`
          <div style="color: #0F172A; font-family: sans-serif;">
            <h4 style="font-weight: bold; margin: 0; color: #EA580C;">🔥 Hunger Hotspot: ${hs.areaName}</h4>
            <p style="margin: 4px 0; font-size: 12px;">Recipient Density: <b>${hs.recipientDensityScore}/100</b></p>
          </div>
        `);
        circle.addTo(markersGroupRef.current!);
      });
    }

  }, [requests, volunteers, hotspots, showHotspotHeatmap, selectedRequestId, onSelectRequest]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-10" />
      
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 space-y-1.5 shadow-lg">
        <div className="font-bold text-slate-100 uppercase tracking-wider text-[10px] mb-1">Real-time Map & Route Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm animate-ping"></span> Highlighting Food Request Origin
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-teal-600 border border-lime-400"></span> Active Volunteer Position
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-b-2 border-dashed border-emerald-400"></span> Active Delivery Route Polyline
        </div>
      </div>
    </div>
  );
};
