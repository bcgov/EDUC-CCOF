package ca.bc.gov.ecc.ccof.testrunner;

import org.testng.TestNG;
import java.util.ArrayList;
import java.util.List;

public class TestInvalidLoginRunner {
    public static void main(String[] args) {
        TestNG testng = new TestNG();
        
        // Create a list of test classes to run
        List<String> suiteFiles = new ArrayList<>();
        suiteFiles.add("TestInvalidLogin.xml");
        
        testng.setTestSuites(suiteFiles);
        testng.run();
    }
}