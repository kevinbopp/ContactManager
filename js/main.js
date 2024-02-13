// Group 16 - Contact Manager main.js
// Contains all the code required for our entire site to run. All JS is embedded in HTML.

// User information; when logged in, this automatically updates on each page.
// 0 means no user currently signed in.
let userID = 0;
// First Name and Last Name of currently-logged-in user.
let firstName = "";
let lastName = "";
// Used for searching and compiling a list of contacts from JSON.
const contactIDs = [];

// RegEx for username/password validation.
var numbers = /[0-9]/g;
var letters = /[a-zA-Z]/g;
var lettersNums = /[^a-zA-Z0-9-_]/; // a-z, A-Z, 0-9, -, _ only
var lettersUpper = /[A-Z]/g; // uppercase only

// Booleans to check if user is ready to login or register.
var usernameGood = false;
var passwordGood = false;

// Global variable to store the contact being edited. ONLY used on editcontact, and resets every time we load that page.
let editContactID = -1;
// Global variable, is the table of contacts showing?
let tableShowing = false;

// Event listener; handle showing specific information only after HTML content has fully loaded.
document.addEventListener("DOMContentLoaded", function()
{
    // Before anything, when loading a webpage, read the cookie unless we're on index or register.
    if (!(window.location.pathname.includes("index.html")) && !(window.location.pathname.includes("register.html")))
    {
        readLoginCookie(); // Automatically signs the user out if the cookie is invalid/nonexistent.
    }
    else
    {
        // Get a reference to the formBox so we can update its height dynamically.
        if (window.location.pathname.includes("register.html"))
        {
            // Register page.
            formBox = document.getElementById("divRegisterForm");
        }
    }

    if (window.location.pathname.includes("register.html"))
    {
        // Specific references to elements on the register page.
        let inputUsername = document.getElementById("inputUsername");
        let inputFirstName = document.getElementById("inputFirstName");
        let inputLastName = document.getElementById("inputLastName");
        let inputPassword = document.getElementById("inputPassword");
        let inputConfirmPassword = document.getElementById("inputConfirmPassword");

        // Specific references to text username/password restriction elements on the register page
        let pUserOneLetter = document.getElementById("pUserOneLetter");
        let pUserLength = document.getElementById("pUserLength");
        let pUserSpecial = document.getElementById("pUserSpecial");
        let pPassOneLetter = document.getElementById("pPassOneLetter");
        let pPassOneNumber = document.getElementById("pPassOneNumber");
        let pPassSpecial = document.getElementById("pPassSpecial");
        let pPassLength = document.getElementById("pPassLength");
        let pPassMatch = document.getElementById("pPassMatch");
        
        let divUsernameExplanation = document.getElementById("divUsernameExplanation");
        let divPasswordExplanation = document.getElementById("divPasswordExplanation");

        // Main box that animates, containing all register forms.
        let divLoginForm = document.getElementById("divLoginForm");

        // Attach event listeners to the input fields
        inputUsername.addEventListener("focus", handleFieldFocus);
        inputUsername.addEventListener("blur", handleFieldBlur);
        inputUsername.addEventListener("keyup", regValidateUsername);

        inputPassword.addEventListener("focus", handleFieldFocus);
        inputPassword.addEventListener("blur", handleFieldBlur);
        inputPassword.addEventListener("keyup", regValidatePassword);
        // Repeats password checks, but is necessary for "passwords match" text and so the requirements don't disappear on the user.
        inputConfirmPassword.addEventListener("focus", handleFieldFocus);
        inputConfirmPassword.addEventListener("blur", handleFieldBlur);
        inputConfirmPassword.addEventListener("keyup", regValidatePassword);
    }

    // If we're on the add or edit contact pages, also attatch an event listener to the password form so we can format it.
    if (window.location.pathname.includes("addnewcontact.html") || window.location.pathname.includes("editcontact.html"))
    {
        let inputPhone = document.getElementById("inputPhone");
        inputPhone.addEventListener("keyup", formatPhone);
    }

    // If we're on the edit contact page, check if we can pull the contact info from the URL.
    if (window.location.pathname.includes("editcontact.html"))
    {
        // Get the string data from the URL parameters.
        const urlData = new URLSearchParams(window.location.search);
        const stringData = urlData.get('contact');

        // First, check if there were any parameters. If not, we should not be on the edit contact page!
        if (!stringData)
        {
            // Redirect!
            editContactID = -1;
            window.location.href = 'contacts.html';
            return;
        }

        // Decode the data from JSON so we can read it.
        const contactInfo = JSON.parse(decodeURIComponent(stringData));

        // Now that we have the string of contact information, grab all the info we need.
        editContactID = contactInfo.contactID;

        // The remainder of the information can be added to the form boxes, as the function to actually edit checks these, anyway.
        document.getElementById('inputFirstName').value = contactInfo.firstName;
        document.getElementById('inputLastName').value = contactInfo.lastName;
        document.getElementById('inputPhone').value = contactInfo.phone;
        document.getElementById('inputEmail').value = contactInfo.email;
    }

    function regValidateUsername()
    {
        let counter = 0;

        // Check username length is at least 2-20
        if ((inputUsername.value.length >= 2 && inputUsername.value.length <= 20))
        {
            pUserLength.classList.remove("invalid");
            pUserLength.classList.add("valid");
            counter++;
        }
        else
        {
            pUserLength.classList.remove("valid");
            pUserLength.classList.add("invalid");
        }

        // Check username has at least 1 letter
        if ((inputUsername.value.match(letters)))
        {
            pUserOneLetter.classList.remove("invalid");
            pUserOneLetter.classList.add("valid");
            counter++;
        }
        else
        {
            pUserOneLetter.classList.remove("valid");
            pUserOneLetter.classList.add("invalid");
        }

        // Check username has no special characters (- and _ are ok)
        if (!(inputUsername.value.match(lettersNums)))
        {
            pUserSpecial.classList.remove("invalid");
            pUserSpecial.classList.add("valid");
            counter++;
        }
        else
        {
            pUserSpecial.classList.remove("valid");
            pUserSpecial.classList.add("invalid");
        }

        // Check if we met all 3 conditions
        if (counter == 3)
        {
            usernameGood = true;
        }
        else
        {
            usernameGood = false;
            counter = 0;
        }
    }

    function regValidatePassword()
    {
        let counter = 0;

        // Check password length is at least 8-24
        if ((inputPassword.value.length >= 8 && inputPassword.value.length <= 24))
        {
            pPassLength.classList.remove("invalid");
            pPassLength.classList.add("valid");
            counter++;
        }
        else
        {
            pPassLength.classList.remove("valid");
            pPassLength.classList.add("invalid");
        }

        // Check password has at least 1 uppercase letter
        if ((inputPassword.value.match(lettersUpper)))
        {
            pPassOneLetter.classList.remove("invalid");
            pPassOneLetter.classList.add("valid");
            counter++;
        }
        else
        {
            pPassOneLetter.classList.remove("valid");
            pPassOneLetter.classList.add("invalid");
        }

        // Check password has at least 1 number
        if ((inputPassword.value.match(numbers)))
        {
            pPassOneNumber.classList.remove("invalid");
            pPassOneNumber.classList.add("valid");
            counter++;
        }
        else
        {
            pPassOneNumber.classList.remove("valid");
            pPassOneNumber.classList.add("invalid");
        }

        // Check password has at least one special character (- and _ do not count)
        if ((inputPassword.value.match(lettersNums)))
        {
            pPassSpecial.classList.remove("invalid");
            pPassSpecial.classList.add("valid");
            counter++;
        }
        else
        {
            pPassSpecial.classList.remove("valid");
            pPassSpecial.classList.add("invalid");
        }

        // Check confirm password and password match
        if (inputPassword.value === inputConfirmPassword.value)
        {
            pPassMatch.classList.remove("invalid");
            pPassMatch.classList.add("valid");
            counter++;
        }
        else
        {
            pPassMatch.classList.remove("valid");
            pPassMatch.classList.add("invalid");
        }

        // Check if we met all 5 conditions
        if (counter == 5)
        {
            passwordGood = true;
        }
        else
        {
            passwordGood = false;
            counter = 0;
        }
    }

    // Handle focusing on specific fields (selecting or clicking them)
    function handleFieldFocus(event)
    {
        if (event.target === inputUsername)
        {
            // User clicked on the username field, show username reqs & hide password reqs.
            divUsernameExplanation.style.display = "block";
            divPasswordExplanation.style.display = "none";
            // Update the div box to the expanded class so it animates to a bigger size.
            formBox.style.height = '470px';
        }
        else if (event.target === inputPassword || event.target === inputConfirmPassword)
        {
            // User clicked on the password field, show password reqs & hide username reqs.
            divUsernameExplanation.style.display = "none";
            divPasswordExplanation.style.display = "block";
            formBox.style.height = '545px';
        }

        
  }

    // Function to handle input field blur event
    function handleFieldBlur()
    {
        // On de-selecting a specified field, hide both the username and password requirements.
        divUsernameExplanation.style.display = "none";
        divPasswordExplanation.style.display = "none";
        
        // Update the div box to no longer have the expanded class so it animates to a regular size.
        formBox.style.height = '314px';
    }
}, false);



