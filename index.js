const express = require("express");
const app = express();
const dotnev = require("dotenv");
const mongoose = require("mongoose")
app.use(express.json())
app.use(express.urlencoded({extended: true}))

dotnev.config({ path: ".env" });
const myDbString = process.env.DATABASE;
mongoose.connect(myDbString, { useNewUrlParser: true, }).then(() => {
  console.log("You have connected with your mongoDB")
}).catch((err) => console.log("There is some problem in mongoose connection", { error: err }))

const studenSchema_1 = new mongoose.Schema(
  {
    roll_No: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const studenSchema_2 = new mongoose.Schema(
  {
    roll_No: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },

    father_Name: {
      type: String,
      required: true,
      trim: true,
    },

    mother_Name: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const studenModel_1 = mongoose.model("student_data_1", studenSchema_1);
const studenModel_2 = mongoose.model("student_data_2", studenSchema_2);

app.post("/createStudent_1", async (req, res) => {
  try {
    let data = await studenModel_1.create(req.body)
    res.status(201).send({ status: true, data })
  } catch (err) {
    res.status(500).send({ status: false, msg: err })
  }
});

app.post("/createStudent_2", async (req, res) => {
  try {
    let data = await studenModel_2.create(req.body)
    res.status(201).send({ status: true, data })
  } catch (err) {
    res.status(500).send({ status: false, msg: err })
  }
});

app.get("/getStudentData", async (req, res) => {
  try {
    let bothData = await studenModel_1.aggregate([{
      $lookup: {
        from: "student_data_2",
        localField: "roll_No",
        foreignField: "roll_No",
        as: "student_data_1"
      }
    },
    { $unwind: "$student_data_1" },
    {
      $project: {
          "_id": 1,
          "roll_No": 1,
          "name": 1,
          "email": 1,
          "father_Name":"$student_data_1.father_Name",
          "mother_Name":"$student_data_1.mother_Name",
          "city":"$student_data_1.city"
      }
  },
  ])
    res.status(200).send({ status: true, data: bothData })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err })
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(
    "Your server running on port " + (process.env.PORT || 3001)
  );
});
