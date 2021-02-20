import { Request, Response } from "express";
import { UserModel } from "../models/user";
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";

interface IDecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export default {
  async signup(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email}).exec();
    if (user) {
      return res.status(200).json({
        status: "error",
        message: "ALREADY EXISTS"
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);
    await UserModel.create({ email, password: hashedPass, privateContent: false });
    return res.status(201).json({
      status: "success",
      message: "USER CREATED"
    });
  },
  
  async signin(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return res.status(200).json({
        status: "error",
        message: "USER DOES NOT EXIST"
      });
    }
    const hashedPass = user.password;
    const passOk = await bcrypt.compare(password, hashedPass);
    if (!passOk) {
      return res.status(200).json({
        status: "error",
        message: "INCORRECT PASSWORD",
      });
    }
    
    const privateKEY  = fs.readFileSync('./src/config/private.key', 'utf8');

    const token = jwt.sign({
      id: user._id,
      email,
    }, privateKEY, {
      expiresIn: 60,
      algorithm: 'RS256',
    });

    return res.status(200).json({
      status: "success",
      message: "USER LOGGED IN",
      token: `${token}`,
    });
  },

  async content(req: Request, res: Response) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if(!token){
      return res.status(200).json({
        status: "error",
        message: "TOKEN NOT PROVIDED",
        publicContent: 'This is public content',
      });
    }
    const publicKEY  = fs.readFileSync('./src/config/public.key', 'utf8');
    try {
      const decoded = jwt.verify(token, publicKEY, {
        algorithms: ['RS256']
      }) as IDecodedToken;
      const profile = await UserModel.findOne({_id: new Types.ObjectId(decoded.id)});
      if(!profile){
        return res.status(200).json({
          status: "error",
          message: "USER DOES NOT EXIST",
          publicContent: 'This is public content',
        });
      }
      res.status(200).json({
        status: "success",
        message: "USER LOGGED IN",
        authenticatedContent: profile.privateContent ? 'This is private content' : undefined,
        publicContent: 'This is public content',
        authorizedContent: 'This is authorized content',
      });
    } catch(err){
      res.status(200).json({
        status: "error",
        message: "INVALID TOKEN",
        publicContent: 'This is public content',
      });
    }
    
  }
}