// Functions for various pages and actions.

function login()
{
    // We're logging in with a fresh start. Even if we're signed in, let's start from a new, nonexistent sign-in.
    userID = 0;
    firstName = "";
    lastName = "";

    // Get a reference to the input form values on this page.
    var username = document.getElementById('inputUsername').value;
    var password = document.getElementById('inputPassword').value;

    // Verify what the user entered is okay before attempting to login.
    var canLogin = loginValidation(username, password);

    if (canLogin == 1)
    {
        // We can login! Clear the message.
        document.getElementById('pErrorText').innerHTML = "&nbsp;";
    }
    else if (canLogin == 2)
    {
        // The user left at least one field blank.
        document.getElementById('pErrorText').innerHTML = "All fields are required.";
        return;
    }
    else if (canLogin == 3)
    {
        // The user entered an incorrect username format (such as including a space or special character).
        document.getElementById('pErrorText').innerHTML = "Please enter a valid username.";
        return;
    }
    else
    {
        // The user entered an incorrect password format (such as including a space or did not meet all the requirements).
        // We won't tell the user what the requirements are again; the input box will also show red until they get it correct.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid password.";
        return;
    }

    // Hash the password using md5.
    var passwordHash = md5(password);

    // Combine username and HASHED password into object
    let combined = {
    	Username: username,
        Password: passwordHash
    };
    
    // Stringify the object for JSON to be sent
    let JSONtext = JSON.stringify(combined);

    // Perform login validation using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://fullstackbros.online/LAMPAPI/login.php', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                // Login successful, redirect to main page if user ID good
                let jsonResponse = JSON.parse(xhr.responseText);
                userID = jsonResponse.id;
		
                if (userID < 1)
                {
                    // We failed to login. Let the user know.
                    document.getElementById('pErrorText').innerHTML = "Username or password incorrect; please try again.";
                    return;
                }

                // Otherwise, we have just successfully logged in. Clear any errors and save the current logged-in user information.
                document.getElementById('pErrorText').innerHTML = "&nbsp;";
                firstName = jsonResponse.firstName;
                lastName = jsonResponse.lastName;

                // Save a cookie so we remain logged-in on each page.
                saveLoginCookie();

                // Re-direct to the landing page.
                window.location.href = 'contacts.html';
            }
            else
            {
                // Something went wrong. If the status is 500, that's a server error such as it being offline.
                // We will simplify it to the user with a general message.
                document.getElementById('pErrorText').innerHTML = "Server error; please try again later.";
                return;
            }
        }
    };
    xhr.send(JSONtext);
}

