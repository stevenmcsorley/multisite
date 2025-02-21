import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const originsWithCoords = [
  { name: "Aboriginal Australian", lat: -25.2744, lng: 133.7751 },
  { name: "Afrikaans", lat: -30.5595, lng: 22.9375 },
  { name: "Akan", lat: 7.9465, lng: -1.0232 },
  { name: "Albanian", lat: 41.1533, lng: 20.1683 },
  { name: "Amharic", lat: 9.145, lng: 40.4897 },
  { name: "Ancient Egyptian", lat: 26.8206, lng: 30.8025 },
  { name: "Arabic", lat: 23.4241, lng: 53.8478 },
  { name: "Aramaic", lat: 33.5138, lng: 36.2765 },
  { name: "Armenian", lat: 40.1792, lng: 44.4991 },
  { name: "Assyrian", lat: 35.6895, lng: 45.4 },
  { name: "Athabascan", lat: 64.2008, lng: -149.4937 },
  { name: "Aymara", lat: -16.5, lng: -68.15 },
  { name: "Azerbaijani", lat: 40.1431, lng: 47.5769 },
  { name: "Basque", lat: 43.3167, lng: -1.9833 },
  { name: "Bengali", lat: 23.685, lng: 90.3563 },
  { name: "Berber", lat: 31.7917, lng: -7.0926 },
  { name: "Bulgarian", lat: 42.7339, lng: 25.4858 },
  { name: "Burmese", lat: 21.9162, lng: 95.956 },
  { name: "Catalan", lat: 41.5912, lng: 2.3585 },
  { name: "Celtic", lat: 51.5002, lng: -0.1262 },
  { name: "Cherokee", lat: 35.5175, lng: -86.5804 },
  { name: "Chinese", lat: 35.8617, lng: 104.1954 },
  { name: "Coptic", lat: 30.0444, lng: 31.2357 },
  { name: "Croatian", lat: 45.1, lng: 15.2 },
  { name: "Danish", lat: 56.2639, lng: 9.5018 },
  { name: "Dutch", lat: 52.3676, lng: 4.9041 },
  { name: "English", lat: 51.5099, lng: -0.118 },
  { name: "Fijian", lat: -17.7134, lng: 178.065 },
  { name: "Filipino", lat: 12.8797, lng: 121.774 },
  { name: "French", lat: 48.8566, lng: 2.3522 },
  { name: "German", lat: 51.1657, lng: 10.4515 },
  { name: "Greek", lat: 37.9838, lng: 23.7275 },
  { name: "Hebrew", lat: 31.7683, lng: 35.2137 },
  { name: "Hindi", lat: 28.6139, lng: 77.209 },
  { name: "Hungarian", lat: 47.1625, lng: 19.5033 },
  { name: "Icelandic", lat: 64.1355, lng: -21.8954 },
  { name: "Indonesian", lat: -0.7893, lng: 113.9213 },
  { name: "Italian", lat: 41.9028, lng: 12.4964 },
  { name: "Japanese", lat: 36.2048, lng: 138.2529 },
  { name: "Korean", lat: 37.5665, lng: 126.978 },
  { name: "Latin", lat: 41.9028, lng: 12.4964 },
  { name: "Maori", lat: -40.9006, lng: 174.886 },
  { name: "Persian", lat: 35.6892, lng: 51.389 },
  { name: "Polish", lat: 52.2298, lng: 21.0122 },
  { name: "Portuguese", lat: 38.7169, lng: -9.1399 },
  { name: "Punjabi", lat: 30.7333, lng: 76.7794 },
  { name: "Russian", lat: 55.7558, lng: 37.6173 },
  { name: "Sanskrit", lat: 20.5937, lng: 78.9629 },
  { name: "Scottish", lat: 55.9533, lng: -3.1883 },
  { name: "Spanish", lat: 40.4168, lng: -3.7038 },
  { name: "Swahili", lat: -6.369028, lng: 34.888822 },
  { name: "Swedish", lat: 59.3293, lng: 18.0686 },
  { name: "Tamil", lat: 13.0674, lng: 80.2376 },
  { name: "Telugu", lat: 17.385, lng: 78.4867 },
  { name: "Thai", lat: 13.7563, lng: 100.5018 },
  { name: "Turkish", lat: 39.9334, lng: 32.8597 },
  { name: "Urdu", lat: 30.3753, lng: 69.3451 },
  { name: "Vietnamese", lat: 14.0583, lng: 108.2772 },
  { name: "Welsh", lat: 51.4816, lng: -3.1791 },
  { name: "Xhosa", lat: -31.6469, lng: 26.6417 },
  { name: "Yoruba", lat: 8.5, lng: 4.5 },
  { name: "Zulu", lat: -29.8252, lng: 31.0033 },
];

// MapMarker Component
const MapMarker = ({ name, lat, lng, onClick }) => (
  <Marker coordinates={[lng, lat]} onClick={onClick}>
    <g className="cursor-pointer group">
      <title>{name}</title>
      <circle
        r={3}
        fill="red"
        stroke="white"
        strokeWidth={0.5}
        className="transition-transform group-hover:scale-105"
      />
      <text
        textAnchor="middle"
        y={-5}
        className="fill-white text-[8px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {name}
      </text>
    </g>
  </Marker>
);

// OriginBadge Component
const OriginBadge = ({ name }: { name: string }) => (
  <a
    href={`/browse/${encodeURIComponent(name.toLowerCase())}`}
    className="badge badge-secondary badge-outline text-lg p-2 hover:bg-secondary hover:text-white transition"
  >
    {name}
  </a>
);
OriginBadge.propTypes = {
  name: PropTypes.string.isRequired,
};

export default function OriginsMap() {
  const { t } = useTranslation();

  // Sort origins alphabetically
  const sortedOrigins = [...originsWithCoords].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        {t("browseByOrigin", "Browse Names by Origin")}
      </h2>
      {/* Origins List Underneath Map */}
      <div className="shadow-lg p-6 w-full max-w-4xl text-center rounded-lg">
        {/* <h3 className="text-2xl font-bold mb-4">
          {t("availableOrigins", "Available Origins")}
        </h3> */}
        <div className="flex flex-wrap gap-2 justify-center">
          {sortedOrigins.map(({ name }) => (
            <OriginBadge key={name} name={name} />
          ))}
        </div>
      </div>

      {/* World Map with Zoom */}
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        className="w-full h-[500px] mb-6 bg-gray-900"
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="fill-gray-700 stroke-gray-400 hover:fill-gray-500 transition-all"
                />
              ))
            }
          </Geographies>

          {/* Name Origins Markers */}
          {sortedOrigins.map(({ name, lat, lng }) => (
            <MapMarker
              key={name}
              name={name}
              lat={lat}
              lng={lng}
              onClick={() =>
                (window.location.href = `/browse/${encodeURIComponent(
                  name.toLowerCase()
                )}`)
              }
            />
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
