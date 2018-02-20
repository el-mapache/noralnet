/*
    A Layer manages an array of neurons, and handles feeding data forward
    to the next layer (adjusting activation values) and propagating data
    backwards (adjusting weights / biases)
*/
class Layer {
    constructor(neurons) {
        // The neurons to manage
        this.neurons = neurons;

        // Pointers to traverse forwards and backwards through layers
        this.next = null;
        this.previous = null;
    }

    //// Squash an activation into a logarithmic function of -1 to 1
    // activationValue: A neuron's activation value
    static sigmoid(activationValue) {
        return 1.0 / (1.0 + Math.exp(-activationValue));
    }

    //// Grab the derivative to resolve error adjustment over the sigmoid?
    // squashedValue: The sigmoid(activation) value
    static sigmoidDerivative(squashedValue) {
        return squashedValue * (1 - squashedValue);
    }

    //// Connect a layer to this one
    //   previousLayer: The layer to our left that we want to connect
    connect(previousLayer) {
        // Iterate through the neurons on this layer
        this.neurons.forEach((currentLayerNeuron) => {
            // Iterate through the neurons in the connecting layer
            previousLayer.neurons.forEach((previousLayerNeuron) => {
                // Create a new connection between them with a random weight
                const connection = new Connection(previousLayerNeuron, currentLayerNeuron, Math.random() - 0.5);

                // Set them as their respective input / output entries
                currentLayerNeuron.connections.input.push(connection);
                previousLayerNeuron.connections.output.push(connection);
            });
        });

        // Set a pointer to allow layer traversal
        previousLayer.next = this;
        this.previous = previousLayer;
    }

    //// Propagate value of inputs through the neurons in the layer
    feedForward() {
        let sum;

        // Iterate over this layer's neurons
        this.neurons.forEach((currentLayerNeuron) => {
            sum = 0.0;

            // Itearte over the neuron's input connections
            currentLayerNeuron.connections.input.forEach((inputConnection) => {
                // Add the signals up
                sum += inputConnection.from.activation * inputConnection.weight;
            });

            // Squash our activation into -1 to 1
            currentLayerNeuron.activation = Layer.sigmoid(sum + currentLayerNeuron.bias);
        });
    }

    //// Propagate adjustments backwards through the neurons in a layer
    // learnRate: The factor to apply to calculating error (how much to change)
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
            currentLayerNeuron.error *= Layer.sigmoidDerivative(currentLayerNeuron.activation)

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