// Different from regValidate<Username or Password>; checks both fields are OK to send to login.php.
function loginValidation(username, password)
{
    var usernameRegEx = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{2,20}$/;
    var passwordRegEx = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,24}$/;

    if (username == "" || password == "")
    {
        // At least one field is blank, so return with that error.
        return 2;
    }

    // Validate the username field meets the conditions of a proper username.
    if (usernameRegEx.test(username) == false)
    {
        // Username is invalid.
        return 3;
    }

    // Validate the password field meets the conditions of a proper password.
    if (passwordRegEx.test(password) == false)
    {
        // Password is invalid.
        return 4;
    }

    // If we made it this far, both are valid. Not necessarily correct or belonging to an account, but valid!
    return 1;
}

function saveLoginCookie()
{
    // Combine the first name, last name, and user ID of this user to an object.
    const userInfo = {
        firstName: firstName,
        lastName: lastName,
        userID: userID,
    };

    // Convert the cookie to a JSON string and use encodeURIComponent to verify it's safe to store as a cookie.
    const cookieValue = encodeURIComponent(JSON.stringify(userInfo));

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1); // Sets expiration date to today + 1 day (so, tomorrow).

    // Finally, save the cookie. Note: this is a session cookie with an added expiration date, so you remain logged in until the cookie expires 1 day after creation.
    // Removing the expiration date causes this to be a plain session cookie; the user will be signed out the moment they close the browswer.
    document.cookie = `loginInfo=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/`;

    console.log("Cookie saved.");
    console.log(cookieValue);
}

function readLoginCookie()
{
    // Clear the current user and read the cookie instead.
    firstName = "";
    lastName = "";
    userID = 0;

    // Split all cookies on this web page so we can loop through them.
    const cookies = document.cookie.split(';');

    // Check each cookie.
    for (let i = 0; i < cookies.length; i++)
    {
        const cookie = cookies[i].trim();

        // If the cookie starts with loginInfo as we named it this, we've found it. Return the information in it as JSON.
        if (cookie.startsWith('loginInfo='))
        {
            const cookieValue = decodeURIComponent(cookie.substring('loginInfo='.length));
            const loginData = JSON.parse(cookieValue);

            // Assign the values to the global variables
            firstName = loginData.firstName;
            lastName = loginData.lastName;
            userID = loginData.userID;
            
            // If we are on the contacts page, load the welcome message.
            if (window.location.pathname.includes("contacts.html"))
            {
                document.getElementById('userWelcome').innerHTML = "Welcome, " + firstName + "!";
            }
            return loginData;
        }
    }

    // If we checked every cookie and made it here, we are NOT logged in. Return null and re-direct the user.
    window.location.href = 'index.html';
    return null;
}

