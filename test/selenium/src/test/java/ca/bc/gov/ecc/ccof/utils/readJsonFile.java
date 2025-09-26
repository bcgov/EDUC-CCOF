package ca.bc.gov.ecc.ccof.utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class readJsonFile {
	// static String recThree;

	static String filepath = System.getProperty("user.dir") + "//data//CCFRIRec.json";
	static String propertyfile = System.getProperty("user.dir") + "//config.properties";

	public static String readPropFile(String value) throws IOException {
		Properties prop = new Properties();
		FileInputStream fis = new FileInputStream(propertyfile);
		prop.load(fis);
		String data = prop.getProperty(value);
		System.out.println("data: " + data);
		return data;
	}

	public static String readjsonFile(String value) throws FileNotFoundException, IOException, ParseException {

		JSONParser parser = new JSONParser();
		Object obj = parser.parse(new FileReader(filepath));

		JSONObject jsonObject = (JSONObject) obj;
		JSONObject statuses = (JSONObject) jsonObject.get("statuses");

		String recThree = (String) statuses.get("CCFRIRecThree");
		System.out.println("CCFRIRecThree value is: " + recThree);
		return recThree;
// TODO this is work under progress for reading json file

	}
}