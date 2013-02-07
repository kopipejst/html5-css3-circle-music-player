$(document).ready(function() {

    var player = $('#player').get(0),
        playlistPosition = 0;

    PLAYLIST = [];

    //player.setAttribute('src', playlist[playlistPosition].url);
    player.volume = "0.8";

    $('.action').toggle(function() {
		play();
    }, function() {
		pause();
    });



    function play () {
        player.play();
        $('.icon-play').hide();
        $('.icon-pause').show();
        $('.controls').addClass('active');
    }

    function pause () {
        player.pause();
        $('.icon-play').show();
        $('.icon-pause').hide();
    }


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


    $('.playlist-show').click(function() {
        $('.playlist-holder').show();
    });


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
		pause();
        playlistPosition++;
        if (playlistPosition >= PLAYLIST.length) {
            playlistPosition = 0;
        }
        loadSong(playlistPosition);
        play();
    });


    $('#fileInput').change(function(e) {
        var files = e.target.files;
        var count = 0;
        $('.playlist').html('');

        PLAYLIST = [];
        for (var i in files) {
            if (files[i].name && files[i].name.indexOf('mp3') != -1) {
                //var text = files[i].webkitRelativePath.split("/");
                //text = text[text.length - 1].replace('.mp3','') + " - " + text[text.length - 2];
                //var text = files[i].name;
                var text = files[i].webkitRelativePath.replace(/\//g,' - ').replace('.mp3','');
                var li = $('<li />').data('id', count).text(text);
                $('.playlist').append(li);
                PLAYLIST.push(files[i]);
                count++;
            }
        }
        $('.playlist li:first').addClass('active');
        loadSong(0);
        play();

        var url = window.webkitURL.createObjectURL(files[0]);
        player.setAttribute('src', url);
        player.play();

    });

    $('.playlist').delegate('li', 'click', function() {
        var id = $(this).data('id');
        var file = PLAYLIST[id];
        $('.playlist li').removeClass('active');
        $(this).addClass('active');
        loadSong(id);
        play();
    });

    function loadSong (id) {
		var file = PLAYLIST[id];
		var url = window.webkitURL.createObjectURL(file);
		player.setAttribute('src', url);
    }


});

