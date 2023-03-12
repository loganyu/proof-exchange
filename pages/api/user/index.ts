import prisma from '../../../lib/prisma';

// CREATE /api/user/
export default async function handle(req, res) {
    const uid = req.body.uid;
    const pid = req.body.pid;
    let user = await prisma.user.create({
        data:
            {
                pubKey: uid,
                profilePubkey: pid
            },
        })
    return res.json(user);
}
