const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from "../database";
import Roles from "../models/Roles";
import auth from "../services/token";
import mustHaveRole from "../services/mustHaveRole";
import { captureOrder, createOrder } from "../services/paypal";
import { checkStatusCode } from "../services/statusCode";

// Environment setup.
dotenv.config();


router.post("/api/create_order", auth, mustHaveRole(Roles.Verified), (req, res, next) =>
{
    if (!req.body.hasOwnProperty("cart"))
    {
        return res.status(400).send({ status: "Failed to create order. Include all fields before submitting.", });
    }

    try
    {
        createOrder(req.body.cart)
        .then((jsonResponse) =>
        {
            return res.status(200).send(jsonResponse);
        })
        .catch((_) =>
        {
            return res.status(500).send({ status: "Failed to create order. Try again later.", });
        });
        
    }
    catch (error)
    {
        return res.status(500).send({ status: "Failed to create order. Try again later.", });
    }

});


router.post("/api/capture_order", auth, mustHaveRole(Roles.Verified), (req, res, next) =>
{
    if (!req.body.hasOwnProperty("subscriptionID"))
    {
        return res.status(400).send({ status: "Failed to capture order. Include all fields before submitting.", });
    }

    // Try to give user role before they pay. Just provides an extra layer of security against someone feeling ripped off if the db query fails.
    db.any("SELECT id FROM roles WHERE name = $1;",
            [Roles.Paid])
    .then((role) =>
    {
        db.any("INSERT INTO user_to_role (user_id, role_id) VALUES ($1, $2);",
                [req.user.id, role[0].id])
        .then((_) =>
        {
            // Now capture order.
            captureOrder(req.body.orderID)
            .then((jsonResponse) =>
            {
                if (checkStatusCode(jsonResponse.status))
                {
                    // Capture successful.
                    return res.status(200).send(jsonResponse);
                }
                else
                {
                    // Capture unsuccessful, strip role.
                    db.any("DELETE FROM user_to_role WHERE user_id = $1 AND role_id = $2;", [req.user.id, role[0].id]);

                    return res.status(500).send(jsonResponse);
                }

            })
            .catch((error) =>
            {
                // Capture unsuccessful, strip role.
                db.any("DELETE FROM user_to_role WHERE user_id = $1 AND role_id = $2;", [req.user.id, role[0].id]);
                
                return res.status(500).send({ status: "Failed to capture payment. Try again later.", });
            });

        })
        .catch((_) =>
        {
            return res.status(500).send({ status: "Failed to capture payment. Try again later.", });
        });

    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to capture payment. Try again later.", });
    });

});


export { router };