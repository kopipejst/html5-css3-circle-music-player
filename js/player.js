/**
 * Globals
 */
var PLAYER,
    PLAYLIST = [],
    SHUFFLE = false,
    REPEAT = false,
    CURRENT = 0;


/**
 * Rewinding functionality
 * @return {[type]} [description]
 */
function rewind() {
    var rewindStart = false,
        center,
        a,
        b,
        deg,
        degToPer,
        position;

    $('.player').mousedown(function (e) {
        e.preventDefault();
        rewindStart = true;
    });

    $('.player').mousemove(function (e) {
        if (rewindStart) {
            var offset = $('.player').offset();
            center = {
                top: offset.top + $('.player').outerHeight() / 2,
                left: offset.left + $('.player').outerWidth() / 2
            };

            a = center.left - e.pageX;
            b = center.top - e.pageY;

            deg = Math.atan2(a, b) * 180 / Math.PI;

            if (deg < 0) {
                deg = 360 + deg;
            }

            degToPer = 100 * (360 - deg) / 360;
            position = PLAYER.duration * degToPer / 100;

            PLAYER.currentTime = position;
        }
    });

    $(document).mouseup(function () {
        rewindStart = false;
    });
}


/**
 * Showing desktop notifications with message
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function notify(message) {
    if (!window.webkitNotifications) {
        return false;
    }
    if (window.webkitNotifications.checkPermission() === 0) {
        var notification = window.webkitNotifications.createNotification('', 'Round Player', message);
        notification.show();
        setTimeout(function () {
            notification.cancel();
        }, 5000);
    } else {
        window.webkitNotifications.requestPermission();
    }
}


/**
 * Parse song name from song file object
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function songName(file) {
    return file.webkitRelativePath.replace(/\//g, ' - ').replace('.mp3', '');
}


/**
 * After a few seconds of inactivity collapse player to initial look
 * @return {[type]} [description]
 */
function collapsePlayer() {
    var mousePosition = {},
        mousePositionOld = {},
        t;

    $(document).mousemove(function (e) {
        mousePosition.x = e.pageX;
        mousePosition.y = e.pageY;
    });

    t = setInterval(function () {
        if (mousePosition.x == mousePositionOld.x && mousePositionOld.y == mousePositionOld.y) {
            $('.playlist-holder').hide();
            $('.volume-holder').hide();
        } else {
            mousePosition.x = mousePositionOld.x;
            mousePosition.y = mousePositionOld.y;
        }
    }, 5000);
}


/**
 * Set progress indicator value
 * @param  {[type]} percent [description]
 * @return {[type]}         [description]
 */
function progress(percent) {
    var angle = percent * 360 / 100;

    $('.spinner').css('-webkit-transform', 'rotate(' + angle + 'deg)');
    if (percent > 50) {
        $('.filler').css('opacity', '1');
        $('.mask').css('opacity', '0');
    } else {
        $('.filler').css('opacity', '0');
        $('.mask').css('opacity', '1');
    }
}


/**
 * Load song from playlist
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function loadSong(id) {
    var file = PLAYLIST[id],
        url = window.webkitURL.createObjectURL(file);

    PLAYER.setAttribute('src', url);
    $('.playlist li').removeClass('active');
    $('.playlist li:nth-child(' + (parseInt(id) + 1) + ')').addClass('active');

    notify(songName(file));
}


/**
 * Play action
 * @return {[type]} [description]
 */
function play() {
    PLAYER.play();
    $('.icon-play').hide();
    $('.icon-pause').show();
}


/**
 * Pause action
 * @return {[type]} [description]
 */
function pause() {
    PLAYER.pause();
    $('.icon-play').show();
    $('.icon-pause').hide();
}


/**
 * Mute action
 * @return {[type]} [description]
 */
function mute() {
    $('#mute').removeClass('normal').addClass('mute');
}


/**
 * Unmute action
 * @return {[type]} [description]
 */
function unmute() {
    $('#mute').removeClass('mute').addClass('normal');
}


/**
 * Check if browser support webkitdirectory
 * @return {Boolean} [description]
 */
function isInputDirSupported() {
    var tmpInput = document.createElement('input');
    if ('webkitdirectory' in tmpInput) {
        return true;
    }
    return false;
}


$(document).ready(function () {

    if (!isInputDirSupported()) {
        $('.player-holder').hide();
        $('.not-supported').show();
        return false;
    }

    PLAYER = $('#player').get(0);

    PLAYER.volume = '0.8';

    $('.action').toggle(function (e) {
        play();
    }, function (e) {
        pause();
    });

    $('.action').hover(function () {
        $('.controls').addClass('active');
    });

    $('.volume-show').click(function () {
        $('.volume-holder').show();
    });

    $('#volume').change(function () {
        PLAYER.volume = $(this).val();
        $(this).data('val', $(this).val());
        if (player.volume === 0) {
            mute();
        } else {
            unmute();
        }
    });

    $('#mute').click(function () {
        if (PLAYER.volume === 0) {
            unmute();
            var previousVolume = $('#volume').data('val');
            if (previousVolume == 0 || !previousVolume) {
                $('#volume').data('val', '0.8');
            }
            PLAYER.volume = $('#volume').data('val');
            $('#volume').val(PLAYER.volume);
        } else {
            mute();
            $('#volume').val(0);
            PLAYER.volume = 0;
        }
    });

    $('.playlist-show').click(function () {
        $('.playlist-holder').show();
    });

    PLAYER.addEventListener('timeupdate', function (evt) {
        var played = PLAYER.currentTime / PLAYER.duration * 100;
        $('#played').css('width', played + '%');
        $('#position').val(played);
        progress(played);
    });

    PLAYER.addEventListener('progress', function (evt) {
        try {
            var loaded = PLAYER.buffered.end(0) / PLAYER.duration * 100;
            $('#loaded').css('width', loaded + '%');
        } catch (e) {
            console.log('buffer error');
        }
    });

    PLAYER.addEventListener('ended', function (evt) {

        pause();

        if (SHUFFLE) {
            CURRENT = parseInt(Math.random() * PLAYLIST.length + 1);
        } else {
            CURRENT++;
        }
        if (CURRENT >= PLAYLIST.length) {
            CURRENT = 0;
        }

        loadSong(CURRENT);
        play();

    });

    $('#fileInput').change(function (e) {
        var files = e.target.files,
            text = '',
            li = '',
            count = 0,
            i;

        $('.playlist').html('');

        PLAYLIST = [];

        for (i in files) {
            if (files[i].name && files[i].name.indexOf('mp3') != -1) {
                text = songName(files[i]);
                li = $('<li />').data('id', count).text(text);
                $('.playlist').append(li);
                PLAYLIST.push(files[i]);
                count++;
            }
        }

        loadSong(0);
        play();

    });

    $('.shuffle').toggle(function () {
        SHUFFLE = true;
        $(this).addClass('active');
    }, function () {
        SHUFFLE = false;
        $(this).removeClass('active');
    });

    $('.repeat').toggle(function () {
        REPEAT = true;
        $(this).addClass('active');
    }, function () {
        REPEAT = false;
        $(this).removeClass('active');
    });

    $('.playlist').delegate('li', 'click', function () {
        var id = $(this).data('id');
        loadSong(id);
        play();
    });

    rewind();
    collapsePlayer();

});