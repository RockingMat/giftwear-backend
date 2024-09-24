import express from 'express';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/User';
import authMiddleware, { AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict' as const
  };
  res.cookie('jwt', token, cookieOptions);
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user
    }
  });
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }
    
    // Check if user exists && password is correct
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    // If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    if (err instanceof Error) {
        res.status(400).json({ status: 'fail', message: err.message });
      }  }
});

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.create({ username, email, password });
      createSendToken(user, 201, res);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ status: 'fail', message: err.message });
          }    }
  });

router.get('/logout', (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
});


// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;