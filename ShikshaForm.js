import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./Shiksha.css";
import locationData from "./data.json";

// Function to create default school structure
const createSchoolData = () => ({
  exists: false,
  category: "",
  medium: "",
  name: "",
  students: { girls: 0, boys: 0 },
  classes: { fourth: 0, fifth: 0, eighth: 0, tenth: 0 },
  principal: { name: "", contact: "" },
  smcMember: { name: "", contact: "" },
});

// **Reusable School Form Component**
const SchoolForm = ({ schoolType, formData, handleChange, handleShikshaExistChange }) => {
  // Ensure `formData[schoolType]` is defined before using its properties
  if (!formData[schoolType]) return null;

  return (
    <>
      <label>{schoolType} Exists?</label>
      <select onChange={(e) => handleShikshaExistChange(e, schoolType)} value={formData[schoolType]?.exists}>
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>

      {formData[schoolType]?.exists && (
        <div className="newform">
          <label>Category:</label>
          <input type="text" name="category" value={formData[schoolType]?.category || ""} onChange={(e) => handleChange(e, schoolType)} />

          <label>Medium:</label>
          <select name="medium" value={formData[schoolType]?.medium || ""} onChange={(e) => handleChange(e, schoolType)}>
            <option value="">Select Medium</option>
            <option value="Marathi">Marathi</option>
            <option value="English">English</option>
            <option value="Semi">Semi</option>
          </select>

          <label>School Name:</label>
          <input type="text" name="name" value={formData[schoolType]?.name || ""} onChange={(e) => handleChange(e, schoolType)} />

          <label>Students - Girls:</label>
          <input type="number" name="students.girls" value={formData[schoolType]?.students?.girls } onChange={(e) => handleChange(e, schoolType, "students")} />

          <label>Students - Boys:</label>
          <input type="number" name="students.boys" value={formData[schoolType]?.students?.boys} onChange={(e) => handleChange(e, schoolType, "students")} />

          <h4>Classes:</h4>
          <label>Fourth:</label>
          <input type="number" name="classes.fourth" value={formData[schoolType]?.classes?.fourth} onChange={(e) => handleChange(e, schoolType, "classes")} />

          <label>Fifth:</label>
          <input type="number" name="classes.fifth" value={formData[schoolType]?.classes?.fifth } onChange={(e) => handleChange(e, schoolType, "classes")} />

          <label>Eighth:</label>
          <input type="number" name="classes.eighth" value={formData[schoolType]?.classes?.eighth } onChange={(e) => handleChange(e, schoolType, "classes")} />

          <label>Tenth:</label>
          <input type="number" name="classes.tenth" value={formData[schoolType]?.classes?.tenth } onChange={(e) => handleChange(e, schoolType, "classes")} />

          <h4>Principal:</h4>
          <label>Name:</label>
          <input type="text" name="principal.name" value={formData[schoolType]?.principal?.name || ""} onChange={(e) => handleChange(e, schoolType, "principal")} />

          <label>Contact:</label>
          <input type="text" name="principal.contact" value={formData[schoolType]?.principal?.contact || ""} onChange={(e) => handleChange(e, schoolType, "principal")} />

          <h4>SMC Member:</h4>
          <label>Name:</label>
          <input type="text" name="smcMember.name" value={formData[schoolType]?.smcMember?.name || ""} onChange={(e) => handleChange(e, schoolType, "smcMember")} />

          <label>Contact:</label>
          <input type="text" name="smcMember.contact" value={formData[schoolType]?.smcMember?.contact || ""} onChange={(e) => handleChange(e, schoolType, "smcMember")} />
        </div>
      )}
    </>
  );
};

