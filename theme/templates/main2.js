const pathStartOffset = 13400;
const maxBikeHeight = 1600;
const scrollSpeed = 80;
let cameraLeftOffset = 300;

// text stuff

const textEls = document.getElementsByTagName('section');
const keyFrameData = [{ //start
    start: 0,
    end: 100,
    bikePosition: 0.2
}, { //climb 1
    start: 100,
    end: 1200,
    bikePosition: 0.4
}, { //climb 2
    start: 1200,
    end: 2300,
    bikePosition: 0.7
}, { //climb 3
    start: 2300,
    end: 3400,
    bikePosition: 0.8
}, { //climb 4
    start: 3400,
    end: 4500,
    bikePosition: 0.7
}, { //top of the hill
    start: 4500,
    end: 6000,
    bikePosition: 0.5
}, { //forest
    start: 6000,
    end: 7300,
    bikePosition: 0.2
}, { //plains 1
    start: 7300,
    end: 8600,
    bikePosition: 0.2
}, { //plains 2
    start: 8600,
    end: 9700,
    bikePosition: 0.2
}, { //video
    start: 9700,
    end: 11150,
    bikePosition: 0.3
}, { //end
    start: 11150,
    end: 11261,
    bikePosition: 0.4
}];

function handleKeyFrames(distance) {
    const {
        previousKeyFrame,
        currentKeyFrame,
        nextKeyFrame,
        i
    } = getCurrentKeyFrame(distance);

    //fade in stars and house on last section
    if (i === keyFrameData.length - 1) {
        if (svgHouseLight.style.opacity !== 1) {
            svgHouseLight.style.opacity = 1;

            svgStarz.style.opacity = 1;
        }
    } else {
        if (svgHouseLight.style.opacity !== 0) {
            svgHouseLight.style.opacity = 0;

            svgStarz.style.opacity = 0.1;
        }
    }

    //fade in header in 1st and last section
    if (i === 0 || i === keyFrameData.length - 1) {
        if (elHeader.style.display !== 'block') {
            elHeader.style.display = 'block';
        }
    } else {
        if (elHeader.style.display !== 'none') {
            elHeader.style.display = 'none';
        }
    }

    //fade in correct text
    for (const textEl of textEls) {
        if (textEl.style.opacity !== 0) {
            textEl.style.visibility = 'hidden';
            textEl.style.opacity = 0;
        }
    }
    textEls[i].style.visibility = 'visible';
    textEls[i].style.opacity = 1;

    //move bike to correct part of screen
    const leftKeyFrame  = (distance < getKeyFrameCenter(currentKeyFrame)) ? previousKeyFrame : currentKeyFrame;
    const rightKeyFrame = (distance < getKeyFrameCenter(currentKeyFrame)) ? currentKeyFrame : nextKeyFrame;

    const sectionSize = getKeyFrameCenter(rightKeyFrame) - getKeyFrameCenter(leftKeyFrame);
    
    let ratio = (distance - getKeyFrameCenter(leftKeyFrame)) / sectionSize;
    if (sectionSize === 0) {
        ratio = 0;
    }

    const tweenBikePosition = leftKeyFrame.bikePosition * (1 - ratio) + rightKeyFrame.bikePosition * ratio;
    cameraLeftOffset = window.innerWidth * tweenBikePosition;
    
    return i;
}

function getCurrentKeyFrame(distance) {
    for (let i = textEls.length - 1; i >= 0; i--) {
        if (distance >= keyFrameData[i].start) {
            const previousKeyFrame = keyFrameData[Math.max(0, i-1)] || currentKeyFrame;
            const currentKeyFrame = keyFrameData[i];
            const nextKeyFrame = keyFrameData[Math.min(keyFrameData.length, i+1)] || currentKeyFrame;
            return {
                previousKeyFrame,
                currentKeyFrame,
                nextKeyFrame,
                i
            };
        }
    }
}

function getKeyFrameCenter(keyframe) {
    return keyframe.start + (keyframe.end - keyframe.start) / 2;
}

// render stuff
const elHeader = document.getElementById('story-header');

const elWrap = document.getElementsByClassName('story-container')[0];
const elScroll = document.getElementsByClassName('story-scroll-wrap')[0];

const svgRoad = document.getElementById('svg-road');
const pathGround = document.getElementById('path-road');
const pathGroundLength = pathGround.getTotalLength();

const svgMountain1 = document.getElementById('svg-mountain1');
const svgMountain2 = document.getElementById('svg-mountain2');
const svgMountain3 = document.getElementById('svg-mountain3');
const svgSun1 = document.getElementById('svg-sun1');
const svgSun2 = document.getElementById('svg-sun2');
const svgBike = document.getElementById('svg-bike');

const elLayerBack = document.getElementById('story-background-layer-back');
const elLayer1 = document.getElementById('story-background-layer-1');
const elLayer2 = document.getElementById('story-background-layer-2');
const elLayer3 = document.getElementById('story-background-layer-3');
const elLayerFront = document.getElementById('story-background-layer-front');

