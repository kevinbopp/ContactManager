<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    $inData = getRequestInfo();
    
    $conn = new mysqli("localhost", "root", "group16COP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=? AND UserID=?");
        $stmt->bind_param("ssssis", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], $inData["id"], $inData["userID"]);
        $stmt->execute();

        $stmt->close();
        $conn->close();

        returnWithInfo( "Contact Updated Successfully!" );
    }
    
    // Linebreak request stuff
	
	function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo($message, $firstName = "", $lastName = "", $id = 0) {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":"","message":"' . $message . '"}';
        sendResultInfoAsJson($retValue);
    }
    

?>
