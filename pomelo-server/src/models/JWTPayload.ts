import Roles from "./Roles";

export interface JWTPayload
{
    username: string;
    email: string;
    id: number;
    registration: string;
    roles: Roles[];
};