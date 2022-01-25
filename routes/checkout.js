const express = require("express");
const checkoutRouter = express.Router();
const stripe = require("stripe")(process.env.skLive);
const Beat = require("../models/beatSchema");

checkoutRouter.route("/:id")
  .post(async (req, res) => {
    const id = req.params.id;
    await Beat.findById({ _id: id })
    .then(async beat => {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: beat.beatfile.originalname,
              },
              unit_amount: 3000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success/${beat._id}`,
        cancel_url: 'http://localhost:3000/',
      });

      res.redirect(session.url);
    })
  });

module.exports = checkoutRouter;