import { describe, it } from "mocha";
import { expect } from "chai";
import { table } from "console";
var AWS = require("aws-sdk");



describe("Example Test Series", () => {
    it("should return an expected value", () => {
        const x = 1;
        const y = 10;
        const target = x + y;

        expect(target).to.equal(11);
    });

    it("should create item in the database", function(done){ 
        
        var params = {
            Item: {
                "PhotoID": "123566"
            },
            TableName: "photo_table"
        };


          var documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
          documentClient.put(params, function(_err: any, data: any) {
            expect(_err).length.to.equal(null)
            done();
          });
        });

        
    
});


