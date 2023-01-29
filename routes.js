const express = require("express");
const router = new express.Router();

const EventController = require(_pathconst.ControllersPath.EventController);

router.post(
    "/freeSlots",
    EventController.FreeSlots
);

router.post(
    "/bookSlot",
    EventController.BookSlot
);

router.post(
    "/getEvents",
    EventController.GetEvents
);

module.exports = router;