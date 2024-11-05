
const humanReadableTimeToFormat = (time: string): number =>
{
    if (time.includes("AM"))
    {
        const hour = parseInt(time.replace("AM", ""));

        if (hour == 12)
        {
            return 23;
        }
        else
        {
            return hour - 1;
        }

    }
    else if (time.includes("PM"))
    {
        const hour = parseInt(time.replace("PM", ""));
        const adjustedTime = hour + 11;

        if (hour == 12)
        {
            return 11;
        }
        else
        {
            return adjustedTime;
        }

    }
    else
    {
        return 0;
    }
    
};

export default humanReadableTimeToFormat;