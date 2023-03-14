import { IDL as ForumIDL } from './src/types/forum'
import { FORUM_PROG_ID } from './src/index';
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { ForumClient } from "./src/forum/forum.client"
import { stringifyPKsAndBNs } from './src/prog-common';
import { forumConfig } from "../forum/src/cli/config_devnet/forumConfig-devnet";
import { ForumFees, ReputationMatrix } from '../forum/src/forum/forum.client';
import { findForumAuthorityPDA } from './src/forum/forum.pda'
import { BN } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';

export class ForumWalletClient {
    forumClient: ForumClient 
    forumPubkey: PublicKey

    constructor(
        connection: Connection,
        wallet: WalletContextState,
        forumPubkey: PublicKey = new PublicKey('BbtyjiTGn2p3pKBrs6PuYQEfLk5sMyq1WreFZw9oJezY')
    ) {
        this.forumPubkey = forumPubkey;
        // @ts-ignore
        this.forumClient = new ForumClient(connection, wallet, ForumIDL, FORUM_PROG_ID)
    }

    // --------------------------------------------- forum manager instructions ---------------------------------------------

    async initForum(): Promise<string> {
        // console.log('initForum')
        const forum = Keypair.generate();
        this.forumPubkey = forum.publicKey
        const forumFees: ForumFees = forumConfig.forumFees;
        const reputationMatrix: ReputationMatrix = forumConfig.reputationMatrix;
        const forumInstance = await this.forumClient.initForum(
          forum,
          this.forumClient.wallet.publicKey,
          forumFees,
          reputationMatrix,
        );
        
        return stringifyPKsAndBNs(forumInstance);
      }
    
      async updateForumParams(): Promise<string> {
        // console.log('updateForumParams')
        const forumKey = new PublicKey(this.forumPubkey);
        const forumFees: ForumFees = forumConfig.forumFees;
        const reputationMatrix: ReputationMatrix = forumConfig.reputationMatrix;
    
        const updateForumParamsInstance = await this.forumClient.updateForumParams(
          forumKey,
          this.forumClient.wallet.publicKey,
          forumFees,
          reputationMatrix,
        );
        
        return stringifyPKsAndBNs(updateForumParamsInstance);
      }
    
      async payoutFromTreasury(receiverPubkey: string): Promise<string>  {
        // console.log('payoutFromTreasury')
    
        const rentBytes: number = 16;
    
        const forumKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
        const minimumBalanceForRentExemption: anchor.BN = new anchor.BN(await this.forumClient.conn.getMinimumBalanceForRentExemption(rentBytes));
    
        // console.log('Minimum balance for rent exemption for a data size of', rentBytes,
        //             'bytes is: ', stringifyPKsAndBNs(minimumBalanceForRentExemption));
    
        const payoutInstance = await this.forumClient.payoutFromTreasury(
            forumKey,
            this.forumClient.wallet.publicKey,
            receiverKey,
            minimumBalanceForRentExemption
        );
        return stringifyPKsAndBNs(payoutInstance);
      }
    
      async closeForum(receiverPubkey): Promise<string>  {
        console.log('closeForum')
        const forumKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
        const closeForumInstance = await this.forumClient.closeForum(
          forumKey,
          this.forumClient.wallet.publicKey,
          receiverKey,
        );
        return stringifyPKsAndBNs(closeForumInstance);
      }

      // ---------------------------------------------- user profile instructions ------------------------------------------
    
      async  createProfile(): Promise<any> {
        // console.log('createUserProfile')
        const forum = new PublicKey(this.forumPubkey);
    
        const profileInstance = await this.forumClient.createUserProfile(
          forum,
          this.forumClient.wallet.publicKey,
        );
        
        return stringifyPKsAndBNs(profileInstance);
      }
    
      async  editProfile(tokenMint): Promise<any> {
        // console.log('editProfile')
        const tokenMintKey = new PublicKey(tokenMint);
    
        const editInstance = await this.forumClient.editUserProfile(
          this.forumClient.wallet.publicKey,
          tokenMintKey
        );
        return stringifyPKsAndBNs(editInstance);
      }
    
    
      async deleteProfile(receiverPubkey= ''): Promise<any> {
        console.log('deleteProfile')
        const forumKey: PublicKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
    
        const deleteInstance = await this.forumClient.deleteUserProfile(
          forumKey,
          this.forumClient.wallet.publicKey,
          receiverKey,
        );
        return stringifyPKsAndBNs(deleteInstance);
      }
    
