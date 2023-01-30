const ResHelper = require(_pathconst.FilesPath.ResHelper);
const EventService = require(_pathconst.ServicePath.EventService);
const Config = require(_pathconst.FilesPath.Config);
const moment = require("moment-timezone");
const { timeZone } = require("../../helpers/config");

exports.FreeSlots = async (req, res, next) => {
  try {
    const { Date, Timezone } = req.body;
    if (Date && Timezone) {
      const fmt = "YYYY-MM-DD";
      const convertedDate = moment.tz(Date, fmt, Timezone).utc();
      const prevDate = moment(convertedDate).subtract(1,'d');
      const nextDate = moment(convertedDate, fmt).add(1, "d");

      const bookedSlotData = await EventService.getSlots(
        prevDate,
        nextDate
      );
      let bookedSlots = bookedSlotData.map((obj)=>moment(obj.slot).format(''));
      let set = new Set(bookedSlots);

      let bookedSlotMod = bookedSlotData.map((obj) => ({
        ...obj,
        user_slot: moment(moment.utc(obj.slot), `${fmt} HH:mm`)
          .tz( Timezone )
          .format(`${fmt} HH:mm`),
        config_slot: moment(moment.utc(obj.slot), `${fmt} HH:mm`)
          .tz( Config.timeZone )
          .format(`${fmt} HH:mm`),
      }));

      let allSlots = [];    //include yesterday, today, tomorrow slots

      //Yesterday
      let dateTime = moment(prevDate.format(`${fmt} `) + Config.startHour, `${fmt} HH:mm`), 
      endDateTime = moment(prevDate.format(`${fmt} `) + Config.endHour, `${fmt} HH:mm`);
      while(moment(dateTime).isBefore(endDateTime)){
        allSlots.push(moment(dateTime).utc().format());
        dateTime = moment(dateTime, `${fmt} HH:mm`).add(Config.duration, "minutes");
      }

      //Today
      dateTime = moment(convertedDate.format(`${fmt} `) + Config.startHour, `${fmt} HH:mm`), 
      endDateTime = moment(convertedDate.format(`${fmt} `) + Config.endHour, `${fmt} HH:mm`);
      while(moment(dateTime).isBefore(endDateTime)){
        allSlots.push(moment(dateTime).utc().format());
        dateTime = moment(dateTime, `${fmt} HH:mm`).add(Config.duration, "minutes");
      }

      //Tomorrow
      dateTime = moment(nextDate.format(`${fmt} `) + Config.startHour, `${fmt} HH:mm`), 
      endDateTime = moment(nextDate.format(`${fmt} `) + Config.endHour, `${fmt} HH:mm`);
      while(moment(dateTime).isBefore(endDateTime)){
        allSlots.push(moment(dateTime).utc().format());
        dateTime = moment(dateTime, `${fmt} HH:mm`).add(Config.duration, "minutes");
      }

      //Removing booked slots from allSlots
      let freeSlots = allSlots.filter((val)=> !set.has(val));

      //Setting to user timezone
      freeSlots = freeSlots.map((val)=>moment(val).tz(Timezone).format());

      //Removing other days value
      freeSlots = freeSlots.filter((val)=>{
        let tmp = moment.tz(val,fmt, Timezone).format(fmt);
        return tmp === Date;
      });
      
      ResHelper.apiResponse(res, true, "Success", 200, {freeSlots, bookedSlotMod}, "");
    } else {
      ResHelper.apiResponse(
        res,
        false,
        "Date and Timezone Required",
        400,
        {},
        ""
      );
    }
  } catch (error) {
    ResHelper.apiResponse(res, false, "Error occured", 500, error, "");
  }
};

exports.BookSlot = async (req, res, next) => {
  try {
    const { DateTime, Duration } = req.body;
    if (DateTime && Duration) {
      let convertedTime = moment(DateTime).utc();
      const bookSlot = await EventService.bookSlot(convertedTime, Duration);
      if (bookSlot)
        ResHelper.apiResponse(res, true, "Slot Booked", 200, {}, "");
      else
        ResHelper.apiResponse(
          res,
          false,
          "Error occured while slot booking",
          500,
          {},
          ""
        );
    } else {
      ResHelper.apiResponse(
        res,
        false,
        "DateTime and Duration Required",
        400,
        {},
        ""
      );
    }
  } catch (error) {
      if(error.code === 6)  ResHelper.apiResponse(res, false, "Already exist", 422, {}, ""); 
    ResHelper.apiResponse(res, false, "Error occured", 500, error, "");
  }
};

exports.GetEvents = async (req, res, next) => {
  try {
    const { StartDate, EndDate } = req.body;
    if (StartDate && EndDate) {
      let convertedStartDate = moment
        .tz(StartDate, "YYYY-MM-DD", Config.timeZone)
        .utc();
      let convertedEndDate = moment
        .tz(EndDate, "YYYY-MM-DD", Config.timeZone)
        .utc();
      const bookedSlotData = await EventService.getSlots(
        convertedStartDate,
        convertedEndDate
      );
      ResHelper.apiResponse(res, true, "Success", 200, bookedSlotData, "");
    } else {
      ResHelper.apiResponse(
        res,
        false,
        "StartDate and EndDate Required",
        400,
        {},
        ""
      );
    }
  } catch (error) {
    ResHelper.apiResponse(res, false, "Error occured", 500, error, "");
  }
};
