$(document).ready( function () {
	var player = $('#player').get(0);
		player.setAttribute('src', playlist[1].url);
		player.volume= "0.8";

	$('.play').toggle ( function () {
							player.play();
						},
						function () {
							player.pause();
						}
					);


	$('#volume').change ( function () {
		player.volume = $(this).val();
		$(this).data('val', $(this).val());
		if ( player.volume === 0 ) {
			mute();
		} else {
			unmute();
		}
	});

	$('#mute').click ( function () {
		if ( player.volume === 0 ) {
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


	function mute () {
		$('#mute').removeClass('normal').addClass('mute');
	}

	function unmute () {
		$('#mute').removeClass('mute').addClass('normal');
	}	

	$('#position').change ( function () {
		var position = player.duration * $(this).val() / 100;
		player.currentTime = position;
	});

	player.addEventListener('timeupdate', function(evt) {
		var played = player.currentTime / player.duration * 100;
		$("#played").css("width", played + "%");
		$("#position").val(played);
	});

	player.addEventListener('progress', function(evt) {
		var loaded = player.buffered.end(0) / player.duration * 100;
		$("#loaded").css("width", loaded + "%");
	});

});

		var playlist = [
				{ "title": "Die Antwoord - I Fink U Freeky",
					"url": "audio/02 I Fink U Freeky.mp3"
				},
				{ "title": "Everlast - White Trash Beautiful",
					"url": "http://workshop.rs/projects/roundplayer/03%20White%20Trash%20Beautiful.mp3"
				}

			];