function register()
{
    // We're signing up. So, start with a new sign-in again.
    userID = 0;
    firstName = "";
    lastName = "";

    // Now, grab all the information the user typed in.
    let username = document.getElementById('inputUsername').value;
    firstName = document.getElementById('inputFirstName').value;
    lastName = document.getElementById('inputLastName').value;
    let password = document.getElementById('inputPassword').value;
    let confirmedPassword = document.getElementById('inputConfirmPassword').value;

    // Verify what the user entered is okay before attempting to sign up.
    var canRegister = registerValidation(firstName, lastName, username, password, confirmedPassword);

    // Check if we can register based on the error code or not; 1 is successful registration and continues past this.
    if (canRegister == 1)
    {
        // Success! Clear any errors and move on.
        document.getElementById('pErrorText').innerHTML = "&nbsp;";
    }
    else if (canRegister == 2)
    {
        // Invalid registration; at least one field is blank.
        document.getElementById('pErrorText').innerHTML = "All fields are required.";
        return;
    }
    else if (canRegister == 3)
    {
        // Invalid registration; username is invalid.
        document.getElementById('pErrorText').innerHTML = "Username does not meet the requirements.";
        return;
    }
    else if (canRegister == 4)
    {
        // Invalid registration; enter a valid first name.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid first name.";
        return;
    }
    else if (canRegister == 5)
    {
        // Invalid registration; enter a valid last name.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid last name.";
        return;
    }
    else if (canRegister == 6)
    {
        // Invalid registration; password is invalid.
        document.getElementById('pErrorText').innerHTML = "Password does not meet the requirements.";
        return;
    }
    else
    {
        // Invalid registration; passwords do not match.
        document.getElementById('pErrorText').innerHTML = "Passwords do not match.";
        return;
    }

    // If we made it this far, clear any errors.
    document.getElementById('pErrorText').innerHTML = "&nbsp;";

    // Hash the password using md5.
    var passwordHash = md5(password);
    
    // Combine everything into an object.
    let combinedSignup = {
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        Password: passwordHash
    };
    
    // Combine said object into JSON.
    let jsonCombinedText = JSON.stringify(combinedSignup);

    // Perform registration validation using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://fullstackbros.online/LAMPAPI/Register.php', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                // Sign-up successful, redirect to main page shortly after saving some information.
                let jsonResponseNew = JSON.parse(xhr.responseText);

                if (jsonResponseNew.error == "This Username is already in use")
                {
                    // Username in use! Ahhh! Error and return, quick! ABORT ABORT ABORT!
                    document.getElementById('pErrorText').innerHTML = "Username taken; please try again.";
                    return;
                }

                userID = jsonResponseNew.id;
                firstName = jsonResponseNew.firstName;
                lastName = jsonResponseNew.lastName;

                // Save a cookie so we remain logged-in on each page.
                saveLoginCookie();
          
                // Re-direct to the landing page.
                window.location.href = 'contacts.html';
            }
            else if (xhr.status == 409)
            {
                // User is already in the system.
                document.getElementById('pErrorText').innerHTML = "Username taken; please try again.";
                return;
            }
            else
            {
                // Something went wrong. If the status is 500, that's a server error such as it being offline.
                // We will simplify it to the user with a general message.
                document.getElementById('pErrorText').innerHTML = "Server error; please try again later.";
                return;
            }
        }
    };
    xhr.send(jsonCombinedText);
}

// Different from regValidate<Username or Password>; checks all registration fields are OK to send to Register.php.
function registerValidation(firstName, lastName, username, password, confirmedPassword)
{
    var usernameRegEx = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{2,20}$/;
    var passwordRegEx = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,24}$/;
    // First and last names are a-z, A-Z only and 1 <= length <= 30. Hyphens allowed, too, but only if surrounded by text.
    var namesRegEx = /^(?=.{1,30}$)[a-zA-Z]+(?:-[a-zA-Z]+)*$/;

    // RegEx for username/password validation.
    var numbers = /[0-9]/g;
    var letters = /[a-zA-Z]/g;
    var lettersNums = /[^a-zA-Z0-9-_]/; // a-z, A-Z, 0-9, -, _ only
    var lettersUpper = /[A-Z]/g; // uppercase only

    // Verify each field is not blank.
    if (firstName == "" || lastName == "" || username == "" || password == "" || confirmedPassword == "")
    {
        // Error: At least one blank field.
        return 2;
    }

    // Validate the username field meets the conditions of a proper username.
    if (usernameRegEx.test(username) == false)
    {
        // Username is invalid.
        return 3;
    }

    // Validate the first name is just a name with no other characters and not too long.
    if (namesRegEx.test(firstName) == false)
    {
        // First Name is invalid.
        return 4;
    }

    // Validate the last name is just a name with no other characters and not too long.
    if (namesRegEx.test(lastName) == false)
    {
        // Last Name is invalid.
        return 5;
    }

    // Validate the password field meets the conditions of a proper password.
    if (passwordRegEx.test(password) == false)
    {
        // Password is invalid.
        return 6;
    }

    // Validate the password matches the confirmed password.
    if (password != confirmedPassword)
    {
        // Passwords do not match.
        return 7;
    }

    // If we made it this far, all forms are valid and we can sign up. They may already be in the system, but they're valid to attempt to sign up with!
    return 1;
}