const ShikshaForm = () => {
  const [formData, setFormData] = useState({
    nameOfSurveyor: "Aditya Katare",
    state:"",
    village: "",
    gramPanchayat: "",
    taluk: "",
    district: "",
    pincode: "",
    population: { males: 0, females: 0, houses: 0, families: 0, total: 0 },
    govtSchool: createSchoolData(),
    pvtSchool: createSchoolData(),
    asm: createSchoolData(),
  });

  // **Handles changes for input fields**
  const handleChange = (e, schoolType, nestedField = null) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (nestedField) {
        return {
          ...prevData,
          [schoolType]: {
            ...prevData[schoolType],
            [nestedField]: {
              ...prevData[schoolType][nestedField],
              [name.split(".")[1]]: value,
            },
          },
        };
      }

      return {
        ...prevData,
        [schoolType]: {
          ...prevData[schoolType],
          [name]: value,
        },
      };
    });
  };

  // **Handles toggle for school existence**
  const handleShikshaExistChange = (e, schoolType) => {
    const value = e.target.value === "true";
    setFormData((prevData) => ({
      ...prevData,
      [schoolType]: value ? { ...prevData[schoolType], exists: true } : createSchoolData(),
    }));
  };

  // **Handles form submission**
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/shiksha/submit", formData);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  // Load States
  useEffect(() => {
    setStates(Object.keys(locationData));
  }, []);

  // Handle State Change
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, district: "", taluk: "", village: "", pincode: "" });

    if (selectedState) {
      setDistricts(Object.keys(locationData[selectedState]));
      setTalukas([]);
      setVillages([]);
    } else {
      setDistricts([]);
      setTalukas([]);
      setVillages([]);
    }
  };

  // Handle District Change
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData({ ...formData, district: selectedDistrict, taluk: "", village: "", pincode: "" });

    if (selectedDistrict) {
      setTalukas(Object.keys(locationData[formData.state][selectedDistrict]));
      setVillages([]);
    } else {
      setTalukas([]);
      setVillages([]);
    }
  };

  // Handle Taluka Change
  const handleTalukChange = (e) => {
    const selectedTaluk = e.target.value;
    setFormData({ ...formData, taluk: selectedTaluk, village: "", pincode: "" });

    if (selectedTaluk) {
      setVillages(locationData[formData.state][formData.district][selectedTaluk]);
    } else {
      setVillages([]);
    }
  };

  // Handle Village Change & Auto-fill Pincode
  const handleVillageChange = (e) => {
    const selectedVillage = e.target.value;
    const villageData = villages.find((v) => v.village === selectedVillage);

    setFormData({ ...formData, village: selectedVillage, pincode: villageData ? villageData.pincode : "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="image-container">
        <label>Surveyor Name</label>
        <input type="text" name="nameOfSurveyor" value={formData.nameOfSurveyor} readOnly className="readOnly" />
      </div>
   
     <label>State:</label>
      <select name="state" onChange={handleStateChange} value={formData.state}>
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      <label>District:</label>
      <select name="district" onChange={handleDistrictChange} value={formData.district}>
        <option value="">Select District</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>

      <label>Taluka:</label>
      <select name="taluk" onChange={handleTalukChange} value={formData.taluk}>
        <option value="">Select Taluka</option>
        {talukas.map((taluka) => (
          <option key={taluka} value={taluka}>
            {taluka}
          </option>
        ))}
      </select>

      <label>Village:</label>
      <select name="village" onChange={handleVillageChange} value={formData.village}>
        <option value="">Select Village</option>
        {villages.map((v) => (
          <option key={v.village} value={v.village}>
            {v.village}
          </option>
        ))}
      </select>

      <label>Pincode:</label>
      <input type="text" name="pincode" value={formData.pincode} readOnly className="readOnly" />


      <label>Gram Panchayat<span className="required">*</span>:</label>
      <input type="text" name="gramPanchayat" onChange={handleChange} required />

     


      <SchoolForm schoolType="govtSchool" formData={formData} handleChange={handleChange} handleShikshaExistChange={handleShikshaExistChange} />
      <SchoolForm schoolType="pvtSchool" formData={formData} handleChange={handleChange} handleShikshaExistChange={handleShikshaExistChange} />
      <SchoolForm schoolType="asm" formData={formData} handleChange={handleChange} handleShikshaExistChange={handleShikshaExistChange} />

      <button type="submit">Submit</button>
    </form>
  );
};

export default ShikshaForm;
