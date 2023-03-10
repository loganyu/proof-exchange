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

    async initForum(){
        console.log('initForum')
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
        
        console.log(stringifyPKsAndBNs(forumInstance));
      }
    
      async updateForumParams(){
        console.log('updateForumParams')
        const forumKey = new PublicKey(this.forumPubkey);
        const forumFees: ForumFees = forumConfig.forumFees;
        const reputationMatrix: ReputationMatrix = forumConfig.reputationMatrix;
    
        const updateForumParamsInstance = await this.forumClient.updateForumParams(
          forumKey,
          this.forumClient.wallet.publicKey,
          forumFees,
          reputationMatrix,
        );
        console.log(stringifyPKsAndBNs(updateForumParamsInstance));
      }
    
      async payoutFromTreasury(receiverPubkey: string) {
        console.log('payoutFromTreasury')
    
        const rentBytes: number = 16;
    
        const forumKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey? new PublicKey(receiverPubkey) : wallet.publicKey;
        const minimumBalanceForRentExemption: anchor.BN = new anchor.BN(await connection.getMinimumBalanceForRentExemption(rentBytes));
    
        console.log('Minimum balance for rent exemption for a data size of', rentBytes,
                    'bytes is: ', stringifyPKsAndBNs(minimumBalanceForRentExemption));
    
        const payoutInstance = await this.forumClient.payoutFromTreasury(
            forumKey,
            this.forumClient.wallet.publicKey,
            receiverKey,
            minimumBalanceForRentExemption
        );
        console.log(stringifyPKsAndBNs(payoutInstance));
      }
    
      async closeForum(receiverPubkey) {
        console.log('closeForum')
        const forumKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
        const closeForumInstance = await this.forumClient.closeForum(
          forumKey,
          this.forumClient.wallet.publicKey,
          receiverKey,
        );
        console.log(stringifyPKsAndBNs(closeForumInstance));
      }
    
      async  createUserProfile(){
        console.log('createUserProfile')
        const forum = new PublicKey(this.forumPubkey);
    
        const profileInstance = await this.forumClient.createUserProfile(
          forum,
          this.forumClient.wallet.publicKey,
        );
        
        
        console.log(stringifyPKsAndBNs(profileInstance));
      }
    
      async  editProfile(){
        console.log('editProfile')
        const tokenMint = ''
        const tokenMintKey = new PublicKey(tokenMint);
    
        const editInstance = await this.forumClient.editUserProfile(
          this.forumClient.wallet.publicKey,
          tokenMintKey
        );
        console.log(stringifyPKsAndBNs(editInstance));
      }
    
    
      async deleteProfile(receiverPubkey= ''){
        console.log('deleteProfile')
        const forumKey: PublicKey = new PublicKey(this.forumPubkey);
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.forumClient.wallet.publicKey;
    
    
        const deleteInstance = await this.forumClient.deleteUserProfile(
          forumKey,
          this.forumClient.wallet.publicKey,
          receiverKey,
        );
        console.log(stringifyPKsAndBNs(deleteInstance));
      }
    
      async createAboutMe(content: string){
        console.log('createAboutMe')
    
    
        const aboutMeInstance = await this.forumClient.createAboutMe(
          this.forumPubkey,
          this.wallet.publicKey,
          content,
        );
        console.log(stringifyPKsAndBNs(aboutMeInstance));
      }
    
      async deleteAboutMe(receiverPubkey = ''){
        console.log('deleteAboutMe')
    
        const receiverKey: PublicKey = receiverPubkey ? new PublicKey(receiverPubkey) : this.wallet.publicKey;
    
        const deleteAboutMeInstance = await this.forumClient.deleteAboutMe(
          this.wallet.publicKey,
          receiverKey,
      );
        console.log(stringifyPKsAndBNs(deleteAboutMeInstance));
      }

      async editAboutMe(new_content = ''){
        console.log('editAboutMe')

        const editAboutMeInstance = await this.forumClient.editAboutMe(
            this.wallet.publicKey,
            new_content
        );
        console.log(stringifyPKsAndBNs(editAboutMeInstance));
      }
    
      async fetchAboutMeForProfile(userProfilePubkey){
        console.log('fetchAboutMeForProfile')
    
        const userProfileKey: PublicKey = new PublicKey(userProfilePubkey);
    
        console.log('Fetching about me PDA for user profile with pubkey: ', userProfileKey.toBase58());
        const aboutMePDAs = await this.forumClient.fetchAboutMeForProfile(userProfileKey);
    
        // Loop over all PDAs and display account info
        for (let num = 1; num <= aboutMePDAs.length; num++) {
            console.log('About me account', num, ':');
            console.dir(stringifyPKsAndBNs(aboutMePDAs[num - 1]), {depth: null});
        }
      }
    
      async fetchAllQuestions(userProfilePubkey){
        console.log('fetchAllQuestions')
    
        const userProfileKey: PublicKey = new PublicKey(userProfilePubkey);
        console.log('Fetching all question PDAs for user profile with pubkey: ', userProfileKey.toBase58());
    
        const questionPDAs = await this.forumClient.fetchAllQuestionPDAs(userProfileKey);
    
        // Loop over all PDAs and display account info
        for (let num = 1; num <= questionPDAs.length; num++) {
            console.log('Question account', num, ':');
            console.dir(stringifyPKsAndBNs(questionPDAs[num - 1]), {depth: null});
        }
      }
}