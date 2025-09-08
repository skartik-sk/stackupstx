#!/bin/bash

# Fix bounty-system.test.ts
cd /Users/singupallikartik/Developer/stacks/stackup-contracts

# Replace all 3-parameter create-bounty calls with 5-parameter calls
sed -i '' 's/Cl\.stringAscii("Test for winner selection"),$/Cl\.stringAscii("Test for winner selection"),\
        Cl\.stringAscii("Development"),/g' tests/bounty-system.test.ts

sed -i '' 's/Cl\.stringAscii("Test ownership"),$/Cl\.stringAscii("Test ownership"),\
        Cl\.stringAscii("Development"),/g' tests/bounty-system.test.ts

sed -i '' 's/Cl\.stringAscii("Test cancellation"),$/Cl\.stringAscii("Test cancellation"),\
        Cl\.stringAscii("Development"),/g' tests/bounty-system.test.ts

sed -i '' 's/Cl\.stringAscii("Description"),$/Cl\.stringAscii("Description"),\
        Cl\.stringAscii("Development"),/g' tests/bounty-system.test.ts

# Add the deadline parameter where missing
sed -i '' 's/Cl\.uint(2000000) \/\/ 2 STX$/Cl\.uint(2000000), \/\/ 2 STX\
        Cl\.none()/g' tests/bounty-system.test.ts

sed -i '' 's/Cl\.uint(1000000)$/Cl\.uint(1000000),\
        Cl\.none()/g' tests/bounty-system.test.ts

sed -i '' 's/Cl\.uint(1500000)$/Cl\.uint(1500000),\
        Cl\.none()/g' tests/bounty-system.test.ts

echo "Fixed bounty-system.test.ts"
