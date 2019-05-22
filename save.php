<?php
if(isset($_POST['write']) && boolval($_POST['write']) && isset($_POST['data']) && !empty($_POST['data'])) {
	file_put_contents('db.json', $_POST['data']);
} else {
	header( 'HTTP/1.1 400 BAD REQUEST' );
}

?>