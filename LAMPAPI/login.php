<?php

    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "root", "group16COP4331", "COP4331");
	//format = database server's host, username, password, and then database name 
	//May need to change localhost to something else, will need to test after we get api running
    
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // Prepare the SQL statement
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName FROM Users WHERE (Username=? AND PasswordHash=?)");
        $stmt->bind_param("ss", $inData["Username"], $inData["Password"]);
        $stmt->execute();

        // Get the result of the SQL query
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
        }
        else
        {
            returnWithError("No Records Found");
        }

        $stmt->close();
        $conn->close();
    }

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

    function returnWithInfo( $firstName, $lastName, $id )
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }
?>
