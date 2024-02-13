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
        $search = "%" . $inData["search"] . "%";
        $stmt = $conn->prepare("SELECT ID, userID, FirstName, LastName, Email, Phone FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?)");
        $stmt->bind_param("issss", $inData["userID"], $search, $search, $search, $search);
        $stmt->execute();
        $result = $stmt->get_result();
        

        $contacts = [];
        while ($row = $result->fetch_assoc())
        {
            $contacts[] = $row;
        }

        $stmt->close();
        $conn->close();

        returnWithInfo( json_encode($contacts) );
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

    function returnWithInfo($contacts) {
        sendResultInfoAsJson($contacts);
    }

?>
