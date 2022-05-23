import {
	MapContainer,
	TileLayer,
	useMap,
	Marker,
	Popup,
	GeoJSON,
} from "react-leaflet";
import { europeData } from "../../Data/europeData.js";
import "leaflet/dist/leaflet.css";
export default function Map() {



    const changeCountryColor = (event) => {
        console.log(event.target);
        event.target.setStyle({
          color: "green",
        //   fillColor: this.state.color,
          fillOpacity: 1,
        });
      };
    
    function onEachCountry (country, layer)  {
          country.price= Math.floor(Math.random() *1000)
       const countryName  = country.properties.admin
        console.log('ON EACH COUNTRY:',countryName);
        layer.bindPopup(countryName);
    
        // layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
        // const colorIndex = Math.floor(Math.random() * this.colors.length);
        // layer.options.fillColor = this.colors[colorIndex]; //0
    
        console.log('LAYER',layer);
        layer.on({
          click: changeCountryColor,
        });
      };

	const countryStyle = (country) => {
		return { 
            fillColor: getColor(country.price), 
            fillOpacity: 1,
            color: "black",
             weight: 2 };
	};
	function getColor(d) {
		return d > 1000
			? "#800026"
			: d > 500
			? "#BD0026"
			: d > 100
			? "#FED976"
			: "#FFEDA0";
	}

   function handleClick (e)  {
        console.log('click');
     onEachCountry()
    }
	return (
    
		 <MapContainer
         onClick={handleClick}
			style={{ height: "calc(100vh - 5rem) " }}
			id={"mapbox/light-v9"}
			center={[53.988337, 13.861923]}
			zoom={3.7}
		>
			  <GeoJSON
				style={countryStyle}
				data={europeData.features}
				onEachFeature={onEachCountry}
			/> 
		</MapContainer>
        
        
	);
}

{
	/* <TileLayer
attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    <Marker position={[51.505, -0.09]}>
        <Popup>
  A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
    </Marker>  */
}
