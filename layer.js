class Layer {
    constructor(neurons) {
        this.neurons = neurons;

        this.next = null;
        this.previous = null;
    }

    connect(previousLayer) {
        this.neurons.forEach((currentLayerNeuron) => {
            previousLayer.neurons.forEach((previousLayerNeuron) => {
                const connection = new Connection(previousLayerNeuron, currentLayerNeuron, Math.random() - 0.5);

                currentLayerNeuron.connections.input.push(connection);
                previousLayerNeuron.connections.output.push(connection);
            });
        });

        previousLayer.next = this;
        this.previous = previousLayer;
    }

    feedForward() {
        let sum;

        this.neurons.forEach((currentLayerNeuron) => {
            sum = 0.0;

            currentLayerNeuron.connections.input.forEach((inputConnection) => {
                sum += inputConnection.from.activation * inputConnection.weight;
            });

            currentLayerNeuron.activation = currentLayerNeuron.squash(sum + currentLayerNeuron.bias);
        });
    }

    backPropagate(learnRate) {
        let inputNeuron,
            outputNeuron;

        // Iterate through the neurons on this layer
        this.neurons.forEach((currentLayerNeuron) => {
            // Iterate through the output connections to resolve error
            currentLayerNeuron.connections.output.forEach((outputConnection) => {
                // Get a reference to the connected neuron in the output layer
                outputNeuron = outputConnection.to;

                // Update the current error based on the output layer neuron's error times the connection weight
                currentLayerNeuron.error += (outputNeuron.error * outputConnection.weight);
            });

            // Get the derivative of the total error
            currentLayerNeuron.error *= currentLayerNeuron.squash(currentLayerNeuron.error, true)

            // Iterate through the input neurons to adjust weights
            currentLayerNeuron.connections.input.forEach((inputConnection) => {
                // Get a reference to the connected neuron in the input layer
                inputNeuron = inputConnection.from;

                // TODO: Break these out into functions
                inputConnection.weight += (learnRate * currentLayerNeuron.error * inputNeuron.activation);
            });

            // Set the bias
            currentLayerNeuron.bias += (learnRate * currentLayerNeuron.error);
        });
    }
}

class InputLayer extends Layer {
    feedForward() {
        this.neurons.forEach((currentLayerNeuron, i) => {
            currentLayerNeuron.activation = this.features[i];
        });
    }

    backPropagate() {
        return;
    }

    setFeatures(features) {
        this.features = features;
    }
}

class OutputLayer extends Layer {
    setTargets(targets) {
        this.targets = targets;
    }

    backPropagate(learnRate) {
        let targetValue,
            inputNeuron,
            neuronActivation;

        this.neurons.forEach((currentLayerNeuron, i) => {
            targetValue = this.targets[i];
            neuronActivation = currentLayerNeuron.activation;

            currentLayerNeuron.error = (targetValue - neuronActivation) * currentLayerNeuron.squash(neuronActivation, true);

            currentLayerNeuron.connections.input.forEach((inputConnection) => {
                inputNeuron = inputConnection.from;

                inputConnection.weight += (learnRate * currentLayerNeuron.error * inputNeuron.activation);
            });

            currentLayerNeuron.bias += (learnRate * currentLayerNeuron.error);
        });
    }
}
