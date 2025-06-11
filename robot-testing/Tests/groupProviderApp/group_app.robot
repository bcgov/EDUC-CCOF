*** Settings ***
Library    SeleniumLibrary
Resource   ../../Keywords/common_keywords.robot
Resource        ../../resources/locators.robot
Resource        ../../resources/variables.robot
Suite Setup    Open Browser To Login Page
Suite Teardown    Close Browser

*** Test Cases ***
Login and Start Application
    [Tags]    GroupApplication
    Click Element       ${LOGIN_BUTTON}
    Sleep    3s
    Wait Until Page Contains Element    ${LOGINBUTTONPAGE_TITLE}
    Wait Until Page Contains Element    ${USERNAME_FIELD}
    Input Text                          ${USERNAME_FIELD}    ${USER_ID}
    Input Password                      ${PASSWORD_FIELD}    ${PASSWORD}
    Click Button                        ${CONTINUE_BUTTON}
    Sleep    10s
    #Key word only valid till the test case completes
    Handle Cancel If Present
    Sleep    20s

    Element Should Be Visible           ${LANDINGPAGE1_TITLE}
    Element Should Be Visible    ${LANDINGPAGE1_SUBSECTION_TITLE}  3s
    Click Button                        ${START_APPLICATION1_BTN}
    Sleep    2s
    Element Should Be Visible    ${LANDINGPAGE2_TITLE}
    Click Button                       ${START_APPLICATION2_BTN}
    Sleep    2s
    Element Should Be Visible    ${LANDINGPAGE3_TITLE}
    Element Should Be Visible    ${LANDINGPAGE3_SUBSECTION_TITLE}
    Click Button                       ${START_APPLICATION3_BTN}
    Wait Until Page Contains Element    ${ORGINFO_TITLE}
    Execute JavaScript    document.querySelector("input[value='100000002']").click()
    Input Text    ${LEGAL_ORG_NAME_FIELD}    ${LEGAL_ORG_NAME_TEXT}
    Input Text    ${INCORP_NUMBER_FIELD}    ${INCORP_NUMBER_TEXT}
    Execute JavaScript    document.getElementById("checkbox-61").click()
    Sleep    5s
    Input Text    ${MAILING_ADDRESS_FIELD}   ${MAILING_ADDRESS_TEXT}
    Input Text    ${CITY/TOWN_ORG_FIELD}  ${CITY/TOWN_ORG_TEXT}
    Input Text    ${POSTALCODE_ORG_FIELD}  ${POSTALCODE_ORG_TEXT}
    Select And Verify Dropdown list item  BC
    Execute JavaScript      document.querySelector("input[value='true'][name='same-mailing-address-button']").click()
    Input Text    xpath=//label[normalize-space()='Organization Contact Name']/following::input[1]   test organisation
    Input Text    xpath=//label[normalize-space()='Position']/following::input[1]    QA
    Input Text    xpath=//label[normalize-space()="Phone Number of the Organization's Authorized Signing Authority"]/following::input[1]    6470000000
    Input Text    xpath=//label[normalize-space()="Email Address of the Organization's Authorized Signing Authority"]/following::input[1]    ofmqa01@gmail.com
    Click Element    xpath=//span[normalize-space()='Next']













