<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);


    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "root", "group16COP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $inData["userID"], $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"]);
        $stmt->execute();
    
        $stmt->close();
        $conn->close();
    
        returnWithInfo($inData["userID"], $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"]);
    }
    
    // Linebreak request stuff
    
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    function returnWithError($err)
    {
        $retValue = '{"userID":0,"firstName":"","lastName":"","email":"","phone":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    
    function returnWithInfo($userID, $firstName, $lastName, $email, $phone)
    {
        $retValue = '{"userID":' . $userID . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phone":"' . $phone . '","error":""}';
        sendResultInfoAsJson($retValue);
    }
?>    