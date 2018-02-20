const Squash = {
    LOGISTIC: function(x, derivate) {
        // Not sure why Euler's constant is special
        // 1 / (1 + (2.718^-x))
        // I think the means that as connections increase, their impact on the activation
        // is reduced.  This might mean that different connection have
        // undue weight over the activation
        const fx = 1 / (1 + Math.exp(-x));

        // Not sure what this means, maybe this is to produce the adustment?
        // or to handle the calculation with only positive values?
        if (!derivate) return fx;

        // This shifts the bounds from 0 - 2 to -1 - 1
        return fx * (1 - fx);
    },
    TANH: function (x, derivate) {
        // All the same as above
        if (derivate) return 1 - Math.pow(Math.tanh(x), 2);
        return Math.tanh(x);
    }
}

let shouldLog = true;
function log(message) {
    if (shouldLog) {
        console.log(message);
    }
}

const Neuron = (function() {
    function neuron(value) {
        // Set the activation value if passed in, either init to random
        this.activation = value === undefined ? Math.random() - 0.5 : value;

        // The bias value for connections to this neuron
        this.bias = 0;

        // The connections for this neuron
        this.connections = {
            input: [],
            output: []
        }

        // Errors
        this.error;

        // Set default squash function
        this.squash = Squash.TANH;
    }
})();

const Connection = (function() {
    function connection(from, to, weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    return connection;
})();

const Layer = (function() {
    function layer(neurons) {
        this.neurons = neurons;

        this.next = null;
        this.previous = null;
    }

    layer.prototype = {
        connect(previousLayer) {
            this.neurons.forEach(currentLayerNeuron) => {
                previousLayer.neurons.forEach((previousLayerNeuron) => {
                    const connection = new Connection(previousLayerNeuron, currentLayerNeuron, Math.random() - 0.5);

                    currentLayerNeuron.connections.input.push(connection);
                    previousLayerNeuron.connections.output.push(connection);
                });
            });

            previousLayer.next = this;
            this.previous = previousLayer;
        },
        feedForward() {
            let sum,
                hiddenIndex,
                inputIndex,
                outputIndex;

            this.neurons.forEach((currentLayerNeuron) => {
                // Clear sum
                sum = parseDouble(0.0);

                currentLayerNeuron.connections.input.forEach((inputConnection) => {
                    sum += inputConnection.from.activation * inputConnection.weight;
                });

                currentLayerNeuron.activation = currentLayerNeuron.squash(sum + currentLayerNeuron.bias);
            });
        },
        backPropagate(learnRate) {
            let outputNeuron;

            // Iterate through the neurons on this layer
            this.neurons.forEach((currentLayerNeuron) => {
                // Iterate through the output connections
                currentLayerNeuron.connections.output.forEach((outputConnection) => {
                    // Get a reference to the connected neuron in the output layer
                    outputNeuron = outputConnection.to;

                    // Update the current error based on the output layer neuron's error times the connection weight
                    currentLayerNeuron.error += (outputNeuron.error * outputConnection.weight);

                    // Adjust the weight by the output error times activation, adjusted by the learn rate
                    outputConnection.weight += (learnRate * outputNeuron.error * currentLayerNeuron.activation);

                    // Update the bias based on the error (why?)
                    outputNeuron.bias = (learnRate * outputNeuron.error);
                });

                // Get the derivative of the total error
                currentLayerNeuron.error *= currentLayerNeuron.squash(currentLayerNeuron.error, true)
            });
        }
    };

    return layer;
})();

