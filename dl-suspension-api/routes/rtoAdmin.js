import express from 'express';
import pool from '../db.js';
import validateFields from '../utils/validators.js'; // Default import
const router = express.Router();

router.post('/create-rto-user', async (req, res) => {
  try {
    const {
      UserID,
      Username,
      UserPassword,
      FullName,
      ContactNo,
      RtoID,
      OperationStatus,
      EntryUserID,
    } = req.body;

    // Validate required fields using the validateFields function
    try {
      validateFields(req.body, [
        'UserID',
        'Username',
        'UserPassword',
        'FullName',
        'ContactNo',
        'RtoID',
        'OperationStatus',
        'EntryUserID',
      ]);
    } catch (error) {
      return res.status(400).json({
        status: 1,
        message: error.message,
        data: null,
      });
    }

    // Call the stored procedure
    const [spResult] = await pool.query(
      'CALL sp_saveCreateRtoUser(?, ?, ?, ?, ?, ?, ?, ?, @OUTUserID, @ErrorCode);',
      [UserID, Username, UserPassword, FullName, ContactNo, RtoID, OperationStatus, EntryUserID]
    );
    
    const [errorCodeResult] = await pool.query('SELECT @ErrorCode AS ErrorCode, @OUTUserID as OUTUserID;');
    
    const errorCode = errorCodeResult[0].ErrorCode;
    console.error(errorCode)
    // Extract the ErrorCode from the result

    // Handle ErrorCode
    switch (errorCode) {
      case 0:
        return res.json({
          status: 0,
          message: 'User created successfully',
          data: null,
        });
      case 2:
        return res.status(409).json({
          status: 1,
          message: 'Username already exists',
          data: null,
        });
      default:
        return res.status(500).json({
          status: 1,
          message: 'An unexpected error occurred',
          data: null,
        });
    }
  } catch (error) {
    console.error('Error while creating RTO user:', error);
    res.status(500).json({
      status: 1,
      message: 'Internal server error',
      data: null,
    });
  }
});
router.get('/get-rto-user-details', async (req, res) => {
  try {
    const { UserID } = req.query; // Get UserID from query params

    // Validate that UserID is provided

    // Validate required fields using the validateFields function
    try {
      validateFields(req.query, [
        'UserID' 
      ]);
    } catch (error) {
      return res.status(400).json({
        status: 1,
        message: error.message,
        data: null,
      });
    }
    // Call the stored procedure
    const [spResult] = await pool.query(
      'CALL sp_getRTOUserDetails(?);',
      [UserID]  // Pass UserID as a parameter to the stored procedure
    );

    // Check if the result contains data
    if (spResult && spResult.length > 0) {
      const userDetails = spResult[0][0];  // Extract the user details from the result

      return res.json({
        status: 0,
        message: 'User details fetched successfully',
        data: userDetails,
      });
    } else {
      // If no user is found
      return res.status(404).json({
        status: 1,
        message: 'User not found',
        data: null,
      });
    }

  } catch (error) {
    console.error('Error while fetching RTO user details:', error);
    return res.status(500).json({
      status: 1,
      message: 'Internal server error',
      data: null,
    });
  }
});


export default router;
