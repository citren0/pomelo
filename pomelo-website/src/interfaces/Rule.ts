import DaysOfTheWeek from "./DaysOfTheWeek";

export interface Rule
{
    domain: string;
    start: number;
    stop: number;
    days: DaysOfTheWeek;
};