const Example = (function() {
    // The neurons in the layers of the network
    const INPUT_NEURONS = 4;
    const HIDDEN_NEURONS = 6;
    const OUTPUT_NEURONS = 14;

    // The ratio of error to apply for correction
    const LEARN_RATE = 0.2;

    // Randomness?
    const NOISE_FACTOR = 0.45;

    // The number of training iterations to perform
    const TRAINING_REPETITIONS = 10000;

    // Create a matrix
    const inputConnections = new Array(INPUT_NEURONS + 1);
    const outputConnections = new Array(HIDDEN_NEURONS + 1);

    function populateConnections(connections, amount) {
        let i;
        for (i = 0; i < connections.length; i++) {
            // New array doesn't like map, so use some ES6 magic to zero out the array
            connections[i] = [...Array(amount)].map(() => 0);
        }
    }

    populateConnections(inputConnections, HIDDEN_NEURONS);
    populateConnections(outputConnections, OUTPUT_NEURONS);

    // The layers
    const inputs = [...Array(INPUT_NEURONS)].map(() => 0);
    const hidden = [...Array(HIDDEN_NEURONS)].map(() => 0);
    const outputs =[...Array(OUTPUT_NEURONS)].map(() => 0);

    // The ideal result
    const targets = new Array(OUTPUT_NEURONS);

    // The error holders
    const outputErrors = new Array(OUTPUT_NEURONS);
    const hiddenErrors = new Array(HIDDEN_NEURONS);

    // Not sure
    const MAX_SAMPLES = 14;

    const trainingInputs = [
        [ 1, 1, 1, 0 ],
        [ 1, 1, 0, 0 ],
        [ 0, 1, 1, 0 ],
        [ 1, 0, 1, 0 ],
        [ 1, 0, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 1, 0 ],
        [ 1, 1, 1, 1 ],
        [ 1, 1, 0, 1 ],
        [ 0, 1, 1, 1 ],
        [ 1, 0, 1, 1 ],
        [ 1, 0, 0, 1 ],
        [ 0, 1, 0, 1 ],
        [ 0, 0, 1, 1 ]
    ];

    const trainingOutputs = [
        [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ]
    ];

    function assignRandomWeights() {
        // Iterate through the input neurons
        let inputIndex,
            hiddenIndex,
            outputIndex;

        for (inputIndex = 0; inputIndex < INPUT_NEURONS; inputIndex++) {
            for (hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
                // Assign a random weight value between 0.5 and -0.5
                inputConnections[inputIndex][hiddenIndex] = Math.random() - 0.5;
            }
        }

        for (hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
            for (outputIndex = 0; outputIndex < OUTPUT_NEURONS; outputIndex++) {
                // Assign a random weight again
                outputConnections[hiddenIndex][outputIndex] = Math.random() - 0.5;
            }
        }
    }

    function feedForward() {
        let sum,
            hiddenIndex,
            inputIndex,
            outputIndex;

        // Calculate input to hidden layer.  This is really a scan operation L and L - 1
        for(hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
            // Set sum to 0
            sum = 0.0;
            for(inputIndex = 0; inputIndex < INPUT_NEURONS; inputIndex++) {
                // The input activation * the connection's weight (+ bias?)
                sum += inputs[inputIndex] * inputConnections[inputIndex][hiddenIndex];
            }

            // The last entry in the incomingConnections array holds the bias
            sum += inputConnections[INPUT_NEURONS][hiddenIndex];

            // Set the hidden (L) layer's neuron activation
            hidden[hiddenIndex] = Squash.TANH(sum);
        }

        for (outputIndex = 0; outputIndex < OUTPUT_NEURONS; outputIndex++) {
            sum = 0.0
            for (hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
                sum += hidden[hiddenIndex] * outputConnections[hiddenIndex][outputIndex];
            }

            // Grab the bias, which is held in the last connection entry
            sum += outputConnections[HIDDEN_NEURONS][outputIndex];

            // Set the output activation as the squashed sum
            outputs[outputIndex] = Squash.TANH(sum);
        }

        return;
    }

    function backPropagate() {
        let outputIndex,
            hiddenIndex,
            inputIndex;

            // // Calculate the output layer error (step 3 for output cell).
            // for(int out = 0; out < OUTPUT_NEURONS; out++)
            // {
            //     erro[out] = (target[out] - actual[out]) * sigmoidDerivative(actual[out]);
            // }

        // Iterate over the output layer (L)
        for (outputIndex = 0; outputIndex < OUTPUT_NEURONS; outputIndex++) {
            // Multiply the delta from ideal by the derivative of the squashed real value
            // I really don't get this well, but I understand that I am calculating a multi-dimensional vector?
            outputErrors[outputIndex] = (targets[outputIndex] - outputs[outputIndex]) * Squash.TANH(outputs[outputIndex], true);
        }

            // // Calculate the hidden layer error (step 3 for hidden cell).
            // for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
            // {
            //     errh[hid] = 0.0;
            //     for(int out = 0; out < OUTPUT_NEURONS; out++)
            //     {
            //         errh[hid] += erro[out] * who[hid][out];
            //     }
            //     errh[hid] *= sigmoidDerivative(hidden[hid]);
            // }

        // Iterate over the hidden layer (L - 1)
        for (hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
            // Set the base so we can accumulate
            hiddenErrors[hiddenIndex] = 0.0;
            // Iterate over the output layer (L)
            for (outputIndex = 0; outputIndex < OUTPUT_NEURONS; outputIndex++) {
                // Sum the outputError value * the weight of the connection between the two layers
                hiddenErrors[hiddenIndex] += outputErrors[outputIndex] * outputConnections[hiddenIndex][outputIndex];
            }

            // Squash the errors into the derivative of the hidden activation
            hiddenErrors[hiddenIndex] *= Squash.TANH(hidden[hiddenIndex], true);
        }

            // // Update the weights for the output layer (step 4).
            // for(int out = 0; out < OUTPUT_NEURONS; out++)
            // {
            //     for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
            //     {
            //         who[hid][out] += (LEARN_RATE * erro[out] * hidden[hid]);
            //     } // hid
            //     who[HIDDEN_NEURONS][out] += (LEARN_RATE * erro[out]); // Update the bias.
            // } // out

        // Update the wieghts for the output layer (L)
        for (outputIndex = 0; outputIndex < OUTPUT_NEURONS; outputIndex++) {
            for (hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
                // Adjust the weight by the outputErrors times the hidden layer neuron's activation and times the learn rate (strength of the adjustment)
                outputConnections[hiddenIndex][outputIndex] += (LEARN_RATE * outputErrors[outputIndex] * hidden[hiddenIndex]);
            }

            // Adjust the bias by the learn rate times the output error for this index (not sure why)
            outputConnections[HIDDEN_NEURONS][outputIndex] += (LEARN_RATE * outputErrors[outputIndex]);
        }

            // // Update the weights for the hidden layer (step 4).
            // for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
            // {
            //     for(int inp = 0; inp < INPUT_NEURONS; inp++)
            //     {
            //         wih[inp][hid] += (LEARN_RATE * errh[hid] * inputs[inp]);
            //     } // inp
            //     wih[INPUT_NEURONS][hid] += (LEARN_RATE * errh[hid]); // Update the bias.
            // } // hid

        // Update the weights for the hidden layer (L - 1)
        for (hiddenIndex = 0; hiddenIndex < HIDDEN_NEURONS; hiddenIndex++) {
            for (inputIndex = 0; inputIndex < INPUT_NEURONS; inputIndex++) {
                inputConnections[inputIndex][hiddenIndex] += (LEARN_RATE * hiddenErrors[hiddenIndex] * inputs[inputIndex]);
            }

            inputConnections[INPUT_NEURONS][hiddenIndex] += (LEARN_RATE * hiddenErrors[hiddenIndex]);
        }
    }

    function maximum(neurons) {
        // This function returns the index of the maximum of vector().
        let maxIndex = 0;
        let maxValue = neurons[0]

        // We already accounted for index 0
        for(let index = 1; index < OUTPUT_NEURONS; index++) {
            if (neurons[index] > maxValue) {
                max = neurons[index];
                maxIndex = index;
            }
        }

        return maxIndex;
    }

    function getTrainingStats() {
        let sum = 0.0;
        for (let i = 0; i < MAX_SAMPLES; i++) {
            for(let a = 0; a < INPUT_NEURONS; a++) {
                inputs[a] = trainingInputs[i][a];
            }

            for(let a = 0; a < OUTPUT_NEURONS; a++) {
                targets[a] = trainingOutputs[i][a];
            }

            feedForward();

            if (maximum(outputs) === maximum(targets)) {
                sum += 1;
            } else {
                log(inputs[0] + "\t" + inputs[1] + "\t" + inputs[2] + "\t" + inputs[3]);
                log(maximum(outputs) + "\t" + maximum(targets));
            }
        }

        log("Network is " + (sum / MAX_SAMPLES * 100.0) + "% correct.");

        return;
    }

    function testNetworkTraining() {
        // This function simply tests the training vectors against network.
        for (let i = 0; i < MAX_SAMPLES; i++) {
            for (let a = 0; a < INPUT_NEURONS; a++) {
                // Get the input value
                inputs[a] = trainingInputs[i][a];
            }

            // Test the network
            feedForward();

            // Log all the input values
            for(let a = 0; a < INPUT_NEURONS; a++) {
                log(inputs[a]);
            }

            // Log the output values
            log("Output: " + maximum(outputs));
        }

        return;
    }

    function testNetworkWithNoise1() {
        // Iterate over the samples
        for(let i = 0; i < MAX_SAMPLES; i++) {
            for(let a = 0; a < INPUT_NEURONS; a++) {
                // Add variablility to the input.  Blurryness
                inputs[a] = trainingInputs[i][a] + (Math.random() * NOISE_FACTOR);
            }

            feedForward();

            for (let a = 0; a < INPUT_NEURONS; a++) {
                log(inputs[a]);
            }

            log(JSON.stringify(hidden));
            log("Output: " + maximum(outputs));
        }

        return;
    }

    function NeuralNetwork() {
        let trainingSample = 0,
            epoch,
            inputIndex,
            outputIndex;

        assignRandomWeights();

        for (trainCount = 0; trainCount < TRAINING_REPETITIONS; trainCount++) {
            // Increment which sample we want to grab
            trainingSample++;

            // Roll over to 0
            if (trainingSample === MAX_SAMPLES) {
                trainingSample = 0;
            }

            // Populate the inputs
            for (inputIndex = 0; inputIndex < INPUT_NEURONS; inputIndex++) {
                inputs[inputIndex] = trainingInputs[trainingSample][inputIndex];
            }

            // Populate the target data
            for (outputIndex = 0; outputIndex < OUTPUT_NEURONS; outputIndex++) {
                targets[outputIndex] = trainingOutputs[trainingSample][outputIndex];
            }

            feedForward();

            backPropagate();
        }

        getTrainingStats();

        log("Test network against original input:");
        testNetworkTraining();

        log("Test network against noisy input:");
        testNetworkWithNoise1();
    }

    NeuralNetwork();
})();



    // private static void NeuralNetwork()
    // {
    //     int sample = 0;
    //
    //     assignRandomWeights();
    //
    //     // Train the network.
    //     for(int epoch = 0; epoch < TRAINING_REPS; epoch++)
    //     {
    //         sample += 1;
    //         if(sample == MAX_SAMPLES){
    //             sample = 0;
    //         }
    //
    //         for(int i = 0; i < INPUT_NEURONS; i++)
    //         {
    //             inputs[i] = trainInputs[sample][i];
    //         } // i
    //
    //         for(int i = 0; i < OUTPUT_NEURONS; i++)
    //         {
    //             target[i] = trainOutput[sample][i];
    //         } // i
    //
    //         feedForward();
    //
    //         backPropagate();
    //
    //     } // epoch
    //
    //     getTrainingStats();
    //
    //     System.out.println("\nTest network against original input:");
    //     testNetworkTraining();
    //
    //     System.out.println("\nTest network against noisy input:");
    //     testNetworkWithNoise1();
    //
    //     return;
    // }
    //
    // private static void getTrainingStats()
    // {
    //     double sum = 0.0;
    //     for(int i = 0; i < MAX_SAMPLES; i++)
    //     {
    //         for(int j = 0; j < INPUT_NEURONS; j++)
    //         {
    //             inputs[j] = trainInputs[i][j];
    //         } // j
    //
    //         for(int j = 0; j < OUTPUT_NEURONS; j++)
    //         {
    //             target[j] = trainOutput[i][j];
    //         } // j
    //
    //         feedForward();
    //
    //         if(maximum(actual) == maximum(target)){
    //             sum += 1;
    //         }else{
    //             System.out.println(inputs[0] + "\t" + inputs[1] + "\t" + inputs[2] + "\t" + inputs[3]);
    //           System.out.println(maximum(actual) + "\t" + maximum(target));
    //         }
    //     } // i
    //
    //     System.out.println("Network is " + ((double)sum / (double)MAX_SAMPLES * 100.0) + "% correct.");
    //
    //     return;
    // }
    //
    // private static void testNetworkTraining()
    // {
    //     // This function simply tests the training vectors against network.
    //     for(int i = 0; i < MAX_SAMPLES; i++)
    //     {
    //         for(int j = 0; j < INPUT_NEURONS; j++)
    //         {
    //             inputs[j] = trainInputs[i][j];
    //         } // j
    //
    //         feedForward();
    //
    //         for(int j = 0; j < INPUT_NEURONS; j++)
    //         {
    //             System.out.print(inputs[j] + "\t");
    //         } // j
    //
    //         System.out.print("Output: " + maximum(actual) + "\n");
    //     } // i
    //
    //     return;
    // }
    //
    // private static void testNetworkWithNoise1()
    // {
    //     // This function adds a random fractional value to all the training
    //     // inputs greater than zero.
    //     DecimalFormat dfm = new java.text.DecimalFormat("###0.0");
    //
    //     for(int i = 0; i < MAX_SAMPLES; i++)
    //     {
    //         for(int j = 0; j < INPUT_NEURONS; j++)
    //         {
    //             inputs[j] = trainInputs[i][j] + (new Random().nextDouble() * NOISE_FACTOR);
    //         } // j
    //
    //         feedForward();
    //
    //         for(int j = 0; j < INPUT_NEURONS; j++)
    //         {
    //             System.out.print(dfm.format(((inputs[j] * 1000.0) / 1000.0)) + "\t");
    //         } // j
    //         System.out.print("Output: " + maximum(actual) + "\n");
    //     } // i
    //
    //     return;
    // }
    //
    // private static int maximum(final double[] vector)
    // {
    //     // This function returns the index of the maximum of vector().
    //     int sel = 0;
    //     double max = vector[sel];
    //
    //     for(int index = 0; index < OUTPUT_NEURONS; index++)
    //     {
    //         if(vector[index] > max){
    //             max = vector[index];
    //             sel = index;
    //         }
    //     }
    //     return sel;
    // }
    //
    // private static void feedForward()
    // {
    //     double sum = 0.0;
    //
    //     // Calculate input to hidden layer.
    //     for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
    //     {
    //         sum = 0.0;
    //         for(int inp = 0; inp < INPUT_NEURONS; inp++)
    //         {
    //             sum += inputs[inp] * wih[inp][hid];
    //         } // inp
    //
    //         sum += wih[INPUT_NEURONS][hid]; // Add in bias.
    //         hidden[hid] = sigmoid(sum);
    //     } // hid
    //
    //     // Calculate the hidden to output layer.
    //     for(int out = 0; out < OUTPUT_NEURONS; out++)
    //     {
    //         sum = 0.0;
    //         for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
    //         {
    //             sum += hidden[hid] * who[hid][out];
    //         } // hid
    //
    //         sum += who[HIDDEN_NEURONS][out]; // Add in bias.
    //         actual[out] = sigmoid(sum);
    //     } // out
    //     return;
    // }
    //
    // private static void backPropagate()
    // {
    //     // Calculate the output layer error (step 3 for output cell).
    //     for(int out = 0; out < OUTPUT_NEURONS; out++)
    //     {
    //         erro[out] = (target[out] - actual[out]) * sigmoidDerivative(actual[out]);
    //     }
    //
    //     // Calculate the hidden layer error (step 3 for hidden cell).
    //     for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
    //     {
    //         errh[hid] = 0.0;
    //         for(int out = 0; out < OUTPUT_NEURONS; out++)
    //         {
    //             errh[hid] += erro[out] * who[hid][out];
    //         }
    //         errh[hid] *= sigmoidDerivative(hidden[hid]);
    //     }
    //
    //     // Update the weights for the output layer (step 4).
    //     for(int out = 0; out < OUTPUT_NEURONS; out++)
    //     {
    //         for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
    //         {
    //             who[hid][out] += (LEARN_RATE * erro[out] * hidden[hid]);
    //         } // hid
    //         who[HIDDEN_NEURONS][out] += (LEARN_RATE * erro[out]); // Update the bias.
    //     } // out
    //
    //     // Update the weights for the hidden layer (step 4).
    //     for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
    //     {
    //         for(int inp = 0; inp < INPUT_NEURONS; inp++)
    //         {
    //             wih[inp][hid] += (LEARN_RATE * errh[hid] * inputs[inp]);
    //         } // inp
    //         wih[INPUT_NEURONS][hid] += (LEARN_RATE * errh[hid]); // Update the bias.
    //     } // hid
    //     return;
    // }
    //
    // private static void assignRandomWeights()
    // {
    //     for(int inp = 0; inp <= INPUT_NEURONS; inp++) // Do not subtract 1 here.
    //     {
    //         for(int hid = 0; hid < HIDDEN_NEURONS; hid++)
    //         {
    //             // Assign a random weight value between -0.5 and 0.5
    //             wih[inp][hid] = new Random().nextDouble() - 0.5;
    //         } // hid
    //     } // inp
    //
    //     for(int hid = 0; hid <= HIDDEN_NEURONS; hid++) // Do not subtract 1 here.
    //     {
    //         for(int out = 0; out < OUTPUT_NEURONS; out++)
    //         {
    //             // Assign a random weight value between -0.5 and 0.5
    //             who[hid][out] = new Random().nextDouble() - 0.5;
    //         } // out
    //     } // hid
    //     return;
    // }
    //
    // private static double sigmoid(final double val)
    // {
    //     return (1.0 / (1.0 + Math.exp(-val)));
    // }
    //
    // private static double sigmoidDerivative(final double val)
    // {
    //     return (val * (1.0 - val));
    // }
    //
    // public static void main(String[] args)
    // {
    //     NeuralNetwork();
    //     return;
    // }

//}
