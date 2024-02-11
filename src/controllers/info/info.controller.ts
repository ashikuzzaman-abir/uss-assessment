import { Request, Response } from 'express';

const infoController = (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Md. Ashikuzzaman Abir',
    designation: 'Software Engineer',
    company: 'Thinkcrypt.io',
    github: 'https://github.com/ashikuzzaman-abir',
    email: 'ashikuzzamanabir@hotmail.com',
  });
};
export default infoController;
