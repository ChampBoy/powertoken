var amplitude = 10;
var frequency = .15;
var time = 0;
var diameter = 20;
var radius = diameter/2;

var cavansW = 600;
var canvasH = 400;
var margin = 20;
var centerX, centerY;

var data;
var activities, progress;

var gap;
var innerR, outerR;
var mask;


function preload(){
  // need to update this
  //data = {{activity_data |tojson }}
  data = loadJSON("../static/data/viz_activity_data.json");
  mask = loadImage("../static/img/mask.png");
}

function setup() {
  // get window height and width, min are 600 x 400
  if(window.innerWidth > 600){
    canvasW = window.innerWidth;}
  if(window.innerHeight > 400){
    canvasH = window.innerHeight;}
  createCanvas(canvasW, canvasH);
  centerX = canvasW / 2;
  centerY = canvasH / 2;
  //
  gap = 2.5*PI/180;
  innerR = canvasW/4;
  outerR = canvasH/1.3;
  //
  progress = data.progress;
  activities = [];
  var totalW = 0;
  for(var i = 0; i < data.activities.length; i++){
    var a = new Activity(data.activities[i].name,data.activities[i].weight,data.activities[i].start_time,data.activities[i].completed);
    activities.push(a);
    totalW = totalW + a.absoluteW;
  }
  for (var i = 0; i < activities.length; i++){
    activities[i].update(totalW);
  }
}

function draw() {
  background(255);
  //
  drawWave();
  image(mask, canvasW/2-canvasH/2, 0, canvasH, canvasH);
  fill(255);
  noStroke();
  rect(0,0,canvasW/2-canvasH/2,canvasH);
  rect(canvasW-canvasW/2+canvasH/2-5,0,canvasW/2-canvasH/2+10,canvasH);

  //
  var startA = -PI/2;
  for (var i = 0; i < activities.length; i++){
    activities[i].draw(startA);
    activities[i].drawText(startA);
    startA = startA + activities[i].length;
  }

}

function drawWave(){
  var height = canvasH*progress;
  push();
  translate(0, (canvasH-height));
  noStroke();

  for (var x = radius; x <= width-radius; x += diameter*1.5) {
    var phi = -x*.01;
    fill('#B2E5FC');
    ellipse(x, amplitude*sin(frequency * time + phi), 100, diameter);
  	ellipse(x, amplitude*sin(frequency * time + phi) + 17, 100, diameter);
  	rect(0, 0, width, height);
  }
  time += .5;
  noStroke();
  pop();
}

function calculateW(h){
  var cos = (innerR - (innerR*2-h))/innerR;
  var alpha = 2 * Math.acos(cos);
  var s = 2 * innerR*Math.sin(alpha/2);
  return s;
}


class Activity {
  constructor(name,weight,startTime,completed){
    this.name = name;
    this.absoluteW = weight;
    this.relativeW = 0;
    this.startT = startTime;
    this.completed = completed;
    this.length = 0;
    if (this.completed == "true"){
      // set up color
      if (this.absoluteW == 1){
        this.color = color('#9856CA');
      } else if(this.absoluteW == 2){
        this.color = color('#2096F3');
      } else if (this.absoluteW == 3){
        this.color = color('#00BCD4');
      } else if (this.absoluteW == 4){
        this.color = color('#FFC105');
      } else {
        this.color = color('#FF5005');
      }
    }else {
      if (this.absoluteW == 1){
        this.color = color('#E5D5F2');
      } else if(this.absoluteW == 2){
        this.color = color('#C7E5FC');
      } else if (this.absoluteW == 3){
        this.color = color('#BFEEF4');
      } else if (this.absoluteW == 4){
        this.color = color('#FFEFC0');
      } else {
        this.color = color('#FFD3C0');
      }
    }
  }
  update(totalW){
    this.relativeW = this.absoluteW/totalW;
    this.length = PI*2*this.relativeW;
  }
  draw(startA){
    noFill();
    stroke(this.color);
    strokeWeight(10);
    for(var i = 0; i < 50; i=i+2){
      arc(centerX,centerY,outerR-2*i,outerR-2*i,startA,startA+this.length-3*gap);
    }
  }
  drawText(startA){
    var arc = innerR*2*PI*startA/(2*PI);
    for (var i=0; i < this.name.length; i++){
      var char = this.name.charAt(i);
      var w = textWidth(char);
      arc = arc + w;
      var theta = arc/(innerR);
      push();
      translate(centerX+(innerR)*Math.cos(theta), centerY+(innerR)*Math.sin(theta));
      rotate(theta+PI/2);
      fill(0,0,0,100);
      noStroke();
      textSize(20);
      text(char,0,0);
      pop();
      arc += w;
    }
  }
}
