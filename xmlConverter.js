import xml2js from 'xml2js';
import JSONToCSV from 'json2csv';
import xmlFile from "./Facility.js"
import FileSystem from "fs"


export default function converter(data,fileName){
    let parser = new xml2js.Parser({
        explicitArray:false,
    })
    parser.parseString(data, function (err, result){//Parses xml string to JSON
        if(err) throw new Error(err)

        const parsed = result.Table_Facility.T_Facility //keying into proper level of JSON object
        let mapped = parsed.map(data =>{ //returning array of formated objects with appropriate mapping
            return {
                property_id:data.Facility_ID || "", //added the or condition to return an empty string rather than "undefined"
                account_number:data.Facility_Account_Number || "",
                name: data.Facility_Name || "",
                address1:data.Service_Address_Street_Name || "",
                city:data.Service_Address_City || "",
                state_prov:data.Service_Address_State || "",
                postal_code:data.Service_Address_Zip_Code || "",
                primary_contact_id:data.Facility_Contact_Mgr_ID || ""
            }
        })
        const csv = JSONToCSV.parse(mapped,//intaking mapped array of JSON objects and formating them into csv
            {fields: [
                "property_id",
                "account_number",
                "name",
                "address1",
                "city",
                "state_prov",
                "postal_code",
                "primary_contact_id"
            ]
            })
            console.log(csv)
        FileSystem.writeFileSync(`./${fileName}.csv`,csv) //writing file with passed in file name
    })
}


//Example:
//converter(xmlFile,"tester")
