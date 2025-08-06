package ca.bc.gov.educ.ccof.selenium.TestCases;

import java.io.File;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.testng.IReporter;
import org.testng.ISuite;
import org.testng.ISuiteResult;
import org.testng.ITestResult;
import org.testng.xml.XmlSuite;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class CustomReporter implements IReporter {

    @Override
    public void generateReport(List<XmlSuite> xmlSuites, List<ISuite> suites, String outputDirectory) {
        try {
            DocumentBuilderFactory documentFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder documentBuilder = documentFactory.newDocumentBuilder();
            Document document = documentBuilder.newDocument();

            // Create root element
            Element root = document.createElement("testng-results");
            root.setAttribute("ignored", "0");
            root.setAttribute("total", String.valueOf(countTotalTests(suites)));
            root.setAttribute("passed", String.valueOf(countPassedTests(suites)));
            root.setAttribute("failed", String.valueOf(countFailedTests(suites)));
            root.setAttribute("skipped", String.valueOf(countSkippedTests(suites)));
            document.appendChild(root);

            // Create suite element
            Element suite = document.createElement("suite");
            suite.setAttribute("started-at", String.valueOf(System.currentTimeMillis()));
            suite.setAttribute("name", "Test suite");
            root.appendChild(suite);

            for (ISuite suiteItem : suites) {
                for (Map.Entry<String, ISuiteResult> entry : suiteItem.getResults().entrySet()) {
                    String testName = entry.getKey();
                    ISuiteResult suiteResult = entry.getValue();
                    Element test = document.createElement("test");
                    test.setAttribute("started-at", String.valueOf(System.currentTimeMillis()));
                    test.setAttribute("name", testName);
                    suite.appendChild(test);

                    // Process each test method
                    for (ITestResult result : suiteResult.getTestContext().getPassedTests().getAllResults()) {
                        addTestMethodToXml(document, test, result);
                    }
                    for (ITestResult result : suiteResult.getTestContext().getFailedTests().getAllResults()) {
                        addTestMethodToXml(document, test, result);
                    }
                    for (ITestResult result : suiteResult.getTestContext().getSkippedTests().getAllResults()) {
                        addTestMethodToXml(document, test, result);
                    }
                }
            }
            
            

            // Write the content into XML file
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            DOMSource domSource = new DOMSource(document);
            StreamResult streamResult = new StreamResult(new File(outputDirectory + "/testng-results.xml"));
            transformer.transform(domSource, streamResult);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void addTestMethodToXml(Document document, Element test, ITestResult result) {
        Element classElement = document.createElement("class");
        classElement.setAttribute("name", result.getTestClass().getName());
        test.appendChild(classElement);

        // Add test method results
        Element testMethod = document.createElement("test-method");
        testMethod.setAttribute("signature", result.getMethod().toString());
        testMethod.setAttribute("started-at", String.valueOf(result.getStartMillis()));
        testMethod.setAttribute("name", result.getMethod().getMethodName() + result.getEndMillis());
        testMethod.setAttribute("finished-at", String.valueOf(result.getEndMillis()));
        testMethod.setAttribute("duration-ms", String.valueOf(result.getEndMillis() - result.getStartMillis()));
        testMethod.setAttribute("status", result.getStatus() == ITestResult.FAILURE ? "FAIL" : "PASS");

        // Add exception details if the test failed
        if (result.getStatus() == ITestResult.FAILURE) {
            Element exception = document.createElement("exception");
            exception.setAttribute("class", result.getThrowable().getClass().getName());
            Element message = document.createElement("message");
            message.appendChild(document.createCDATASection(result.getThrowable().getMessage()));
            exception.appendChild(message);
            testMethod.appendChild(exception);
        }

        classElement.appendChild(testMethod);
    }

    private int countFailedTests(List<ISuite> suites) {
        int failedCount = 0;
        for (ISuite suite : suites) {
            for (ISuiteResult result : suite.getResults().values()) {
                failedCount += result.getTestContext().getFailedTests().getAllResults().size();
            }
        }
        return failedCount;
    }

    private int countPassedTests(List<ISuite> suites) {
        int passedCount = 0;
        for (ISuite suite : suites) {
            for (ISuiteResult result : suite.getResults().values()) {
                passedCount += result.getTestContext().getPassedTests().getAllResults().size();
            }
        }
        return passedCount;
    }

    private int countSkippedTests(List<ISuite> suites) {
        int skippedCount = 0;
        for (ISuite suite : suites) {
            for (ISuiteResult result : suite.getResults().values()) {
                skippedCount += result.getTestContext().getSkippedTests().getAllResults().size();
            }
        }
        return skippedCount;
    }

    private int countTotalTests(List<ISuite> suites) {
        int totalCount = 0;
        for (ISuite suite : suites) {
            for (ISuiteResult result : suite.getResults().values()) {
                totalCount += result.getTestContext().getAllTestMethods().length;
            }
        }
        return totalCount;
    }
}
