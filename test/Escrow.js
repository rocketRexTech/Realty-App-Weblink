// write test in javascript to auto check behavior of smart contract insted of doing it manually.

const { expect } = require('chai');
const { ethers } = require('hardhat');
const { EDIT_DISTANCE_THRESHOLD } = require('hardhat/internal/constants');

// (token helper) takes value and converts it to ether for the smart contract.
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

// where we put all the test for escrot smart contact.
describe('Escrow', () => {
    let buyer, seller, inspector, lender
    let realEstate, escrow

    // run all of this code before each test example inside 'Deployment' run
    beforeEach(async () => {
        // get all the accounts saved to hardhat project to act on behalf of seller.
        // signers are fake people (metamask accounts hardhat gives us for free behind the scenes) on the blockchain, they all have crypto inside of them.

        // (long way below)
        // const signers = await ethers.getSigners()
        // const buyer = signers[0] // set buyer
        // const seller = signers[1] // set seller

        //or use parallel assignmet to set up buyer seller
        [buyer, seller, inspector, lender] = await ethers.getSigners()

        // deploy real estate (put a real estate nft on blockchain)
       const RealEstate = await ethers.getContractFactory('RealEstate')
       realEstate = await RealEstate.deploy()

       // mint (realEstate.connect(seller).mint) does it from the sellers perspective or on sellers behalf.
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/1.json")
        await transaction.wait()

        // deploy escrow contract
        const Escrow = await ethers.getContractFactory('Escrow')
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address,
        )

        // need owner's consent to move token out of wallet to smart contract (approve property)
        transaction = await realEstate.connect(seller).approve(escrow.address, 1) // 1 is the tokenID
        await transaction.wait()

        // list property
        // tokens: it cost 10 ehter to list the property, and 5 is the escrow amount (token helper)
        transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5)) // 1 is the tokenID
        await transaction.wait()
    })

    describe('Deployment', () => {
        it('Returns NFT address', async () => {
             // checks the nft address
            const result = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address)
        })
    
        it('Returns seller', async () => {
            // check that it returns the seller
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)
        })
    
        it('Returns inspector', async () => {
            // check that it returns the inspector
            const result = await escrow.inspector()
            expect(result).to.be.equal(inspector.address)
        })
    
        it('Returns lender', async () => {
            // check that it returns the lender
            const result = await escrow.lender()
            expect(result).to.be.equal(lender.address)
        })
    })

    describe('Listing', () => {
        it('Updates as listed', async () => {
            const result = await escrow.isListed(1)
            expect(result).to.be.equal(true)
        })

        it('Updates ownership', async () => {
            // check that owner of the nft is now the smart contract intsead of the previous owner
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address)
        })

        it('Returns Buyer', async () => {
            const result = await escrow.buyer(1)
            expect(result).to.be.equal(buyer.address)
        })

        it('Returns purchase price', async () => {
            const result = await escrow.purchasePrice(1)
            expect(result).to.be.equal(tokens(10))
        })

        it('Returns escrow amount', async () => {
            const result = await escrow.escrowAmount(1)
            expect(result).to.be.equal(tokens(5))
        })

    })

    describe('Deposits', () => {
        it('Updates contract balance', async () => {
            const transaction = await escrow.connect(buyer).depositeEarnest(1, {value: tokens(5)}) // value: tokens(5) is the metadata
            await transaction.wait()
            const result = await escrow.getBalance()
            expect(result).to.be.equal(tokens(5))
        })
    })

    describe('Inspection', () => {
        it('Updates inspection status', async () => {
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()
            const result = await escrow.inspectionPass(1)
            expect(result).to.be.equal(true)
        })
    })

    describe('Approval', () => {
        it('Updates approval status', async () => {
           let transaction = await escrow.connect(buyer).approveSale(1)
           await transaction.wait() 

           transaction = await escrow.connect(seller).approveSale(1)
           await transaction.wait() 

           transaction = await escrow.connect(lender).approveSale(1)
           await transaction.wait() 

           expect(await escrow.approval(1, buyer.address)).to.be.equal(true)
           expect(await escrow.approval(1, seller.address)).to.be.equal(true)
           expect(await escrow.approval(1, lender.address)).to.be.equal(true)
        })
    })

    describe('Sale', async () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).depositeEarnest(1, {value: tokens(5)})
            await transaction.wait()

            transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()

            transaction = await escrow.connect(buyer).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).approveSale(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).approveSale(1)
            await transaction.wait()

            await lender.sendTransaction({to: escrow.address, value:tokens(5)})

            transaction = await escrow.connect(seller).finalizeSale(1)
            await transaction.wait()
        })

        it('Updates ownsership', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
        }) 

        it('Updates balance', async () => {
            expect(await escrow.getBalance()).to.be.equal(0)
        }) 
    })

})
