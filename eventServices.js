const moment = require("moment-timezone");
const fs = require("firebase-admin");
const serviceAccount = require(_pathconst.FilesPath.KeyPath);
fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});
const db = fs.firestore();

exports.getSlots = (startDate, endDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      let jsonvalue = [];
      const bookEvents = await db
        .collection("book_events")
        .where("booked_slots", ">=", startDate)
        .where("booked_slots", "<=", endDate)
        .get()
        .then((snapshot) => {
          snapshot.forEach((docs) => {
            let data = docs.data();
            data.slot = moment
              .unix(data.booked_slots._seconds).utc();
            delete data['booked_slots'];
            jsonvalue.push(data);
          });
        });
      resolve(jsonvalue);
    } catch (error) {
      reject(error);
    }
  });
};

exports.bookSlot = (datetime, duration) => {
  return new Promise(async (resolve, reject) => {
    try {
      let insertData = {
        booked_slots: datetime,
        duration: duration,
      };
      const resp = await db
        .collection("book_events")
        .doc(datetime.format("YYYY-MM-DD HH:mm:ss"))
        .create(insertData)
        .then((res)=>{
            resolve(res);
        })
        .catch((err)=>{
            reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};
