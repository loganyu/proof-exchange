import prisma from '../../../lib/prisma';

// GET_OR_CREATE /api/post/:id
export default async function handle(req, res) {
  const pubKey = req.params.id;
  if (req.method === 'POST') {
    let user = await prisma.user.findUnique({
        where: {
            pubKey: pubKey
        },
    });
    if (!user) {
        user = await prisma.user.create({
            data:
                {pubKey: pubKey},
            })
    }
    return res.json(user);
  } else if (req.method === 'GET') {
    let user = await prisma.user.findUnique({
        where: {
            pubKey: pubKey
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
