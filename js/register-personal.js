
$('document').ready(function(){

	///////////////// VALIDATION FORMS //////////////////////
	$('#register').validate({
		rules: {
			'reg-user':{required:true, minlength:6, pattern:/^[a-zA-Z]{6,20}$/},
			'reg-pass':{required:true, minlength:8, pattern:/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/},
			'reg-email':{email:true, required:true},
			'reg-web':{url:true},
			'reg-selector':{required:true}
		},
		messages:{
			'reg-user':{required:'C\'mon! We need your username!', minlength:'No numbers and at least 6 letters.', pattern:'Numbers are not allowed. Min 6 and max 20 letters.'},
			'reg-pass':{required:'You need a password, for sure!', minlength:'At least 6 characters.', pattern:'Min 8 / max 16 characters. At least: 1 number, 1 lowercase and 1 uppercase letters. No special characters.'},
			'reg-email':{email:'That doesn\'nt seems an email.', required:'An email is mandatory.'},
			'reg-web':{url:'That doesn\'nt seems an email.'},
			'reg-selector':{required:'At least one item have to be selected.'}

		},
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		}
	});

	$('#btn-login').click(function(){
		$userName = $('#reg-user').val();
		$password = $('#reg-pass').val();
		var parametros = {userLogin: "yes", userName: $userName, password: $password};
		var archivo = 'php/Controller.php';

		$.ajax({
			type:"POST",
			url: archivo,
			data: parametros,
			success: function(datos)
			{
				if(datos=="yes"){
					sessionStorage.userName = $userName;
					window.location = "khanban.html";

				}else{
					alert("NO WAY! Incorrect login. Try again o sing up!");
				}
			}
		});
	});

	$('#btn-register').click(function(e){
			e.preventDefault();
		if($('#register').valid()){

			$userName = $('#reg-user').val();
			$password = $('#reg-pass').val();
			var parametros = {register: "yes", userName: $userName, password: $password};
			var archivo = 'php/Controller.php';

			$.ajax({
				type:"POST",
				url: archivo,
				data: parametros,
				success: function(datos)
				{
					sessionStorage.userName = $userName;
					window.location = "khanban.html";
				},
				error: function(){
					alert("error");
				}
			});


		};

	})

});
