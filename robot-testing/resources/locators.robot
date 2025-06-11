*** Settings ***
Resource        ../resources/variables.robot

*** Variables ***
${LOGIN_BUTTON}                     xpath=//a[contains(@href,'/api/auth/login')]
${USERNAME_FIELD}                   xpath=//input[@id='user']
${PASSWORD_FIELD}                   xpath=//input[@id='password']
${CONTINUE_BUTTON}                  xpath=//input[@value='Continue']
${LOGINBUTTONPAGE_TITLE}            xpath=//div[@id='login-to']
${CANCEL_BUTTON}                    XPATH=//button[@class='v-btn v-btn--slim v-theme--ccofLightTheme v-btn--density-default v-btn--size-default v-btn--variant-text red-button']
${CANCEL_CONTINUE_BUTTON}           XPATH=//button[.//span[normalize-space(text())='Continue']]
${LANDINGPAGE1_TITLE}               xpath=//div[@class='pb-12 text-h4 text-center']
${LANDINGPAGE1_SUBSECTION_TITLE}    XPATH=//p[contains(., 'Apply for Child Care Operating Funding') and .//strong[contains(text(), '(CCOF)')]]
${START_APPLICATION1_BTN}           xpath=//button[.//span[text()[normalize-space()='Start Application']]]
${LANDINGPAGE2_TITLE}               xpath=//*[@id="app"]/div/main/div[2]/p[1]
${START_APPLICATION2_BTN}           xpath=//*[@id="start-application"]
${LANDINGPAGE3_TITLE}               xpath=//p[@class='text-h4 text-center']
${LANDINGPAGE3_SUBSECTION_TITLE}    XPATH=//div[normalize-space()='Group Provider']
${START_APPLICATION3_BTN}           xpath=//*[@id="app"]/div/main/div[2]/div[1]/div[1]/div/div[4]/button
${ORGINFO_TITLE}                    xpath=//*[@id="app"]/div/main/div[3]/form/div/div[2]/h3
${ORG_TYPE_RADIOBUTTON}             xpath=//input[@id='input-46']
${LEGAL_ORG_NAME_FIELD}             xpath=//input[@id='input-55']
${INCORP_NUMBER_FIELD}              xpath=//input[@id='input-58']
${Enter_Address_Manually_Checkbox}  xpath=//input[@id='checkbox-61']
${MAILING_ADDRESS_FIELD}            xpath=//input[@id='input-90']
${CITY_TOWN_ORG_FIELD}              xpath=//input[@id='input-67']
${POSTALCODE_ORG_FIELD}             xpath=//input[@id='input-72']
${PROVINCE_ORG_FIELD}               xpath=//div[@class='v-field__input']
${PROVINCE_INPUT}                   xpath=//input[@id='input-69']
${PROVINCE_OPTION}                  xpath=//span[@class='v-select__selection-text' and normalize-space()='BC']
${ORGANISATION_CONTACT_NAME_FIELD}  xpath=//label[normalize-space()='Organization Contact Name']/following::input[1]
${POSITION_NAME_FIELD}              xpath=//label[normalize-space()='Position']/following::input[1]
${PHONE_NUMBER_FIELD}               xpath=//label[normalize-space()="Phone Number of the Organization's Authorized Signing Authority"]/following::input[1]
${EMAIL_ADDRESS_FIELD}              xpath=//label[normalize-space()="Email Address of the Organization's Authorized Signing Authority"]/following::input[1]
${ORG_PG_NXT_BTTN_FIELD}            xpath=//span[normalize-space()='Next']

#FACILITY INFORMATION PAGE
${FACILITY_INFOPG_TITLE}            XPATH=//h3[normalize-space()='Facility Information']
${FACILITY_NAME_FIELD}              xpath=//label[normalize-space()='Facility Name (as it appears on the Community Care and Assisted Living Act Licence)']/following::input[1]
${FACILITY_OPERATION_YEAR_FIELD}    xpath=//label[normalize-space()='Year Facility Began Operation (YYYY)']/following::input[1]
${FACILITY_LICENCE_NO_FIELD}        xpath=//label[normalize-space()='Facility Licence Number']/following::input[1]
${LICENCE_NO_DATE_FIELD}            xpath=//label[normalize-space()='Effective Date of Current Licence']/following::input[1]
${FACILITY_PG_NXT_BTTN_FIELD}       xpath=//span[normalize-space()='Next']

#Facility Licence and Service Details
${FACILITY_LICENCE_PAGE_TITLE}      xpath=//h3[normalize-space()='Facility Licence and Service Details']
${MAXIMUM_DAYS_PERWEEK_FIELD}       xpath=//label[normalize-space()='Maximum number of days per week you provide child care']/following::input[1]
${MAXIMUM_WEEK_PERYEAR_FIELD}       xpath=//label[normalize-space()='Maximum number of weeks per year you provide child care']/following::input[1]
${FACILITY_HOURS_FROM_FIELD}        xpath=//label[normalize-space()='Facility hours of operation from']/following::input[1]
${FACILITY_HOURS_TO_FIELD}          xpath=//label[normalize-space()='Facility hours of operation to']/following::input[1]
${FACILITY_LICENCE_NEXT_BUTTON}     xpath=//span[normalize-space()='Next']

#confirmation page

${CONFIRMATION_FACILITY_TITLE}      xpath=//p[@class='text-center mb-4']
${CONFIRMATION_FACILITY_PAGE_NO_BUTTON}     xpath=//span[@class='text-wrap'][normalize-space()='No']

#LICENCE UPLOAD
${FACILITY_NAME_VERIFICATION}       xpath=//span[normalize-space()='${FACILITY_NAME}']
${FILE_UPLOAD_PLACEHOLDER}          xpath=//input[@placeholder='Select your file']
${LICENCE_UPLOAD_NEXT_BUTTON}       xpath=//span[normalize-space()='Next']