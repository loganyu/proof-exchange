import prisma from '../../../lib/prisma';

// GET /api/user/:id/
export default async function handle(req, res) {
  if (req.method === 'GET') {
    const id = req.query.id;
    let user = await prisma.user.findUnique({
        where: {
            pubKey: id
        },
    });

    return res.json(user);
  } 
  else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
