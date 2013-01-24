$(document).ready( function () {
	var player = $('#player').get(0);
		player.setAttribute('src', playlist[0].url);
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

});

		var playlist = [
				{ "title": "Die Antwoord - I Fink U Freeky",
					"url": "audio/02 I Fink U Freeky.mp3"
				},
				{ "title": "Everlast - White Trash Beautiful",
					"url": "audio/03 White Trash Beautiful.mp3"
				}

			];

