import { useEffect, useState } from "react";
import ResultHeart from "../../../../../../public/resultheartsvg";
import Camera from "../../../../../../public/camerasvg";
import Envelope from "../../../../../../public/envelope";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import WaliRed from "../../../../../../public/search/waliRed";
import HeartClick from "../../../../../../public/heartClickSvg";
import NextImage from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import Arrow from "../../../../../../public/arrow";
import ImageSlider from "react-simple-image-slider";
import { ImageTwoTone } from "@mui/icons-material";

export default function HeartedMe() {
  const [data, setData] = useState([]);
  const [requestCheck, setRequestCheck] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); //Temporary storage for users
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [heartClicked, setHeartClicked] = useState(false);
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [counts, setCounts] = useState([]);
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  const [blockStart, setBlockStart] = useState(0);
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);
  const { getCode, getName } = require("country-list");
  const [showWali, setShowWali] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleShowAll = (userInfo) => {
    setShowAll(!showAll);
    setSelectedUserData(userInfo);
  };
  //-------------Api to retrieve data------------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      try {
        const res = await fetch("/api/interest/getFavsMe", {
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
        const dataToChange = response.data;

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

        //Getting active time

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
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  //-------------^^^^^^^^^^^^^^^^^^^^------------------
  //-------------------Request Wali------------------------

  const RequestPrivateImage = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: "Would like to request your private images",
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
    console.log("Private Image Request Sent: ", response);
  };

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------
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

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

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

  //  update count data
  const handleUpdateStatus = async () => {
    // setIsLoading(true);

    try {
      // Retrieve email from localStorage
      const email = localStorage.getItem("email");

      // Check if email is available
      if (!email) {
        throw new Error("Email not found in localStorage");
      }

      // Mock API request - replace with your actual logic
      const response = await fetch("/api/interest/setCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, user_status: 1 }), // Fixed value for user_status
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(response);
    } catch (error) {
      console.error("Error updating user status:", error.message);
    } finally {
      // setIsLoading(false);
    }
  };

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
          (request.receiver_email === userInfo.email ||
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
          color={"red"}
          navStyle={ImageTwoTone}
        />
      </div>
    );
  };
  //-----------------^^^^^^^^^^^^^^----------------
  return (
    <div>
       <div className="bottom-container-search" onMouseEnter={handleUpdateStatus}>
        {data.map((userInfo) => (
          <div
            key={userInfo.id}
            className="result-parent-container-search"
            style={{
              backgroundColor: counts.some(
                (count) =>
                  count.viewer_email === userInfo.email && count.views === 0
              )
                ? "#ededed"
                : "white",
            }}
          >
            <div className="result-img-parent-search">
            <div className="result-main-img">
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
          </div>
        ))}
      </div>
    </div>
  );
}