function logout()
{
    // Wipe all the stored information about the currently-signed-in user.
    userID = 0;
    firstName = "";
    lastName = "";

    // Wipe the current cookie. Use the start time of Linux (the official cookie standard) as the expiration so we know it's dead.
    document.cookie = "loginInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Re-direct the user to the main page when logging out.
    window.location.href = "index.html";
}

function addContact()
{
    // I could have written one function for add or edit with slight changes. Oops. My CS1/CS2 has failed me. Or me, it.
    // If anyone notices this, my answer is: I didn't feel like it.

    // First, grab all the information the user typed in.
    let firstName = document.getElementById('inputFirstName').value;
    let lastName = document.getElementById('inputLastName').value;
    let phone = document.getElementById('inputPhone').value;
    let email = document.getElementById('inputEmail').value;

    // Clear the success text if it's still up.
    document.getElementById('pSuccessText').value = "";

    // Verify what the user entered is okay before attempting to add the contact.
    var canAddContact = contactValidation(firstName, lastName, phone, email);

    // Check if we can add a contact based on the error code or not; 1 is successful and continues past this.
    if (canAddContact == 1)
    {
        // Success! Clear any errors and move on.
        document.getElementById('pErrorText').innerHTML = "&nbsp;";
    }
    else if (canAddContact == 2)
    {
        // Invalid add contact; at least one field is blank.
        document.getElementById('pErrorText').innerHTML = "All fields are required.";
        return;
    }
    else if (canAddContact == 3)
    {
        // Invalid add contact; enter a valid first name.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid first name.";
        return;
    }
    else if (canAddContact == 4)
    {
        // Invalid add contact; enter a valid last name.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid last name.";
        return;
    }
    else if (canAddContact == 5)
    {
        // Invalid add contact; enter a complete phone number.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid phone number: (123) 456-7890.";
        return;
    }
    else
    {
        // Invalid add contact; enter a valid email address.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid email: example@email.com.";
        return;
    }

    // If we made it this far, clear any errors.
    document.getElementById('pErrorText').innerHTML = "&nbsp;";
    
    // Combine everything into an object. Include the user ID so we know who this contact should be added to.
    let combinedContact = {
        userID: userID,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };
    
    // Combine said object into JSON.
    let jsonCombinedContact = JSON.stringify(combinedContact);

    // Perform add contact validation using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://fullstackbros.online/LAMPAPI/AddContact.php', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                // Add contact successful, clear forms so user can add a new contact and show/hide success text after some time.
                let jsonResponseContact = JSON.parse(xhr.responseText);
                let contactFirstName = jsonResponseContact.firstName;

                // Hide any errors.
                document.getElementById('pErrorText').innerHTML = "";
                // Show the success and contact added.
                document.getElementById('pSuccessText').innerHTML = contactFirstName + " has been added!";

                // Clear the forms, setting the focus to the first form again.
                startOver();

                // We successfully added a contact. Disable the add button; it will turn back on when the text goes away so we can't spam it.
                document.getElementById("buttonAddContact").disabled = true;

                // Set a timer so we hide the success text after 3 seconds.
                // This checks if it's still showing, if we're still on the page, and if there's errors before doing anything, too.
                setTimeout(hideSuccessMessage, 3000);
          
                // Optionally, uncomment this/move it to the timer so we automatically redirect back to the contacts page instead.
                // Currently, we allow the user to continue adding more contacts, which is why we clear the forms and show the name
                // of who we just added to make it clear.
                // window.location.href = 'contacts.html';
            }
            else if (xhr.status == 409)
            {
                // Contact is already in the system.
                document.getElementById('pErrorText').innerHTML = contactFirstName + " is already in your address book!";
                document.getElementById('pSuccessText').innerHTML = "";

                // Don't clear the forms, the user may have mis-typed.
                return;
            }
            else
            {
                // Something went wrong. If the status is 500, that's a server error such as it being offline.
                // We will simplify it to the user with a general message.
                document.getElementById('pErrorText').innerHTML = "Server error; please try again later.";
                document.getElementById('pSuccessText').innerHTML = "";
                return;
            }
        }
    };
    xhr.send(jsonCombinedContact);
}

