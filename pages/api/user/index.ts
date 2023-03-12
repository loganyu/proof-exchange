import prisma from '../../../lib/prisma';

// CREATE /api/post//:upid
export default async function handle(req, res) {
  const uid = req.params.uid;
  const pid = req.params.pid;
    let user = await prisma.user.create({
        data:
            {
                pubKey: uid,
                userProfilePubkey: pid
            },
        })
    return res.json(user);
}
