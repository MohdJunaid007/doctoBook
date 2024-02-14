const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
// const { Configuration, OpenAIApi } = require("openai");
const OpenAI = require("openai");
const path = require('path')


//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());



//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

const openai = new OpenAI({
  apiKey: process.env.API_KEY // This is also the default, can be omitted
});

const openAi = async (question) => {

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "user", "content": question }],
    max_tokens: 15
  });
  return chatCompletion.choices[0].message;
}

app.post('/apiGPT', async (req, res) => {
  try {
    let question = req.body.question;
     question = question + " the list of type of doctors- Cardiologists, audiologists, dentists, ENT specialists, gynecologists, orthopedic surgeons, pediatricians, psychiatrists, veterinarians, radiologists, pulmonologists, endocrinologists, oncologists, neurologists, cardiothoracic surgeons, general physician. now from the list of above doctors select only one doctor who matches the most with the above description and give answer in one word only i.e. the doctor type from the list provided above and no other expta response and if the description matches to none send with general physician as answer"
    // question=question+ " return answer in one word that is either Ayurveda or heart in response"
    const response = await openAi(question);
    // console.log(response, "data");
    res.status(200).send({
      success: true,
      data: response
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
});


//// static files////
app.use(express.static(path.join(__dirname,'./client/build')))

app.get('*',function(req,res){
  res.sendFile(path.join(__dirname + './client/build/index.html'));
});


//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(
    `Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