      async createAboutMe(content: string): Promise<any> {
        // console.log('createAboutMe')
        const aboutMeInstance = await this.forumClient.createAboutMe(
          this.forumPubkey,
          this.forumClient.wallet.publicKey,
          content,
        );
        console.log(stringifyPKsAndBNs(aboutMeInstance));
        return JSON.stringify(stringifyPKsAndBNs(aboutMeInstance));
      }

      async editAboutMe(new_content = ''){
        // console.log('editAboutMe')
        const editAboutMeInstance = await this.forumClient.editAboutMe(
            this.forumClient.wallet.publicKey,
            new_content
        );
        return stringifyPKsAndBNs(editAboutMeInstance);
      }
    
      async deleteAboutMe(receiverPubkey = ''): Promise<any> {
        // console.log('deleteAboutMe')
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
        const deleteAboutMeInstance = await this.forumClient.deleteAboutMe(
          this.forumClient.wallet.publicKey,
          receiverKey,
      );
        return JSON.stringify(stringifyPKsAndBNs(deleteAboutMeInstance));
      }

      async addModerator(userProfilePubkey: string): Promise<any> {
        // console.log('addModerator')
        const userProfileKey = new PublicKey(userProfilePubkey);
        const userProfileAcct = await this.forumClient.fetchUserProfileAccount(userProfileKey);
        const profileOwnerKey = userProfileAcct.profileOwner;

        const addModeratorInstance = await this.forumClient.addModerator(
          this.forumPubkey,
          this.forumClient.wallet.publicKey,
          profileOwnerKey
        );

        return stringifyPKsAndBNs(addModeratorInstance);
      }

      async removeModerator(userProfilePubkey: string): Promise<any> {
        // console.log('removeModerator')
        const userProfileKey = new PublicKey(userProfilePubkey);
        const userProfileAcct = await this.forumClient.fetchUserProfileAccount(userProfileKey);
        const profileOwnerKey = userProfileAcct.profileOwner;

        const removeModeratorInstance = await this.forumClient.removeModerator(
          this.forumPubkey,
          this.forumClient.wallet.publicKey,
          profileOwnerKey
      );

        return stringifyPKsAndBNs(removeModeratorInstance);
      }

      // ---------------------------------------------- user profile instructions ------------------------------------------

      async askQuestion(title, content, tag, bountyAmount): Promise<any> {
        // console.log('askQuestion')
        const forumKey = new PublicKey(this.forumPubkey);
    
        const questionInstance = await this.forumClient.askQuestion(
          forumKey,
          this.forumClient.wallet.publicKey,
          title,
          content,
          {[tag]: {}},
          new BN(bountyAmount)
        )
        return stringifyPKsAndBNs(questionInstance);
      }

      async addToQuestion(questionPubkey, newContent): Promise<any> {
        // console.log('addToQuestion')
        const forumKey = new PublicKey(this.forumPubkey);

        const questionKey = new PublicKey(questionPubkey);
        const questionAcct = await this.forumClient.fetchQuestionAccount(questionKey);
        const questionSeed = questionAcct.questionSeed;

        const addContentToQuestionInstance = await this.forumClient.addContentToQuestion(
          forumKey,
          this.forumClient.wallet.publicKey,
          questionSeed,
          newContent,
        );

        return stringifyPKsAndBNs(addContentToQuestionInstance);
      }


      async editQuestion(questionPubkey, title, content, tags): Promise<any> {
        // console.log('editQuestion')
        const forumKey = new PublicKey(this.forumPubkey);

        const questionKey = new PublicKey(questionPubkey);
        const questionAcct = await this.forumClient.fetchQuestionAccount(questionKey);
        const questionSeed = questionAcct.questionSeed;

        const editQuestionInstance = await this.forumClient.editQuestion(
          forumKey,
          this.forumClient.wallet.publicKey,
          questionSeed,
          title,
          content,
          tags,
        );
        console.log(stringifyPKsAndBNs(editQuestionInstance));

        return stringifyPKsAndBNs(editQuestionInstance);
      }

