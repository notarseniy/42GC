$(document).ready(function () {
	$('#copysurl').zclip({
		path: '/js/ZeroClipboard.swf',
		copy: function () {
			return 'http://4gc.me/' + $('a#surl').html();
		}
	});
});
