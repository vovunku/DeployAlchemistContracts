const { ethers } = await import('npm:ethers@6.10.0');

const abiCoder = ethers.AbiCoder.defaultAbiCoder();

const dataFingerprint = args[0];



const apiResponse = await Functions.makeHttpRequest({
    url: `https://gateway.lighthouse.storage/ipfs/${dataFingerprint}`,
    method: 'GET',
    responseType: "text"
});

// const listPrice = Number(apiResponse.data.ListPrice);
// const originalListPrice = Number(apiResponse.data.OriginalListPrice);
// const taxAssessedValue = Number(apiResponse.data.TaxAssessedValue);

// console.log(`List Price: ${listPrice}`);
// console.log(`Original List Price: ${originalListPrice}`);
// console.log(`Tax Assessed Value: ${taxAssessedValue}`);

// const encoded = abiCoder.encode([`uint256`, `uint256`, `uint256`, `uint256`], [tokenId, listPrice, originalListPrice, taxAssessedValue]);

// return ethers.getBytes(encoded);
// bafkreidi2ogt3nhkadvb4s6v4ityzxyd4iwzqdwqwneo6lh5i6mzfcrski
// console.log(`${apiResponse.data}`)
// console.log(apiResponse)

const data = apiResponse.data.replaceAll('\n', '');
// console.log(data)
// const encoded = abiCoder.encode([`bytes`], [apiResponse.data.replaceAll('\n', '')]);

return ethers.getBytes(data);