      async deleteQuestion(userProfileKey, questionPubkey, receiverPubkey = ''): Promise<any> {
        // console.log('deleteQuestion')
        const forumKey = new PublicKey(this.forumPubkey);
        
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;

        const questionKey = new PublicKey(questionPubkey);
        const questionAcct = await this.forumClient.fetchQuestionAccount(questionKey);
        const questionSeed = questionAcct.questionSeed;

        const userProfileAcct = await this.forumClient.fetchUserProfileAccount(userProfileKey);
        const profileOwnerKey = userProfileAcct.profileOwner;

        const deleteQuestionInstance = await this.forumClient.deleteQuestion(
          forumKey,
          this.forumClient.wallet.publicKey,
          profileOwnerKey,
          questionSeed,
          receiverKey
        );

        return stringifyPKsAndBNs(deleteQuestionInstance);
      }

      async supplementQuestionBounty(questionPubkey, amount): Promise<any> {
        const supplementalBountyAmount = new anchor.BN(amount);

        const questionKey = new PublicKey(questionPubkey);
        const questionAcct = await this.forumClient.fetchQuestionAccount(questionKey);
        const questionSeed = questionAcct.questionSeed;
        const forumKey = questionAcct.forum;
        const userProfileKey = questionAcct.userProfile;

        const userProfileAcct = await this.forumClient.fetchUserProfileAccount(userProfileKey);
        const profileOwnerKey = userProfileAcct.profileOwner;

        const supplementQuestionBountyInstance = await this.forumClient.supplementQuestionBounty(
          forumKey,
          this.forumClient.wallet.publicKey,
          profileOwnerKey,
          questionSeed,
          supplementalBountyAmount,
        );

        return stringifyPKsAndBNs(supplementQuestionBountyInstance)
      }

      async acceptAnswer(questionPubkey, answerPubkey, receiverPubkey): Promise<any> {
        const forumKey = new PublicKey(this.forumPubkey);
        
        const questionKey = new PublicKey(questionPubkey);
        const questionAcct = await this.forumClient.fetchQuestionAccount(questionKey);
        const questionSeed = questionAcct.questionSeed;

        const answerKey = new PublicKey(answerPubkey);
        const answerAcct = await this.forumClient.fetchAnswerAccount(answerKey);
        const answerSeed = answerAcct.answerSeed;
        const answerProfileOwnerKey = answerAcct.userProfile;

        const receiverKey = new PublicKey(receiverPubkey);

        const acceptAnswerInstance = await this.forumClient.acceptAnswer(
          forumKey,
          this.forumClient.wallet.publicKey,
          answerProfileOwnerKey,
          questionSeed,
          answerSeed,
          receiverKey,
        );
      
        return stringifyPKsAndBNs(acceptAnswerInstance);
      }

      async answerQuestion(questionPubkey, content): Promise<any> {
        const questionKey: PublicKey = new PublicKey(questionPubkey);

        const answerInstance = await this.forumClient.answerQuestion(
          questionKey,
          this.forumClient.wallet.publicKey,
          content,
        );
      
        return stringifyPKsAndBNs(answerInstance);
      }

      async addToAnswer(answerPubkey, additionalAnswerContent): Promise<any> {
        const answerKey = new PublicKey(answerPubkey);
        const answerAcct = await this.forumClient.fetchAnswerAccount(answerKey);
        // const forumKey: PublicKey = answerAcct.forum;
        const forumKey = new PublicKey(this.forumPubkey);
        const answerSeed = answerAcct.answerSeed;

        const newContent: string[] = additionalAnswerContent;

        const output = []
        for (let i=0; i < newContent.length; i++) {
          const addContentToQuestionInstance = await this.forumClient.addContentToQuestion(
              forumKey,
              this.forumClient.wallet.publicKey,
              answerSeed,
              newContent[i],
          );
          output.push(stringifyPKsAndBNs(addContentToQuestionInstance))
        }

        return output
      }

