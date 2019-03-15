/////////////////////////  CREATING A POSTIT ///////////////////////////////
//Array to save all postit
var $todoPostIt = [];
var $id = 1;
//Function to create Postit Object
var PostIt = /** @class */ (function () {
    function PostIt($id_, $accion_, $peso_, $color_, $estado_) {
        if ($peso_ === void 0) { $peso_ = 1; }
        if ($color_ === void 0) { $color_ = 'yellow'; }
        this.id = $id_;
        this.accion = $accion_;
        this.color = $color_;
        this.peso = $peso_;
        this.estado = $estado_;
        creaPostIt_vista(this.id, this.accion, this.peso, this.color);
        $id = this.id;
        $id++; //Increment global variable to change the id of created elements.
    }
    PostIt.prototype.myEquals = function (b) {
        return Object.is(this, b);
    };
    PostIt.prototype.mytoString = function () {
        return this.id + ", " + this.accion + ", " + this.color + ", " + this.peso + ", " + this.estado;
    };
    return PostIt;
}());
//Creación dinámica de los elementos Post It
var creaPostIt_vista = function ($id_, $accion_, $peso_, $color_) {
    var $id = $id_;
    var $accion = $accion_;
    var $peso = $peso_;
    var $color = $color_;
    var $nuevo = "\n\t<div class=\"postIt " + $color + " ui-draggable ui-draggable-handle\" id=\"" + $id + "\">\n\t<small class=\"eliminar-postit\">x</small>\n\t<p class=\"accion-postit\">" + $accion + "</p>\n\t<p><span class=\"peso-circulo peso-postit\">" + $peso + "</span></p>\n\t</div>";
    $('#target-postIt-nuevos').append($nuevo);
    $('.postIt').draggable({
        cancel: '.tools',
        drag: function () {
            $(this).css("z-index", "1");
            $(this).css("opacity", "0.6");
            $(this).css("box-shadow", "20px 40px 36px -6px #777");
            $(this).css("transform", "skew(7deg, 7deg)");
            $(this).css("transform", "rotate(7deg)");
            $('.fase').css("background-color", "#eee");
        },
        stop: function () {
            $(this).css("box-shadow", "0 10px 6px -6px #777");
            $(this).css("z-index", "1");
            $(this).css("opacity", "1");
            $(this).css("transform", "skew(0,0)");
            $('.fase').css("background-color", "rgba(255,255,255,0.95)");
        }
    });
};
var getPostIt = function ($id_) {
    for (var i = 0; i < $todoPostIt.length; i++) {
        if ($todoPostIt[i].id == $id_) {
            return $todoPostIt[i];
        }
    }
};
var setPostIt = function ($p) {
    $p.id = Number($('#id-modificar').val());
    $p.accion = $('#accion-modificar').val();
    $p.peso = $('#peso-modificar').val();
    $p.color = $('#postIt-form-modifica-campos').attr("class");
    $p.estado = $("input[name='estado']:checked").val();
};
var removePostIt = function ($id_) {
    var $bandera = false;
    for (var i = 0; i < $todoPostIt.length && !$bandera; i++) {
        if ($todoPostIt[i].id == $id_) {
            $todoPostIt.splice(i, 1);
            $bandera = true;
        }
    }
};
var modificaPostIt_vista = function ($p) {
    $("#" + $p.id + " .accion-postit").text($p.accion);
    $("#" + $p.id + " .peso-postit").text($p.peso);
    $("#" + $p.id).removeClass("yellow").removeClass("green").removeClass("red").addClass($p.color);
};
var rellenaFormularioModificacion = function ($id_) {
    //Buscamos en tabla que almacena todos postit
    var $p = getPostIt($id_);
    $('#id-modificar').val($p["id"]);
    $('#accion-modificar').val($p["accion"]);
    $('#peso-modificar').val($p["peso"]);
    if ($p["color"] == "yellow") {
        $('#postIt-form-modifica-campos').attr("class", "yellow");
    }
    else if ($p["color"] == "green") {
        $('#postIt-form-modifica-campos').attr("class", "green");
    }
    else if ($p["color"] == "red") {
        $('#postIt-form-modifica-campos').attr("class", "red");
    }
    //Contruccion del selector con los datos de la tabla
    $("#estado-" + $p['estado']).prop('checked', true);
};
////////SAVE
//Ajax function to save ALL the actions in DB (through Php files)
var saveAllPostItInDB = function () { return $.ajax({
    type: 'POST',
    url: 'php/Controller.php',
    data: { postit: $todoPostIt },
    dataType: 'json',
    success: function (data) {
        alert("You've saved ALL!");
    },
    error: function (data) {
        alert("ERROR");
    }
}); };
////////DELETE
//Ajax function that DELETE ONE action in DB (through Php files)
// Triggered by:  $('#trash-icon').droppable({stop:...});
var deletaPostItDB = function ($id_) {
    var $p = getPostIt($id_);
    return $.ajax({
        type: 'POST',
        url: 'php/Controller.php',
        data: { deleteOne: $p },
        dataType: 'json',
        success: function (data) {
        },
        error: function (data) {
            alert("ERROR");
        }
    });
};
