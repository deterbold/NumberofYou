const model_url = '/models';
let faceDrawings = [];
let capture;
let input;

//UI
let button;
let moveOnButton;

//Memory
let NumbersOfYou = [];

//Scene Management
let scene = 0;

//Timer management
let timer = 3;
let timerIsDone = false;


async function pre() 
{
  console.log('loading models')
	await faceapi.loadSsdMobilenetv1Model(model_url);
  await faceapi.loadAgeGenderModel(model_url);
  await faceapi.loadFaceExpressionModel(model_url);
  console.log('loaded models')
}

function setup() 
{
  //loading the models
  pre();
  //creating the canvas
  createCanvas(windowWidth, windowHeight);

  //creating the video capture
  capture = createCapture(VIDEO);
  capture.id("video_element");
  input = document.getElementById('video_element');
  capture.hide();

  //loading the Numbers of You array
  NumbersOfYou = getItem('NumbersOfYou');
  console.log("loaded Numbers: " + NumbersOfYou.length);
  // if(ready = true)
  // {
  //   setTimeout(cameraData, 5000);
  // }
}

function draw()
{
  switch(scene) {
    case 0:
      introScene();
      break;
    case 1:
      cameraScene();
      break;
    case 2:
      soundScene();
      break;
    default:
      break;
  }
}

//SCENES

function introScene()
{
  noLoop();
  //add text here
  background(255);
  textSize(150);
  textAlign(CENTER, CENTER);
  text("Welcome to Number of You", windowWidth/2, windowHeight/2);
  textSize(100);
  text("please wait while we load the system", windowWidth/2, windowHeight/2 + 150);
  console.log("Scene: " + scene);
  setTimeout(moveScenes, 2000);
}


function cameraScene() 
{
  background(255);
  image(capture, windowWidth/2 - 300, windowHeight/2 - 400);
  fill(0, 0, 0, 0);

  faceDrawings.map((drawing) => {
    if (drawing) {
      
        textSize(15);
        strokeWeight(1);
        stroke(255, 255, 255);
        console.log(drawing.detection.box._x);

        const textX = drawing.detection.box._x + drawing.detection.box._width + windowWidth/2 - 150;
        const textY = drawing.detection.box._y + drawing.detection.box._height + windowHeight/2 - 400;
        
        const confidencetext = "Gender: "+ drawing.gender;
        const genderTextWidth = textWidth(confidencetext);
        text(confidencetext, textX-genderTextWidth-10, textY-60);


        const agetext = "Age: "+ drawing.age.toFixed(0);
        const ageTextWidth = textWidth(agetext);
        text(agetext, textX-ageTextWidth-10, textY-30);

        const copiedExpression = drawing.expressions;
        const expressions = Object.keys(copiedExpression).map((key) => {
            const value = copiedExpression[key];
            return value;
        })

        const max = Math.max(...expressions);
        
        const expression_value = Object.keys(copiedExpression).filter((key) => {
            return copiedExpression[key] === max; 
        })[0];

        const expressiontext = "Mood: "+ expression_value;
        const expressionWidth = textWidth(expressiontext);
        text(expressiontext, textX-expressionWidth-10, textY-10);
        
        strokeWeight(4);
        //stroke('rgb(100%,100%,100%)');
        stroke(255, 0, 0);
        rect(drawing.detection.box._x + windowWidth/2 - 300, drawing.detection.box._y + windowHeight/2 - 400, drawing.detection.box._width, drawing.detection.box._height);
    }
});

  faceapi.detectAllFaces(input).withAgeAndGender().withFaceExpressions().then((data) => {
    showFaceDetectionData(data);
});

  //timer in this scene
  textAlign (CENTER, CENTER);
  textSize(100);
  text(timer, windowWidth/2, windowHeight/2 - 600 );
  if (frameCount % 10 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  }
  if (timer == 0) {
    moveScenes();
  }
}

function soundScene()
{
  background(0);
  console.log('Reached the sound scene');
  noLoop();
  console.log(isLooping);
}

function showFaceDetectionData(data)
{
  faceDrawings = data;
}

// GET DATE FUNCTION
// NICKED FROM https://editor.p5js.org/bitSpaz/sketches/hiUY5zSr7
function getDate()
{
  let date = new Date();
  function formateDate()
  {
    return date.toDateString().slice(4);
  }
  return formateDate();
}

//UI function

function drawUI()
{
  button = createButton('PRESENT');
  button.size(300, 100);
  button.position(400, 600);
  button.style("font-family", "Comic Sans MS");
  button.style("font-size", "48px");
  button.mousePressed(presentNOY);
}

//KEY FUNCTION: GATHERS DATA FROM THE CAMERA

function cameraData()
{
  console.log('loaded camera');
  console.log(isLooping);
  let expressionsData = faceDrawings[0].expressions;
  const expressions = Object.keys(expressionsData).map((key) => {
    const value = expressionsData[key];
    return value;
  })
  
  const max = Math.max(...expressions);              
  const expression_value = Object.keys(expressionsData).filter((key) => 
  {
    return expressionsData[key] === max; 
  })[0];
  
  let date = getDate();

  const NoY = new Object();
  NoY.date = date;
  NoY.age = faceDrawings[0].age;
  NoY.gender = faceDrawings[0].gender;
  NoY.mood = expr1ession_value;
  

  NumbersOfYou.push(NoY);
  storeItem('NumbersOfYou', NumbersOfYou);
}

// function mouseClicked()
// {
//   //console.log('Age: ' + faceDrawings[0].age);
//   //console.log('Gender: ' + faceDrawings[0].gender);
  
//   // getting the mood data from
//   // https://github.com/overflowjs-com/object_face_detection_webcam_react/blob/master/src/ObjectDetectionSketch.js
//   // fucking javascript
//   let expressionsData = faceDrawings[0].expressions;
//   const expressions = Object.keys(expressionsData).map((key) => {
//     const value = expressionsData[key];
//     return value;
//   })
  
//   const max = Math.max(...expressions);              
//   const expression_value = Object.keys(expressionsData).filter((key) => 
//   {
//     return expressionsData[key] === max; 
//   })[0];
  
//   //console.log("Mood: " + expression_value);
//   let date = getDate();
//   //console.log("Date: " + date);

//   const NoY = new Object();
//   NoY.date = date;
//   NoY.age = faceDrawings[0].age;
//   NoY.gender = faceDrawings[0].gender;
//   NoY.mood = expression_value;
  

//   NumbersOfYou.push(NoY);
//   storeItem('NumbersOfYou', NumbersOfYou);
// }

function presentNOY()
{
  let NoYs = getItem('NumbersOfYou');
  console.log("Numbers stored in memory: " + NoYs.length);
  for (let i = 0; i < NoYs.length; i++) 
  {
    console.log(NoYs[i].date);
  }
}

//CALLED FROM THE TIMER

function invokeTheSystem()
{
  cameraData();
  console.log("done with the timer");
}

//MOVE SCENES
function moveScenes()
{
  console.log('called');
  scene = scene + 1;
  loop();
  console.log('Scene: ' + scene);
}

//WINDOW MANAGEMENT

function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}

