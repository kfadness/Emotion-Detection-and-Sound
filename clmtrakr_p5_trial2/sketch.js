var ctracker;
var ec;
var emotionData;
var mic;
var amp;
var song;
var k=5/8;
var angle = 0.0;

var volhistory = [];

function setup() {
    // setup camera capture
    var videoInput = createCapture();
    videoInput.size(400, 300);
    videoInput.position(50, 300);

    // setup canvas
    var cnv = createCanvas(windowWidth, windowHeight);
    cnv.position(0, 0);
    // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(videoInput.elt);
    noStroke();
    //set up mic
    angleMode(DEGREES);
    mic = new p5.AudioIn();
    mic.start();
    amp = new p5.Amplitude();

    ec = new emotionClassifier() //from the emotion_classifier.js
    ec.init(emotionModel) //from the emotionmodel.js file attached in index.js
    emotionData = ec.getBlank();
    console.log(emotionData);

}

function draw() {

    clear();
    // get array of face marker positions [x, y] format
    var positions = ctracker.getCurrentPosition(); // for the positioning of the face
    var cp = ctracker.getCurrentParameters(); //for the detection of the emotion
    var emotionData = ec.meanPredict(cp); //for the guess at what emotion

      stroke(0);
      strokeWeight(2)
      fill(254, 255, 24)//happy
      rect(50, 40, 35, 35);
      fill(255, 173, 0)//surprised
      rect(50, 80, 35, 35);
      fill(121, 191, 204)//sad
      rect(50, 120, 35, 35);
      fill(153, 6, 0)//angry
      rect(50, 160, 35, 35);

      noStroke()
      fill(0)
      textSize(18)
      text('happy',95,63)
      text('surprised',95,103)
      text('sad',95,145)
      text('angry',95,185)
      noFill()
    //uncomment to see a stream of data from each preditciton.
    if(emotionData){
      // console.log('angry:' + emotionData[0].value)
      if(emotionData[0].value > 0.4){
        fill(153, 6, 0);
      }
      // console.log('sad:' + emotionData[1].value)
      if(emotionData[1].value > 0.4){
        fill(121, 191, 204);
      }
      // console.log('surprised:' + emotionData[2].value)
      if(emotionData[2].value > 0.4){
        fill(255, 173, 0);
      }
      // console.log('happy:' + emotionData[3].value)
      if(emotionData[3].value > 0.4){
        fill(254, 255, 24);
      }
    }


    //try to identify... this is where you could really use some work to dial in the values and do checks
    for (var i = 0; i < emotionData.length; i++) {
      if(emotionData[i].value > 0.4){
        console.log(emotionData[i].emotion);
        // textSize(24);
        // text(emotionData[i].emotion, width/2,height/4);
      }
  }

    //sound
    var vol = mic.getLevel();
    volhistory.push(vol);
    stroke(0);
    strokeWeight(3)


translate(width/3*2, height/2)
beginShape()
for (var i = 0; i < 360; i++){
  var r = map(volhistory[i],0,1,160,800);
  var x = r * cos(i);
  var y = r * sin(i);
vertex(x, y);
}
endShape();


if (volhistory.length > 360){
  volhistory.splice(0,1);
}


}