function editContact()
{
    // First, grab all the information the user typed in.
    let firstName = document.getElementById('inputFirstName').value;
    let lastName = document.getElementById('inputLastName').value;
    let phone = document.getElementById('inputPhone').value;
    let email = document.getElementById('inputEmail').value;

    // Clear the success text if it's still up.
    document.getElementById('pSuccessText').value = "";

    // Verify what the user entered is okay before attempting to edit the contact.
    var canEditContact = contactValidation(firstName, lastName, phone, email);

    // Check if we can edit a contact based on the error code or not; 1 is successful and continues past this.
    if (canEditContact == 1)
    {
        // Success! Clear any errors and move on.
        document.getElementById('pErrorText').innerHTML = "&nbsp;";
    }
    else if (canEditContact == 2)
    {
        // Invalid edit contact; at least one field is blank.
        document.getElementById('pErrorText').innerHTML = "All fields are required.";
        return;
    }
    else if (canEditContact == 3)
    {
        // Invalid edit contact; enter a valid first name.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid first name.";
        return;
    }
    else if (canEditContact == 4)
    {
        // Invalid edit contact; enter a valid last name.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid last name.";
        return;
    }
    else if (canEditContact == 5)
    {
        // Invalid edit contact; enter a complete phone number.
        document.getElementById('pErrorText').innerHTML = "Please enter a complete phone number: (123) 456-7890.";
        return;
    }
    else
    {
        // Invalid edit contact; enter a valid email address.
        document.getElementById('pErrorText').innerHTML = "Please enter a valid email: example@email.com.";
        return;
    }

    // If we made it this far, clear any errors.
    document.getElementById('pErrorText').innerHTML = "&nbsp;";
    
    // Combine everything into an object. Include the user ID so we know who this contact should be updated to and the ID of the contact as well.
    let combinedEditContact = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        id: editContactID,
        userID: userID
    };
    
    // Combine said object into JSON.
    let jsonCombinedEditContact = JSON.stringify(combinedEditContact);

    // Perform add contact validation using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://fullstackbros.online/LAMPAPI/EditContact.php', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                // Edit contact successful, clear forms, show a success, and return after a moment.
                let jsonResponseEditContact = JSON.parse(xhr.responseText);

                // Hide any errors.
                document.getElementById('pErrorText').innerHTML = "";
                // Show the success and contact added.
                document.getElementById('pSuccessText').innerHTML = firstName + " has been updated! Returning...";

                // Clear the forms, setting the focus to the first form again.
                startOver();

                // Make sure to disable the button so the user can do nothing to break the updated contact while they wait to reload.
                document.getElementById("buttonEditContact").disabled = true;

                // Set a timer so we return to the contacts page in 2 seconds.
                setTimeout(hideSuccessMessage, 2000);
            }
            else if (xhr.status == 409)
            {
                // Note: Test this and update code as necessary. Not sure what happens if you attempt to edit a contact to the same values.
                // Contact is already in the system.
                document.getElementById('pErrorText').innerHTML = firstName + " is already in your address book!";
                document.getElementById('pSuccessText').innerHTML = "";

                // Don't clear the forms, the user may have mis-typed.
                return;
            }
            else
            {
                // Something went wrong. If the status is 500, that's a server error such as it being offline.
                // We will simplify it to the user with a general message.
                document.getElementById('pErrorText').innerHTML = "Server error; please try again later.";
                document.getElementById('pSuccessText').innerHTML = "";
                return;
            }
        }
    };
    xhr.send(jsonCombinedEditContact);
}

// Checks all contact fields are OK to send to addnewcontact.php or editcontact.php.
function contactValidation(firstName, lastName, phone, email)
{
    // RegEx for contact validation.
    // First and last names are a-z, A-Z only and 1 <= length <= 30. Hyphens allowed, too, but only if surrounded by text.
    var namesRegEx = /^(?=.{1,30}$)[a-zA-Z]+(?:-[a-zA-Z]+)*$/;
    // Phone number is formatted with formatPhone, so we will just check if the length is exactly "(123) 456-7890" 14 characters long.
    // Email address is *@*.* only.
    var emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Format phone again before performing validation. If length != 14 below, it's invalid.
    formatPhone();

    // Verify each field is not blank.
    if (firstName == "" || lastName == "" || phone == "" || email == "")
    {
        // Error: At least one blank field.
        return 2;
    }

    // Validate the first name is just a name with no other characters and not too long.
    if (namesRegEx.test(firstName) == false)
    {
        // First Name is invalid.
        return 3;
    }

    // Validate the last name is just a name with no other characters and not too long.
    if (namesRegEx.test(lastName) == false)
    {
        // Last Name is invalid.
        return 4;
    }

    // Validate the phone number is of the proper length; if it's not, it is incomplete and invalid.
    if (phone.length != 14)
    {
        // Phone number is invalid.
        return 5;
    }

    // Validate the email address is in a valid format@email.com.
    if (emailRegEx.test(email) == false)
    {
        // Email is not formatted correctly and is invalid.
        return 6;
    }

    // If we made it this far, all forms are valid and we can add or edit a contact. They may already be in the system, but they're valid to attempt to sign up with!
    // That, and duplicate contacts is probably okay. What if people have the same name?
    return 1;
}

function hideSuccessMessage()
{
    // Check if we're still on the add contact page.
    if (window.location.pathname.includes("addnewcontact.html"))
    {
        // Only hide the success text if there's no errors being displayed.
        if (document.getElementById('pErrorText').innerHTML == "&nbsp;" || document.getElementById('pErrorText').innerHTML == "")
        {
            // Hide the success text.
            document.getElementById('pSuccessText').innerHTML = "";
        }

        document.getElementById('pErrorText').innerHTML = "&nbsp;"

        // Now that the timeout is over, we can enable the button to add a new contact again.
        document.getElementById("buttonAddContact").disabled = false;
    }
    else if (window.location.pathname.includes("editcontact.html"))
    {
        // Don't bother hiding the text, it is time to return.
        window.location.href = 'contacts.html'
    }
}

