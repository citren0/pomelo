import Roles from "../models/Roles";

const mustHaveRole = (role: Roles) =>
    (req, res, next) =>
    {
        if (req.hasOwnProperty("user") &&
            req.user.hasOwnProperty("roles") &&
            typeof(req.user.roles) == "object" &&
            req.user.roles.includes(role))
        {
            next();
        }
        else
        {
            return res.status(403).send({ status: "You are not authorized to make this request." });
        }
    }

export default mustHaveRole;