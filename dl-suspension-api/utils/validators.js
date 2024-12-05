 const validateFields = (fields, requiredFields) => {
    const missingFields = requiredFields.filter((field) => !fields[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  };
  export default validateFields;
  