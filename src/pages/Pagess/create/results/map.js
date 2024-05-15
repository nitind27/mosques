import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  CircleF,
} from "@react-google-maps/api";
import { addMosqueUser } from "../../../api/createAcc/addMosqueUser.js";

function scatterCoordinates(latitude, longitude) {
  const earthRadius = 6371;

  const randomDistance = Math.random() * (0.5 - 0.1) + 0.2;
  const randomAngle = Math.random() * (2 * Math.PI);
  const newLatitude =
    latitude +
    (randomDistance / earthRadius) * (180 / Math.PI) * Math.cos(randomAngle);
  const newLongitude =
    longitude +
    (randomDistance / earthRadius) * (180 / Math.PI) * Math.sin(randomAngle);
  return { latitude: newLatitude, longitude: newLongitude };
}

function Map({ positions, center, display, zoom, people, email, radius }) {
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeName, setActiveName] = useState(null);
  const [activePeople, setActivePeople] = useState([]);
  const [mainPositions, setMainPositions] = useState([]);
  const [isPart, setIsPart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [defaultPeople, setDefaultPeople] = useState([]);

  useEffect(() => {
    //let temp = activePeople.filter((person) => person.email != email);
    setMainPositions(positions);
  }, [positions]);

  const handleMarkerClick = (marker) => {
    try {
      setActiveMarker(marker);
      setActiveName(marker.name);
      if (marker.type == "mosque" || marker.type == "mosque2") {
        let unmappedData = defaultPeople.filter((person) => {
          let temp = JSON.parse(person.locations);
          for (let i in temp) {
            if (temp[i][2] === marker.name) {
              return true;
            }
          }
        });
        setActivePeople(
          unmappedData.map((person) => {
            let temp = JSON.parse(person.locations);
            let scattered = scatterCoordinates(
              marker.location.lat,
              marker.location.lng
            );
            for (let i in temp) {
              return {
                name: person.username,
                email: person.email,
                type: person.gender,
                lat: scattered.latitude,
                lng: scattered.longitude,
              };
            }
          })
        );
        setIsProcessing(true);
      }
    } catch (error) {
      console.log("Error on marker: ", error);
    }
  };

  useEffect(() => {
    setDefaultPeople(people);
  }, [people]);

  useEffect(() => {
    let found = false;
    for (let i in activePeople) {
      if (activePeople[i].email == email) {
        found = true;
        break;
      }
    }
    if (found) {
      setIsPart(true);
      console.log("FOUND");
    } else {
      setIsPart(false);
      console.log("NOT FOUND");
    }
  }, [activePeople]);

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
    setActiveName(null);
    setIsPart(false);
    setActivePeople([]);
    setIsProcessing(false);
  };

  const handleOnLoad = (mapInput) => {
    console.log("Handle on load started");
    const bounds = new window.google.maps.LatLngBounds();
    if (positions) {
      positions.forEach((d) => bounds.extend({ lat: d.lat, lng: d.lng }));
      mapInput.fitBounds(bounds);
    }
  };

  useEffect(() => {
    console.log("MAP IS BEING INITIALIZED");
    console.log(display);
  }, []);

  const handleAddMosque = (e) => {
    e.preventDefault();

    console.log("DATA NOT FOUND");
    var saveData = async () => {
      let result = await fetch("/api/createAcc/addMosqueUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          lat: activeMarker.location.lat,
          lng: activeMarker.location.lng,
          mosque: activeMarker.name,
        }),
      });

      result = await result.json();
      if (result.message == "Success") {
        try {
          console.log("SUCCESS");
          setIsPart(true);
          let temp = defaultPeople.filter((person) => person.email == email);
          let temp2 = JSON.parse(temp[0].locations);
          temp2.push([
            activeMarker.location.lat,
            activeMarker.location.lng,
            activeMarker.name,
          ]);
          temp2 = JSON.stringify(temp2);
          temp = { ...temp[0], locations: temp2 };

          let temp3 = defaultPeople.filter((person) => person.email != email);
          temp3.push(temp);
          setDefaultPeople(temp3);
        } catch (error) {
          console.log("ERROR: ", error);
        }
      } else {
        console.log("ERROR");
      }
    };
    saveData();
  };

  const getIconUrl = (type) => {
    switch (type) {
      case "mosque":
        return "https://cdn-icons-png.flaticon.com/512/2319/2319870.png";
      case "female":
        return "https://cdn-icons-png.flaticon.com/512/7029/7029970.png";
      case "male":
        return "https://cdn-icons-png.flaticon.com/512/7029/7029967.png";
      case "mosque2":
        return "https://cdn-icons-png.flaticon.com/128/4050/4050101.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/819/819814.png";
    }
  };

  if (display) {
    return (
      <GoogleMap
        onLoad={handleOnLoad}
        onClick={() => setActiveMarker(null)}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        zoom={zoom}
        center={center}
      >
        {mainPositions &&
          mainPositions.map((position) => (
            <>
              {position.type === "user" && ( // Conditionally render Circle for type "user"
                <CircleF
                  center={{
                    lat: position.lat,
                    lng: position.lng,
                  }}
                  radius={radius} // Adjust the radius as needed
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                  }}
                />
              )}
              <MarkerF
                icon={{
                  url: getIconUrl(position.type),
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                key={`${position.location?.lat || position.lat || "unknown"}-${
                  position.location?.lng || position.lng || "unknown"
                }`}
                position={
                  position.location
                    ? {
                        lat: position.location.lat,
                        lng: position.location.lng,
                      }
                    : {
                        lat: position.lat,
                        lng: position.lng,
                      }
                }
                onClick={() => handleMarkerClick(position)}
                name={position.name}
              />
            </>
          ))}
        {activeMarker && isProcessing && (
          <InfoWindowF
            className="map-info-window"
            position={
              activeMarker.location
                ? {
                    lat: activeMarker.location.lat,
                    lng: activeMarker.location.lng,
                  }
                : {
                    lat: activeMarker.lat,
                    lng: activeMarker.lng,
                  }
            }
            onCloseClick={handleInfoWindowClose}
          >
            <div className="mosque-add-label">
              <div>{activeName}</div>
              {(activeMarker.type == "mosque" ||
                activeMarker.type == "mosque2") && (
                <button
                  className="mosque-add-button"
                  onClick={handleAddMosque}
                  style={{
                    backgroundColor: isPart ? "#ed7b86" : "#4CAF50",
                    cursor: isPart ? "context-menu" : "pointer",
                  }}
                  disabled={isPart}
                >
                  {isPart ? "Mosque Added" : "Add mosque"}
                </button>
              )}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    );
  } else {
    return null;
  }
}

export default Map;
