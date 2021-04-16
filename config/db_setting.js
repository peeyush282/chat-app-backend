const mongoose = require("mongoose");
const { MONGO_URI, MONGODB_ONLINE_URI, MONGODB_PASS } = process.env;

if (
  process.env.NODE_ENV === "Development" &&
  process.env.NODE_DATABASE === "online"
) {
  let connect = async () => {
    try {
      await mongoose.connect(
        MONGODB_ONLINE_URI.replace("<password>", MONGODB_PASS),
        {
          useCreateIndex: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
        }
      );
      await console.log("Mongodb Atlas connected successfully");
    } catch (err) {
      await console.log(err.message);
    }
  };
  connect();
} else if (
  process.env.NODE_ENV === "Development" &&
  process.env.NODE_DATABASE === "offline"
) {
  let connect = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      await console.log("offline db connected successfully");
    } catch (err) {
      await console.log(err.message);
    }
  };
  connect();
} else {
  // please  write the connection logic for production
  // below is a default one just for an example
  let connect = async () => {
    try {
      await mongoose.connect(MONGO_URI, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      await console.log("production db connected successfully");
    } catch (err) {
      await console.log(err.message);
    }
  };
  connect();
  //end
}
