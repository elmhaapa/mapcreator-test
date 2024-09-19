"use client";
// Change this to: import maplibregl from '@mapcreator/maplibre-gl';
import maplibregl from '@mapcreator/maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { use, useEffect, useRef } from "react";
import { exportSvgString } from '@mapcreator/svg-renderer';


export default function Home() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);
  const lng = 139.753;
  const lat = 35.6844;
  const zoom = 14;

  const the_svg: any = useRef(null);

  const token = "YOUR_TOKEN"
  const other_token = "YOUR_OTHER_TOKEN"
  const styles = `https://vapi.mc-cdn.io/styles/Aluemedia%20Digital.json?include_token=true&access_token=${token}`
  
  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,  
      style: styles,
      center: [lng, lat],
      zoom: zoom
    });
  }, [lng, lat, zoom]);

  useEffect(() => {
    const f = async () => {
      if (!map.current) return;
      the_svg.current = await exportSvgString({
        map: map.current,
        api: {
          token: other_token,
        },
      });
    }
    f();
  }, [map]);

  return (
    <div>
      <main style={{
        width: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div ref={mapContainer} className="map" style={{
        width: '800px',
        height: '800px'
      }} />

      {the_svg.current && (
        <div>
          <h2>Exported SVG:</h2>
          <div dangerouslySetInnerHTML={{ __html: the_svg.current }} />
        </div>
      )}
      </main>
    </div>
  );
}
