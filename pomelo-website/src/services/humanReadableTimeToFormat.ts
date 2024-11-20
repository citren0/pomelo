import dropdownHours from "@/constants/dropdownHours";

const humanReadableTimeToFormat = (time: string): number =>
{
    const value = dropdownHours.find((val) => val.display == time);

    return parseInt(value?.value ?? "0");
};

export default humanReadableTimeToFormat;