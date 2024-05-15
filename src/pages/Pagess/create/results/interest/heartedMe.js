import { useEffect, useState } from "react";
import Camera from "../../../../../../public/camerasvg";
import Envelope from "../../../../../../public/envelope";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import WaliRed from "../../../../../../public/search/waliRed";
import NextImage from "next/image";

export default function HeartedMe() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); //Temporary storage for users
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [heartClicked, setHeartClicked] = useState(false);
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  const [blockStart, setBlockStart] = useState(0);
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);

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

  //-----------------^^^^^^^^^^^^^^----------------
  return (
    <div>
      <div className="bottom-container-search">
        {data.map((userInfo) => (
          <div key={userInfo.id} className="result-parent-container-search">
            <div className="result-img-parent-search">
              <div className="img-container-search">
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
                        }}
                        alt=""
                      />
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
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
                <div>{userInfo.username},</div>
                <div className="age-search">
                  {calculateAge(
                    userInfo.aboutme_year,
                    userInfo.aboutme_month,
                    userInfo.aboutme_day
                  )}
                </div>
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
                  className="heart-container-search"
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
                  className="heart-container-search"
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
                              setMessageText(
                                "I would like to request your Private Images"
                              );
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
                  className="heart-container-search"
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
                  className="heart-container-search"
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
                <div className="heart-container-search">
                  <WaliRed />
                </div>
              </div>
              <div className="result-line3-container-search">
                <div className="distance-search">{userInfo.mosque}</div>
              </div>
              <div className="result-line4-container-search">
                <div>{userInfo.eduwork_profession} -</div>
                <div className="info-search">{userInfo.religion_sector} - </div>
                <div className="info-search">{userInfo.eduwork_subject} -</div>
                <div className="info-search">{userInfo.personal_height} -</div>
                <div className="info-search"> {userInfo.religion_pray}</div>
              </div>
              <div className="result-line5-container-search">
                <div>{userInfo.religion_halal} -</div>
                <div className="info-search"> {userInfo.personal_smoke} -</div>
                <div className="info-search"> {userInfo.personal_drink} -</div>
              </div>
              <div className="result-line5-container-search">
                <div> {userInfo.personal_marriage} -</div>
                <div className="info-search">{userInfo.personal_relocate}</div>
              </div>
              <div className="result-line5-container-search">
                <div>Annual Income: {userInfo.personal_income}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
