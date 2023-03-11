import prisma from '../../../lib/prisma';

// GET_OR_CREATE /api/post/:id
export default async function handle(req, res) {
  const userId = req.query.id;
  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
        where: {
          id: String(req.params?.id),
        },
      });
      return {
        props: user,
      }
    res.json(user);
  } else if (req.method === 'POST') {
    const user = await prisma.user.create({
        data:
            {},
        })
        return {
        props: user,
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
