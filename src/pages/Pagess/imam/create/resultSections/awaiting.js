import { useEffect, useState } from "react";
// import Envelope from "../../../../../../public/envelope";
import { Data, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import Envelope from "../../../../../../public/envelope";
import Camera from "../../../../../../public/camerasvg";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import NextImage from "next/image";
import Arrow from "../../../../../../public/arrow";
import WaliRed from "../../../../../../public/search/waliRed";
import Right from "../../../../../../public/right";
import Wrong from "../../../../../../public/wrong";

export default function Awaiting() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD2vzJGdXaHatCi0Hf-2Z6PvQyRYlh3Akc",
  });
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);
  //-----For private image request---------
  const [showPrivate, setShowPrivate] = useState(false);
  // console.log(filteredData);
  const { getCode, getName } = require("country-list");
  const [showAll, setShowAll] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [showWali, setShowWali] = useState(false);
  //-------------Api to retrieve data for all males----------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        const res = await fetch("/api/imam/getInfoAwaiting", {
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

        setData(response.user);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item) => item.gender === "male");
    setFilteredData(filteredData);
  }, [data]);

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

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

  console.log("firstdad", filteredData);
  //--------------------View Bio function-------------------
  const ViewBio = async (e, user) => {
    e.preventDefault();

    const username = user;

    const res = await fetch("/api/createAcc/addView", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
  };
  //--------------------^^^^^^^^^^^^^-------------------

  const check = (item, userItem) => {
    if (item.length == 0 || item.indexOf(userItem.toLowerCase()) !== -1) {
      return 1;
    }
  };

  //------------------Verifies Email------------------

  const verifyEmail = async (user, command) => {
    const email1 = user;
    console.log("email1:", email1);
    const email2 = localStorage.getItem("email");
    console.log("email2:", email2);
    const res = await fetch("/api/imam/verifyEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email1: email1, email2: email2, number: command }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);
  };

  //------------------^^^^^^^^^^^^^-------------------

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

  //-------------------Sending Message------------------------
  const SendMessage = async (e, user) => {
    e.preventDefault();
    console.log("Send message fucntion started", user);
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

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //CSS IN imam.css in AWAITING SECTION
  return (
    <div className="bottom-container-search">
      {filteredData.map((userInfo) => (
        <div key={userInfo.id} className="result-parent-container-search">
          <div className="result-img-parent-search">
            <div className="img-container-search">
              <Link
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default behavior of the link
                  setSelectedUserInfo(userInfo);
                  ViewBio(e, userInfo.email);
                  router.push({
                    pathname: "/Pagess/create/results/viewProfile/viewProfile",
                    query: {
                      name: JSON.stringify(userInfo),
                    },
                  });
                }}
                href="/Pagess/create/results/viewProfile/viewProfile"
              >
                {loaded ? (
                  <div>
                    {imageData
                      .filter((img) => img.email === userInfo.email)
                      .map((img) => (
                        <NextImage
                          unoptimized
                          key={img.email} // Ensure each NextImage has a unique key
                          src={`data:image/jpeg;base64,${img.image}`}
                          width={100}
                          height={100}
                          style={{
                            border: "1px solid black",
                            width: "150px",
                            height: "150px",
                          }}
                          alt=""
                        />
                      ))}

                    {imageData.filter((img) => img.email === userInfo.email)
                      .length === 0 && (
                      <NextImage
                        unoptimized
                        src="/female.jpeg" // Set src to "/female.jpeg" if no images found
                        width={100}
                        height={100}
                        style={{
                          border: "1px solid black",
                          width: "150px",
                          height: "150px",
                        }}
                        alt=""
                      />
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </Link>
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
                Active:
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
                {userInfo.gender == "male" ? "" : <WaliRed />}
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

              {userInfo.types
                .slice(0, showAll ? userInfo.types.length : 3)
                .map((type, index) => (
                  <div
                    key={index}
                    className={`result-line3 ${index}`}
                    data-tooltip={type} // Add data-tooltip attribute with the type value
                  >
                    {type}
                  </div>
                ))}

              <div>
                {!showAll && userInfo.types.length > 3 && (
                  <span onClick={handleShowAll}>
                    <Arrow />
                  </span>
                )}
              </div>

              <Link
                className="view-bio-search"
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default behavior of the link
                  setSelectedUserInfo(userInfo);
                  ViewBio(e, userInfo.email);
                  router.push({
                    pathname: "/Pagess/create/results/viewProfile/viewProfile",
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
          <div className="btn-container-awaiting">
            {/* 0 = VERIFY   1 = DENY  */}
            <div
              className="btn-awaiting"
              onClick={() => verifyEmail(userInfo.email, 0)}
            >
              <Right />
            </div>
            <div
              className="btn2-awaiting"
              onClick={() => verifyEmail(userInfo.email, 1)}
            >
              <Wrong />
            </div>
            <div
              className="btn3-awaiting"
              onClick={(e) => {
                setSelectedUserInfo(userInfo);
                setShowMessage(true);
              }}
            >
              <Envelope />
            </div>
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
          </div>
        </div>
      ))}
    </div>
  );
}