      async editAnswer(answerPubkey, content): Promise<any> {
        const answerKey: PublicKey = new PublicKey(answerPubkey);
        const answerAcct = await this.forumClient.fetchAnswerAccount(answerKey);
        const forumKey = answerAcct.forum;
        const answerSeed = answerAcct.answerSeed;

        const newContent: string = content;

        const editAnswerInstance = await this.forumClient.editAnswer(
          forumKey,
          this.forumClient.wallet.payer,
          answerSeed,
          newContent,
        );

        return stringifyPKsAndBNs(editAnswerInstance);
      }

      async deleteAnswer(answerPubkey, receiverPubkey): Promise<any> {
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;

        const answerKey = new PublicKey(answerPubkey);
        const answerAcct = await this.forumClient.fetchAnswerAccount(answerKey);
        const forumKey = answerAcct.forum;
        const answerSeed = answerAcct.answerSeed;
        const userProfileKey = answerAcct.userProfile;

        const userProfileAcct = await this.forumClient.fetchUserProfileAccount(userProfileKey);
        const profileOwnerKey = userProfileAcct.profileOwner;

        const deleteAnswerInstance = await this.forumClient.deleteAnswer(
          forumKey,
          this.forumClient.wallet.publicKey,
          profileOwnerKey,
          answerSeed,
          receiverKey
        );
        return stringifyPKsAndBNs(deleteAnswerInstance);
      }

      async leaveComment(commentedOn, content): Promise<any> {
        const forumKey = new PublicKey(this.forumPubkey);

        const commentedOnKey: PublicKey = new PublicKey(commentedOn);

        const commentInstance = await this.forumClient.leaveComment(
          forumKey,
          this.forumClient.wallet.publicKey,
          commentedOnKey,
          content,
        );
        console.log(stringifyPKsAndBNs(commentInstance));
      }

      async editComment(commentPubkey, newContent): Promise<any> {
        const commentKey: PublicKey = new PublicKey(commentPubkey);
        const commentAcct = await this.forumClient.fetchCommentAccount(commentKey);
        const forumKey = commentAcct.forum;
        const commentSeed = commentAcct.commentSeed;

        const editCommentInstance = await this.forumClient.editComment(
          forumKey,
          this.forumClient.wallet.publicKey,
          commentSeed,
          newContent,
        );
        return stringifyPKsAndBNs(editCommentInstance);
      }

      async deleteComment(commentPubkey, receiverPubkey): Promise<any> {
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;

        const commentKey = new PublicKey(commentPubkey);
        const commentAcct = await this.forumClient.fetchCommentAccount(commentKey);
        const forumKey = commentAcct.forum;
        const commentSeed = commentAcct.commentSeed;
        const userProfileKey = commentAcct.userProfile;

        const userProfileAcct = await this.forumClient.fetchUserProfileAccount(userProfileKey);
        const profileOwnerKey = userProfileAcct.profileOwner;

        const deleteCommentInstance = await this.forumClient.deleteComment(
          forumKey,
          this.forumClient.wallet.publicKey,
          profileOwnerKey,
          commentSeed,
          receiverKey
        );

        return stringifyPKsAndBNs(deleteCommentInstance);
      }

      // -------------------------------------------------- PDA account fetching instructions ------------------------------------------

      async fetchAllForums(managerPubkey = ''): Promise<any> {
        // console.log('fetchAllForums')
        const managerKey: PublicKey = managerPubkey ? new PublicKey(managerPubkey) : this.forumClient.wallet.publicKey;

        const forumPDAs = await this.forumClient.fetchAllForumPDAs(managerKey);

        const output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= forumPDAs.length; num++) {
            console.log('Forum account', num, ':');
            output.push(stringifyPKsAndBNs(forumPDAs[num - 1]))
        }

