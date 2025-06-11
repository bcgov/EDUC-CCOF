*** Settings ***
Library    SeleniumLibrary
Suite Setup    Open Browser To Login Page
Suite Teardown    Close Browser

*** Variables ***
${LOGIN_URL}       https://qa.mychildcareservices.gov.bc.ca/login
${BROWSER}         chrome
${LOGIN_BUTTON}    xpath=//a[contains(@href,'/api/auth/login')]
${USERNAME_FIELD}   xpath=//input[@id='user']
${PASSWORD_FIELD}   xpath=//input[@id='password']
${CONTINUE_BUTTON}  xpath=//input[@value='Continue']
${USER_ID}          OFMQA218
${PASSWORD}         WelcomeQA218
${EXPECTED_TITLE}   xpath=//div[@id='login-to']

*** Test Cases ***
Login With Credentials After Redirect
   [Tags]    Portallogin
    Click Login Button
    Wait Until Page Contains Element    ${EXPECTED_TITLE}    5s
    Wait Until Element Is Visible    ${USERNAME_FIELD}    5s
    Input Text    ${USERNAME_FIELD}    ${USER_ID}
    Sleep   3s
    Input Password    ${PASSWORD_FIELD}    ${PASSWORD}
    Sleep   3s
    Click Button    ${CONTINUE_BUTTON}
    Sleep   3s
    Log    Login credentials submitted

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Page Contains Element    ${LOGIN_BUTTON}    5s

Click Login Button
    Click Element       ${LOGIN_BUTTON}
    Sleep    20
    Log    Waited 20 seconds after clicking login