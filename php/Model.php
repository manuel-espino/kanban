<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

class Model{

	protected $conexion;

	public function __construct($host, $user, $pass, $db){

		$con = mysqli_connect($host, $user, $pass, $db);

		if(!$con){
			die("Imposible realizar la conexión." . mysqli_error($con));
		}

		mysqli_set_charset($con, "utf8");

		$this->conexion = $con;
	}


	function exist($p){
		$res=false;
		$id = htmlspecialchars($p['id']);

		$sql= "SELECT id FROM postits WHERE id=".$id."";

		$result = mysqli_query($this->conexion, $sql);

		if(mysqli_num_rows($result)>0){
			$res=true;
		}
		return $res;
	}

	function insert($p){
		$id = htmlspecialchars($p['id']);
		$accion = htmlspecialchars($p['accion']);
		$peso = htmlspecialchars($p['peso']);
		$color = htmlspecialchars($p['color']);
		$estado = htmlspecialchars($p['estado']);

		$sql = "INSERT INTO postits (id, accion, peso, color, estado) VALUES (". $id .", '".$accion ."', '".$peso."', '".$color . "', '".$estado."')";

		$result = mysqli_query($this->conexion, $sql);

		return $result;
	}

	function update($p){
		$id = htmlspecialchars($p['id']);
		$accion = htmlspecialchars($p['accion']);
		$peso = htmlspecialchars($p['peso']);
		$color = htmlspecialchars($p['color']);
		$estado = htmlspecialchars($p['estado']);

		$sql = "UPDATE postits SET accion='".$accion."', peso='". $peso ."', color='".$color."', estado='".$estado."' WHERE id =".$id ."";

		$result= mysqli_query($this->conexion, $sql);

		return $result;
	}

	function getAll(){
		$sql="SELECT * FROM postits";

		$result = mysqli_query($this->conexion, $sql);

		$postIts = array();

		while($row = mysqli_fetch_assoc($result)){
			$postIts[]=$row;
		}

		return $postIts;
	}

	function deleteOne($p){
		$id = htmlspecialchars($p['id']);
		$sql= "DELETE FROM postits WHERE id=".$id."";

		$result = mysqli_query($this->conexion, $sql);

		return $result;
	}


	function userLogin($userName, $password){
		$res="no";

		$userName = htmlspecialchars($userName);
		$password = htmlspecialchars($password);

		$sql= "SELECT * FROM users WHERE userName='".$userName."' AND password='".$password."'";

		$result = mysqli_query($this->conexion, $sql);

		if(mysqli_num_rows($result)>0){
			$res="yes";
		}else{
			$res="no";
		}

		return $res;
	}

	function insertUser($userName, $password){
		$res="no";

		$sql = "INSERT INTO users (userName, password) VALUES ('".$userName ."', '".$password."')";

		$result = mysqli_query($this->conexion, $sql);

		if($result){
			$res="yes";
		}else{
			$res="no";
		}

		return $res;
	}

}


?>
