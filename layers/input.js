/*
    An Input Layer is responsible for transmitting the source values, outputting
    an array of features
*/
class InputLayer extends Layer {
    //// Feed the features forward
    feedForward() {
        // Set out activations (in case features changed)
        this.neurons.forEach((currentLayerNeuron, i) => {
            currentLayerNeuron.activation = this.features[i];
        });
    }

    //// We don't connect to anything
    backPropagate() {
        return;
    }

    // Update the features to evaluate
    setFeatures(features) {
        this.features = features;
    }
}
