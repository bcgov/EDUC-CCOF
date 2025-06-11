*** Settings ***
Library    SeleniumLibrary
Resource    ../../Keywords/common_keywords.robot
Suite Setup    Open Browser To Dynamics SignIn Page
Suite Teardown    Close Browser

*** Variables ***
${DYNAMICS_LOGIN_URL}       https://mychildcareservicestest.crm3.dynamics.com/
${BROWSER}         chrome
${DYNAMICS_SIGHINPAGE_TITLE}     xpath=//*[@id="loginHeader"]/div
${DYNAMICS_SIGNIN_FIELD}   xpath=//*[@id="i0116"]
${DYNAMICS_SIGNIN_NXTBTTN}   xpath=//input[@id='idSIButton9']
${DYNAMICS_PASSWORDPAGE_TITLE}     xpath=//div[@role='heading']
${DYNAMICS_PASSWORD_FIELD}   xpath=//input[@id='i0118']
${DYNAMICS_SIGNIN_BUTTON}  xpath=//input[@id='idSIButton9']
${DYNAMICS_LOGIN_EMAILID}          OFMQASV1@gov.bc.ca
${DYNAMICS_PASSWORD}         Fun is when you win1!
${DYNAMICS_SIGNIN_DIALOG_TITLE}   xpath=//*[@id="dialogTitleText_1"]


*** Test Cases ***
Login With Credentials After Redirect
   [Tags]    Dynamiclogin

    Wait Until Page Contains Element    ${DYNAMICS_SIGHINPAGE_TITLE}    5s
    Wait Until Element Is Visible    ${DYNAMICS_SIGNIN_FIELD}
    Input Text    ${DYNAMICS_SIGNIN_FIELD}    ${DYNAMICS_LOGIN_EMAILID}
    Click Button    ${DYNAMICS_SIGNIN_NXTBTTN}
    Sleep   3s
    Input Password    ${DYNAMICS_PASSWORD_FIELD}     ${DYNAMICS_PASSWORD}
    Sleep   3s
    Click Button    ${DYNAMICS_SIGNIN_BUTTON}
    Sleep    3s
    Click Button   xpath=//input[@id='idSIButton9']
    Sleep    20s
   # Wait for Element to Load    xpath=//*[@id="dialogTitleText_1"]   30s
    #IF    Page Should Contain Element      ${DYNAMICS_SIGNIN_DIALOG_TITLE}
  Click Element   xpath=//span[normalize-space()='Sign In']/ancestor::button
  Sleep    10s
  Click Element    xpath=//*[@id="AppTileContainerSec_1_LI_1" and @data-appid="ccof_CaseManagementSystem_published"]
  Sleep    3s
   Wait Until Page Contains Element    xpath=//span[@id='Dashboard_Selector_fd0f3c92-b1d3-417a-a054-aa23d26f6bb0_text-value']
    Sleep   3s


*** Keywords ***
Open Browser To Dynamics SignIn Page
    Open Browser    ${DYNAMICS_LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Page Contains Element    ${DYNAMICS_SIGNIN_NXTBTTN}   5s

