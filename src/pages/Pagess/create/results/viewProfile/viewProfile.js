import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import ResultsNav from "../navResult";
import BasicEditView from "./basicEditView";
import AboutEditView from "./aboutEditView";
import EduEditView from "./eduEditView";
import PersonalEditView from "./personalEditView";
import ReligonEditView from "./religonEditView";
import PhotoEditView from "./photoEditView";

export default function ViewProfile() {
  const router = useRouter();
  const { push } = useRouter();

  const [userInfo, setUserInfo] = useState([]);
  const [selected, setSelected] = useState("Basic Information");

  // Get the user info from the query parameters
  useEffect(() => {
    const userInfoString = router.query.name;
    if (userInfoString) {
      try {
        const userInfoArray = JSON.parse(userInfoString);
        setUserInfo(userInfoArray);
        localStorage.setItem("currentNavOption", "search");
        localStorage.setItem("currentUserViewed", userInfoArray.email);
        console.log("userInfoArray", userInfoArray);
      } catch (error) {
        console.error("Error parsing userInfo:", error);
        push("/Pagess/create/results/results");
      }
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, [router.query]);

  return (
    <div className="shade-edit">
      <ResultsNav />
      <div className="parent-edit">
        <div className="left-container-edit">
          <div className="title-edit">{selected}</div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("Basic Information")}
          >
            Basic Information
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("About Me")}
          >
            About Me
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("Education & Work")}
          >
            Education & Work
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("Personal Information")}
          >
            Personal Information
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div className="subtitle-edit" onClick={() => setSelected("Religon")}>
            Religon
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div className="subtitle-edit" onClick={() => setSelected("Photo")}>
            Photo
          </div>
          <div className="horizontal-seprator-edit"></div>
        </div>
        <div className="vertical-seprator-edit"></div>
        <div className="right-edit">
          {selected === "Basic Information" && (
            <BasicEditView data={userInfo.username} />
          )}
          {selected === "About Me" && <AboutEditView data={userInfo} />}
          {selected === "Education & Work" && <EduEditView data={userInfo} />}
          {selected === "Personal Information" && (
            <PersonalEditView data={userInfo} />
          )}
          {selected === "Religon" && <ReligonEditView data={userInfo} />}
          {selected === "Photo" && (
            <PhotoEditView data={userInfo} routerQuery={router.query} />
          )}
        </div>
      </div>
    </div>
  );
}
