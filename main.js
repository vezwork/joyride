const pathStartOffset = 13400;
const maxBikeHeight = 1600;
const scrollSpeed = 100;
let cameraLeftOffset = 300;

// text stuff

const textEls = document.getElementsByClassName('story-text');
const keyFrameData = [{
    start: 0,
    end: 2000,
    bikePosition: 0.2
}, {
    start: 2000,
    end: 4000,
    bikePosition: 0.8
}, {
    start: 4000,
    end: 6000,
    bikePosition: 0.5
}, {
    start: 6000,
    end: 8000,
    bikePosition: 0.2
}, {
    start: 8000,
    end: 16000,
    bikePosition: 0.2
}];

function a(distance) {
    for (let i = 0; i < textEls.length; i++) {
        if (distance >= keyFrameData[i].start && distance < keyFrameData[i].end) {
            const previousKeyFrame = keyFrameData[Math.max(0, i-1)];
            const currentKeyFrame = keyFrameData[i];
            const nextKeyFrame = keyFrameData[Math.min(keyFrameData.length, i+1)];

            //fade in correct text
            textEls[i].style.opacity = 1;
            for (const textEl of textEls) {
                if (textEl !== textEls[i]) {
                    textEl.style.opacity = 0;
                }
            }

            //move bike to correct part of screen
            const leftKeyFrame  = (distance < getKeyFrameCenter(keyFrameData[i])) ? previousKeyFrame : currentKeyFrame;
            const rightKeyFrame = (distance < getKeyFrameCenter(keyFrameData[i])) ? currentKeyFrame : nextKeyFrame;

            const sectionSize = getKeyFrameCenter(rightKeyFrame) - getKeyFrameCenter(leftKeyFrame);
            
            let ratio = (distance - getKeyFrameCenter(leftKeyFrame)) / sectionSize;
            if (sectionSize === 0) {
                ratio = 0;
            }

            const tweenBikePosition = leftKeyFrame.bikePosition * (1 - ratio) + rightKeyFrame.bikePosition * ratio;
            cameraLeftOffset = window.innerWidth * tweenBikePosition;
        }
    }
}

function getKeyFrameCenter(keyframe) {
    return keyframe.start + (keyframe.end - keyframe.start) / 2;
}

// render stuff

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


const lineInfo = getSVGPointInfo(pathGround, 0);
svgBike.style.transform = `translate(${lineInfo.x|0}px, ${lineInfo.y|0}px) rotate(${lineInfo.angle|0}deg)`;


elWrap.addEventListener('wheel', scrollHandler);

let scroll = 0;

function render() {
    a(scroll);

    const lineInfo = getSVGPointInfo(pathGround, -scroll + pathStartOffset);
    const scrollOffset = lineInfo.x - cameraLeftOffset;

    if (lineInfo.y < maxBikeHeight) {
        elScroll.style.transform = `translate(${ -scrollOffset }px, ${ maxBikeHeight - lineInfo.y }px)`;
    }
    else {
        elScroll.style.transform = `translate(${ -scrollOffset }px)`;
    }

    
    svgMountain3.style.transform = `translate(${ scrollOffset * 3 / 4 }px)`;
    svgMountain2.style.transform = `translate(${ scrollOffset / 2 }px)`;
    svgMountain1.style.transform = `translate(${ scrollOffset / 3 }px)`;

    svgSun1.style.transform = `translate(${ scrollOffset * 5 / 6 }px)`;
    svgSun2.style.transform = `translate(${ scrollOffset * 5 / 6 }px)`;

    
    svgBike.style.transform = `translate(${lineInfo.x|0}px, ${lineInfo.y|0}px) rotate(${lineInfo.angle-180|0}deg)`;

    

    requestAnimationFrame(render);
}
render();


function scrollHandler(e) {
    if (e.deltaY > 0) {
        scroll = Math.max(0, scroll + scrollSpeed);
    }
    else {
        scroll = Math.max(0, scroll - scrollSpeed);
    }    
}


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
    console.log('loaded');
    elStoryTexture.style.opacity = 0.5;
});
imageBackground.src = 'https://s3.amazonaws.com/unode1/assets/5022/rAxcJUZQkG0vysxleCGB_gravel.png';