var briDelay;
function brightnessRotateDelay(pickColorIds, newBrightness, settingTransitionTime) {
  clearTimeout(briDelay);
  briDelay = setTimeout(function(){ hueLightSetBrightness(pickColorIds, newBrightness, settingTransitionTime); }, 300);
}

function tizenBackButton() {
  if ($(".modal").is(":visible")) {
    if ($("#brightness-picker-modal").is(":visible")) {
      hueLightsGet();
      hueGroupsGet();
    }
    $(".modal").hide();
  } else if ($(".hue-tabs").is(":visible")) {
    try { tizen.application.getCurrentApplication().exit(); } catch (ignore) {}
  } else {
    $(".hue-tabs").show();
  }
}


var SCROLL_STEP = 200;
var SCROLL_TIME = 150;

function tizenRotate(direction) {
  if ($(".modal").is(":visible")) {
    if ($("#brightness-picker-modal").is(":visible")) {
//        setBrightness(pickColorIds, bri

      if (direction == "cw") {
        if (brightnessPickerBar.value > 95) {
          brightnessPickerBar.value = 95;
        } else if (brightnessPickerBar.value == 1) {
          brightnessPickerBar.value = 0;
        }

        newBrightness = (brightnessPickerBar.value + 5) * 2.54;
        brightnessPickerBar.set(brightnessPickerBar.value + 5, false);
      } else if (direction == "ccw") {
        if (brightnessPickerBar.value < 6) {
          brightnessPickerBar.value = 6;
        }
        newBrightness = (brightnessPickerBar.value - 5) * 2.54;
        brightnessPickerBar.set(brightnessPickerBar.value - 5, false);
      }

      newBrightness = Math.round(newBrightness);

      console.log(newBrightness);

      if (pickColorMode == "light") {
        pickColorIds = [pickColorIds];
      }
      brightnessRotateDelay(pickColorIds, newBrightness, settingTransitionTime);
//      hueLightSetBrightness(pickColorIds, newBrightness, settingTransitionTime);
//      setBrightness(pickColorIds, newBrightness);

    }
//pickColorIds
//brightnessPickerBar.value
  } else if (currentScrollType == "light" || currentScrollType == "group") {
    if (direction == "cw") {
      scrollBy(1);
    } else if (direction == "ccw") {
      scrollBy(-1);
    }
  } else {
    if (direction == "cw") {
      scrollByAnimated(SCROLL_STEP, SCROLL_TIME);
    } else if (direction == "ccw") {
      scrollByAnimated(-SCROLL_STEP, SCROLL_TIME);
    }
  }
}


// simulate tizen events
if (window.location.hash = "#watch") {
  document.onkeydown = function (e) {
    switch (e.key) {
        case 'Backspace':
            tizenBackButton();
            break;
        case 'ArrowLeft':
            tizenRotate("ccw");
            break;
        case 'ArrowRight':
            tizenRotate("cw");
    }
  };
}



// add eventListener for tizenhwkey
document.addEventListener('tizenhwkey', function(e) {
  if (e.keyName == "back") {
    tizenBackButton();
  }
});


document.addEventListener('rotarydetent', function(ev) {
    var direction = ev.detail.direction;
    if (direction == 'CW') {
        //window.scrollBy(0,SCROLL_STEP);
        tizenRotate("cw");
    } else if (direction == 'CCW') {
        tizenRotate("ccw");
    }
});


scrollByAnimated = function(scrollY, duration){
	  //gist here https://gist.github.com/loadedsith/857540fd76fe9c0609c7
	  var startTime = new Date().getTime();

	  var startY = window.scrollY;
	  var endY = startY + scrollY;
	  var currentY = startY;
	  var directionY = scrollY > 0 ? 'down' : 'up';

	  var animationComplete;
	  var count = 0;

	  var animationId;

	  if(duration === undefined){
	    duration = 250;//ms
	  }

	  //grab scroll events from the browser
	  var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

	  //stop the current animation if its still going on an input from the user
	  var cancelAnimation = function () {
	    if(animationId!==undefined){
	      window.cancelAnimationFrame(animationId)
	      animationId=undefined;
	    }

	  }

	  if (document.attachEvent) {
	    //if IE (and Opera depending on user setting)
	    document.attachEvent("on"+mousewheelevt, cancelAnimation)
	  } else if (document.addEventListener) {
	    //WC3 browsers
	    document.addEventListener(mousewheelevt, cancelAnimation, false)
	  }

	  var step = function (a,b,c) {
	    var now = new Date().getTime();
	    var completeness = (now - startTime) / duration;
	    window.scrollTo(0, Math.round(startY + completeness * scrollY));
	    currentY = window.scrollY;
	    if(directionY === 'up') {
	      if (currentY === 0){
	        animationComplete = true;
	      }else{
	        animationComplete = currentY<=endY;
	      }
	    } 
	    if(directionY === 'down') {
	      /*limitY is cross browser, we want the largest of these values*/ 
	      var limitY = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
	      if(currentY + window.innerHeight === limitY){
	        animationComplete = true;
	      }else{
	        animationComplete = currentY>=endY;
	      }
	    } 

	    if(animationComplete===true){
	      /*Stop animation*/
	      return;
	    }else{
	      /*repeat animation*/
	      if(count > 500){
	        return;
	      }else{
	        count++;
	        animationId = window.requestAnimationFrame(step);
	      }

	    }
	  };
	  /*start animation*/  
	  step();
};

//$(".hue-tabs").removeClass("tabs");

var currentScrollType = "none";
var currentScrollN = 0;
function scrollToElement(type, n) {
  currentScrollType = type;
  currentScrollN = n;
  $([document.documentElement, document.body]).animate({
    scrollTop: $(".hue" + type + "-n" + n).offset().top
  }, 200);
  console.log(currentScrollType + ", " + currentScrollN);
}

function scrollBy(n) {
  if ( $(".hue" + currentScrollType + "-n" + (currentScrollN + n)).length ) {
    scrollToElement(currentScrollType, currentScrollN + n);
  }
}

function watchGroupsBtn() {
  console.log("groups");
  $('#hue .lights-container').hide();
  $('#hue .groups-container').show();
  $(".hue-tabs").hide();
  scrollToElement("group", 1);
}
function watchLightsBtn() {
  console.log("lights");
  $('#hue .groups-container').hide();
  $('#hue .lights-container').show();
  $(".hue-tabs").hide();
  scrollToElement("light", 1);
}

$(".hue-tabs").html("<div><p style='text-align: center; margin: 30px 0px 20px 0px; color: #aaa;'>Hue Control</p><a id='watch-groups-btn'><span class='icon'><i class='fas fa-cubes' aria-hidden='true'></i></span><span>Groups</span></a><br><a id='watch-lights-btn'><span class='icon'><i class='fas fa-lightbulb' aria-hidden='true'></i></span><span>Lights</span></a></div>");
document.getElementById("watch-groups-btn").addEventListener("click", watchGroupsBtn);
document.getElementById("watch-lights-btn").addEventListener("click", watchLightsBtn);

