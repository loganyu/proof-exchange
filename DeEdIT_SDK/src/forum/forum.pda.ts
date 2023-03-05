import { PublicKey } from '@solana/web3.js';
import { FORUM_PROG_ID } from '../index';

export const findForumAuthorityPDA = async (forum: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [forum.toBytes()],
        FORUM_PROG_ID
    );
};

export const findForumTreasuryPDA = async (forum: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('treasury'), forum.toBytes()],
        FORUM_PROG_ID
    );
};

export const findUserProfilePDA = async (profileOwner: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('user_profile'), profileOwner.toBytes()],
        FORUM_PROG_ID
    );
};

export const findAboutMePDA = async (userProfile: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('about_me'), userProfile.toBytes()],
        FORUM_PROG_ID
    );
};

export const findQuestionPDA = async (forum: PublicKey, userProfile: PublicKey, questionSeed: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('question'), forum.toBytes(), userProfile.toBytes(), questionSeed.toBytes()],
        FORUM_PROG_ID
    );
};

export const findBountyPDA = async (question: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('bounty_pda'), question.toBytes()],
        FORUM_PROG_ID
    );
};
