/*
initialize
*/
var scrollDown = false;
var scrollUp = false;
var scroll = 0;
var $view = $('#view');
var l = 0;
var t = 0;
var w = $view.width();
var h = $view.height();
$view.find('.parallax').each(function () {
    var $moving = $(this);
    // position the next moving correctly
    if ($moving.hasClass('from-left')) {
        $moving.css('left', l - $moving.width());
    } else if ($moving.hasClass('from-right')) {
        $moving.css('left', w);
    } else if ($moving.hasClass('from-top')) {
        $moving.css('top', t - $moving.height());
    } else if ($moving.hasClass('from-bottom')) {
        $moving.css('top', h);
    }
    // make sure moving is visible
    $moving.css('z-index', 0);
});
var $moving = $view.find('.parallax:first');
$moving.css('z-index', 0);
/*
event handlers
*/
$(window).keydown(function (e) {
    if (e.which == 37 || e.which == 38) {
        // left or up
        scrollDown = false;
        scrollUp = true;;
    } else if (e.which == 39 || e.which == 40) {
        // right or down
        scrollUp = false;
        scrollDown = true;
    }
});
$(window).keyup(function (e) {
    if (e.which >= 37 && e.which <= 40) {
        // left, up, right, down
        scrollDown = false;
        scrollUp = false;
    }
});
var mousew = function (e) {
    var d = 0;
    if (!e) e = window.event;
    if (e.wheelDelta) {
        d = -e.wheelDelta / 120;
    } else if (e.detail) {
        d = e.detail / 3;
    }
    parallaxScroll(d);
}
if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', mousew, false);
}
window.onmousewheel = document.onmousewheel = mousew;

/*
parallax loop display loop
*/
window.setInterval(function () {
    if (scrollDown) parallaxScroll(4);
    else if (scrollUp) parallaxScroll(-4);
}, 50);

function parallaxScroll(scroll) {
    // current moving object
    var ml = $moving.position().left;
    var mt = $moving.position().top;
    var mw = $moving.width();
    var mh = $moving.height();
    // calc velocity
    var fromTop = false;
    var fromBottom = false;
    var fromLeft = false;
    var fromRight = false;
    var vLeft = 0;
    var vTop = 0;
    var pin = false;
    if ($moving.hasClass('from-top')) {
        vTop = scroll;
        fromTop = true;
    } else if ($moving.hasClass('from-bottom')) {
        vTop = -scroll;
        fromBottom = true;
    } else if ($moving.hasClass('from-left')) {
        vLeft = scroll;
        fromLeft = true;
    } else if ($moving.hasClass('from-right')) {
        vLeft = -scroll;
        fromRight = true;
    }  
    if ($moving.hasClass('pin')) {
        pin = true;
    }
    // calc new position
    var newLeft = ml + vLeft;
    var newTop = mt + vTop;
    // check bounds
    var finished = false;
    if (fromTop && (newTop > t || newTop + mh < t)) {
        finished = true;
        newTop = (scroll > 0 ? t : t - mh);
    } else if (fromBottom && (newTop < t || newTop > h)) {
        finished = true;
        newTop = (scroll > 0 ? t : t + h);
    } else if (fromLeft && (newLeft > l || newLeft + mw < l)) {
        finished = true;
        newLeft = (scroll > 0 ? l : l - mw);
    } else if (fromRight && (newLeft < l || newLeft > w)) {
        finished = true;
        newLeft = (scroll > 0 ? l : l + w);
    }
    // set new position
    $moving.css('left', newLeft);
    $moving.css('top', newTop);
    // if finished change moving object
    if (finished) {
        if (pin) {
            $moving.css('z-index', 999);
        }
        // get the next moving
        if (scroll > 0) {
            $moving = $moving.next('.parallax');
            if ($moving.length == 0) $moving = $view.find('.parallax:last');
        } else {
            $moving = $moving.prev('.parallax');
            if ($moving.length == 0) $moving = $view.find('.parallax:first');
        }
    }
    // for debug
    $('#direction').text(scroll + " " + l + "/" + t + " " + ml + "/" + mt + " " + finished + " " + $moving.text());
}