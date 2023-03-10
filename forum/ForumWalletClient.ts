import { IDL as ForumIDL } from './src/types/forum'
import { FORUM_PROG_ID } from './src/index';
import { Connection, SystemProgram, Transaction, Keypair, PublicKey } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { ForumClient } from "./src/forum/forum.client"
import { stringifyPKsAndBNs } from './src/prog-common';
import { forumConfig } from "../forum/src/cli/config_devnet/forumConfig-devnet";
import { ForumFees, ReputationMatrix } from '../forum/src/forum/forum.client';
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
        
        return JSON.stringify(stringifyPKsAndBNs(forumInstance));
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
        
        return JSON.stringify(stringifyPKsAndBNs(updateForumParamsInstance));
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
        return JSON.stringify(stringifyPKsAndBNs(payoutInstance));
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
        return JSON.stringify(stringifyPKsAndBNs(closeForumInstance));
      }
    
      async  createUserProfile(): Promise<string> {
        // console.log('createUserProfile')
        const forum = new PublicKey(this.forumPubkey);
    
        const profileInstance = await this.forumClient.createUserProfile(
          forum,
          this.forumClient.wallet.publicKey,
        );
        
        return JSON.stringify(stringifyPKsAndBNs(profileInstance));
      }
    
      async  editProfile(tokenMint): Promise<string> {
        // console.log('editProfile')
        const tokenMintKey = new PublicKey(tokenMint);
    
        const editInstance = await this.forumClient.editUserProfile(
          this.forumClient.wallet.publicKey,
          tokenMintKey
        );
        return JSON.stringify(stringifyPKsAndBNs(editInstance));
      }
    
    
      async deleteProfile(receiverPubkey= ''): Promise<string> {
        console.log('deleteProfile')
        const forumKey: PublicKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
    
        const deleteInstance = await this.forumClient.deleteUserProfile(
          forumKey,
          this.forumClient.wallet.publicKey,
          receiverKey,
        );
        return JSON.stringify(stringifyPKsAndBNs(deleteInstance));
      }
    
      async createAboutMe(content: string): Promise<string> {
        // console.log('createAboutMe')
        const aboutMeInstance = await this.forumClient.createAboutMe(
          this.forumPubkey,
          this.forumClient.wallet.publicKey,
          content,
        );
        console.log(stringifyPKsAndBNs(aboutMeInstance));
        return JSON.stringify(stringifyPKsAndBNs(aboutMeInstance));
      }
    
      async deleteAboutMe(receiverPubkey = ''): Promise<string> {
        // console.log('deleteAboutMe')
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
        const deleteAboutMeInstance = await this.forumClient.deleteAboutMe(
          this.forumClient.wallet.publicKey,
          receiverKey,
      );
        return JSON.stringify(stringifyPKsAndBNs(deleteAboutMeInstance));
      }

      async editAboutMe(new_content = ''){
        // console.log('editAboutMe')
        const editAboutMeInstance = await this.forumClient.editAboutMe(
            this.forumClient.wallet.publicKey,
            new_content
        );
        return JSON.stringify(stringifyPKsAndBNs(editAboutMeInstance));
      }
    
      async fetchAboutMeForProfile(userProfilePubkey): Promise<string> {
        // console.log('fetchAboutMeForProfile')
        const userProfileKey: PublicKey = new PublicKey(userProfilePubkey);
    
        // console.log('Fetching about me PDA for user profile with pubkey: ', userProfileKey.toBase58());
        const aboutMePDAs = await this.forumClient.fetchAboutMeForProfile(userProfileKey);
    
        let output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= aboutMePDAs.length; num++) {
            output.push('About me account', num, ':');
            output.push(stringifyPKsAndBNs(aboutMePDAs[num - 1]), {depth: null});
        }

        return JSON.stringify(output)
      }
    
      async fetchAllQuestions(userProfilePubkey): Promise<string> {
        console.log('fetchAllQuestions')
    
        const userProfileKey: PublicKey = new PublicKey(userProfilePubkey);
        console.log('Fetching all question PDAs for user profile with pubkey: ', userProfileKey.toBase58());
    
        const questionPDAs = await this.forumClient.fetchAllQuestionPDAs(userProfileKey);
    
        let output = []
        // Loop over all PDAs and display account info
        for (let num = 1; num <= questionPDAs.length; num++) {
            output.push('Question account', num, ':');
            output.push(stringifyPKsAndBNs(questionPDAs[num - 1]), {depth: null});
        }

        return JSON.stringify(output)
      }
}