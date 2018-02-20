/*
    The output layer is responsible for evaluating its activation against
    the ideal result
*/
class OutputLayer extends Layer {
    //// Set the ideal results to resolve against
    setTargets(targets) {
        this.targets = targets;
    }

    //// The output layer is able to compute its error against the ideal
    //// target.  This starts a chain reaction of adjustments backwards
    //// through the network.
    // learnRate: Limits the size of adjustments during training
    backPropagate(learnRate) {
        let targetValue,
            inputNeuron,
            neuronActivation;

        // Iterate through each neuron in this output layer
        this.neurons.forEach((currentLayerNeuron, i) => {
            // Grab the target value (a little ugly)
            targetValue = this.targets[i];

            // Grab this neuron's activation
            neuronActivation = currentLayerNeuron.activation;

            // Multiply the delta to ideal by the derivative of our activation
            // to determine how much to adjust weights and biases
            currentLayerNeuron.error = (
                (targetValue - neuronActivation) *
                Layer.sigmoidDerivative(neuronActivation)
            );

            // Iterate through all the input connections
            currentLayerNeuron.connections.input.forEach((inputConnection) => {
                inputNeuron = inputConnection.from;

                // Update the connection weight based on our distance from the delta and how
                // loud the previous activation is
                inputConnection.weight += (learnRate * currentLayerNeuron.error * inputNeuron.activation);
            });

            // Adjust our bias to adjust activation calculations
            currentLayerNeuron.bias += (learnRate * currentLayerNeuron.error);
        });
    }
}
