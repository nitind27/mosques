//------------AboutME---------------

const WhereLive = [
  "Bath",
  "Birmingham",
  "Bradford",
  "Brighton and Hove",
  "Bristol",
  "Cambridge",
  "Canterbury",
  "Carlisle",
  "Chester",
  "Chichester",
  "Coventry",
  "Derby",
  "Durham",
  "Ely",
  "Exeter",
  "Gloucester",
  "Hereford",
  "Kingston upon Hull",
  "Lancaster",
  "Leeds",
  "Leicester",
  "Lichfield",
  "Lincoln",
  "Liverpool",
  "City of London",
  "Manchester",
  "Newcastle upon Tyne",
  "Norwich",
  "Nottingham",
  "Oxford",
  "Peterborough",
  "Plymouth",
  "Portsmouth",
  "Preston",
  "Ripon",
  "Salford",
  "Salisbury",
  "Sheffield",
  "Southampton",
  "St Albans",
  "Stoke-on-Trent",
  "Sunderland",
  "Truro",
  "Wakefield",
  "Wells",
  "Westminster",
  "Winchester",
  "Wolverhampton",
  "Worcester",
  "York",
  "Bangor",
  "Cardiff",
  "Newport",
  "St Davids",
  "Swansea",
  "Aberdeen",
  "Dundee",
  "Edinburgh",
  "Glasgow",
  "Inverness",
  "Stirling",
  "Armagh",
  "Belfast",
  "Londonderry",
  "Lisburn",
  "Newry",
];
const Countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
const Dates = Array.from({ length: 31 }, (_, i) => i + 1);

const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const startYear = 1960;
const endYear = 2020;
const Years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
);

//------------^^^^^---------------

//------------Education---------------
const Education = [
  "Pre-preparatory",
  "Preparatory or Junior",
  "Senior(Public)",
  "Foundation Diploma",
  "Higher Diploma",
  "Advanced Diploma",
  "International Baccalaureate",
  "Higher National Certificate (HNC)",
  "Higher National Diploma (HND)",
  "Foundation Degree",
  "Graduate Certificate",
  "Graduate Diploma",
  "Professional Graduate Certificate",
  "Ordinary Bachelor's Degree",
  "Bachelor's Degree with honors",
  "Postgraduate certificate",
  "Postgraduate diploma",
  "Integrated master's degree",
  "Master's Degree",
  "Doctorates",
];

const Profession = [
  "Administrative/Management",
  "Advertising/Marketing/Communications",
  "Construction/Building Trades/Engineering",
  "Creative Arts/Desgin",
  "Education/Research/Academia",
  "Financial Services",
  "Food and Hospitality Services",
  "Healthcare/Medical Research",
  "Human Resources/Consulting",
  "Information Technology(IT)",
  "Legal Services/Government/Non-profit",
  "Personal Services",
  "Retail Sales / Customer Service",
  "Transportation",
];

