"use client";

import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import L from "leaflet";

export default function LiveMap() {
  const router = useRouter();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const areas = useQuery(api.queries.getLiveMap);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [6.524, 3.379],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current || !areas) return;

    const map = mapRef.current;
    const currentIds = new Set<string>();

    for (const area of areas) {
      const id = area._id;
      currentIds.add(id);

      const hasLight = area.status?.hasLight;
      const noData = area.status === null;

      const color = noData ? "#555555" : hasLight ? "#22c55e" : "#ef4444";
      const fillOpacity = noData ? 0.3 : 0.75;
      const radius = noData ? 10 : 13;

      const outageDuration = area.status?.outageSince
        ? formatDuration(Date.now() - area.status.outageSince)
        : null;

      const popupHtml = `
        <div style="font-family: JetBrains Mono, monospace; min-width: 160px;">
          <div style="font-family: Syne, sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 6px; color: #e8e8e8;">
            ${area.name}
          </div>
          <div style="font-size: 12px; color: ${color}; font-weight: 600; margin-bottom: 4px;">
            ${noData ? "No reports yet" : hasLight ? "⚡ Light available" : "🔴 No light"}
          </div>
          ${outageDuration ? `<div style="font-size: 11px; color: #888;">Out for ${outageDuration}</div>` : ""}
          ${area.status?.avgOutageMins ? `<div style="font-size: 11px; color: #666; margin-top: 2px;">Avg outage: ${Math.round(area.status.avgOutageMins)}m</div>` : ""}
          <a href="/area/${area.slug}" style="
            display: block;
            margin-top: 10px;
            padding: 6px 12px;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #e8e8e8;
            font-size: 11px;
            text-align: center;
            text-decoration: none;
            border-radius: 3px;
            cursor: pointer;
          ">Report / View details →</a>
        </div>
      `;

      const existing = markersRef.current.get(id);

      if (existing) {
        existing.setStyle({ color, fillColor: color, fillOpacity, radius });
        existing.bindPopup(popupHtml, { className: "nepa-popup" });
      } else {
        const marker = L.circleMarker([area.lat, area.lng], {
          radius,
          color,
          fillColor: color,
          fillOpacity,
          weight: 2,
          opacity: 0.9,
        }).addTo(map);

        marker.bindPopup(popupHtml, { className: "nepa-popup" });
        markersRef.current.set(id, marker);
      }
    }

    // Remove stale markers
    for (const [id, marker] of markersRef.current) {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }
  }, [areas, router]);

  return (
    <div ref={containerRef} style={{ flex: 1, width: "100%", minHeight: 0 }} />
  );
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}
