import HoursDictionary from "@/interfaces/HoursDictionary";

const dropdownHours = [
    { value: "0", display: "12 AM" },
    { value: "1", display: "1 AM" },
    { value: "2", display: "2 AM" },
    { value: "3", display: "3 AM" },
    { value: "4", display: "4 AM" },
    { value: "5", display: "5 AM" },
    { value: "6", display: "6 AM" },
    { value: "7", display: "7 AM" },
    { value: "8", display: "8 AM" },
    { value: "9", display: "9 AM" },
    { value: "10", display: "10 AM" },
    { value: "11", display: "11 AM" },
    { value: "12", display: "12 PM" },
    { value: "13", display: "1 PM" },
    { value: "14", display: "2 PM" },
    { value: "15", display: "3 PM" },
    { value: "16", display: "4 PM" },
    { value: "17", display: "5 PM" },
    { value: "18", display: "6 PM" },
    { value: "19", display: "7 PM" },
    { value: "20", display: "8 PM" },
    { value: "21", display: "9 PM" },
    { value: "22", display: "10 PM" },
    { value: "23", display: "11 PM" }
];


const hoursDictionary: HoursDictionary = {
    "0": "12 AM",
    "1": "1 AM",
    "2": "2 AM",
    "3": "3 AM",
    "4": "4 AM",
    "5": "5 AM",
    "6": "6 AM",
    "7": "7 AM",
    "8": "8 AM",
    "9": "9 AM",
    "10": "10 AM",
    "11": "11 AM",
    "12": "12 PM",
    "13": "1 PM",
    "14": "2 PM",
    "15": "3 PM",
    "16": "4 PM",
    "17": "5 PM",
    "18": "6 PM",
    "19": "7 PM",
    "20": "8 PM",
    "21": "9 PM",
    "22": "10 PM",
    "23": "11 PM"
}

export default dropdownHours;

export { hoursDictionary };