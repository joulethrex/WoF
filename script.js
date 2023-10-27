var categories = [];
var startAngle = 0;
var arc = Math.PI / 6; // You can change number of segments based on how many categories you want by default
var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;

document.addEventListener('DOMContentLoaded', function() {
  drawWheel();
});

function drawWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = '16px Helvetica, Arial';

    for (var i = 0; i < categories.length; i++) {
      var angle = startAngle + i * arc;

      // Draw the segments
      ctx.fillStyle = (i % 2 == 0) ? "#ffd700" : "#ff8c00"; // Alternate colors
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      // Draw the text
      ctx.fillStyle = "black";
      ctx.save();
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = categories[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
  }
}

function spinWheel() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000; // Random spin time
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 30px Helvetica, Arial';
  var text = categories[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
  document.getElementById("result").textContent = "Result: " + text;
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

function addCategory() {
  var newCategoryInput = document.getElementById("newCategory");
  var newCategory = newCategoryInput.value.trim();
  if (newCategory) {
    categories.push(newCategory);
    newCategoryInput.value = '';
    newCategoryInput.focus();
    arc = 2 * Math.PI / categories.length; // Recalculate the arc based on the number of categories
    drawWheel();
  } else {
    alert("Enter a category");
  }
}
