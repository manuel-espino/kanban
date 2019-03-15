
/////////////////////////  CREATING A POSTIT ///////////////////////////////

//Array to save all postit
var $todoPostIt = [];

var $id = 1;



interface Developer{
	mytoString():string;
	myEquals(b:PostIt):boolean;
}

//Function to create Postit Object
class PostIt implements Developer{

	id:number;
	accion:string;
	color:string;
	peso:number;
	estado:string;

	public constructor($id_:number, $accion_:string, $peso_:number=1, $color_:string='yellow', $estado_:string){
		this.id = $id_;
		this.accion = $accion_;
		this.color = $color_;
		this.peso = $peso_;
		this.estado = $estado_;

		creaPostIt_vista(this.id, this.accion, this.peso, this.color);
		$id=this.id;
		$id++; //Increment global variable to change the id of created elements.
	}
	public myEquals(b:PostIt):boolean{
		return (<any>Object).is(this, b);
	}

	public mytoString():string{
		return this.id + ", " + this.accion + ", " + this.color + ", " + this.peso + ", " + this.estado;
	}

}



//Creación dinámica de los elementos Post It
let creaPostIt_vista = ($id_:number, $accion_:string, $peso_:number, $color_:string) => {

	let $id:number = $id_;
	let $accion:string = $accion_;
	let $peso:number = $peso_;
	let $color:string = $color_;

	let $nuevo = `
	<div class="postIt ${$color} ui-draggable ui-draggable-handle" id="${$id}">
	<small class="eliminar-postit">x</small>
	<p class="accion-postit">${$accion}</p>
	<p><span class="peso-circulo peso-postit">${$peso}</span></p>
	</div>`;

	$('#target-postIt-nuevos').append($nuevo);

	$('.postIt').draggable({
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


let getPostIt = $id_ => {
	for (var i = 0; i < $todoPostIt.length; i++) {
		if($todoPostIt[i].id == $id_){
			return $todoPostIt[i];
		}
	}
}

let setPostIt = $p => {
	$p.id = Number($('#id-modificar').val());
	$p.accion = $('#accion-modificar').val();
	$p.peso = $('#peso-modificar').val();
	$p.color =  $('#postIt-form-modifica-campos').attr("class");
	$p.estado = $("input[name='estado']:checked").val();
};




let removePostIt = $id_ => {
	let $bandera = false;
	for (let i = 0; i < $todoPostIt.length && !$bandera; i++) {
		if($todoPostIt[i].id == $id_){
			$todoPostIt.splice(i,1);
			$bandera = true;
		}
	}
}

let modificaPostIt_vista = $p => {
	$("#" + $p.id + " .accion-postit").text($p.accion);
	$("#" + $p.id + " .peso-postit").text($p.peso);
	$("#" + $p.id).removeClass("yellow").removeClass("green").removeClass("red").addClass($p.color);
}


let  rellenaFormularioModificacion = $id_ => {

	//Buscamos en tabla que almacena todos postit
	let $p = getPostIt($id_);

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

	////////SAVE

	//Ajax function to save ALL the actions in DB (through Php files)
	let saveAllPostItInDB = () =>  $.ajax({
			type: 'POST',
			url: 'php/Controller.php',
			data: {postit: $todoPostIt},
			dataType: 'json',
			success: function(data){
				alert("You've saved ALL!");
			},
			error: function( data ){
				alert("ERROR");
			}
		});

	////////DELETE

	//Ajax function that DELETE ONE action in DB (through Php files)
	// Triggered by:  $('#trash-icon').droppable({stop:...});
	let  deletaPostItDB = $id_ => {

		let $p = getPostIt($id_);

		return $.ajax({
			type: 'POST',
			url: 'php/Controller.php',
			data: {deleteOne : $p },
			dataType: 'json',
			success: function(data){
			},
			error: function( data ){
				alert("ERROR");
			}
		});
	}
