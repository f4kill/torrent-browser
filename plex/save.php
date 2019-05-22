<?php
extract($_POST);

if(isset($write) && boolval($write) && isset($data) && !empty($data) && isset($server) && !empty($server)) {
	if (!file_exists($server)) {
	    mkdir($server, 0777, true);
	}
	file_put_contents($server . '/db.xml', $data);
} else {
	header( 'HTTP/1.1 400 BAD REQUEST');
}

?>