        return output;
      }

      async fetchForumByKey(managerPubkey = ''): Promise<any> {
        // console.log('fetchAllForums')
        const managerKey: PublicKey = managerPubkey ? new PublicKey(managerPubkey) : this.forumClient.wallet.publicKey;

        const forumPDA = await this.forumClient.fetchForumAccount(managerKey);

        return stringifyPKsAndBNs(forumPDA)
      }

      async fetchAllProfiles(): Promise<any> {
        const profilePDAs = await this.forumClient.fetchAllUserProfilePDAs();

        const output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= profilePDAs.length; num++) {
            output.push(stringifyPKsAndBNs(profilePDAs[num - 1]));
        }

        return output;
      }

      async fetchProfileByKey(userProfilePubkey): Promise<any> {
        const profileKey: PublicKey = new PublicKey(userProfilePubkey);

        const profilePDA = await this.forumClient.fetchUserProfileAccount(profileKey);

        return stringifyPKsAndBNs(profilePDA)
      }

      async fetchProfileByOwner(userProfileOwnerPubkey): Promise<any> {
        const profileOwnerKey: PublicKey = new PublicKey(userProfileOwnerPubkey);

        const profilePDAs = await this.forumClient.fetchAllUserProfilePDAs(profileOwnerKey);

        const output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= profilePDAs.length; num++) {
            output.push(stringifyPKsAndBNs(profilePDAs[num - 1]))
        }

        return output;
      }

      async fetchAboutMeByKey(aboutMePubkey): Promise<any> {
        const aboutMeKey: PublicKey = new PublicKey(aboutMePubkey);

        const aboutMePDA = await this.forumClient.fetchAboutMeAccount(aboutMeKey);

        return stringifyPKsAndBNs(aboutMePDA)
      }
      
      async fetchAboutMeByProfile(userProfilePubkey): Promise<any> {
        // console.log('fetchAboutMeForProfile')
        const userProfileKey: PublicKey = new PublicKey(userProfilePubkey);
    
        // console.log('Fetching about me PDA for user profile with pubkey: ', userProfileKey.toBase58());
        const aboutMePDAs = await this.forumClient.fetchAboutMeForProfile(userProfileKey);
    
        let output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= aboutMePDAs.length; num++) {
            output.push(stringifyPKsAndBNs(aboutMePDAs[num - 1]));
        }

        return output
      }

      async fetchAllQuestions(userProfilePubkey = ''): Promise<any> {
        console.log('fetchAllQuestions')
    
        const userProfileKey: PublicKey = userProfilePubkey ? new PublicKey(userProfilePubkey) : null;
    
        const questionPDAs = await this.forumClient.fetchAllQuestionPDAs(userProfileKey);
    
        let output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= questionPDAs.length; num++) {
            output.push(stringifyPKsAndBNs(questionPDAs[num - 1]));
        }

        return output
      }

      async fetchQuestionByKey(questionPubkey): Promise<any> {
        console.log('fetchQuestionByKey')

        const questionKey: PublicKey = new PublicKey(questionPubkey);
    
        const questionPDA = await this.forumClient.fetchQuestionAccount(questionKey);

        console.log('Displaying account info for question with pubkey: ', questionKey.toBase58());
        return stringifyPKsAndBNs(questionPDA);
      }

      async fetchAllAnswersByQuestion(questionPubkey): Promise<any> {
        const questionKey: PublicKey = new PublicKey(questionPubkey);

        console.log('Fetching all answer PDAs for question account with pubkey: ', questionKey.toBase58());
        const answerPDAs = await this.forumClient.fetchAllAnswerPDAsByQuestion(questionKey);

        const output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= answerPDAs.length; num++) {
            output.push(stringifyPKsAndBNs(answerPDAs[num - 1]))
        }

        return output;
      }

      async fetchForumAuth(forumPubkey): Promise<any> {
        console.log('fetchQuestionByKey')

        const forumKey: PublicKey = new PublicKey(forumPubkey);

        const [forumAuthKey, _forumAuthKeyBump] = await findForumAuthorityPDA(forumKey);

        return forumAuthKey.toBase58();
      }

      async fetchTreasuryBalance(forumPubkey): Promise<any> {
        const forumKey: PublicKey = new PublicKey(forumPubkey);
        const treasuryBalance = await this.forumClient.fetchTreasuryBalance(forumKey)

        return stringifyPKsAndBNs(treasuryBalance);
      }
}