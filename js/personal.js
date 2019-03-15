
$('document').ready(function(){

	$userName = sessionStorage.userName;

	$('#userName').text($userName);


	$('#exit-icon').click(function(){
		sessionStorage.userName=null;
		window.location = "index.html";

	});
	var $from = new Date();
	var $to = new Date();

	/////////////////////////  CREATING A POSTIT ///////////////////////////////
	//Load JS file created using TypeScript / EcmaScript 6
	$.getScript("js/TypeEcma6.js", function(){

	});

	///////////////////// Persistence DDBB - AJAX functions ////////////////////////////
	// The persistence functions have been dissociete of button events, despite their tight relation, in order to be enable for further uses.

	////////LOAD
	//Icon event that trigger the LOAD process of saved actions from DB
	$('#load-icon').click(function(){
		if($todoPostIt.length>=1){
			alert("You cannot load saved actions because you've creater new elements.")
		}else{
			getAllPostItFromDB();
		}
	});


	//Ajax function that request data to DB (through Php files)
	function getAllPostItFromDB(){
		return $.ajax({
			type: 'POST',
			url: 'php/Controller.php',
			data: {getAll: true, user: $userName},
			datatype: 'json',
			success: function(data){
				$p = JSON.parse(data);
				setPostItFromDB($p);
			},
			error: function($data){
				alert("ERROR");
			}
		});
	}


	//Create the action, insert them in the array and in the canvas.
	function setPostItFromDB($p){
		r=0;
		$.each($p, function( i, value ){
			$todoPostIt.push(new PostIt(value.id, value.accion, value.peso, value.color, value.estado));

			$( "#"+value.id).position({
				my: "left top",
				at: "left+50 top+"+ (r+=100),
				of: "#"+value.estado
			});
		});
	}

	////////SAVE

	//Icon event that trigger the SAVE process of saved actions from DB
	$('#save-icon').click(function(){
		if($todoPostIt.length<1){
			$("#save-advise").dialog( "open" );
		}else{
			saveAllPostItInDB();
		}
	});


	///////////////// VALIDATION FORMS //////////////////////

	$('#form-crear').validate({
		messages: {},
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertBefore(element);
			}
		}
	});

	$('#postIt-form-modifica').validate({
		messages: {},
		errorPlacement: function(error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		}
	});

	/////////////////////////////////////////////////////////////////////////////////////

	//Acción del botón + (crear nuevo postit) desencadena creación
	$("#form-crear").submit(function(){
		//Si no hay errores detectados por Validate()
		if($('#form-crear').valid()){
			//Captura texto del formulario de creación de postIt
			$accion =  $('#accion_insertar').val();
			$peso =  $('#peso-insertar').val();
			//Creación de nuevo objeto + inclusión en tabla
			//Por defecto todos los elementos se crean amarillos y con estado "to do", "por hacer"
			$todoPostIt.push(new PostIt($id, $accion, $peso, "yellow", "todo", $userName));

			//$pendientes++
			//$progreso= (($id-$restantes)*100)/$id;
			//progress($progreso);
			$("#form-crear").trigger("reset");
		}
	});


	$("#trash-advise").dialog({
		autoOpen: false,
		show: {
			effect: "blind",
			duration: 500
		},
		hide: {
			effect: "blind",
			duration: 500
		}
	});

	$('#trash-icon').click(function(){
		$('#trash-advise').dialog("open");
	});


	$( "#save-advise" ).dialog({
		autoOpen: false,
		show: {
			effect: "blind",
			duration: 500
		},
		hide: {
			effect: "blind",
			duration: 500
		}
	});

	/////////////////////////// CONTEXT MENU - library ///////////////////////////

	$.contextMenu({
		selector: '.postIt',
		trigger: 'right',
		callback: function(key, options) {
			$id_ = $(this).attr("id");

			if(key == "copy"){
				duplicarPostIt($id_);
			}else{
				$(this).remove();
				removePostIt($id_);
			}
		},
		items: {
			"copy": {name: "copy", icon: "copy"},
			"delete": {name: "Delete", icon: "delete"},
		}
	});

	function duplicarPostIt($id_){
		$p = getPostIt($id_);

		$todoPostIt.push(new PostIt($id, $p.accion, $p.peso, $p.color, $p.estado));

	}



	$("#container-columnas").disableSelection();

	//Permite borrar PostIt arrastrándolos sobre la papelera.
	$('#trash-icon').droppable({
		accept: ".postIt",
		drop: function(ev, ui){
			ui.draggable.remove();
			$id_ = ui.draggable.attr("id");
			deletaPostItDB($id_);
			removePostIt($id_);

		},
		over: function(event, ui){
			$(this).css("opacity", "0.3");
			$(this).css("transform", "rotate(20deg)");

		},
		deactivate: function(event, ui){
			$(this).css("opacity", "1");
			$(this).css("transform", "rotate(0deg)");
		}
	});


	//Tooltips con ayuda para entender cada sección y/o herramientas
	$('span').tooltip({
		show: null,
		position: {
			my: "left top",
			at: "left bottom"
		},
		open: function(event, ui ) {
			ui.tooltip.animate({
				top: ui.tooltip.position().top + 20 }, "slow" );
			},
			hide: {
				effect: "fold",
				delay: 250,
			}
		});

		//Permite cambiar el camaño de las columnas de estado
		$('.columna').resizable({
			helper: "ui-resizable-helper",
			animate: true,
			maxHeight: 1800,
			minHeight: 250,
			cancel: ".tools" //No permite cambiar tamaño en columna de herramientas
		});

		//Permite que las columnas de estado reciban postit y estos pueden cambiar su estado interno

		$( ".columna" ).droppable({
			drop: function( event, ui ) {

				$status = $(this).attr("id");

				$id_ = ui.draggable.attr("id");
				modifyStatus($id_, $status);
			}

		});

		function modifyStatus($id_, $status){

			if($status == "todo" || $status == "progress" || $status == "done"){
				$p = getPostIt($id_);
				$p.estado= $status;
			}
		}

		function setEstado($id_, $estado){
			$p = getPostIt($id_);
			$p.estado = $estado;
		}

		//Estilos aplicados con jQuery
		$('#titulo_web:first a').mouseover(function () {
			$('#arrow').css("color", "white");
		});

		$('#titulo_web').mouseout(function () {
			$('#arrow').css("color", "#404040");
		});

		$('#target-modifica-postIt').hide();


		///////////////////////// CAPTURA DE DATOS DEL POSTIT SELECCIONADO Y CARGA EN FORMULARIO ///////////////////////////////
		///AGREGACIÓN DE EVENTOS A ELEMENTOS CREADOS DINÁMICAMENTE
		//Añadir eventos con ON. En este caso se le añade a todos los elementos con clase postIt que estén contenidos en el elemento con el id "target-postIt-nuevos". Es necesario añadirlo con ON al ser elementos creados dinámicamente, a posterior de la caga del DOM.

		//Evento, doble click en un postit, desencadena carga de sus datos en el formulario de modificación
		$('#target-postIt-nuevos').on("dblclick", ".postIt",function(){

			//Accedemos a id del elemento
			$id_ = $(this).attr('id');

			//Reinicia las clase del formulario, por si se carga otro postit sin cerrar el anterior
			$('#postIt-form-modifica-campos').removeClass();

			//Relenamos formulario con datos extraidos
			rellenaFormularioModificacion($id_);
			//Mostrar formulario
			$('#target-modifica-postIt').fadeIn("slow");



		});

		//Eliminar PostIt mediante la X en cada uno de ellos
		$('#target-postIt-nuevos').on("click", ".eliminar-postit", function(){

			if(confirm("¿Quieres borrar la acción?")){
				//Eliminar graficamente
				$(this).parent().remove();
				//$restantes--;
				//$progreso= (($id-$restantes)*100)/$id;
				//progress($progreso);

				//Eliminar de la tabla
				$id_ = $(this).parent().attr("id");
				removePostIt($id_);
			}
		})

		///////////////////////// FORMULARIO MODIFICACIONES ///////////////////////////////
		//Al hacer clic en el botón guardar se llama a la función que persiste los datos en el array

		//Acción del botón + (crear nuevo postit) desencadena creación
		$("#postIt-form-modifica").submit(function(){
			//Si no hay errores detectados por Validate()
			if($('#postIt-form-modifica').valid()){
				$postIt = getPostIt($('#id-modificar').val());

				setPostIt($postIt);

				modificaPostIt_vista($postIt);

				$('#postIt-form-modifica-campos').removeClass();
				$("#form-crear").trigger("reset");

				$('#target-modifica-postIt').hide("bounce", { times: 1 }, "slow" );
			}
		});


		//Botones de modificación de colores
		$('.colores input[type=button]').click(function(){
			$padre = $(this).parent().parent().parent();
			$padre.attr("class","");
			$padre.addClass($(this).attr("class"));
		});


		$("#btn-cancelar-modificacion").click(function(){
			$('#postIt-form-modifica').trigger('reset');
			$('#postIt-form-modifica').validate();

			$('#postIt-form-modifica-campos').removeClass();
			$('#target-modifica-postIt').hide( "bounce", { times: 1 }, "slow" );
		});




		////////////////////////////// CALENDAR //////////////////////////
		$('#cal-icon').click(function(){
			$('#calendar').dialog('open');
		});

		$('#timing').click(function(){
			$('#cal-icon').trigger('click');
		});


		$('#btn-set-dates').click(function(){
			$from = $('#from').val();
			$to = $('#to').val();
			$('#from-text').text("").text($from).css("font-weight", "bolder");
			$('#to-text').text("").text($to).css("font-weight", "bolder");


			$('#calendar').dialog('close');
		});

		$(function() {
			var dateFormat = "dd/mm/yy",
			from = $( "#from" )
			.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 1
			})
			.on( "change", function() {
				to.datepicker( "option", "minDate", getDate( this ) );
			}),
			to = $( "#to" ).datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 1
			})
			.on( "change", function() {
				from.datepicker( "option", "maxDate", getDate( this ) );
			});

			function getDate( element ) {
				var date;
				try {
					date = $.datepicker.parseDate( dateFormat, element.value );
				} catch( error ) {
					date = null;
				}
				return date;
			}
		} );

		$("#calendar").dialog({
			autoOpen: false,
			show: {
				effect: "blind",
				duration: 500
			},
			hide: {
				effect: "blind",
				duration: 500
			}
		});


	});
