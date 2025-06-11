*** Settings ***
Library         SeleniumLibrary
Library         OperatingSystem
Resource        ../../Keywords/common_keywords.robot
Resource        ../../resources/locators.robot
Resource        ../../resources/variables.robot
Suite Setup     Open Browser To Login Page
Suite Teardown    Close Browser

*** Test Cases ***
Login and Start Application
    [Tags]    facilityinfo
    Click Login Button
    Wait Until Page Contains Element    ${LOGINBUTTONPAGE_TITLE}
    Wait Until Page Contains Element    ${USERNAME_FIELD}
    Input Text                          ${USERNAME_FIELD}    ${USER_ID}
    Input Password                      ${PASSWORD_FIELD}    ${PASSWORD}
    Click Button                        ${CONTINUE_BUTTON}
    Sleep    10s
    #Key word only valid till the test case completes
    Handle Cancel If Present
    Wait for Element to Load            ${LANDINGPAGE1_TITLE}
    Element Should Be Visible           ${LANDINGPAGE1_TITLE}
    Element Should Be Visible    ${LANDINGPAGE1_SUBSECTION_TITLE}
    Wait for Element to Load    ${START_APPLICATION1_BTN}
    Click Button                        ${START_APPLICATION1_BTN}
    Wait for Element to Load            ${LANDINGPAGE2_TITLE}
    Element Should Be Visible    ${LANDINGPAGE2_TITLE}
    Wait for Element to Load    ${START_APPLICATION2_BTN}
    Click Button                       ${START_APPLICATION2_BTN}
    Wait for Element to Load            ${LANDINGPAGE3_TITLE}
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
    Input Text    ${CITY_TOWN_ORG_FIELD}  ${CITY_TOWN_ORG_TEXT}
    Input Text    ${POSTALCODE_ORG_FIELD}  ${POSTALCODE_ORG_TEXT}
    Select And Verify Dropdown list item  BC
    Execute JavaScript      document.querySelector("input[value='true'][name='same-mailing-address-button']").click()
    Input Text    ${ORGANISATION_CONTACT_NAME_FIELD}   ${ORGANISATION_CONTACT_NAME}
    Input Text    ${POSITION_NAME_FIELD}          ${POSITION_NAME}
    Input Text      ${PHONE_NUMBER_FIELD}        ${PHONE_NUMBER}
    Input Text      ${EMAIL_ADDRESS_FIELD}        ${EMAIL_ADDRESS}
    Click Element   ${ORG_PG_NXT_BTTN_FIELD}
    #FACILITY INFORMATION PAGE
    Wait for Element to Load    ${FACILITY_INFOPG_TITLE}
    Wait Until Page Contains Element        ${FACILITY_INFOPG_TITLE}
    Input Text          ${FACILITY_NAME_FIELD}       ${FACILITY_NAME}
    Input Text      ${FACILITY_OPERATION_YEAR_FIELD}       ${FACILITY_OPERATION_YEAR}
    Execute JavaScript      document.querySelector("input[value='true'][name='same-org-address-button']").click();
    Sleep    1s
    Execute JavaScript    document.querySelector("input[value='true'][name='same-org-signing-authority-contact-button']").click()
    Input Text      ${FACILITY_LICENCE_NO_FIELD}        ${FACILITY_LICENCE_NO}
    Input Text      ${LICENCE_NO_DATE_FIELD}        ${LICENCE_NO_DATE}

    Select And Verify Dropdown list item  Fraser Health
    Execute JavaScript    document.querySelector("input[value='100000001']").click();
    Click Element           ${FACILITY_PG_NXT_BTTN_FIELD}

    #Facility Licence and Service Details
    Wait for Element to Load    ${FACILITY_LICENCE_PAGE_TITLE}
    #heading
    Wait Until Page Contains Element       ${FACILITY_LICENCE_PAGE_TITLE}
    Input Text    ${MAXIMUM_DAYS_PERWEEK_FIELD}         ${MAXIMUM_DAYS_PERWEEK}
    Input Text    ${MAXIMUM_WEEK_PERYEAR_FIELD}         ${MAXIMUM_WEEK_PERYEAR}
    Input Text    ${FACILITY_HOURS_FROM_FIELD}          ${FACILITY_HOURS_FROM}
    Input Text    ${FACILITY_HOURS_TO_FIELD}            ${FACILITY_HOURS_TO}

    #Radiobutton
    Execute JavaScript    document.evaluate("//div[contains(@class,'v-input') and .//div[contains(., 'Are there months when ALL of the programs at this facility are closed for the entire month?')]]//input[@type='radio' and @value='0']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue?.click();
    #checkbox
    Execute JavaScript    document.getElementById("under-36months-checkbox").click()
    #checkbox subfield
    Set Maximum Number For Under 36 Months   5   Maximum Number for Group Child Care (Under 36 Months)
    Set Maximum Number For Under 36 Months   5   Maximum Licensed Capacity
    #Radiobutton
    Execute JavaScript    document.evaluate("//div[contains(@class,'v-input') and .//div[contains(., 'Is the facility located on school property?')]]//input[@type='radio' and @value='0']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue?.click();
    Execute Javascript      document.evaluate("//div[contains(@class,'v-input') and .//div[contains(., 'Do you regularly offer extended hours of child care')]]//input[@type='radio' and @value='0']",document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue?.click();
    Execute JavaScript    window.scrollTo(0, 1000)
    Click Element    ${FACILITY_LICENCE_NEXT_BUTTON}
    

    #confirmation page

 #verify header and facility name
    Wait for Element to Load    ${CONFIRMATION_FACILITY_TITLE}
    Wait Until Page Contains Element    ${CONFIRMATION_FACILITY_TITLE}
    Element Should Be Visible    ${FACILITY_NAME_VERIFICATION}
    Click Element    ${CONFIRMATION_FACILITY_PAGE_NO_BUTTON}
    Sleep    10s
    ${file_path}=           Join Path    ${CURDIR}      ..  ..  resources    img.png
    Choose File         ${FILE_UPLOAD_PLACEHOLDER}    ${file_path}
    Click Element       ${LICENCE_UPLOAD_NEXT_BUTTON}













