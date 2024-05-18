import { useState, useEffect, useContext, use } from "react";
import ImageSlider from "react-simple-image-slider";
import "react-slideshow-image/dist/styles.css";

import { useRouter } from "next/navigation";
import { AppContext } from "../../AppContext";
import Camera from "../../../../../public/camerasvg";
import Envelope from "../../../../../public/envelope";
import Stop from "../../../../../public/stopsvg";
import Excalim from "../../../../../public/exclaimsvg";
import { Data, useLoadScript } from "@react-google-maps/api";
import Map from "./map";
import NextImage from "next/image";
import WaliRed from "../../../../../public/search/waliRed";
import Link from "next/link";
import Arrow from "../../../../../public/arrow";
import ReactCountryFlag from "react-country-flag";
import { countries } from "country-data";
import ProfileImages from "./ProfileImages";
export default function SearchUserData() {
  const [data, setData] = useState([]);
  //Setting the Current User's Coordinates

  const [cLocation, setcLocation] = useState(null);

  let locationSet = false;
  const [requestCheck, setRequestCheck] = useState([]);
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
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); //Temporary storage for users
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showWali, setShowWali] = useState(false);
  //-----For profile image-----
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailProfile, setEmailProfile] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  console.log("imgfafsdaf", imageData);

  //-----For Fav icon-----
  const [heartClicked, setHeartClicked] = useState(false);
  const [heartedEmails, setHeartedEmails] = useState([]);
  //-----For private image request---------
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  const [blockStart, setBlockStart] = useState(0);
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);

  const router = useRouter();
  // console.log(filteredData);
  const { getCode, getName } = require("country-list");
  const [showAll, setShowAll] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleShowAll = (userInfo) => {
    setShowAll(!showAll);
    setSelectedUserData(userInfo);
  };

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

  // Use useEffect to handle the body overflow
  useEffect(() => {
    if (showAll) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    // Clean up the effect when the component unmounts or showAll changes
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [showAll]);

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
  const SendMessage = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: messageText,
    };

    const res = await fetch("/api/message/sendMessage", {
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

  const RequestWali = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: "I would like to request your wali details",
    };

    const res = await fetch("/api/message/sendMessage", {
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
    console.log("Wali Request Sent: ", response);
  };

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Request Wali------------------------

  const RequestPrivateImage = async (e, user) => {
    e.preventDefault();
    console.log("Requesting Images");
    try {
      const res = await fetch("/api/interest/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewed: user,
          viewer: localStorage.getItem("email"),
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error: ", data.error);
        return;
      }
      alert("Private Images Requested");

      console.log("Data: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

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

  //-------------Function to calculate age------------------
  function calculateAge(year, month, day) {
    const dateOfBirth = `${year}-${month}-${day}`;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the birth date for the current year hasn't occurred yet, subtract one year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return <div>{age}</div>;
  }
  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //--------------------View Bio function-------------------
  const ViewBio = async (e, viewed) => {
    e.preventDefault();

    const viewer = localStorage.getItem("email");

    const res = await fetch("/api/interest/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewed, viewer }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }

    const response = await res.json();
    console.log(response);
  };
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
    const getImages = async () => {
      try {
        const emails = data.map((user) => user.email);

        // Fetch images from the first endpoint
        const res1 = await fetch("/api/createAcc/getProfileImgBulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
          }),
        });
        const data1 = await res1.json();

        // Fetch images from the second endpoint
        const res2 = await fetch("/api/createAcc/getProfileImgPublicBulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
          }),
        });
        const data2 = await res2.json();

        // Check if either request failed
        if (data1.error || data2.error) {
          setLoaded(true);
          return;
        }

        // Combine image data from both endpoints
        const imageData = [data1.image, data2.images];
        // Set the image data and mark as loaded
        setImageData(imageData);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    getImages();
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

  const HeartClick = async (user) => {
    console.log("Heart clicked!");
    const res = await fetch("/api/interest/heart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hearted: user,
        hearter: localStorage.getItem("email"),
      }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);
  };

  const HeartClickRemove = async (user) => {
    console.log("Heart clicked!");
    const res = await fetch("/api/interest/heartRemove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hearted: user,
        hearter: localStorage.getItem("email"),
      }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);
  };
  //--------------------^^^^^^^^^^^^^-------------------

  //----------------Change Length of filtered array------------------

  //--------------------^^^^^^^^^^^^^-------------------

  useEffect(() => {
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

  //---------------Block a user----------------
  const BlockUser = async (e, user) => {
    e.preventDefault();
    const res = await fetch("/api/interest/blockUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocked: user,
        blocker: localStorage.getItem("email"),
      }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);
  };

  //-----------------^^^^^^^^^^^^^^----------------

  //-----------------Format Time------------------

  const formatTimeAgo = (timestamp) => {
    // Parse timestamp as a Date object
    const timestampDate = new Date(timestamp);

    // Calculate the difference in milliseconds
    const differenceMs = Date.now() - timestampDate.getTime();

    if (differenceMs < 24 * 60 * 60 * 1000) {
      // If less than a day
      return "A few hours ago";
    } else {
      // If greater than or equal to a day
      const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      return `${differenceDays} day${differenceDays > 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/interest/requestCheck");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setRequestCheck(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Image render
  const renderUserImages = (userInfo) => {
    const userImages = imageData
      .flat()
      .filter((img) => img.email === userInfo.email)
      .map((image, index) => ({
        url:
          index === 0 ? `data:image/jpeg;base64,${image.image}` : image.image,
      }));

    const isFemaleWithApproval =
      userInfo.gender === "female" &&
      requestCheck.some(
        (request) =>
          (request.sender_email === userInfo.email ||
            userInfo.email === email) &&
          request.status === "approved"
      );

    const shouldDisplayImages =
      userInfo.gender !== "female" || isFemaleWithApproval;

    if (userImages.length === 0) {
      return (
        <NextImage
          src="/female.jpeg"
          width={150}
          height={150}
          style={{ border: "1px solid black" }}
          alt="Female Placeholder"
        />
      );
    }

    if (!shouldDisplayImages) {
      return (
        <NextImage
          src="/private.jpg"
          width={150}
          height={150}
          style={{ border: "1px solid black" }}
          alt="Private"
        />
      );
    }

    return (
      <div className="image-slider-container">
        <ImageSlider
          width={150}
          height={150}
          images={userImages}
          showBullets={false}
          showNavs={true}
          navMargin={-5}
          navSize={30}
      color={'red'}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="bottom-container-search">
        {filteredData.map((userInfo) => (
          <div key={userInfo.id} className="result-parent-container-search">
            <div className="result-img-parent-search">
              <div className="img-container-search">
                {loaded ? (
                  renderUserImages(userInfo)
                ) : (
                  <NextImage
                    src="/female.jpeg"
                    width={150}
                    height={150}
                    style={{ border: "1px solid black" }}
                    alt="Loading"
                  />
                )}
              </div>
            </div>

            <div className="result-line1">
              <div className="flag-container">
                <ReactCountryFlag
                  countryCode={getCode(`${userInfo.aboutme_country}`)}
                  svg
                  title="India"
                  className="result-line1-flag"
                  style={{ height: "20px", width: "20px" }} // Set height and width inline
                />
              </div>
              <div className="flag-container">
                <ReactCountryFlag
                  countryCode={getCode(`${userInfo.personal_origin}`)}
                  svg
                  style={{
                    marginRight: "10px",
                    height: "20px",
                    width: "20px",
                  }} // Set height and width inline
                  title="India"
                  className="result-line1-flag"
                />
              </div>
            </div>

            <div className="result-right-parent-container">
              <div className="result-line1-container-search">
                <div>{userInfo.aboutme_looking}</div>
                <div className="active-text-search">
                  <strong>Active:</strong>
                  {timeStamp.map((timestampItem) => {
                    if (timestampItem.email === userInfo.email) {
                      return (
                        <div key={timestampItem.email}>
                          {formatTimeAgo(timestampItem.active_since)}
                        </div>
                      );
                    }
                    return null; // Return null if no match
                  })}
                </div>
              </div>

              <div className="result-line2-container-search">
                <div className="result-line2">
                  <Link
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default behavior of the link
                      setSelectedUserInfo(userInfo);
                      ViewBio(e, userInfo.email);
                      router.push({
                        pathname:
                          "/Pagess/create/results/viewProfile/viewProfile",
                        query: {
                          name: JSON.stringify(userInfo),
                        },
                      });
                    }}
                    href="/Pagess/create/results/viewProfile/viewProfile"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <strong>{userInfo.username}</strong>
                  </Link>
                </div>

                <div className="mini-seprator-search"></div>
                <span className="result-line2-container-age">
                  Age:
                  <div className="age-search">
                    {calculateAge(
                      userInfo.aboutme_year,
                      userInfo.aboutme_month,
                      userInfo.aboutme_day
                    )}
                  </div>
                </span>
                <div className="mini-seprator-search"></div>
                <div className="heart-container-search">
                  {Array.isArray(heartedEmails) ? (
                    heartedEmails.includes(userInfo.email) ? (
                      <div
                        id="heart"
                        onClick={() => {
                          HeartClickRemove(userInfo.email);
                          reloadPage();
                        }}
                      ></div>
                    ) : (
                      <div
                        id="blackHeart"
                        onClick={() => {
                          HeartClick(userInfo.email);
                          reloadPage();
                        }}
                      ></div>
                    )
                  ) : null}
                </div>
                <div
                  className="heart-container-search2"
                  onClick={(e) => {
                    setSelectedUserInfo(userInfo);
                    setShowMessage(true);
                  }}
                >
                  <Envelope />
                </div>
                {/* Shows Message Details */}
                {showMessage && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">New Message</div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowMessage(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <div className="msg-mini-text-search">Message</div>
                        <textarea
                          placeholder="Enter your message here"
                          className="msg-input-search"
                          onChange={(e) => {
                            setMessageText(e.target.value);
                          }}
                        ></textarea>
                        <div className="send-msg-container-search">
                          <button
                            className="send-msg-search"
                            onClick={(e) => {
                              SendMessage(e, selectedUserInfo.email);
                              setShowMessage(false);
                            }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* ^^^^^^^^^^^^^ */}
                <div
                  className="heart-container-search2"
                  onClick={() => {
                    setSelectedUserInfo(userInfo);
                    setShowPrivate(true);
                  }}
                >
                  <Camera />
                </div>
                {showPrivate && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">
                          Request Private Images
                        </div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowPrivate(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <div className="send-msg-container-search">
                          <button
                            className="send-msg-search"
                            onClick={(e) => {
                              RequestPrivateImage(e, selectedUserInfo.email);
                              setShowPrivate(false);
                            }}
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="heart-container-search2"
                  onClick={() => {
                    setSelectedUserInfo(userInfo);
                    setShowBlock(true);
                  }}
                >
                  <Stop />
                </div>
                {showBlock && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">Block This User?</div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowBlock(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <div className="send-msg-container-search">
                          <button
                            className="send-msg-search"
                            onClick={(e) => {
                              BlockUser(e, selectedUserInfo.email);
                              setShowBlock(false);
                              reloadPage();
                            }}
                          >
                            Block
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="heart-container-search2"
                  onClick={(e) => {
                    setSelectedUserInfo(userInfo);
                    setShowReport(true);
                  }}
                >
                  <Excalim />
                </div>
                {showReport && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">Report</div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowReport(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <div className="msg-mini-text-search">
                          Message To Admin
                        </div>
                        <textarea
                          placeholder="Enter your report here"
                          className="msg-input-search"
                          onChange={(e) => {
                            setMessageText(e.target.value);
                          }}
                        ></textarea>
                        <div className="send-msg-container-search">
                          <button
                            className="send-msg-search"
                            onClick={(e) => {
                              SendMessageAdmin(e, selectedUserInfo.email);
                              setShowReport(false);
                            }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="heart-container-search"
                  onClick={() => {
                    setSelectedUserInfo(userInfo);
                    setShowWali(true);
                  }}
                >
                  {userInfo.gender}
                  {userInfo.gender == "female" && <WaliRed />}
                </div>
                {showWali && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">
                          Request Wali Details
                        </div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowWali(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <div className="send-msg-container-search">
                          <button
                            className="send-msg-search"
                            onClick={(e) => {
                              setMessageText(
                                "I would like to request your wali details"
                              );
                              RequestWali(e, selectedUserInfo.email);
                              setShowWali(false);
                            }}
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shows Bio Details */}
                {viewBio && (
                  <div className="bio-container-search">
                    {console.log(
                      "data found on user:",
                      selectedUserInfo.username
                    )}
                    <div className="bio-sub-search">
                      <div className="bio-heading-search">
                        <div className="bio-text-search">Biography</div>
                        <div className="close-bio-search">
                          <div
                            onClick={(e) => {
                              setViewBio(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-bio-search"></div>
                      <div className="bio-mini-container-search">
                        <div className="bio-mini-text-search">
                          A Little bit about me
                        </div>
                        <div className="bio-mini-text2-search">
                          {selectedUserInfo.aboutme_about}
                        </div>
                      </div>
                      <div className="bio-mini-container-search">
                        <div className="bio-mini-text-search">
                          What I am looking for
                        </div>
                        <div className="bio-mini-text2-search">
                          {selectedUserInfo.aboutme_looking}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* ^^^^^^^^^^^^^ */}
              </div>
              <div className="result-line3-container-search">
                <div>{userInfo.distance + " Km Away"}</div>
                {userInfo.types.slice(0, 3).map((type, index) => (
                  <div
                    key={index}
                    className={`result-line3 ${index}`}
                    data-tooltip={type}
                  >
                    {type}
                  </div>
                ))}
                <div>
                  {!showAll && userInfo.types.length > 3 && (
                    <span onClick={() => handleShowAll(userInfo)}>
                      <Arrow />
                    </span>
                  )}
                </div>
                {showAll && selectedUserData === userInfo && (
                  <div className="msg-container-search">
                    <div className="msg-sub-search">
                      <div className="msg-heading-search">
                        <div className="msg-text-search">Types</div>
                        <div className="close-msg-search">
                          <div
                            onClick={(e) => {
                              setShowAll(false);
                            }}
                          >
                            X
                          </div>
                        </div>
                      </div>
                      <div className="divider-msg-search"></div>
                      <div className="msg-mini-container-search">
                        <ul>
                          {selectedUserData.types.map((type, index) => (
                            <li key={index} className="msg-mini-text-search">
                              {type}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  className="view-bio-search"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default behavior of the link
                    setSelectedUserInfo(userInfo);
                    ViewBio(e, userInfo.email);
                    router.push({
                      pathname:
                        "/Pagess/create/results/viewProfile/viewProfile",
                      query: {
                        name: JSON.stringify(userInfo),
                      },
                    });
                    localStorage.setItem("turn", 0);
                  }}
                  href="/Pagess/create/results/viewProfile/viewProfile"
                >
                  View Profile
                </Link>
              </div>
              <div className="result-line4-container-search">
                <div className="info-search">
                  <i>
                    <span className="result-line4">Sect:</span>
                    {userInfo.religion_sector}
                  </i>{" "}
                </div>
                <div className="info-search">
                  <i>
                    <span className="result-line4">Hijab</span>:
                    {userInfo.religion_hijab}
                  </i>{" "}
                </div>

                <div className="info-search">
                  <i>
                    <span className="result-line4">Pray</span>:
                    {userInfo.religion_pray}
                  </i>{" "}
                </div>

                <div className="info-search">
                  <i>
                    <span className="result-line4">Quran</span>:
                    {userInfo.religon_quran}
                  </i>{" "}
                </div>

                <div className="info-search">
                  <i>
                    <span className="result-line4">Religiousness</span>:
                    {userInfo.religion_religious}
                  </i>
                </div>
              </div>

              <span className="result-line5-container-datas">
                <i>
                  <div className="result-line5-container-search">
                    <div className="info-search">
                      <span className="result-line5">Occupation</span>:
                      {userInfo.eduwork_job
                        ? userInfo.eduwork_job
                        : "Not Specified"}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Martial Status</span>:{" "}
                      {userInfo.personal_marital}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Has Children</span>:{" "}
                      {userInfo.personal_children2}
                    </div>
                    <div className="info-search">
                      {" "}
                      <span className="result-line5">Build</span>:
                      {userInfo.personal_build}{" "}
                    </div>

                    <div>
                      <span className="result-line5">Height</span>:{" "}
                      {userInfo.personal_height}{" "}
                    </div>

                    <div className="">
                      <div>
                        <span className="result-line5">Income</span>:{" "}
                        {userInfo.personal_income}
                      </div>
                    </div>
                  </div>
                </i>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