function togglePasswordVisibility(inputId)
{
    const inputElement = document.getElementById(inputId);
    const iconElement = document.getElementById(inputId + 'Icon');

    if (inputElement.type === 'password')
    {
        inputElement.type = 'text';
        iconElement.src = 'images/passwordShown.png';
    }
    else
    {
        inputElement.type = 'password';
        iconElement.src = 'images/passwordHidden.png';
    }
}

// Clears input fields on edit or add new contact pages.
function startOver()
{
    // Clear each of the input forms. These are identical on the editcontact and addnewcontact pages.
    document.getElementById("inputFirstName").value = "";
    document.getElementById("inputLastName").value = "";
    document.getElementById("inputPhone").value = "";
    document.getElementById("inputEmail").value = "";

    // Clear any error or success messages. Again, identical naming system.
    document.getElementById("pSuccessText").value = "";
    document.getElementById("pErrorText").value = "&nbsp;";

    // Set the focus to the first form as if the user clicked on it.
    document.getElementById("inputFirstName").focus();
}

// Formats the phone properly as the user types; also enforces input validation.
function formatPhone()
{
    let inputPhone = document.getElementById("inputPhone");
    let formattedPhone = inputPhone.value;

    // Remove all characters from the input that are not digits.
    formattedPhone = formattedPhone.replace(/\D/g,'');
        
    // Trim the remaining input to ten total characters.
    formattedPhone = formattedPhone.substring(0,10);

    // Based upon the length of the string, add formatting as necessary (the set of (), the space, and the -)
    var length = formattedPhone.length;

    if (length == 0)
    {
        // Do nothing.
    }
    else if (length < 4)
    {
        // (12
        formattedPhone = '(' + formattedPhone;
    }
    else if (length < 7)
    {
        // (123) 45
        formattedPhone = '('+formattedPhone.substring(0,3)+') '+formattedPhone.substring(3,6);
    }
    else
    {
        // (123) 456-*
        formattedPhone = '('+formattedPhone.substring(0,3)+') '+formattedPhone.substring(3,6)+'-'+formattedPhone.substring(6,10);
    }

    // Update the phone in the box.
    inputPhone.value = formattedPhone;
}

// Overrides what happens when you hit a key on a form. Currently, when you hit enter, it "submits" the form.
// I added this function so pressing enter on specific forms (only the last form on each page) does the same thing as
// clicking the button to run the main function (such as logging in or adding a contact), instead of reloading the page, which
// was useless. It also prevents all other forms from reloading the page.
function handleKeyPress(event, formType)
{
    // If we pressed 13, which is the key code for enter...
    if (event.keyCode === 13)
    {
        // Prevent all forms from being submitted on enter; we will override it based on the form now.
        event.preventDefault();

        // Check the form type.
        if (formType == 0)
        {
            return;
        }
        else if (formType == 1)
        {
            login();
        }
        else if (formType == 2)
        {
            register();
        }
        else if (formType == 3)
        {
            searchContacts();
        }
        else if (formType == 4)
        {
            addContact();
        }
        else if (formType == 5)
        {
            editContact();
        }
    }
}

