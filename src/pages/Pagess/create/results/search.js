import { useState, useEffect, useContext, use } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../../AppContext";
import { Data, useLoadScript } from "@react-google-maps/api";
import Map from "./map";

import SearchUserData from "./searchuserdata";
export default function Search() {
  const [data, setData] = useState([]);
  //Setting the Current User's Coordinates

  const [cLocation, setcLocation] = useState(null);

  let locationSet = false;
  const [email, setEmail] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  console.log("dad0", filteredData);
  const { filterContext, setFilterContext } = useContext(AppContext);
  //Context Range Variable
  const { rangeContext, setRangeContext } = useContext(AppContext);
  const [loadMap, setLoadMap] = useState(false);
  const [locAccess, setLocAccess] = useState(true);
  const [mapData, setMapData] = useState([]);

  const [zoom, setZoom] = useState(10);

  const [messageText, setMessageText] = useState("");

  //-----For profile image-----
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);

  const [heartedEmails, setHeartedEmails] = useState([]);
  //-----For private image request---------

  //-----For blocking user---------

  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);

  const router = useRouter();

  console.log("mypic", imageData);

  const ethnicities_existing = [
    "asian",
    "african",
    "latin",
    "east indian",
    "mixed",
    "native american",
    "pacific islander",
    "caucasian",
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD2vzJGdXaHatCi0Hf-2Z6PvQyRYlh3Akc",
  });

  const { push } = useRouter();

  const [mapCenter, setMapCenter] = useState({
    lat: 41.881832,
    lng: -87.623177,
  });

  useEffect(() => {
    localStorage.setItem("currentNavOption", "search");
    if (localStorage.getItem("turn") == 0) {
      localStorage.setItem("turn", 1);
      reloadPage();
    }
  }, []);
  // Updator for Current Location
  useEffect(() => {
    if (cLocation && !locationSet) {
      locationSet = true;
      var tempData = data.map((e) => {
        if (e.locations) {
          let tempLoc = JSON.parse(e.locations)[0];
          e.distance = Math.round(
            getDistance(cLocation[0], cLocation[1], tempLoc[0], tempLoc[1])
          );
        }
        return e;
      });
    }
  }, [cLocation]);

  //-------------Api to retrieve data------------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        //Getting all users
        const res = await fetch("/api/createAcc/getInfoAcc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email1),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();

        //Getting users who you have blocked
        const res2 = await fetch("/api/interest/getBlocked", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: localStorage.getItem("email"),
          }),
        });
        let data2 = await res2.json();
        if (data2.error) {
          console.log("Error on getting blocked: ", data2.error);
        }

        data2 = data2.data;

        //getting users who have blocked me so we can filter then also

        const res3 = await fetch("/api/interest/getBlockedMe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: localStorage.getItem("email"),
          }),
        });

        let data3 = await res3.json();
        if (data3.error) {
          console.log("Error on getting blocked: ", data3.error);
        }

        data3 = data3.data;

        const res4 = await fetch("/api/createAcc/getTime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: localStorage.getItem("email"),
          }),
        });

        let timeData = await res4.json();
        if (timeData.error) {
          console.log("Error on getting timestamp", error);
        }
        timeData = timeData.data;
        setTimeStamp(timeData);

        //Adding a Distance Tracker to the Users
        const dataToChange = response.user.rows.map((e) => {
          e["distance"] = "Unknown";
          return e;
        });

        //Filtering users who are blocked by current
        const dataChanged = dataToChange.filter(
          (user) => !data2.some((item) => item.receiver_email === user.email)
        );

        //Filtering users who have blocked current user
        const filteredData = dataChanged.filter(
          (user) => !data3.some((item) => item.sender_email === user.email)
        );
        console.log("FilteredData fadsfasdf,", filteredData);

        setData(filteredData);
        showMap();
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Sending Message------------------------

  const SendMessageAdmin = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: messageText,
    };

    const res = await fetch("/api/admin/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
  };

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Request Wali------------------------

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Calculate Distance------------------------

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lng1 - lng2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515; // distance in miles
    dist = dist * 1.609344; // convert miles to kilometers
    return dist;
  };

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Api to get nearest mosque mosque------------------------

  const getMosqueData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `/api/getMosque/getMosque?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();

      if (response.ok && data.status === "OK" && data.results.length > 0) {
        const mosquesData = data.results.slice(0, 10).map((result) => ({
          location: result.geometry.location,
          name: result.name,
        }));

        return mosquesData;
      } else {
        console.error("Error fetching data from Google Places API:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  const showMap = async () => {
    let tempVar = 0;
    navigator.geolocation.watchPosition(
      async (position) => {
        tempVar = 1;
        const { latitude, longitude } = position.coords;
        await setcLocation([latitude, longitude]);
        await setMapCenter({ lat: latitude, lng: longitude });
        let tempData = [];

        tempData.push({
          lat: latitude,
          lng: longitude,
          name: "You",
          type: "user",
        });

        setZoom(15);

        let mosquesData = await getMosqueData(latitude, longitude);
        let userData = await getUserData();

        let updatedMapData = mosquesData.map((mosque) => ({
          location: {
            lat: mosque.location.lat,
            lng: mosque.location.lng,
          },
          name: mosque.name,
          type: "mosque",
        }));
        let updatedMapData2;
        try {
          updatedMapData2 = userData.map((data) => ({
            location: {
              lat: data.location.lat,
              lng: data.location.lng,
            },
            name: data.name,
            type: "mosque2",
          }));
        } catch (error) {
          console.error("Error mapping userData:", error);
          return;
        }
        tempData = tempData.concat(updatedMapData2);

        let tempcat = [];
        tempData.forEach((e) => {
          tempcat.push(e.name);
        });

        updatedMapData = updatedMapData.filter((e) => {
          if (tempcat.indexOf(e.name) === -1) {
            return e;
          }
        });

        tempData = tempData.concat(updatedMapData);

        setMapData(tempData);
        setLoadMap(true);
        setLocAccess(true);
      },
      (error) => {
        // Error callback
        console.error("Error getting user's location:", error);
      }
    );

    // If geolocation doesn't work (watchPosition fails immediately), call reloadPage
    setTimeout(() => {
      if (tempVar === 0) {
        // reloadPage();
      }
    }, 3000); // Adjust the timeout duration as needed
  };

  useEffect(() => {
    if (loadMap) {
      console.log("MAP IS READY");
    }
  }, [loadMap]);

  //-------------------Api to get user's mosque------------------------

  const getUserData = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await fetch("/api/getMosque/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Data fetched from user's mosque: ", data);
        return data;
      } else {
        console.error("Error fetching data of user selected mosque:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token === null && !token) {
      push("/Pagess/sign/signIn/signIn");
    }
  }, []);
  //-------------^^^^^^^^^^^^^^^-----------------

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //--------------------^^^^^^^^^^^^^-------------------

  const check = (item, userItem) => {
    if (
      item.length === 0 ||
      (userItem && item.indexOf(userItem.toLowerCase()) !== -1)
    ) {
      return 1;
    }
  };

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  //----------------For profile image------------------
  useEffect(() => {
    var getImg = async () => {
      try {
        const emails = data.map((user) => user.email);
        console.log("get image started", emails);
        const res = await fetch("/api/createAcc/getProfileImgBulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
          }),
        });
        const data2 = await res.json();
        if (data2.error) {
          setImageUrl(null);
        } else {
          console.log("Image URL: ", data2.image);
          setImageData(data2.image);
          setLoaded(true);
        }
        setLoading(true);
      } catch (error) {
        console.log("Error on getting image: ", error);
      }
    };
    getImg();
  }, [data]);

  //--------------------^^^^^^^^^^^^^-------------------

  //----------------For favs------------------
  useEffect(() => {
    var getHearts = async () => {
      try {
        const emails = data.map((user) => user.email);
        console.log("get fav started");
        const res = await fetch("/api/interest/heartedByMe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
            user: localStorage.getItem("email"),
          }),
        });
        const data2 = await res.json();
        if (data2.error) {
          console.log("Error on getting favs: ", data2.error);
        } else {
          setHeartedEmails(data2.data);
        }
      } catch (error) {
        console.log("Error on getting image: ", error);
      }
    };
    getHearts();
  }, [data]);

  useEffect(() => {
    console.log("HEARTED EMAILS: ", heartedEmails);
  }, [heartedEmails]);

  //--------------------^^^^^^^^^^^^^-------------------

  //----------------Heart Click Function && REMOVE------------------

  //--------------------^^^^^^^^^^^^^-------------------

  //----------------Change Length of filtered array------------------
  const changeLength = (length) => {
    const slicedData = filteredData.slice(0, length);
    setFilteredData(slicedData);
  };
  //--------------------^^^^^^^^^^^^^-------------------

  useEffect(() => {
    // if (
    //   !filterContext.ethnicities ||
    //   !filterContext.bodytype ||
    //   !filterContext.income ||
    //   !filterContext.maritalStatus ||
    //   !filterContext.smoking ||
    //   !filterContext.drinking ||
    //   !filterContext.phone ||
    //   !filterContext.religiousness ||
    //   !filterContext.sects ||
    //   !filterContext.reverts ||
    //   !filterContext.halals ||
    //   !filterContext.hijabs ||
    //   !filterContext.prays ||
    //   !filterContext.location
    // ) {
    //   // If any filter value is undefined or empty at the start, set filteredData to the original data
    //   setFilteredData(data);
    //   return;
    // }

    // var filtered = data.filter((item) => {
    //   console.log("Filter Context Location:", item.aboutme_location);

    //   if (
    //     filterContext.ethnicities.length === 0 ||
    //     (item.personal_ethnicity?.toLowerCase() &&
    //       (filterContext.ethnicities.indexOf(
    //         item.personal_ethnicity.toLowerCase()
    //       ) !== -1 ||
    //         (ethnicities_existing.indexOf(
    //           item.personal_ethnicity.toLowerCase()
    //         ) === -1 &&
    //           filterContext.ethnicities.indexOf("other") !== -1)))
    //   ) {
    //     if (
    //       check(filterContext.bodytype, item.personal_build) &&
    //       check(filterContext.income, item.personal_income) &&
    //       check(filterContext.maritalStatus, item.personal_marital) &&
    //       check(filterContext.smoking, item.personal_smoke) &&
    //       check(filterContext.drinking, item.personal_drink) &&
    //       check(filterContext.phone, item.personal_long) &&
    //       check(filterContext.religiousness, item.religion_religious) &&
    //       check(filterContext.sects, item.religion_sector) &&
    //       // check(filterContext.subject, item.eduwork_subject) &&

    //       check(filterContext.reverts, item.religion_revert) &&
    //       check(filterContext.halals, item.religion_halal) &&
    //       check(filterContext.hijabs, item.religion_hijab) &&
    //       check(filterContext.prays, item.religion_pray) &&
    //       check(filterContext.location, item.aboutme_location)
    //     ) {
    //       if (email !== item.email) {
    //         if (
    //           item.distance !== "Unknown" &&
    //           item.distance < rangeContext * 1
    //         ) {
    //           return true;
    //         } else if (item.distance === "Unknown") {
    //           return true;
    //         }
    //       }
    //     }
    //   }
    //   return false;
    // });
    var filtered = data.filter((item) => {
      console.log("Filter Context Location:", item.aboutme_location);

      if (
        filterContext.ethnicities &&
        (filterContext.ethnicities.length === 0 ||
          (item.personal_ethnicity?.toLowerCase() &&
            (filterContext.ethnicities.indexOf(
              item.personal_ethnicity.toLowerCase()
            ) !== -1 ||
              (ethnicities_existing.indexOf(
                item.personal_ethnicity.toLowerCase()
              ) === -1 &&
                filterContext.ethnicities.indexOf("other") !== -1))))
      ) {
        if (
          check(filterContext.bodytype, item.personal_build) &&
          check(filterContext.income, item.personal_income) &&
          check(filterContext.maritalStatus, item.personal_marital) &&
          check(filterContext.smoking, item.personal_smoke) &&
          check(filterContext.drinking, item.personal_drink) &&
          check(filterContext.phone, item.personal_long) &&
          check(filterContext.religiousness, item.religion_religious) &&
          check(filterContext.sects, item.religion_sector) &&
          // check(filterContext.subject, item.eduwork_subject) &&

          check(filterContext.reverts, item.religion_revert) &&
          check(filterContext.halals, item.religion_halal) &&
          check(filterContext.hijabs, item.religion_hijab) &&
          check(filterContext.prays, item.religion_pray) &&
          check(filterContext.location, item.aboutme_location)
        ) {
          if (email !== item.email) {
            if (
              item.distance !== "Unknown" &&
              item.distance < rangeContext * 1
            ) {
              return true;
            } else if (item.distance === "Unknown") {
              return true;
            }
          }
        }
      }
      return false;
    });

    setFilteredData(filtered);
  }, [filterContext, data, rangeContext]);

  return (
    <div>
      <div className="top-container-search">
        <div className="top-left-search">
          <div className="search-heading-search">Search Results</div>

          {!locAccess && (
            <div className="map-error-search">Access to Location Denied :/</div>
          )}
        </div>
        <div className="top-right-search">
          <div className="select-container-right-search">
            <select
              className="select-top2-search"
              onChange={(e) => changeLength(Number(e.target.value))}
            >
              <option value="10">Per Page: 10</option>
              <option value="15">Per Page: 15</option>
              <option value="20">Per Page: 20</option>
            </select>
          </div>
        </div>
      </div>
      <div className="map-container-search">
        <div className="map-body-search">
          {console.log("IS LOADED: ", isLoaded)}

          {isLoaded && locAccess ? (
            <Map
              positions={mapData}
              center={mapCenter}
              display={true}
              zoom={zoom}
              people={data}
              email={email}
              radius={rangeContext}
            />
          ) : null}
        </div>
      </div>

      <SearchUserData />
    </div>
  );
}