const svgHouseDark = document.getElementById('svg-house-dark');
const svgHouseLight = document.getElementById('svg-house-light');
const svgStarz = document.getElementById('svg-starz');

const lineInfo = getSVGPointInfo(pathGround, 0);
svgBike.style.transform = `translate(${lineInfo.x|0}px, ${lineInfo.y|0}px) rotate(${lineInfo.angle|0}deg)`;


document.addEventListener('keydown', e => {
    const {
        previousKeyFrame,
        nextKeyFrame
    } = getCurrentKeyFrame(scroll);

    if (e.key === 'ArrowRight') {
        scroll = getKeyFrameCenter(nextKeyFrame);
    }
    if (e.key === 'ArrowLeft') {
        scroll = getKeyFrameCenter(previousKeyFrame);
    }
});

/* experimental autotabbing between sections
window.addEventListener('focus', e => {
    const tabNextId = document.activeElement.getAttribute('data-tab-next-id');

    if (tabNextId !== null) {
        document.getElementById(tabNextId).focus();
    }
}, true);
*/

let mouseScrollDirection = 0;
elWrap.addEventListener('wheel', e => {
    if (e.deltaY > 0) {
        mouseScrollDirection = 1;
    }
    else {
        mouseScrollDirection = -1;
    }
});

let previousTouchX = null;
let previousTouchY = null;
elWrap.addEventListener('touchstart', e => {
    previousTouchX = null;
    previousTouchY = null;
});
elWrap.addEventListener('touchmove', e => {
    e.preventDefault();
    if (previousTouchX !== null) {
        if (Math.abs(previousTouchX - e.changedTouches[0].pageX) > Math.abs(previousTouchY - e.changedTouches[0].pageY)) {
            scroll = Math.max(0, scroll + (previousTouchX - e.changedTouches[0].pageX) * 4);
        } else {
            scroll = Math.max(0, scroll + (previousTouchY - e.changedTouches[0].pageY) * 4);
        }
        
    }

    previousTouchX = e.changedTouches[0].pageX;
    previousTouchY = e.changedTouches[0].pageY;
});

let scroll = 0;
let scrollReal = 0;

let curFrameTime = 0;
let prevFrameTime = 0;
function render() {
    prevFrameTime = curFrameTime;
    curFrameTime = performance.now();
    //time dependent scroll speed
    scroll = Math.max(0, scroll + mouseScrollDirection * Math.min(curFrameTime-prevFrameTime, 42) * 3);
    mouseScrollDirection = 0;
    //max scroll distance
    scroll = Math.min (scroll, keyFrameData[keyFrameData.length-1].end);
    //smooth scrolling
    scrollReal += (scroll - scrollReal) * 0.35;
    
    const i = handleKeyFrames(scrollReal);

    const lineInfo = getSVGPointInfo(pathGround, -scrollReal + pathStartOffset);
    const scrollOffset = lineInfo.x - cameraLeftOffset;

    let vertOffset = 0;

    if (lineInfo.y < maxBikeHeight) {
        vertOffset = maxBikeHeight - lineInfo.y;
    }
    elScroll.style.transform = `translate(${ -scrollOffset }px, ${ vertOffset }px)`;

    elLayerFront.style.transform = `translate(${ -scrollOffset / 3 }px)`;

    elLayer1.style.transform = `translate(${ scrollOffset / 3 }px)`;
    elLayer2.style.transform = `translate(${ scrollOffset / 2 }px, ${ -vertOffset/4 }px)`;
    elLayer3.style.transform = `translate(${ scrollOffset * 3 / 4 }px, ${ -vertOffset/2 }px)`;

    elLayerBack.style.transform = `translate(${ scrollOffset * 5 / 6 }px, ${ -vertOffset*3/4 }px)`;

    
    svgBike.style.transform = `translate(${lineInfo.x|0}px, ${lineInfo.y|0}px) rotate(${lineInfo.angle-180|0}deg)`;

    requestAnimationFrame(render);
}
render();





function getSVGPointInfo(svgEl, l=0) {
    const totalLength = svgEl.getTotalLength();
    const point = svgEl.getPointAtLength((totalLength - l) % totalLength);
    const point1 = svgEl.getPointAtLength((totalLength - l - 1) % totalLength);
    const point2 = svgEl.getPointAtLength((totalLength - l + 1) % totalLength);
    return {
        x: point.x,
        y: point.y,
        angle: Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI
    }
}



//image preloading

const elStoryTexture = document.getElementsByClassName('story-texture')[0];
const imageBackground = new Image();

imageBackground.addEventListener('load', e => {
    elStoryTexture.style.opacity = 0.5;
});
imageBackground.src = 'https://s3.amazonaws.com/unode1/assets/5022/rAxcJUZQkG0vysxleCGB_gravel.png';


//email validation
const buttonEmail = document.getElementById('mc-embedded-subscribe');
const inputEmail = document.getElementById('mce-EMAIL');
const EMAIL_REGEXP =
    /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

inputEmail.addEventListener('input', () => {
  console.log('a');
  buttonEmail.disabled = !EMAIL_REGEXP.test(inputEmail.value)
});