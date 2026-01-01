"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issues
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
    country: string;
    lat: number;
    lng: number;
    count: number;
}

export default function MapContent({ locations }: { locations: Location[] }) {
    return (
        <MapContainer
            center={[20, 0] as L.LatLngExpression}
            zoom={2}
            scrollWheelZoom={false}
            className="w-full h-full bg-[#020409]"
            zoomControl={false}
            attributionControl={false}
        >
            {/* Google Maps Hybrid Tiles (Satellite + Labels) */}
            <TileLayer
                url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}"
                attribution='&copy; Google Maps'
            />
            {/* Optional: Dark overlay to make it fit theme better if needed, but keeping raw satellite as requested */}

            {locations.map((loc, i) => (
                <CircleMarker
                    key={i}
                    center={[loc.lat, loc.lng]}
                    pathOptions={{
                        color: '#f43f5e',
                        fillColor: '#f43f5e',
                        fillOpacity: 0.6,
                        weight: 1
                    }}
                    radius={Math.min(20, Math.max(5, loc.count / 2))}
                >
                    <Popup className="glass-popup">
                        <div className="p-2 min-w-[150px]">
                            <h3 className="font-bold text-sm text-foreground mb-1">{loc.country}</h3>
                            <div className="text-xs text-muted-foreground">
                                <span className="text-rose-500 font-bold">{loc.count}</span> Breaches Detected
                            </div>
                            <div className="mt-2 text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
                                Sector: {loc.lat.toFixed(2)}, {loc.lng.toFixed(2)}
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
