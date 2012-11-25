Push = (json) ->
	socket = io.connect(window.BASE_URL)
	socket.emit('create', {content: json})
	socket.on('error', error_toast)
	socket.on('success_callback', success_toast)
success_toast = ->
	$('.toast-container').remove(); 
	$('.toast-container').toastmessage('showToast', {
    	text     : 'Slide(s) has been added successfully !!!',
    	sticky   : false,
    	type     : 'success',
    	position : 'top-center'
	});
error_toast = -> 
	$('.toast-container').remove(); 
	$('.toast-container').toastmessage('showToast', {
    	text     : 'Oops Something went wrong :(',
    	sticky   : false,
    	type     : 'error',
    	position : 'top-center'
	});
