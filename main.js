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


const lineInfo = getSVGPointInfo(pathGround, -500);
svgBike.style.transform = `translate(${lineInfo.x|0}px, ${lineInfo.y|0}px) rotate(${lineInfo.angle|0}deg)`;


elWrap.addEventListener('wheel', scrollHandler);

let scroll = 0;

function render() {
    //scroll = (scroll + 8) % (document.body.offsetWidth + 400);



    elScroll.style.transform = `translate(${ -scroll }px)`;
    svgMountain3.style.transform = `translate(${ scroll * 3 / 4 }px)`;
    svgMountain2.style.transform = `translate(${ scroll / 2 }px)`;
    svgMountain1.style.transform = `translate(${ scroll / 3 }px)`;

    svgSun1.style.transform = `translate(${ scroll * 5 / 6 }px)`;
    svgSun2.style.transform = `translate(${ scroll * 5 / 6 }px)`;

    const lineInfo = getSVGPointInfo(pathGround, scroll-800);

    svgBike.style.transform = `translate(${lineInfo.x|0}px, ${lineInfo.y|0}px) rotate(${lineInfo.angle|0}deg)`;

    requestAnimationFrame(render);
}
render();


function scrollHandler(e) {

    if (e.deltaY > 0) {
        scroll = Math.max(0, scroll + 70);
    }
    else {
        scroll = Math.max(0, scroll - 70);
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