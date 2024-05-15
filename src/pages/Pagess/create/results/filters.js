import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../AppContext";
import MenuIcon from "../../../../../public/search/menuIconSvg";

export default function Filters() {
  /*------------------States to manage showing slides----------------*/
  const [ethnicity, setEthnicity] = useState(false);
  const [body, setBody] = useState(false);
  const [incomes, setIncomes] = useState(false);
  const [marital, setMarital] = useState(false);
  const [smoke, setSmoke] = useState(false);
  const [drink, setDrink] = useState(false);
  const [phones, setPhones] = useState(false);

  const [religon, setReligon] = useState(false);
  const [sect, setSect] = useState(false);
  const [revert, setRevert] = useState(false);
  const [hijab, setHijab] = useState(false);
  const [halal, setHalal] = useState(false);
  const [pray, setPray] = useState(false);
  const [quran, setQuran] = useState(false);

  const [checked, isChecked] = useState(true);

  //Setting the Slider Data and checkboxes and mosques
  const [sliderValue, setSliderValue] = useState(700);
  const [arrPlaces, setArrPlaces] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [currentMosques, setCurrentMosques] = useState([]);
  const [visibleMosques, setVisibleMosques] = useState([]);
  const initialDisplayCount = 5;
  const [menu, setMenu] = useState(false);

  //Mosques visiblility

  useEffect(() => {
    setVisibleMosques(currentMosques.slice(0, initialDisplayCount));
  }, [currentMosques]);

  useEffect(() => {
    setVisibleMosques(
      showAll ? currentMosques : currentMosques.slice(0, initialDisplayCount)
    );
  }, [showAll, currentMosques]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  const ToggleIcon = ({ onClick, rotate }) => (
    <div
      className="remove-location-filter"
      onClick={onClick}
      style={{
        marginLeft: "87%",
        cursor: "pointer",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <svg
        width="20"
        height="30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5L4 12L12 19"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  //Context Range Variable
  const { rangeContext, setRangeContext } = useContext(AppContext);
  const rangeInputRef = useRef("");

  //--------------Intializing context----------------
  const { filterContext, setFilterContext } = useContext(AppContext);

  //--------------^^^^^^^^^^^^^^^^------------------

  /*----------Arrays for checkbox names / data-----------*/
  const ethnicities = [
    "Asian",
    "African",
    "Latin",
    "East Indian",
    "Mixed",
    "Native American",
    "Pacific Islander",
    "Caucasian",
    "Other",
  ];

  const bodytype = ["Slim", "Athletic", "Medium", "Muscular", "Large"];
  const income = ["Below Average", "Average", "Above Average"];
  const maritalStatus = ["Divorced", "Never Married", "Widowed", "Married"];
  const smoking = ["No", "Yes", "Sometimes", "Stopped"];
  const drinking = ["No", "Yes", "Sometimes", "Stopped"];
  const phone = ["Attatched to my phone", "Regular User", "Not Much"];

  const religiousness = [
    "Very Religious",
    "Religious",
    "Somewhat Religious",
    "Not Religious",
    "Prefer Not To Say",
  ];
  const sects = ["Just Muslim", "Sunni", "Shia", "Other"];

  const reverts = ["Yes", "No"];
  const hijabs = ["Yes Hijab", "Yes Niqab", "No", "Other"];
  const halals = [
    "Always Keep Halal",
    "Usually Keep Halal",
    "I Keep Halal At Home",
    "Don't Keep Halal",
  ];
  const prays = ["Always", "Usually", "Sometimes", "Never"];
  const qurans = ["Always", "Usually", "Sometimes", "Never"];

  const [filterRules, setFilterRules] = useState({
    ethnicities: [],
    bodytype: [],
    income: [],
    maritalStatus: [],
    smoking: [],
    drinking: [],
    phone: [],
    religiousness: [],
    sects: [],
    reverts: [],
    hijabs: [],
    halals: [],
    prays: [],
    qurans: [],
    location: [],
  });

  useEffect(() => {
    setFilterContext(filterRules);
  }, [filterRules]);

  const handleRemoveLocation = (indexToRemove) => {
    setFilterContext({
      ...filterContext,
      location: filterContext.location.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  let handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  //Send Slider Value Globally
  useEffect(() => {
    setRangeContext(sliderValue);
    rangeInputRef.current.value = sliderValue + " MILES";
    console.log("Slider Value:", sliderValue);
  }, [sliderValue]);
  /*----------^^^^^^^^^^^^^^^^^-----------*/

  //-----------------Updates the input suggestions----------------
  const handleInputChangePlaces = async (value) => {
    //Clearing out location to uncheck all checkboxes
    if (value.trim() === "") {
      setArrPlaces([]); // Clear places array if input is empty
      setCheckedCheckboxes([]); // Clear checked checkboxes array
      return;
    }
    setInputValue(value);

    const res = await fetch("/api/getMosque/getPlaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    setArrPlaces(response);
    setCheckedCheckboxes([]);
  };
  //------------------^^^^^^^^^^^^^^^----------------

  //-----------------Get current users mosques----------------

  useEffect(() => {
    const getMosques = async () => {
      try {
        const res = await fetch("/api/getMosque/getCurrentUserMosque", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
          }),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();

        setCurrentMosques(response.mosques);
        console.log("Current Mosques:", response.mosques);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getMosques();
  }, []);
  /*-------------^^^^^^^^^-------------------*/
  const handleRemoveMosque = async (name) => {
    try {
      const res = await fetch("/api/getMosque/removeUserMosque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          name: name,
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();
      reloadPage();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  /*-------------^^^^^^^^^-------------------*/

  return (
    <div className="filters-parent-result">
      <div className="filters-heading-result">Filters</div>
      <div className="filters-sub-result">Search By Location</div>
      <input
        className="filters-location-result"
        onChange={(e) => handleInputChangePlaces(e.target.value)}
        required
        placeholder="Address, city, etc"
      />
      {arrPlaces && arrPlaces.length > 0 && (
        <div className="option-container-mosque">
          {arrPlaces.map((mosque, index) => (
            <div className="mini-option-mosque" key={index}>
              <p>{mosque.name}</p>
              <input
                type="checkbox"
                className="check-option-filter"
                checked={checkedCheckboxes.includes(index)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  if (isChecked) {
                    setCheckedCheckboxes((prev) => [...prev, index]);
                    setFilterRules({
                      ...filterRules,
                      location: [
                        ...filterRules.location,
                        mosque.name.split(/[,\s]+/)[0].toLowerCase(),
                      ],
                    });
                  } else {
                    setCheckedCheckboxes((prev) =>
                      prev.filter((item) => item !== index)
                    );
                    setFilterRules({
                      ...filterRules,
                      location: filterRules.location.filter(
                        (item) =>
                          item !== mosque.name.split(/[,\s]+/)[0].toLowerCase()
                      ),
                    });
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="filters-sub-result">
        {filterContext.location && filterContext.location.length > 0 && (
          <div>
            <div className="your-mosque-filter">Added Locations</div>

            <div
              className="filter-container"
              style={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {filterContext.location.map((location, index) => (
                <div
                  className="container-add-filter"
                  style={{
                    padding: "2px",
                    marginBottom: "1px",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "5px",
                  }}
                >
                  <div key={index}>
                    {" "}
                    <input
                      type="checkbox"
                      disabled
                      style={{ marginRight: "10px" }}
                    />{" "}
                    {location}
                  </div>

                  <div
                    className="remove-location-filter"
                    onClick={() => handleRemoveLocation(index)}
                    style={{ marginLeft: "auto", cursor: "pointer" }}
                  >
                    <svg
                      width="20"
                      height="30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.5 9.5L18.5 18.5M9.5 18.5L18.5 9.5"
                        stroke="#b52d3b"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="filters-sub-result">
        <div className="your-mosque-filter">Your Mosques</div>

        <div
          className="filter-container"
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {visibleMosques.map((mosque, index) => (
            <div
              className="container-add-filter"
              key={index}
              style={{
                padding: "2px",
                marginBottom: "1px",
                display: "flex",
                alignItems: "center",
                marginLeft: "5px",
              }}
            >
              {/* <svg
                width="15"
                height="15"
                viewBox="10 10 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "10px" }}
              >
                <rect
                  x="10"
                  y="10"
                  width="80"
                  height="80"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
              </svg> */}{" "}
              <input
                type="checkbox"
                disabled
                className="container-add-filter1"
                style={{ marginRight: "10px" }}
              />
              {mosque.type}
              <div
                onClick={() => handleRemoveMosque(mosque.type)}
                className="remove-location-filter"
                style={{ marginLeft: "auto", cursor: "pointer" }}
              >
                <svg
                  width="20"
                  height="30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 9.5L18.5 18.5M9.5 18.5L18.5 9.5"
                    stroke="#b52d3b"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          ))}

          {!showAll && currentMosques.length > initialDisplayCount ? (
            <div
              className="remove-location-filter"
              onClick={toggleShowAll}
              style={{
                marginLeft: "auto",
                cursor: "pointer",
                marginRight: "4px",
              }}
            >
              <svg
                width="20"
                height="30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(-90 10 1)"
              >
                <path
                  d="M12 5L4 12L12 19"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div
              className="remove-location-filter"
              onClick={toggleShowAll}
              style={{ marginLeft: "auto", cursor: "pointer" }}
            >
              <svg
                width="20"
                height="30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(90 0 0)"
              >
                <path
                  d="M12 5L4 12L12 19"
                  stroke="#000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="filters-sub-result">Search By Distance</div>

      {/* Input for masjid filter*/}
      <input
        className="filters-location-result"
        ref={rangeInputRef}
        placeholder="City, post code, region, area, etc"
        readOnly
      />

      <input
        type="range"
        name="region-slider"
        className="region-slider"
        min="0"
        max="7000"
        value={sliderValue}
        step="1"
        onChange={handleSliderChange}
      />
      <div className="region-slider-labels">
        <div>0 Miles</div>
        <div>7000 Miles</div>
      </div>

      <div className="filters-line2-result"></div>
      {/* <div className="options-heading-result">Options</div> */}

      <div className="checkbox-container-option-result">
        <div className="personalInfo-head-filter-result">
          Personal Information
        </div>

        {/* Drop Down menu for ethnicity */}
        <div className="dropdown-result">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setEthnicity(!ethnicity);
              }}
            >
              Ethnicity
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {ethnicity ? (
              <div className="slide-dropdown-result">
                {ethnicities.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedEthnicity = inc.toLowerCase();

                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            ethnicities: [
                              ...filterRules.ethnicities,
                              selectedEthnicity,
                            ],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            ethnicities: filterRules.ethnicities.filter(
                              (item) => item !== selectedEthnicity
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for body type */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setBody(!body);
              }}
            >
              Body Type
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {body ? (
              <div className="slide-dropdown-result">
                {bodytype.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedBody = inc.toLowerCase();

                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            bodytype: [...filterRules.bodytype, selectedBody],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            bodytype: filterRules.bodytype.filter(
                              (item) => item !== selectedBody
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        {/* Drop Down menu for income */}
        <div className="seprator-filter-result"></div>
        <div className="seprator-filter-result2"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setIncomes(!incomes);
              }}
            >
              Income
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {incomes ? (
              <div className="slide-dropdown-result">
                {income.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedIncome = inc.toLowerCase();

                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            income: [...filterRules.income, selectedIncome],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            income: filterRules.income.filter(
                              (item) => item !== selectedIncome
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for marital */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setMarital(!marital);
              }}
            >
              Marital
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {marital ? (
              <div className="slide-dropdown-result">
                {maritalStatus.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedMarital = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            maritalStatus: [
                              ...filterRules.maritalStatus,
                              selectedMarital,
                            ],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            maritalStatus: filterRules.maritalStatus.filter(
                              (item) => item !== selectedMarital
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for smoking */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setSmoke(!smoke);
              }}
            >
              Smoke
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {smoke ? (
              <div className="slide-dropdown-result">
                {smoking.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedSmoke = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            smoking: [...filterRules.smoking, selectedSmoke],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            smoking: filterRules.smoking.filter(
                              (item) => item !== selectedSmoke
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for drinking */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setDrink(!drink);
              }}
            >
              Drink
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {drink ? (
              <div className="slide-dropdown-result">
                {drinking.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedDrink = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            drinking: [...filterRules.drinking, selectedDrink],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            drinking: filterRules.drinking.filter(
                              (item) => item !== selectedDrink
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for Phone */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setPhones(!phones);
              }}
            >
              Phone
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {phones ? (
              <div className="slide-dropdown-result">
                {phone.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedPhone = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            phone: [...filterRules.phone, selectedPhone],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            phone: filterRules.phone.filter(
                              (item) => item !== selectedPhone
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="seprator-filter-result"></div>

        {/*---------------------Religon Section Starts------------------- */}
        <div className="religon-head-filter-result">Religon</div>
        <div className="dropdown-result">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setReligon(!religon);
              }}
            >
              Religiousness
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {religon ? (
              <div className="slide-dropdown-result">
                {religiousness.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedReligon = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            religiousness: [
                              ...filterRules.religiousness,
                              selectedReligon,
                            ],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            religiousness: filterRules.religiousness.filter(
                              (item) => item !== selectedReligon
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for Sects */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setSect(!sect);
              }}
            >
              Sect
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {sect ? (
              <div className="slide-dropdown-result">
                {sects.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedSect = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            sects: [...filterRules.sects, selectedSect],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            sects: filterRules.sects.filter(
                              (item) => item !== selectedSect
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        {/* Drop Down menu for revert */}
        <div className="seprator-filter-result"></div>
        <div className="seprator-filter-result2"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setRevert(!revert);
              }}
            >
              Revert
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {revert ? (
              <div className="slide-dropdown-result">
                {reverts.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedRevert = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            reverts: [...filterRules.reverts, selectedRevert],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            reverts: filterRules.reverts.filter(
                              (item) => item !== selectedRevert
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for hijab */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setHijab(!hijab);
              }}
            >
              Hijab
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {hijab ? (
              <div className="slide-dropdown-result">
                {hijabs.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedHijab = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            hijabs: [...filterRules.hijabs, selectedHijab],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            hijabs: filterRules.hijabs.filter(
                              (item) => item !== selectedHijab
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for halal */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setHalal(!halal);
              }}
            >
              Halal
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {halal ? (
              <div className="slide-dropdown-result">
                {halals.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedHalal = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            halals: [...filterRules.halals, selectedHalal],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            halals: filterRules.halals.filter(
                              (item) => item !== selectedHalal
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for Praying */}
        <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={(e) => {
                e.preventDefault(); // Prevent scrolling to top
                setPray(!pray);
              }}
            >
              Praying
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {pray ? (
              <div className="slide-dropdown-result">
                {prays.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const selectedPray = inc.toLowerCase();
                        if (e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            prays: [...filterRules.prays, selectedPray],
                          });
                        }
                        if (!e.target.checked) {
                          setFilterRules({
                            ...filterRules,
                            prays: filterRules.prays.filter(
                              (item) => item !== selectedPray
                            ),
                          });
                        }
                      }}
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Drop Down menu for quran */}
        {/* <div className="seprator-filter-result"></div>
        <div className="dropdown-result2">
          <label for="touch">
            <div
              className="title-dropdown-resut"
              onClick={() => {
                setQuran(!quran);
              }}
            >
              Reading Quran
            </div>
          </label>
          <input type="checkbox" id="touch" />
          <div>
            {quran ? (
              <div className="slide-dropdown-result">
                {qurans.map((inc, index) => (
                  <div className="check-container-personal-result" key={index}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        const selectedReligon = inc.toLowerCase();
                        setFilterContext((prevFilterContext) => {
                          if (
                            prevFilterContext.religon_religious ===
                            selectedReligon
                          ) {
                            // If the checkbox is already selected, remove the key
                            const { religon_religious, ...rest } =
                              prevFilterContext;
                            return rest;
                          } else {
                            // If the checkbox is selected, add the key
                            return {
                              ...prevFilterContext,
                              religon_religious: selectedReligon,
                            };
                          }
                        });
                      }}  
                    />
                    <span className="personal-check-result">{inc}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
