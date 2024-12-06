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
      'CALL sp_saveCreateRtoUser(?, ?, ?, ?, ?, ?, ?, @OUTUserID, @ErrorCode);',
      [UserID, Username, UserPassword, FullName, ContactNo, RtoID, EntryUserID]
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

export default router;
