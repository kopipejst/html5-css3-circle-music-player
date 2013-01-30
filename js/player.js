$(document).ready(function() {

    var player = $('#player').get(0),
        playlistPosition = 0;


    player.setAttribute('src', playlist[playlistPosition].url);
    player.volume = "0.8";

    $('.action').toggle(function() {
        player.play();
    }, function() {
        player.pause();
    });


    $('.volume-show').click(function() {
        $('.volume-holder').show();
    });

    $('#volume').change(function() {
        player.volume = $(this).val();
        $(this).data('val', $(this).val());
        if (player.volume === 0) {
            mute();
        } else {
            unmute();
        }
    });

    $('.volume-show').mouseover(function() {
        $('.volume-holder').show();
        //clearTimeout(t);
    });

    $('.volume-holder').mouseleave(function() {
        //t = setTimeout( function () {
        $('.volume-holder').hide();
        //}, 2000);
    });

    $('#mute').click(function() {
        if (player.volume === 0) {
            unmute();
            var previousVolume = $('#volume').data('val');
            if (previousVolume == 0 || !previousVolume) {
                $('#volume').data('val', '0.8');
            }
            player.volume = $('#volume').data('val');
            $('#volume').val(player.volume);
        } else {
            mute();
            $('#volume').val(0);
            player.volume = 0;
        }
    });


    function mute() {
        $('#mute').removeClass('normal').addClass('mute');
    }

    function unmute() {
        $('#mute').removeClass('mute').addClass('normal');
    }

    $('#position').change(function() {
        var position = player.duration * $(this).val() / 100;
        player.currentTime = position;
    });

    player.addEventListener('timeupdate', function(evt) {
        var played = player.currentTime / player.duration * 100;
        $("#played").css("width", played + "%");
        $("#position").val(played);
    });

    player.addEventListener('progress', function(evt) {
        try {
            var loaded = player.buffered.end(0) / player.duration * 100;
            $("#loaded").css("width", loaded + "%");
        } catch (e) {
            console.log('buffer error');
        }
    });

    player.addEventListener('ended', function(evt) {
        playlistPosition++;
        if (playlistPosition >= playlist.length) {
            playlistPosition = 0;
        }
        player.setAttribute('src', playlist[playlistPosition].url);
        player.play();
    });


    $('#fileInput').change(function(e) {
        FILES = e.target.files;
        for (var i in FILES) {
            var li = $('<li />').data('id', i).text(FILES[i].name);
            $('.playlist').append(li);
        }
        var url = window.webkitURL.createObjectURL(FILES[0]);
        player.setAttribute('src', url);
        player.play();

    });

    $('.playlist').delegate('li', 'click', function() {
        var id = $(this).data('id');
        var file = FILES[id];
        $('.playlist li').removeClass('active');
        $(this).addClass('active');
        var url = window.webkitURL.createObjectURL(file);
        player.setAttribute('src', url);
        player.play();
    });



});


var playlist = [{
    "title": "Die Antwoord - I Fink U Freeky",
    "url": "audio/02 I Fink U Freeky.mp3"
}, {
    "title": "Everlast - White Trash Beautiful",
    "url": "http://workshop.rs/projects/roundplayer/03%20White%20Trash%20Beautiful.mp3"
}

];