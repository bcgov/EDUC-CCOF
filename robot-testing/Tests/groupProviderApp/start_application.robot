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
${LOGINBUTTONPAGE_TITLE}   xpath=//div[@id='login-to']
${LANDINGPAGE1_TITLE}       xpath=//div[@class='pb-12 text-h4 text-center']
${LANDINGPAGE1_SUBSECTION_TITLE}  XPATH=//p[contains(., 'Apply for Child Care Operating Funding') and .//strong[contains(text(), '(CCOF)')]]
${START_APPLICATION1_BTN}   xpath=//button[.//span[text()[normalize-space()='Start Application']]]
${LANDINGPAGE2_TITLE}       xpath=//*[@id="app"]/div/main/div[2]/p[1]
${START_APPLICATION2_BTN}       xpath=//*[@id="start-application"]

*** Test Cases ***
Login and Start Application
    [Tags]    startapplication
    Click Login Button
     Wait Until Page Contains Element    ${LOGINBUTTONPAGE_TITLE}    2s
    Wait Until Page Contains Element    ${USERNAME_FIELD}    2s
    Input Text                          ${USERNAME_FIELD}    ${USER_ID}
    Input Password                      ${PASSWORD_FIELD}    ${PASSWORD}
    Click Button                        ${CONTINUE_BUTTON}
    Sleep    7s
    Element Should Be Visible           ${LANDINGPAGE1_TITLE}
    Element Should Be Visible    ${LANDINGPAGE1_SUBSECTION_TITLE}
    Click Button                        ${START_APPLICATION1_BTN}
    Sleep    5s
    Element Should Be Visible    ${LANDINGPAGE2_TITLE}
    Click Button                       ${START_APPLICATION2_BTN}
    Sleep    5s

    Log                                 Start Application button clicked

*** Keywords ***
Open Browser To Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Page Contains Element    ${LOGIN_BUTTON}    5s

Click Login Button
    Click Element       ${LOGIN_BUTTON}
    Sleep    3s
    Log    Waited 30 seconds after clicking login