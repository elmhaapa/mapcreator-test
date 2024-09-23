"use client";
// Change this to: import maplibregl from '@mapcreator/maplibre-gl';
import maplibregl from '@mapcreator/maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {  useState, useEffect, useRef } from "react";
import { exportSvgString } from '@mapcreator/svg-renderer';


export default function Home() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);
  const lng = 139.753;
  const lat = 35.6844;
  const zoom = 14;

  const [svg, setSvg] = useState<string | null>(null);

  const token = ""
  const other_token = ""
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

  const createSvg = async () => {
    if (!map.current) {
      console.warn('Map not initialized');
      return
    }

    map.current.once('idle', async () => {
      console.log("IS THIS CALLED?!")
      const my_svg = await exportSvgString({
        map: map.current,
        api: {
          token: other_token,
        },
      });
      setSvg(my_svg);
    })
    map.current.fire('idle');
  }
  return (
    <div>
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div ref={mapContainer} className="map" style={{
        width: '800px',
        height: '800px',
        marginTop: '20px'
      }} />

      <button onClick={() => {
        createSvg()
      }}>Export SVG</button>

      {svg && (
        <>
          <h2>SVG Image:</h2>
          <img style={{
            width: '800px',
            height: '800px',
            marginTop: '20px',
            marginBottom: '20px'
          }} src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="Exported SVG" />
        </>
      )}
      </main>
    </div>
  );
}
