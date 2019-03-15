<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once("Config.php");


$conexion = mysqli_connect(Config::$host, Config::$user, Config::$pass, Config::$db);

if ($conexion->connect_errno) {
    echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
    echo "errno de depuración: " . mysqli_connect_errno() . PHP_EOL;
    echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

$sentencia= <<<EOT
CREATE TABLE users(
userName varchar(16) NOT NULL,
password varchar(100) NOT NULL,
PRIMARY KEY (userName)
)ENGINE=INNODB;
CREATE TABLE postits(
id int(3) NOT NULL,
accion varchar(400),
peso int(2),
color varchar(10),
estado varchar(10),
PRIMARY KEY (id)
)ENGINE=INNODB;
EOT;

$result = mysqli_multi_query($conexion, $sentencia);

if(!$result){
	echo "Error al crear las tablas de la base de datos. ".mysqli_error($conexion);
}else{
	echo "Tablas creadas";
}
mysqli_close($conexion);


?>
