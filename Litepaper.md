Volatility Market Lite Paper (V1)


Volatility Market is a ticket-based prediction market where a user can bet on a binary outcome. A user places a nominal bet which at the moment is the amount of 0.01ETH. A user cannot bet more or less than this amount. 

Market Economics:

The market will have multiple prediction verticals on which a user can bet. An example of a ‘prediction vertical’ is the price of ETH/USD. Each prediction vertical will have a Positive or Negative outcome which the user can bet on. A positive outcome is if the predicted outcome happens to be True. A negative outcome is if the predicted outcome happens to be False. Upon placing a bet on a prediction vertical with the set bet amount (0.01ETH), a ticket will be created for the user.

A ticket represents the relationship between the user, the market, and the prediction vertical. A ticket has the following information:

-	Bet Time: Unix Timestamp when bet was placed
-	Amount: This is the 0.01ETH nominal bet
-	Bet Direction: 1 for betting on the Positive outcome, and 0 for betting on the negative outcome
-	Expiry: The time at which the ticket is redeemable. For V1, this will be hard set to 24 hours after the bet time
-	Verification-Start: This is the time (at or after the bet time) at which the user has a reference value to place their bet against. This value is returned by an oracle, and the difference between the Bet Time and Verification-Start is how long it takes for an oracle to return a value. 
-	Bet Price: The price of the asset pair at Verification-Start.


Here is an example.

At the time of writing, the ETH/USD pairing is $1271.20. User A can select this pairing, as the prediction vertical they would like to bet on. User A can bet on the positive outcome if they expect the price of ETH to increase relative to USD by at least 5%. User A can also bet on the negative outcome which is expecting ETH to depreciate relative to USD by at least 5%. Both bets are with respect to the ETH/USD price at the time of betting.

As soon as the ticket is created, User A will have the option to verify their ticket anytime between the Verification-Start time and Expiry (24 hours after the Bet Time). This is if and only if the price of the ETH/USD pairing goes up by more than 5% during the time period. The 5% is an arbitrary value that will be used for the beta. 

If User A verifies in time, then User A is entitled to 2x their nominal bet: 0.02ETH. The additional 0.01 ETH will be obtained from a pool of dead funds. Funds are considered dead if:
-	A user does not verify their ‘winning’ ticket before the Expiry due to their prediction not being correct during the time between the Verification-Start and Expiry, or simply forgetting to verify.

Even if User A has verified their ticket with a correct prediction, they may run into a scenario where there are not enough dead funds in the pool, in which case User A would need to wait until dead funds are available to retain their 0.01ETH winnings. 

It is still being decided whether there will be a pool for the entire application, or pools will be localized to a prediction vertical such as ETH/USD. 


V1: Currency (Crypto & Fiat):

The first phase of the project will involve price comparisons between cryptocurrencies and fiat such as ETH/USD etc. This information will be obtained via ChainLink Feeds(https://data.chain.link/).


![image](https://user-images.githubusercontent.com/12187567/201506711-a8d74ce0-9da7-4d05-85c2-4e366e8f909c.png)