const JobTitle = [
  "Aircraft Mechanic",
  "Airport Security Screener",
  "Airline Pilot",
  "Flight Attendant",
  "Cashier",
  "Customer Service Representative",
  "Retail Salesperson",
  "Retail Supervisor",
  "Animal Groomer",
  "Auto Mechanic",
  "Cosmetologist",
  "Fitness Trainer",
  "Funeral Director",
  "Hairdresser,Hairstylists and Cosmetologist",
  "Marriage and Family Therapist",
  "Veterinarian",
  "Correctinal Officer",
  "Court Reporter",
  "Firefighter",
  "Fundraiser",
  "Judge",
  "Lawyer",
  "Paralegal and Legal Assistant",
  "Police Office",
  "Postal Service Worker",
  "Security Guard",
  "Social Worker",
  "Computer Programmer",
  "Computer System Analyst",
  "Database Administrator",
  "Software Developer",
  "Web Developer",
  "Consultant",
  "Human Resources Manager",
  "Biomedical Engineer",
  "Cardiovascular Technologist",
  "Dental Hygienist",
  "Dentist",
  "Diagnostic Medical Sonographer",
  "Dietitian/Nutritionist",
  "Doctor",
  "EMTs and Paramedics",
  "Health Educator",
  "Home Health Aide",
  "Licensed Practical Nurse",
  "Medical Assistant",
  "Medical Laboratory Tech",
  "Occupational Therapist",
  "Pharmacist",
  "Pharmacy Technician",
  "Physician Assistant",
  "Physical Therapist",
  "Physical Therapist Assistant",
  "Registered Nurse",
  "Bartender",
  "Chef",
  "Waiter/Waitress",
  "Accountant",
  "Actuary",
  "Bank Teller",
  "Book Keeping",
  "Accounting",
  "Auditing Clerks",
  "Budget Analyst",
  "Claims Adjuster",
  "Appraiser",
  "Examiner",
  "Investigator",
  "Financial Advisor",
  "Insurance Underwriter",
  "Loan Officer",
  "Chemist",
  "Curator",
  "Guidance Counselor",
  "Hydrologist",
  "Librarian",
  "Special Education Teacher",
  "School Principle",
  "Teacher",
  "Teacher Assistant",
  "Fashion Designer",
  "Interior Designer",
  "Photographer",
  "Architect",
  "Construction Laborer",
  "Electrician",
  "Enviromental Engineer",
  "Janitor",
  "Mechanical Engineer",
  "Plumber",
  "Advertising Managers and Promotions Manager",
  "Advertising Sales Agent",
  "Editor",
  "Graphic Designer",
  "Interpreter and Translator",
  "Public Relations Specialist",
  "Social Media Manager",
  "Writer and Editor",
  "Event/Meeting Planner",
  "Purchasing Manager",
  "Receptionist",
  "Secretary / Admin Assistant",
  "Market Research Analyst",
];

const Languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Bengali",
  "Russian",
  "Japanese",
  "Punjabi",
  "Marathi",
  "Telugu",
  "Wu",
  "Turkish",
  "Korean",
  "Vietnamese",
  "Tamil",
  "Urdu",
  "Italian",
  "Cantonese",
  "Thai",
  "Gujarati",
  "Javanese",
  "Mandarin",
  "Malayalam",
  "Kannada",
  "Odia",
  "Burmese",
  "Maithili",
  "Tagalog",
  "Yoruba",
  "Malay",
  "Sundanese",
  "Hausa",
  "Bhojpuri",
  "Burmese",
  "Amharic",
  "Farsi",
  "Oromo",
  "Tamil",
  "Yiddish",
  "Kurdish",
  "Malagasy",
  "Pashto",
  "Sindhi",
  "Punjabi",
  "Serbo-Croatian",
  "Nepali",
  "Sinhalese",
  "Chittagonian",
  "Khmer",
  "Zulu",
  "Czech",
  "Afrikaans",
  "Kazakh",
  "Swahili",
  "Uzbek",
  "Dutch",
  "Haitian Creole",
  "Finnish",
  "Hebrew",
  "Romanian",
  "Tajik",
  "Azerbaijani",
  "Hungarian",
  "Greek",
  "Belarusian",
  "Bulgarian",
  "Swedish",
  "Ukrainian",
  "Lao",
  "Slovak",
  "Danish",
  "Norwegian",
  "Icelandic",
  "Latvian",
  "Lithuanian",
  "Estonian",
  "Albanian",
  "Macedonian",
  "Bosnian",
  "Slovenian",
  "Maltese",
  "Luxembourgish",
  "Welsh",
  "Irish",
  "Scottish Gaelic",
  "Manx",
];

//------------^^^^^---------------

//------------Personal---------------

const Height = Array.from({ length: 71 }, (_, i) => (140 + i).toString());

const Ethnicity = [
  "African",
  "Asian",
  "East Indian",
  "Mixed",
  "Latin",
  "Native American",
  "Pacific Islander",
  "Caucasian",
  "Other",
];
//------------^^^^^---------------

export {
  WhereLive,
  Countries,
  Dates,
  Months,
  Years,
  Education,
  Profession,
  JobTitle,
  Languages,
  Height,
  Ethnicity,
};
