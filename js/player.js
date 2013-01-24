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
	});

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

