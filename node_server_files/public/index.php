<?php
// Keys of Database connection
$servername = "127.0.0.1";
$username = "root";
$password = "inamorata1";
$dbname = "locations";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connection OK, ";
}

// Variables that await values ​​from the mobile application
// $dbValue = $_POST['a'];
$data_id = $_POST['b'];
$location_id= 1;
// SQL command for the datas inser
$sql = "INSERT INTO locations (location_id, data_id) VALUES ('$location_id','$time');";
// Connection and query control
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
?>
