let playerChoice = '';
        let currentScreen = 'choice';

        // Initialize number buttons
        const numbersGrid = document.getElementById('numbersGrid');
        for (let i = 1; i <= 10; i++) {
            const button = document.createElement('button');
            button.className = 'number-btn';
            button.textContent = i;
            button.onclick = () => selectNumber(i);
            numbersGrid.appendChild(button);
        }

        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        function makeChoice(choice) {
            playerChoice = choice;
            document.getElementById('playerChoice').textContent = choice;
            showScreen('numberScreen');
        }

        function selectNumber(num) {
            const computerNum = Math.floor(Math.random() * 10) + 1;
            const sum = num + computerNum;
            const isEven = sum % 2 === 0;
            const playerWins = (isEven && playerChoice === 'even') || 
                             (!isEven && playerChoice === 'odd');

            document.getElementById('playerNumber').textContent = num;
            document.getElementById('computerNumber').textContent = computerNum;
            document.getElementById('sum').textContent = sum;
            document.getElementById('result').textContent = isEven ? 'Even' : 'Odd';
            document.getElementById('winner').textContent = playerWins ? 
                'You won the toss!' : 'Computer won the toss!';

            // Show/hide toss choice buttons based on winner
            const tossChoice = document.getElementById('tossChoice');
            if (playerWins) {
                tossChoice.style.display = 'block';
            } else {
                tossChoice.style.display = 'none';
                const computerChoice = Math.random() < 0.5 ? 'batting' : 'bowling';
                document.getElementById('winner').textContent += 
                    ` Computer chose ${computerChoice}!`;
            }

            showScreen('resultScreen');
        }

        function selectToss(choice) {
            document.getElementById('finalDecision').textContent = 
                `You chose ${choice}! Game ready to start!`;
            showScreen('finalScreen');
        }

        function resetGame() {
            playerChoice = '';
            showScreen('choiceScreen');
        }