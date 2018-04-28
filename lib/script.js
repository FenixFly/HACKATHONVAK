//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.ProposeTrade} tx
 * @transaction
 */
async function onProposeTrade(tx) {

  // change the movement status of the animal
  tx.animal.movementStatus = 'IN_TRANSIT';

  if (tx.price <= 0) {
    throw new Error("Invalid price");
  }

  // set the proposed price
  tx.animal.proposedPrice = tx.price;

  // get Animals registry
  const ar = await getAssetRegistry('org.sample.Animal');

  // update the Animal in the registry
  await ar.update(tx.animal)
}

//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.AcceptTrade} tx
 * @transaction
 */
async function onAcceptTrade(tx) {

  // get farmers registry
  const fr = await getParticipantRegistry('org.sample.Farmer');
  // find the proper farmer in the registry
  const farmer = await fr.get(getCurrentParticipant().getIdentifier());
  // find the animal's owner
  const owner = await fr.get(tx.animal.owner.getIdentifier());

  if (farmer.balance < tx.animal.proposedPrice) {
    throw new Error("Not enough money on your balance");
  }

  // reduce the farmer's balance
  farmer.balance -= tx.animal.proposedPrice;
  // add money to owner's balance
  owner.balance += tx.animal.proposedPrice;
  // change the animal's status
  tx.animal.movementStatus = 'IN_FIELD';
  // change the animal's owner
  tx.animal.owner = farmer;
  // zero the proposed price
  tx.animal.proposedPrice = 0.0;

  // update farmer in the registry
  await fr.update(farmer);
  // update old owner in the registry
  await fr.update(owner);

  // get animals registry
  const ar = await getAssetRegistry('org.sample.Animal');
  // update the animal in the registry
  await ar.update(tx.animal);
}


//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.CancelTrade} tx
 * @transaction
 */
async function onCancelTrade(tx) {

  // change the animal's status
  tx.animal.movementStatus = 'IN_FIELD';
  // zero the proposed price
  tx.animal.proposedPrice = 0.0;

  const ar = await getAssetRegistry('org.sample.Animal');
  // update the animal in the registry
  await ar.update(tx.animal);
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//                          Start my code                           //
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.SetupJournalDemo} setupJournalDemo
 * @transaction
 */
async function setupJournalDemo(setupJournalDemo) {
  
  const factory = getFactory();
  const NS = 'org.sample';

   // get registries
   const adminVakRegistry = await getParticipantRegistry(NS + '.AdminVak');
   const journalOwnerRegistry = await getParticipantRegistry(NS + '.JournalOwner');
   const journalRegistry = await getAssetRegistry(NS + '.Journal');

   // create Admins
   var adminsVak = [
    factory.newResource(NS, 'AdminVak', 'admin1@village.com'),
    factory.newResource(NS, 'AdminVak', 'admin2@village.com'),
  ];

  // write admins to the registry
  await adminVakRegistry.addAll(adminsVak);

 // create JOwners
 var journalOwners = [
  factory.newResource(NS, 'JournalOwner', 'owner1@village.com'),
  factory.newResource(NS, 'JournalOwner', 'owner2@village.com'),
  factory.newResource(NS, 'JournalOwner', 'owner3@village.com'),
];

  // fill animals with basic info
  journalOwners[0].firstName = 'Ivan';
  journalOwners[0].lastName = 'Ivanov';

  journalOwners[1].firstName = 'Petr';
  journalOwners[1].lastName = 'Petrov';

  journalOwners[2].firstName = 'Sergey';
  journalOwners[2].lastName = 'Sergeev';
  
  // write JOwners
  await journalOwnerRegistry.addAll(journalOwners);

   // create Journals
   var journals = [
    factory.newResource(NS, 'Journal', '0000-0001'),
    factory.newResource(NS, 'Journal', '0000-0002'),
    factory.newResource(NS, 'Journal', '0000-0003'),
  ];

    // fill animals with basic info
    journals[0].isVAK = true;
    journals[0].isScopus = true;
    journals[0].owner = factory.newRelationship(NS, 'JournalOwner', journalOwners[0].email);
    journals[0].title = 

    journals[1].isVAK = false;
    journals[1].isScopus = true;
    journals[1].owner = factory.newRelationship(NS, 'JournalOwner', journalOwners[1].email);
    journals[1].title = 

  
    journals[2].isVAK = false;
    journals[2].isScopus = false;
    journals[2].owner = factory.newRelationship(NS, 'JournalOwner', journalOwners[2].email);
    journals[2].title = 

    
    // write JOwners
    await journalRegistry.addAll(journals);

}