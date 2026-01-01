"use client";

import { useEffect, useState } from "react";
// Leaflet requires window, so we must dynamically import or handle SSR
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface Location {
    country: string;
    lat: number;
    lng: number;
    count: number;
}

interface LocationMapProps {
    locations: Location[];
}

// Dynamically import MapContainer and TileLayer to avoid SSR issues
const MapContent = dynamic<LocationMapProps>(
    () => import("./MapContent"),
    {
        loading: () => <div className="w-full h-full bg-[#020409] animate-pulse flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest">Initializing Satellite Link...</div>,
        ssr: false
    }
);

export function LocationMap({ locations }: LocationMapProps) {
    return (
        <div className="relative w-full h-full bg-[#020409] rounded-xl overflow-hidden border border-white/10 shadow-2xl z-0">
            <MapContent locations={locations} />

            {/* HUD Overlays - Pointer Events None to allow map interaction */}
            <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-[1000]">
                <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 tracking-widest uppercase rounded backdrop-blur-md">
                    LIVE SATELLITE FEED
                </div>
            </div>

            <div className="absolute bottom-4 left-4 pointer-events-none z-[1000]">
                <div className="px-2 py-1 bg-black/50 text-[9px] text-muted-foreground font-mono tracking-widest uppercase rounded border border-white/5 backdrop-blur-md">
                    INTERACTIVE MODE :: ENABLED
                </div>
            </div>
        </div>
    );
}