function searchContacts()
{
    // Define an array to store the ID of each contact belonging to this user.
    let contactIDS = [];

    // Format our search query the user entered so it is acceptable and save it.
    formatSearch();
    var searchQuery = document.getElementById('inputSearch').value;

    // TODO, CHECK IF BLANK?

    // Combine the search query and the user ID so we know who to search under.
    let combinedSearch = {
        userID: userID,
        searchTerm: searchQuery
    }

    // Stringify the object for JSON to be sent
    let JSONsearch = JSON.stringify(combinedSearch);

    // Perform search validation using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://fullstackbros.online/LAMPAPI/SearchContact.php', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status === 200)
            {
                // Search successful, collect the response.
                let jsonResponseSearch = JSON.parse(xhr.responseText);

                // Begin writing the code to add a new table below the current table.
                let tableCode = "<table border='1'>";

                // Grab the length for the loop.
                let numContacts = jsonResponseSearch.length;

                // Keep track of if we're showing the table or not.
                // We say greater than 1 because, if we delete our last contact, we should still redraw the table after that delete.
                if (numContacts > 1)
                {
                    tableShowing = true;
                }
                else
                {
                    tableShowing = false;
                }

                // Loop through every contact array in the JSON response, which should be an array of each contact's information.
                for (let i = 0; i < numContacts; i++)
                {
                    // Add this next contact to the contactIDS array.
                    contactIDS[i] = jsonResponseSearch[i].ID;
                    // Define a new table row set to the ID of this contact (not the contact ID, but the order they were returned in).
                    tableCode += "<tr id='tr" + i + "'>";
                    // Td containers hold table data. Define 1 for each value of this contact, using the same ID naming system.
                    // Use <span> as this text will display in line and in order, versus in blocks.
                    tableCode += "<td id='trFirstName class='contactInfo'" + i + "'><span>" + jsonResponseSearch[i].FirstName + "</span></td>";
                    tableCode += "<td id='trLastName class='contactInfo'" + i + "'><span>" + jsonResponseSearch[i].LastName + "</span></td>";
                    tableCode += "<td id='trPhone class='contactInfo'" + i + "'><span>" + jsonResponseSearch[i].Phone + "</span></td>";
                    tableCode += "<td id='trEmail class='contactInfo'" + i + "'><span>" + jsonResponseSearch[i].Email + "</span></td>";
                    // Add a td container storing the 2 buttons to edit or delete this contact.
                    // For editing, we will send all of the contact information to the function so it can be sent as a URL query parameter in JSON.
                    tableCode += "<td> <span class='centeredTD'>" +
                        "<button type='button' id='buttonDelete" + i + "' class='cancel-btn' onclick='deleteContact(" + 
                        contactIDS[i] + ", \"" + jsonResponseSearch[i].FirstName + "\", \"" + jsonResponseSearch[i].LastName + "\")'>" + "Delete" + "</button>" +
                        "<button type='button' id='buttonEdit" + i + "' class='edit-btn' onclick='redirectEdit(" + 
                        contactIDS[i] + ", \"" + jsonResponseSearch[i].FirstName + "\", \"" + jsonResponseSearch[i].LastName + "\", \"" +
                        jsonResponseSearch[i].Phone + "\", \"" + jsonResponseSearch[i].Email + "\")'>" +
                        "Edit" + "</button>" +
                        "</span> </td>";
                    // Close out this contact's table row.
                    tableCode += "<tr/>";
                }

                // All contacts have had their rows added. Finally, close out the table.
                tableCode += "</table>";
                // Our table is ready to update. Simply update it!
                document.getElementById("tableContacts").innerHTML = tableCode;
            }
            else
            {
                // Something went wrong. If the status is 500, that's a server error such as it being offline.
                // Because search failed, we should show an empty table.

                // SHOW EMPTY TABLE.
                return;
            }
        }
    };
    xhr.send(JSONsearch);
}

function formatSearch()
{
    var inputSearch = document.getElementById('inputSearch');
    let newQuery = inputSearch.value;

    // Removes all non-alphabetic characters from the string and returns it. Allows hyphens as they can be in names.
    newQuery = newQuery.replace(/[^a-zA-Z0-9-]/g, "");
    inputSearch.value = newQuery;
    return newQuery;
}

function redirectEdit(contactID, firstName, lastName, phone, email)
{
    // Combine the contact values as JSON.
    const contactJSON = {
        contactID: contactID,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    }

    // Convert them to a string.
    const contactJSONstring = JSON.stringify(contactJSON);

    // Encode the data as a URL parameter to be sent to editcontact.html.
    const encodedJSONData = encodeURIComponent(contactJSONstring);

    // Redirect to the editcontact.html page with the contact to edit.
    window.location.href = 'editcontact.html?contact=' + encodedJSONData;
}

function deleteContact(contactIDDel, contactFirstName, contactLastName)
{
    // Send the user a confirmation.
    let canDelete = confirm("Are you sure you would like to delete " + contactFirstName + " " + contactLastName + "?")

    // If true, delete the contact and perform AJAX validation.
    if (canDelete === true)
    {
        // Combine the contact to delete into an object. Note, the API does not require userID to be sent.
        let combinedDelete = {
            contactID: contactIDDel
        }

        // Stringify the object for JSON to be sent
        let JSONdelete = JSON.stringify(combinedDelete);

        // Perform deletion validation using AJAX
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://fullstackbros.online/LAMPAPI/DeleteContact.php', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE)
            {
                if (xhr.status === 200)
                {
                    // Deletion successful; collect the response.
                    let jsonResponseDelete = JSON.parse(xhr.responseText);

                    // Re-draw the table.
                    searchContacts();

                    // That's it!
                    return;
                }
                else
                {
                    // Something went wrong. If the status is 500, that's a server error such as it being offline.
                    // Because deletion failed, we will just do nothing.
                    return;
                }
            }
        };
        xhr.send(JSONdelete);
    }
}

// searchContact(), deleteContact() and confirm deletion, UI to create new HTML when searching contacts. And code so it re-performs a search or nah?
// Mainly UI for deletion/editing as that code is already done to actually perform it.
// Remaining:
//      - SearchContacts features (ListContact? Same as SearchContacts but as if you searched with an empty string)
//      - DeleteContact features (only the UI code and sending the contact to be deleted to the appropriate API)
//      - EditContact features (only the UI code and sending the contact to be edited to the appropriate API and editcontact.html screen)