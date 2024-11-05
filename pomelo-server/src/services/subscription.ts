
import { db } from "../database";
import Roles from "../models/Roles";


const givePaidRole = (user_id: number) =>
{
    db.any("SELECT id FROM roles WHERE name = $1;",
            [Roles.Paid])
    .then((role_id) =>
    {
        db.any("INSERT INTO user_to_role (user_id, role_id) VALUES ($1, $2);",
                [user_id, role_id[0].id]);
    })
    .catch((_) =>
    {});

};


const removePaidRole = (user_id: number) =>
{
    db.any("SELECT id FROM roles WHERE name = $1;",
            [Roles.Paid])
    .then((role_id) =>
    {
        db.any("DELETE FROM user_to_role WHERE user_id = $1 AND role_id = $2;",
                [user_id, role_id[0].id]);
    })
    .catch((_) =>
    {});

};


const createSubscription = (hookBody: any) =>
{
    db.any("INSERT INTO subscriptions (user_id, subscription_id, activated, time_stamp) values ($1, $2, $3, $4);",
            [hookBody.resource.custom_id, hookBody.resource.id, false, Date.now()]);
};


const deleteSubscription = (hookBody: any) =>
{
    db.any("REMOVE FROM subscriptions WHERE user_id = $1;",
            [hookBody.resource.custom_id]);
};


export { givePaidRole, removePaidRole, createSubscription, deleteSubscription, };