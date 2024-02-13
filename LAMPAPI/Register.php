<?php

    $inData = getRequestInfo();
    
    $conn = new mysqli("localhost", "root", "group16COP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
        $stmt->bind_param("s", $inData["Username"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $rows = mysqli_num_rows($result)  )
        {
            returnWithError( "This Username is already in use" );
        }
        else
        {
            $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Username, PasswordHash) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Username"], $inData["Password"]);
            $stmt->execute();

            
            // Modification made: Obtain the new user ID so we can send it back to the client.
            // This function should return the last ID added to the database after the previous INSERT, which should be this new user's ID.
            //$newID = mysqli_insert_id($conn);

            // Modification made: Register.php now returns FirstName, LastName, and ID so we can save a login cookie.
            //returnWithInfo( "Registration Successful!" );
            returnWithInfo($inData["FirstName"], $inData["LastName"], $conn->insert_id);
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
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    // Modifications made. This commented-out function is the old returnWithInfo.
    //function returnWithInfo( $info )
    //{
    //    $retValue = '{"info":"' . $info . '"}';
    //    sendResultInfoAsJson( $retValue );
    //}
    // Modification made: New function is similar to that of login.php; sends back the userID, firstName, and lastName as JSON.
    // This was required so we can save a login cookie properly after registering. Login already accounted for this content being sent back.
    function returnWithInfo( $firstName, $lastName, $id )
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>
