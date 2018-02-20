class Network {
    constructor(layers, learnRate = 0.3) {
        let i,
            leftLayer,
            rightLayer;

        this.layers = layers;

        // Refs to set feature and target data on
        this.inputLayer = layers[0];
        this.outputLayer = layers[layers.length - 1]

        // Limits the strength of corrections
        this.learnRate = learnRate;

        // Attach the layers together
        this.connectLayers(layers);
    }

    //// Connect all the neurons of one layer to all the neurons
    //// of the previous layer recursively through a set of layers
    // layers: The layers to connect
    connectLayers(layers) {
        let leftLayer,
            rightLayer,
            layerLength = layers.length;

        // Iterate over the layers
        for (let i = 1; i < layerLength; i++) {
            // Get the left and right layers in the connection
            leftLayer = layers[i - 1];
            rightLayer = layers[i];

            // Connect the neurons together
            rightLayer.connect(leftLayer);
        }
    }

    //// Process an array of inputs through the network, setting the activation
    //// value of neurons in subsequent layers
    // features: An array of values to set as the input layer's activations
    processInput(features) {
        // Grab the input layer to set the input values (features)
        this.inputLayer.setFeatures(features);

        // Calculate each layers activation value (after the input layer) based
        // on the input from the previous neuron and connection weight
        this.layers.forEach((layer) => layer.feedForward());
    }

    //// Evaluate the current networks activation against the ideal values.
    //// Propagate the necessary adjustments to weights and biases backwards
    //// through the layers
    // targets: An array of ideal values to compare output neurons to
    learn(targets) {
        let i,
            layerLength = this.layers.length;

        // Grab the output layer to set the targets (ideal values)
        this.outputLayer.setTargets(targets);

        // Iterate backwards through the layers and adjust weights and biases
        for (i = layerLength - 1; i >= 0; i--) {
            this.layers[i].backPropagate(this.learnRate);
        }
    }
}
