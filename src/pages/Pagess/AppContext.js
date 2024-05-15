import { createContext, useState } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [usernameContext, setUsernameContext] = useState("default");
    const [genderContext, setGenderContext] = useState("default");
    const [aboutmeContext, setAboutmeContext] = useState(["default"]);
    const [eduworkContext, setEduworkContext] = useState(["default"]);
    const [personalContext, setPersonalContext] = useState(["default"]);
    const [religonContext, setReligonContext] = useState(["default"]);
    const [mosqueContext, setMosqueContext] = useState([]);
    const [filterContext, setFilterContext] = useState([]);
    const [rangeContext, setRangeContext] = useState([]);

    return (
        <AppContext.Provider
            value={{
                usernameContext,
                setUsernameContext,
                genderContext,
                setGenderContext,
                aboutmeContext,
                setAboutmeContext,
                eduworkContext,
                setEduworkContext,
                personalContext,
                setPersonalContext,
                religonContext,
                setReligonContext,
                mosqueContext,
                setMosqueContext,
                filterContext,
                setFilterContext,
                rangeContext,
                setRangeContext,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
export { AppContext };
