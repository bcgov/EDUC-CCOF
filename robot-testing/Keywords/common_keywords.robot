*** Settings ***
Library    SeleniumLibrary
Resource        ../resources/locators.robot
Resource        ../resources/variables.robot


*** Keywords ***

Open Browser To Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Page Contains Element    ${LOGIN_BUTTON}    5s

Click Login Button
    Click Element       ${LOGIN_BUTTON}
    Sleep    3s
    Log    Waited 30 seconds after clicking login
Select And Verify Dropdown list item
    [Arguments]    ${item_name}

    ${open_js}=    Catenate
    ...    const el = document.querySelector('[role="combobox"]');
    ...    if (el) {
    ...        const event = new MouseEvent('mousedown', { bubbles: true });
    ...        el.dispatchEvent(event);
    ...    }
    Execute JavaScript    ${open_js}

    Wait Until Keyword Succeeds    5 times    1s
    ...    Run Keyword And Ignore Error    Element Should Be Visible    xpath=//div[contains(@class,"v-list-item") and contains(., "${item_name}")]


    ${click_js}=    Catenate
    ...    const items = [...document.querySelectorAll("div.v-list-item")];
    ...    const target = items.find(el => el.textContent.trim() === "${item_name}");
    ...    if (target) target.click();
    Execute JavaScript    ${click_js}

    Wait Until Keyword Succeeds    5 times    1s
    ...    Element Text Should Be
    ...    xpath=//span[contains(@class, 'v-select__selection-text')]
    ...    ${item_name}

Handle Cancel If Present
    # Step 1: Check if Cancel button is visible
    ${cancel_exists}=    Run Keyword And Return Status    Element Should Be Visible    ${CANCEL_BUTTON}

    Run Keyword If    '${cancel_exists}' == 'True'    Click Element    ${CANCEL_BUTTON}
    Sleep    15S

    # Step 2: Wait for the confirmation dialog's <h3> and validate its text
    Run Keyword If    '${cancel_exists}' == 'True'
    ...    Wait Until Element Is Visible    xpath=//h3[contains(@class, 'dialog-header')]    10s

    Run Keyword If    '${cancel_exists}' == 'True'
    ...    Element Text Should Be    xpath=//h3[contains(@class, 'dialog-header')]    Cancel Application Warning

    Execute JavaScript      document.evaluate("//button[.//span[normalize-space()='Continue']]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.click();

Enter Value in hidden textbox
    [Arguments]    ${value}     ${heading_name}
    ${js}=    Catenate
    ...    const input = document.evaluate("//label[contains(text(), '${heading_name}')]/following::input[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    ...    if (input) {
    ...        input.value = "${value}";
    ...        input.dispatchEvent(new Event("input", { bubbles: true }));
    ...        input.dispatchEvent(new Event("change", { bubbles: true }));
    ...    }
    Execute JavaScript    ${js}

#Facility License and Service Details Page

Set Maximum Number For Under 36 Months
    [Arguments]    ${value}       ${NORMALIZE_SPACE_TEXT}
    Execute JavaScript
    ...         const labels = Array.from(document.querySelectorAll('label'));
    ...         labels.forEach(label => {
    ...             if (label.textContent.trim() === '${NORMALIZE_SPACE_TEXT}') {
    ...                 const inputId = label.getAttribute('for');
    ...                 const input = document.getElementById(inputId);
    ...                 if (input) {
    ...                     input.value = '${value}';
    ...                     input.dispatchEvent(new Event('input', { bubbles: true }));
    ...                 }
    ...             }
    ...         });


 Wait for Element to Load
        [Arguments]    ${locator}    ${timeout}=20s
        Wait Until Element Is Visible    ${locator}    ${timeout}

