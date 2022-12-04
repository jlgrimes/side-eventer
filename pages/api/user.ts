import Iron from '@hapi/iron';
import { NextApiRequest, NextApiResponse } from 'next';
import CookieService from '../../lib/cookie';

const user = async (req: NextApiRequest, res: NextApiResponse) => {
  let user;
  try {
    const cookie = CookieService.getAuthToken(req.cookies);
    user = await Iron.unseal(
      cookie,
      process.env.ENCRYPTION_SECRET ?? '',
      Iron.defaults,
    );
  } catch (error) {
    res.status(401).end();
  }

  // now we have access to the data inside of user
  // and we could make database calls or just send back what we have
  // in the token.

  res.json(user);
};

export default user;