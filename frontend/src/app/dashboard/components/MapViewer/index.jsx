import React, { useState, useEffect } from "react";
import {
	useLoadScript,
	GoogleMap,
	Marker,
	InfoWindow,
	LoadScript,
	DirectionsRenderer,
} from "@react-google-maps/api";
import { mapCenterDefault } from "config";
// Import custom styles to customize the style of Google Map
import styles from "./maps_grey.json";
import { Tag } from "antd";
import "./index.css";

const markerSVGSelect = [
	`<svg width="30px" height="30px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">`,
	`<circle stroke="grey" fill="grey" opacity="0.3" stroke-width="7" cx="16" cy="16" r="7"/>`,
	`<circle stroke="white" fill="#0000ff" stroke-width="5" cx="15" cy="15" r="7"/>`,
	`</svg>`,
].join("\n");

export default React.memo(
	({
		options,
		markers,
		activeMarker,
		bound = false,
		onMarkerClick,
		onMapClick,
		markerAppendable = false,
	}) => {
		const { isLoaded } = useLoadScript({
			googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY,
		});

		const [center, setCenter] = useState(
			options.center
				? options.center
				: {
						lat: mapCenterDefault.latitude,
						lng: mapCenterDefault.longitude,
				  }
		);
		// const [newMarker, setNewMarker] = useState(null);
		const [map, setMap] = useState(null);
		const [infoOpen, setInfoOpen] = useState(false);
		const [selectedMarker, setSelectedMarker] = useState(activeMarker);
		const [markerMap, setMarkerMap] = useState({});

		const loadHandler = (map) => {
			// Store a reference to the google map instance in state
			setMap(map);
			// fitBounds(map);
		};

		// We have to create a mapping of our places to actual Marker objects
		const markerLoadHandler = (marker, location) => {
			return setMarkerMap((prevState) => {
				return { ...prevState, [location.id]: marker };
			});
		};

		const markerClickHandler = (e, marker) => {
			if (typeof onMarkerClick === "function") onMarkerClick(marker);
			setSelectedMarker(marker);
			if (infoOpen) {
				setInfoOpen(false);
			}
			setInfoOpen(true);
		};

		const MapClickHandler = (e) => {
			if (!markerAppendable) return;
			if (infoOpen) {
				setInfoOpen(false);
			}
			setCenter({
				lat: map.getCenter().lat(),
				lng: map.getCenter().lng(),
			});
			if (onMapClick) onMapClick(e.latLng.lat(), e.latLng.lng());
		};

		useEffect(() => {
			// setInfoOpen(false);

			if (map) {
				if (activeMarker) {
					map.panTo(
						new window.google.maps.LatLng(
							activeMarker.latitude,
							activeMarker.longitude
						)
					);

					// setTimeout(() => {
					setSelectedMarker(activeMarker);
					setInfoOpen(true);
					// }, 100);
				}
			}
		}, [activeMarker, markers, map]);

		useEffect(() => {
			if (bound && map && markers && markers.length) {
				const bounds = new window.google.maps.LatLngBounds();
				markers.map((marker, i) =>
					bounds.extend(
						new window.google.maps.LatLng(marker.latitude, marker.longitude)
					)
				);
				map.setZoom(6);
				map.fitBounds(bounds);
			}
		}, [markers, map, bound]);

		function pinSymbol(color) {
			return {
				path:
					"M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
				fillColor: color,
				fillOpacity: 1,
				strokeColor: "#000",
				strokeWeight: 1,
				scale: 1,
			};
		}

		const getActiveMarker = () => {
			if (!activeMarker) return false;
			let markerSeletedIcon = markerSVGSelect;
			return (
				<Marker
					position={{
						lat: parseFloat(activeMarker.latitude),
						lng: parseFloat(activeMarker.longitude),
					}}
					// icon={{
					// 	url:
					// 		"data:image/svg+xml;charset=UTF-8," +
					// 		encodeURIComponent(markerSeletedIcon),
					// 	origin: new window.google.maps.Point(0, 0),
					// }}
					icon={pinSymbol("red")}
					onLoad={(marker) => markerLoadHandler(marker, activeMarker)}
					onClick={(e) => markerClickHandler(e, activeMarker)}
					// onMouseOver={e => markerOverHandler(e, location)}
					// onMouseOut={e => markerOutHandler(e, location)}
				/>
			);
		};

		const renderMap = () => (
			<GoogleMap
				onLoad={loadHandler}
				onClick={MapClickHandler}
				zoom={options.zoom}
				center={center}
				disableDefaultUI={true}
				mapContainerStyle={{
					height: "100%",
					width: "100%",
					// boxShadow: "rgba(0, 0, 0, 0.15) 10px 10px 10px",
				}}
			>
				{getActiveMarker()}
				{/* {infoOpen && selectedMarker && (
					<InfoWindow
						anchor={markerMap[selectedMarker.id]}
						onCloseClick={() => setInfoOpen(false)}
						options={{ pixelOffset: new window.google.maps.Size(0, 8) }}
					>
						<div
							style={{
								padding: 5,
								borderRadius: 3,
							}}
						>
							<h6>{selectedMarker.name}</h6>
							<span>Lat: {selectedMarker.latitude}</span>
							<br />
							<span>Lon: {selectedMarker.longitude}</span>
						</div>
					</InfoWindow>
				)} */}
			</GoogleMap>
		);

		return isLoaded ? renderMap() : null;
	}
);
