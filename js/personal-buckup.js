$('document').ready(function(){


	$('#target-postIt-nuevos').on("click", ".postIt",function(){

console.log($(this).position());


});






	$('#load-icon').click(function(){
		if($todoPostIt.length>=1){
			alert("No puede cargar los elementos guardados cuando ya ha creado nuevos.")
		}else{
			$p="";
			$.ajax({
				type: 'POST',
				url: 'php/Controller.php',
				data: {getAll: true},
				datatype: 'json',
				success: function(data){
					alert("SUCCESS");
					$p = JSON.parse(data);

					r=0;
					$.each( $p, function( i, value ){
						$todoPostIt.push(new PostIt(value.id, value.accion, value.peso, value.color, value.estado));

						$( "#"+value.id).position({
							my: "left top",
  							at: "left+50 top+"+ (r+=100),
  							of: "#"+value.estado
						  });
					});
				},
				error: function( data ){
					alert("ERROR");
				}
			});
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

	/////// GUARDAR TAREAS EN BASE DE DATOS ////////
	$('#save-icon').click(function(){
		if($todoPostIt.length<1){
			$("#save-advise").dialog( "open" );
		}else{
			$.ajax({
				type: 'POST',
				url: 'php/Controller.php',
				data: {postit: $todoPostIt},
				datatype: 'json',
				success: function(data){
					alert("SUCCESS");
				},
				error: function( data ){
					alert("ERROR");
				}
			});
		}
	});


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
		$id++;
	}

	function setEstado($id_, $estado){
		$p = getPostIt($id_);
		$p.estado = $estado;
	}

	$("#container-columnas").disableSelection();

	//Permite borrar PostIt arrastrándolos sobre la papelera.
	$('#trash').droppable({
		accept: ".postIt",
		drop: function(ev, ui){
			//ui.parent().remove();
			ui.draggable.remove();
			removePostIt(ui.draggable.attr("id"))

			//$restantes--;
			//$progreso= (($id-$restantes)*100)/$id;
			//progress($progreso);
		},
		over: function(event, ui){
			$(this).css("opacity", "0.2");
			$(this).css("transform", "rotate(25deg)");

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


		//Estilos aplicados con jQuery
		$('#titulo_web:first a').mouseover(function () {
			$('#arrow').css("color", "white");
		});

		$('#titulo_web').mouseout(function () {
			$('#arrow').css("color", "#404040");
		});

		$('#target-modifica-postIt').hide();


		///////////////////////// CREACIÓN DE POSTIT ///////////////////////////////
		//Función para crear los objetos PostIt
		function PostIt($id_, $accion_, $peso_, $color_, $estado_){
			this.id = $id_;
			this.accion = $accion_;
			this.color = $color_;
			this.peso = $peso_;
			this.estado = $estado_;

			creaPostIt_vista(this.id, this.accion, this.peso, this.color);
		};

		//Array que almacena todos los postit creados
		$todoPostIt = [];

		$id = 1;
		$pendientes= 0;
		$hechos= 0;
		$from = new Date();
		$to = new Date();

		//Acción del botón + (crear nuevo postit) desencadena creación
		$("#accion-btn-insertar").click(function(){
			//Captura texto del formulario de creación de postIt
			$accion =  $('#accion_insertar').val();
			$peso =  $('#peso-insertar').val();
			//Creación de nuevo objeto + inclusión en tabla
			//Por defecto todos los elementos se crean amarillos y con estado "to do", "por hacer"
			$todoPostIt.push(new PostIt($id, $accion, $peso, "yellow", "todo"));
			$id++;
			//$pendientes++
			//$progreso= (($id-$restantes)*100)/$id;
			//progress($progreso);
		});


		//Creación dinámica de los elementos Post It
		function creaPostIt_vista($id_, $accion_, $peso_, $color_){
			//Crear elemento
			if($color_ == null)$color_ = "yellow";
			var div = document.createElement('div');
			div.setAttribute('class', 'postIt '+ $color_);
			div.setAttribute('id', $id_);

			var parrafo1 = document.createElement('p');
			parrafo1.setAttribute('class', 'accion-postit');

			var eliminar = document.createElement('small');
			eliminar.setAttribute('class', 'eliminar-postit');
			var x = document.createTextNode("x");
			eliminar.appendChild(x);
			div.appendChild(eliminar);

			var accion = document.createTextNode($accion_);

			parrafo1.appendChild(accion);
			div.appendChild(parrafo1);

			var parrafo2 = document.createElement('p');
			//var texto2 = document.createTextNode(peso);
			parrafo2.innerHTML = "<span class='peso-circulo peso-postit'>"+ $peso_ + "</span>";

			//parrafo2.appendChild(texto2);
			div.appendChild(parrafo2);
			//Posicionar
			$('#target-postIt-nuevos').append(div);

			$('.postIt').draggable({
				preventCollision: true,
				cancel: '.tools',
				drag: function(){
					$(this).css("z-index", "1");
					$(this).css("opacity", "0.6");
					$(this).css("box-shadow", "20px 40px 36px -6px #777");
					$(this).css("transform", "skew(7deg, 7deg)");
					$(this).css("transform", "rotate(7deg)");
					$('.fase').css("background-color", "#eee");
				},
				stop: function(){
					$(this).css("box-shadow", "0 10px 6px -6px #777");
					$(this).css("z-index", "1");
					$(this).css("opacity", "1");
					$(this).css("transform", "skew(0,0)");
					$('.fase').css("background-color", "rgba(255,255,255,0.95)");
				}
			});
		};


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
		$("#accion-btn-modificar").click(function(){

			$postIt = getPostIt($('#id-modificar').val());

			setPostIt($postIt);

			modificaPostIt_vista($postIt);

			$('#postIt-form-modifica-campos').removeClass();

			$('#target-modifica-postIt').hide("bounce", { times: 1 }, "slow" );
		});


		//Botones de modificación de colores
		$('.colores input[type=button]').click(function(){
			$padre = $(this).parent().parent().parent();
			$padre.attr("class","");
			$padre.addClass($(this).attr("class"));
		});


		$("#btn-cancelar-modificacion").click(function(){
			$('#postIt-form-modifica-campos').removeClass();
			$('#target-modifica-postIt').hide( "bounce", { times: 1 }, "slow" );
		});


		function getPostIt($id_){
			for (var i = 0; i < $todoPostIt.length; i++) {
				if($todoPostIt[i].id == $id_){
					return $todoPostIt[i];
				}
			}
		}

		function setPostIt($p){
			$p.id = Number($('#id-modificar').val());
			$p.accion = $('#accion-modificar').val();
			$p.peso = $('#peso-modificar').val();
			$p.color =  $('#postIt-form-modifica-campos').attr("class");
			$p.estado = $("input[name='estado']:checked").val();
		};

		function modifyStatus($id_, $status){

			if($status == "todo" || $status == "progress" || $status == "done"){
				$p = getPostIt($id_);
				$p.estado= $status;
			}
		}
		function removePostIt($id_){
			$bandera = false;
			for (var i = 0; i < $todoPostIt.length && !$bandera; i++) {
				if($todoPostIt[i].id == $id_){
					$todoPostIt.splice(i,1);
					$bandera = true;
				}
			}
		}

		function modificaPostIt_vista($p){
			$("#" + $p.id + " .accion-postit").text($p.accion);
			$("#" + $p.id + " .peso-postit").text($p.peso);
			$("#" + $p.id).removeClass("yellow").removeClass("green").removeClass("red").addClass($p.color);
		}


		function rellenaFormularioModificacion($id_){

			//Buscamos en tabla que almacena todos postit
			$p = getPostIt($id_);

			$('#id-modificar').val($p["id"]);
			$('#accion-modificar').val($p["accion"]);
			$('#peso-modificar').val($p["peso"]);

			if($p["color"]=="yellow"){
				$('#postIt-form-modifica-campos').attr("class", "yellow");
			}else if($p["color"]=="green"){
				$('#postIt-form-modifica-campos').attr("class", "green");
			}else if($p["color"]=="red"){
				$('#postIt-form-modifica-campos').attr("class", "red");
			}

			//Contruccion del selector con los datos de la tabla
			$("#estado-" + $p['estado']).prop('checked', true);

		}
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

		////////////////////// PROGRESSBAR //////////////////////

		var progressbar = $( "#progressbar" ),
		progressLabel = $( ".progress-label" );

		progressbar.progressbar({
			value: false,
			change: function() {
				progressLabel.text( progressbar.progressbar( "value" ) + "%" );
			},
			complete: function() {
				progressLabel.text( "Complete!" );
			}
		});

		function progress($cantidad) {
			var val = progressbar.progressbar( "value" ) || 0;

			progressbar.progressbar( "value", $cantidad );
		}

	});
