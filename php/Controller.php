<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("Model.php");
require_once("Config.php");

if(isset($_POST["postit"])){

		$arr = $_POST["postit"];
		$m = new Model(Config::$host, Config::$user,
		Config::$pass, Config::$db);

		foreach ($arr as $p) {

			if($m->exist($p)){
				$m->update($p);
			}else{
				$m->insert($p);
			}
		}

    echo json_encode($_POST["postit"]);
};


if(isset($_POST["getAll"])){

		$m = new Model(Config::$host, Config::$user,
		Config::$pass, Config::$db);

		$res = $m->getAll();

    echo json_encode($res);

};


if(isset($_POST["deleteOne"])){

		$p = $_POST["deleteOne"];

		$m = new Model(Config::$host, Config::$user,
		Config::$pass, Config::$db);

		$res = $m->deleteOne($p);

    	echo json_encode($res);

};


if(isset($_POST["userLogin"])){

	if (isset($_POST["userName"]) && isset($_POST["password"]))
	{
	$userName = $_POST["userName"];
	$password = $_POST["password"];

	$m = new Model(Config::$host, Config::$user,
	Config::$pass, Config::$db);

	$res = $m->userLogin($userName, $password);

	echo $res;
	}

};

if(isset($_POST["register"])){

		$m = new Model(Config::$host, Config::$user,
		Config::$pass, Config::$db);

		$m ->insertUser($_POST["userName"], $_POST["password"]);
	};

?>
