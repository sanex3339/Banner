var banner = document.getElementById('banner');

var bannerWidth = banner.offsetWidth;
var bannerHeight = banner.offsetHeight;
var bannerAspectRatio = bannerHeight / bannerWidth;

var elemXOffset = 0;
var elemYOffset = 0;

var timeout;
var timeoutValue = 300;

//detection scroll event after load event and orientationchange event on mobile devices
var is_load, is_orientationchange;

//Kostyl' for detecting mobile devices
function isMobile()
{
	return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//events
window.onload = load;
window.onresize = resize;
window.onscroll = scroll; 
window.onorientationchange = orientationchange; 

function load()
{
	is_load = true;
	elemTransform(banner);
}

function resize()
{
	elemXOffset = window.pageXOffset;
	elemYOffset = window.pageYOffset;

	if (!is_orientationchange) {
		if (!isMobile()) {
			if (timeout)
				clearTimeout(timeout);
			timeout = setTimeout(function()
			{
				banner.classList.add("banner-transition");
				elemTransform(banner);
			}, timeoutValue);
		} else {
			banner.classList.remove("banner-transition");
			elemTransform(banner);
		}
	}
}

function scroll()
{
	elemXOffset = window.pageXOffset;
	elemYOffset = window.pageYOffset;

	//transform banner after load event
	if (!is_orientationchange) {
		if (is_load) {
			elemTransform(banner);
			is_load = false;
		} else {
			//transfrorm banner on scroll
			if (timeout)
				clearTimeout(timeout);
			timeout = setTimeout(function()
			{
				banner.classList.add("banner-transition");
				elemTransform(banner);
			}, timeoutValue);
		}
	}
}

function orientationchange()
{
	is_orientationchange = true;

	banner.style.opacity = 0;
	banner.classList.remove("banner-transition");

	elemXOffset = window.pageXOffset;
	elemYOffset = window.pageYOffset;
	
	timeout = setTimeout(function()
	{	
		is_orientationchange = false;
		elemTransform(banner);
	}, timeoutValue);
}

//banner transformation
function elemTransform(elem)
{
	var viewportWidth = window.innerWidth;
	var viewportHeight = window.innerHeight;

	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;

	var coeffWidth = viewportWidth / width;
	var coeffHeight = viewportHeight / height;

	var elemNewWidth = (bannerWidth * coeffWidth);
	var elemNewHeight = (bannerHeight * coeffHeight);

	elemPosX = Math.round(elemXOffset + ((viewportWidth / 2) - (elemNewWidth / 2)));
	elemPosY = Math.round(elemYOffset + ((viewportHeight / 2) - (elemNewHeight / 2)));
	if ((elemPosY + (elemNewHeight/2)) > height)
		elemPosY = Math.round(height - elemNewHeight); //fix for banner under body after orientationchange
	elem.style.left = elemPosX + "px";
	elem.style.top = elemPosY + "px";

	//resize
	resizedWidth = Math.round(elemNewWidth);
	resizedHeight = resizedWidth * bannerAspectRatio;
	elem.style.width = resizedWidth + "px";
	elem.style.height = resizedHeight + "px";

	elem.style.opacity = 1;
}